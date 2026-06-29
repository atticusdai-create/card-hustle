-- Card Hustle Game Database Schema
-- Run this in your Supabase SQL Editor at https://supabase.com/dashboard

-- Game state table (one row per player session)
CREATE TABLE IF NOT EXISTS game_state (
  id TEXT PRIMARY KEY DEFAULT 'player1',
  player_name TEXT NOT NULL DEFAULT 'Collector',
  money DECIMAL(10,2) NOT NULL DEFAULT 500.00,
  shop_name TEXT NOT NULL DEFAULT 'Card Hustle HQ',
  days_played INTEGER NOT NULL DEFAULT 1,
  total_earned DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_spent DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  cards_sold INTEGER NOT NULL DEFAULT 0,
  reputation INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cards table (stores all cards owned by the player)
CREATE TABLE IF NOT EXISTS cards (
  id TEXT PRIMARY KEY,
  player_name TEXT NOT NULL,
  sport TEXT NOT NULL,
  year INTEGER NOT NULL,
  rarity TEXT NOT NULL,
  condition TEXT NOT NULL,
  psa_grade INTEGER,
  base_value DECIMAL(10,2) NOT NULL,
  current_value DECIMAL(10,2) NOT NULL,
  location TEXT NOT NULL DEFAULT 'collection',
  shop_price DECIMAL(10,2),
  grading_submitted_at TIMESTAMPTZ,
  grading_complete_at TIMESTAMPTZ,
  serial_number INTEGER,
  print_run INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (required for Supabase anon/publishable key access)
ALTER TABLE game_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- Permissive public policies (appropriate for a single-player browser game)
CREATE POLICY "Public read game_state"   ON game_state FOR SELECT USING (true);
CREATE POLICY "Public insert game_state" ON game_state FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update game_state" ON game_state FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Public read cards"   ON cards FOR SELECT USING (true);
CREATE POLICY "Public insert cards" ON cards FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update cards" ON cards FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete cards" ON cards FOR DELETE USING (true);

-- Auto-update updated_at on row changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_game_state_updated_at') THEN
    CREATE TRIGGER update_game_state_updated_at
      BEFORE UPDATE ON game_state
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_cards_updated_at') THEN
    CREATE TRIGGER update_cards_updated_at
      BEFORE UPDATE ON cards
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Migration: add serial_number and print_run columns for Numbered card type
ALTER TABLE cards ADD COLUMN IF NOT EXISTS serial_number INTEGER;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS print_run INTEGER;

-- Migration: add favorited column to protect cards from Delete All
ALTER TABLE cards ADD COLUMN IF NOT EXISTS favorited BOOLEAN NOT NULL DEFAULT false;
