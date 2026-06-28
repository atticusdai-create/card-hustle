-- Card Hustle — Supabase schema
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)

-- ── Profiles (one per auth user) ─────────────────────────────────────────────
create table if not exists profiles (
  id           uuid references auth.users(id) on delete cascade primary key,
  username     text unique not null,
  balance      numeric not null default 10000,
  shop_name    text not null default 'Card Hustle HQ',
  days_played  integer not null default 1,
  total_earned numeric not null default 0,
  total_spent  numeric not null default 0,
  cards_sold   integer not null default 0,
  reputation   numeric not null default 1,
  created_at   timestamptz default now()
);

-- ── Cards ─────────────────────────────────────────────────────────────────────
create table if not exists cards (
  id                   text primary key,
  user_id              uuid references profiles(id) on delete cascade not null,
  player_name          text not null,
  sport                text,
  team                 text,
  position             text,
  rarity               text,
  year                 integer,
  condition            text,
  base_value           numeric,
  current_value        numeric,
  location             text default 'collection',
  shop_price           numeric,
  psa_grade            integer,
  serial_number        integer,
  print_run            integer,
  grading_submitted_at timestamptz,
  grading_complete_at  timestamptz,
  created_at           timestamptz default now()
);

-- ── Friendships ───────────────────────────────────────────────────────────────
create table if not exists friendships (
  id          uuid default gen_random_uuid() primary key,
  sender_id   uuid references profiles(id) on delete cascade not null,
  receiver_id uuid references profiles(id) on delete cascade not null,
  status      text not null default 'pending'
                check (status in ('pending', 'accepted', 'declined')),
  created_at  timestamptz default now(),
  unique(sender_id, receiver_id)
);

-- ── Trades ────────────────────────────────────────────────────────────────────
create table if not exists trades (
  id             uuid default gen_random_uuid() primary key,
  sender_id      uuid references profiles(id) on delete cascade not null,
  receiver_id    uuid references profiles(id) on delete cascade not null,
  sender_cards   text[] not null default '{}',
  receiver_cards text[] not null default '{}',
  status         text not null default 'pending'
                   check (status in ('pending', 'accepted', 'declined', 'cancelled')),
  message        text,
  created_at     timestamptz default now()
);

-- ── Row-Level Security ────────────────────────────────────────────────────────
alter table profiles    enable row level security;
alter table cards       enable row level security;
alter table friendships enable row level security;
alter table trades      enable row level security;

-- profiles: anyone can read (for search); only owner can write
create policy "profiles_read"        on profiles for select using (true);
create policy "profiles_insert_own"  on profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own"  on profiles for update using (auth.uid() = id);

-- cards: own cards + accepted friends' cards (for trade viewing)
create policy "cards_read" on cards for select using (
  auth.uid() = user_id
  or exists (
    select 1 from friendships f
    where f.status = 'accepted'
      and (
        (f.sender_id   = auth.uid() and f.receiver_id = user_id)
        or (f.receiver_id = auth.uid() and f.sender_id   = user_id)
      )
  )
);
create policy "cards_insert_own" on cards for insert with check (auth.uid() = user_id);
create policy "cards_update_own" on cards for update using (auth.uid() = user_id);
create policy "cards_delete_own" on cards for delete using (auth.uid() = user_id);

-- friendships: visible to both parties
create policy "friendships_read"   on friendships for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "friendships_insert" on friendships for insert
  with check (auth.uid() = sender_id);
create policy "friendships_update" on friendships for update
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- trades: visible to both parties
create policy "trades_read"   on trades for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "trades_insert" on trades for insert
  with check (auth.uid() = sender_id);
create policy "trades_update" on trades for update
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- ── Stored procedure: atomic trade acceptance ─────────────────────────────────
create or replace function accept_trade(trade_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  t trades%rowtype;
begin
  select * into t from trades where id = trade_id and status = 'pending';
  if not found then
    raise exception 'Trade not found or not pending';
  end if;

  if t.receiver_id != auth.uid() then
    raise exception 'Only the receiver can accept this trade';
  end if;

  -- Transfer sender's offered cards to receiver
  update cards set user_id = t.receiver_id
  where id = any(t.sender_cards) and user_id = t.sender_id;

  -- Transfer receiver's offered cards to sender
  update cards set user_id = t.sender_id
  where id = any(t.receiver_cards) and user_id = t.receiver_id;

  -- Mark trade accepted
  update trades set status = 'accepted' where id = trade_id;
end;
$$;
