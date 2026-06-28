import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pgmwnazirudxcrpegihd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnbXduYXppcnVkeGNycGVnaWhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1MTc5NjgsImV4cCI6MjA5ODA5Mzk2OH0.Fj8QiA8wQu6L8kC6WjLtKnPCbWO3SW3zl9uLO4WI9qY'

export const supabase = createClient(supabaseUrl, supabaseKey)

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function authSignUp(email, password, username) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  })
  if (error) throw error
  return data
}

export async function authSignIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function authSignOut() {
  await supabase.auth.signOut()
}

// ── Game state ────────────────────────────────────────────────────────────────

async function fetchAllCards(userId) {
  const PAGE_SIZE = 1000
  const allCards = []
  let from = 0

  while (true) {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('user_id', userId)
      .range(from, from + PAGE_SIZE - 1)
    if (error) throw error
    allCards.push(...(data || []))
    if (!data || data.length < PAGE_SIZE) break
    from += PAGE_SIZE
  }

  return allCards
}

export async function loadGame(userId) {
  const [profileResult, cards] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    fetchAllCards(userId),
  ])

  if (profileResult.error && profileResult.error.code !== 'PGRST116') throw profileResult.error

  return {
    gameState: profileResult.data,
    cards,
  }
}

export async function saveGameState(gs, userId) {
  const { error } = await supabase.from('profiles').update({
    balance: gs.money,
    shop_name: gs.shopName,
    days_played: gs.daysPlayed,
    total_earned: gs.totalEarned,
    total_spent: gs.totalSpent,
    cards_sold: gs.cardsSold,
    reputation: gs.reputation,
  }).eq('id', userId)
  if (error) console.error('Save game state error:', error)
}

export async function upsertCard(card, userId) {
  const { error } = await supabase.from('cards').upsert({
    id: card.id,
    user_id: userId,
    player_name: card.playerName,
    sport: card.sport,
    team: card.team ?? null,
    position: card.position ?? null,
    year: card.year,
    rarity: card.rarity,
    condition: card.condition,
    psa_grade: card.psaGrade ?? null,
    base_value: card.baseValue,
    current_value: card.currentValue,
    location: card.location,
    shop_price: card.shopPrice ?? null,
    grading_submitted_at: card.gradingSubmittedAt ?? null,
    grading_complete_at: card.gradingCompleteAt ?? null,
    serial_number: card.serialNumber ?? null,
    print_run: card.printRun ?? null,
  })
  if (error) console.error('Upsert card error:', error)
}

export async function deleteCard(cardId) {
  const { error } = await supabase.from('cards').delete().eq('id', cardId)
  if (error) console.error('Delete card error:', error)
}

export async function deleteCards(cardIds) {
  if (!cardIds.length) return
  const BATCH = 100
  for (let i = 0; i < cardIds.length; i += BATCH) {
    const batch = cardIds.slice(i, i + BATCH)
    const { error } = await supabase.from('cards').delete().in('id', batch)
    if (error) throw error
  }
}

// ── Friends ───────────────────────────────────────────────────────────────────

export async function searchProfiles(query) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username')
    .ilike('username', `%${query}%`)
    .limit(10)
  if (error) throw error
  return data || []
}

export async function getFriendships() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data, error } = await supabase
    .from('friendships')
    .select(`
      *,
      sender:profiles!sender_id(id, username),
      receiver:profiles!receiver_id(id, username)
    `)
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
  if (error) throw error
  return data || []
}

export async function sendFriendRequest(receiverId) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { error } = await supabase.from('friendships').insert({
    sender_id: user.id,
    receiver_id: receiverId,
  })
  if (error) throw error
}

export async function respondFriendRequest(friendshipId, status) {
  const { error } = await supabase
    .from('friendships')
    .update({ status })
    .eq('id', friendshipId)
  if (error) throw error
}

// ── Trades ────────────────────────────────────────────────────────────────────

function supabaseErrorMessage(error) {
  const parts = [error.message || 'Unknown error']
  if (error.code) parts.push(`[${error.code}]`)
  if (error.details) parts.push(error.details)
  if (error.hint) parts.push(`Hint: ${error.hint}`)
  return parts.join(' — ')
}

export async function getFriendCards(friendId) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated — please log out and log back in')
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('user_id', friendId)
    .eq('location', 'collection')
  if (error) throw new Error(supabaseErrorMessage(error))
  return data || []
}

export async function getCardsByIds(ids) {
  if (!ids || ids.length === 0) return []
  const { data, error } = await supabase.from('cards').select('*').in('id', ids)
  if (error) return []
  return data || []
}

export async function proposeTrade(receiverId, senderCards, receiverCards, message) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated — please log out and log back in')
  const { error } = await supabase.from('trades').insert({
    sender_id: user.id,
    receiver_id: receiverId,
    sender_cards: senderCards,
    receiver_cards: receiverCards,
    message: message || null,
  })
  if (error) throw new Error(supabaseErrorMessage(error))
}

export async function getTrades() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data, error } = await supabase
    .from('trades')
    .select(`
      *,
      sender:profiles!sender_id(id, username),
      receiver:profiles!receiver_id(id, username)
    `)
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getPendingIncomingTradeCount() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0
  const { count, error } = await supabase
    .from('trades')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', user.id)
    .eq('status', 'pending')
  if (error) return 0
  return count ?? 0
}

export async function respondTrade(tradeId, status) {
  const { error } = await supabase
    .from('trades')
    .update({ status })
    .eq('id', tradeId)
  if (error) throw new Error(supabaseErrorMessage(error))
}

export async function acceptTradeRPC(tradeId) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated — please log out and log back in')
  const { error } = await supabase.rpc('accept_trade', { trade_id: tradeId })
  if (error) throw new Error(supabaseErrorMessage(error))
}
