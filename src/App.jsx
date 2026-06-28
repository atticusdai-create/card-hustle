import { useState, useEffect, useRef, useCallback } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Wifi, WifiOff, LogOut, RefreshCw } from 'lucide-react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import Navigation from './components/Navigation'
import Shop from './components/Shop'
import CardShows from './components/CardShows'
import PSAGrading from './components/PSAGrading'
import Collection from './components/Collection'
import BuyPacks from './components/BuyPacks'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Friends from './pages/Friends'
import TradePage from './pages/Trade'
import { supabase, loadGame, saveGameState, upsertCard, deleteCard } from './lib/supabase'
import { useAuth } from './contexts/AuthContext'
import { generateCard, generatePsaGrade, calcCurrentValue, COLLECTOR_NAMES } from './lib/gameData'

const GRADING_COST = 80
const GRADING_MS   = 1 * 60 * 1000

const DEFAULT_GAME_STATE = {
  playerName: 'Collector',
  money: 0,
  shopName: 'Card Hustle HQ',
  daysPlayed: 1,
  totalEarned: 0,
  totalSpent: 0,
  cardsSold: 0,
  reputation: 1,
}

function fmt(n) {
  return Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function randFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function mapDbCard(c) {
  return {
    id: c.id,
    playerName: c.player_name,
    sport: c.sport,
    team: c.team,
    position: c.position,
    year: c.year,
    rarity: c.rarity,
    condition: c.condition,
    psaGrade: c.psa_grade,
    baseValue: Number(c.base_value),
    currentValue: Number(c.current_value),
    location: c.location,
    shopPrice: c.shop_price ? Number(c.shop_price) : null,
    gradingSubmittedAt: c.grading_submitted_at,
    gradingCompleteAt: c.grading_complete_at,
    createdAt: c.created_at,
    serialNumber: c.serial_number ?? null,
    printRun: c.print_run ?? null,
  }
}

export default function App() {
  const { user, profile, loading: authLoading, signOut } = useAuth()

  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW()

  const [loading, setLoading] = useState(true)
  const [online, setOnline]   = useState(true)
  const [gameState, setGameState] = useState(DEFAULT_GAME_STATE)
  const [cards, setCards]         = useState([])
  const [activeTab, setActiveTab] = useState('shows')
  const [customerOffer, setCustomerOffer]   = useState(null)
  const [notification, setNotification]     = useState(null)

  const mainScrollRef    = useRef(null)
  const cardsRef         = useRef(cards)
  const gameStateRef     = useRef(gameState)
  const customerOfferRef = useRef(null)
  const activeTabRef     = useRef(activeTab)
  const userRef          = useRef(null)
  const onlineRef        = useRef(online)

  useEffect(() => { cardsRef.current = cards }, [cards])
  useEffect(() => { gameStateRef.current = gameState }, [gameState])
  useEffect(() => { activeTabRef.current = activeTab }, [activeTab])
  useEffect(() => { userRef.current = user }, [user])
  useEffect(() => { onlineRef.current = online }, [online])

  // ── Load game data once auth is ready ────────────────────────────────────────
  // Both getSession() and onAuthStateChange() in AuthContext can independently flip
  // authLoading true→false, which causes this effect to fire twice and run two
  // concurrent init() calls. The cancelled flag ensures only the latest result is
  // applied; any in-flight fetch from a superseded run is silently discarded.
  useEffect(() => {
    if (!user || authLoading) return
    let cancelled = false
    async function init() {
      setLoading(true)
      try {
        const { gameState: gs, cards: rawCards } = await loadGame(user.id)
        if (cancelled) return

        if (gs) {
          const loaded = {
            playerName: gs.username ?? 'Collector',
            money: Number(gs.balance),
            shopName: gs.shop_name ?? DEFAULT_GAME_STATE.shopName,
            daysPlayed: gs.days_played ?? DEFAULT_GAME_STATE.daysPlayed,
            totalEarned: Number(gs.total_earned ?? 0),
            totalSpent: Number(gs.total_spent ?? 0),
            cardsSold: gs.cards_sold ?? 0,
            reputation: Number(gs.reputation ?? DEFAULT_GAME_STATE.reputation),
          }
          setGameState(loaded)
          // Sync the ref immediately so any timers/actions that fire before the
          // next render cycle see the real values, not DEFAULT_GAME_STATE.
          gameStateRef.current = loaded
        }

        setCards(rawCards.map(mapDbCard))
        setOnline(true)
      } catch (err) {
        if (cancelled) return
        console.error('Supabase load error:', err)
        setOnline(false)
        showNotification('Playing offline — changes will not be saved', 'warn')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    init()
    return () => { cancelled = true }
  }, [user?.id, authLoading])

  // ── Refresh cards from DB (called after a real trade is accepted) ─────────────
  const refreshCards = useCallback(async () => {
    if (!user) return
    try {
      const { cards: rawCards } = await loadGame(user.id)
      setCards(rawCards.map(mapDbCard))
    } catch { /* ignore */ }
  }, [user?.id])

  // ── Optimistic removal of traded-away cards (called immediately on accept) ───
  const removeCards = useCallback((cardIds) => {
    const idSet = new Set(cardIds)
    setCards(prev => prev.filter(c => !idSet.has(c.id)))
  }, [])

  // ── Customer simulation ────────────────────────────────────────────────────
  function makeOffer() {
    if (customerOfferRef.current) return
    const shopCards = cardsRef.current.filter(c => c.location === 'shop')
    if (shopCards.length === 0) return
    const card = shopCards[Math.floor(Math.random() * shopCards.length)]
    const mult = 0.5 + Math.random() * 0.5
    const offerPrice = Math.max(1, Math.round(card.shopPrice * mult * 100) / 100)
    const offer = { card, offerPrice, collectorName: randFrom(COLLECTOR_NAMES) }
    customerOfferRef.current = offer
    setCustomerOffer(offer)
  }

  function scheduleOffer(delayMs = 800) {
    setTimeout(makeOffer, delayMs)
  }

  useEffect(() => {
    if (activeTab === 'shop') scheduleOffer(500)
  }, [activeTab])

  // ── Grading completion checker ─────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date()
      cardsRef.current
        .filter(c => c.location === 'grading' && c.gradingCompleteAt && new Date(c.gradingCompleteAt) <= now)
        .forEach(card => completeGrading(card))
    }, 10_000)
    return () => clearInterval(id)
  }, [])

  // ── Helpers ────────────────────────────────────────────────────────────────
  function showNotification(message, type = 'info') {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }

  function updateCards(updater) {
    setCards(prev => {
      const next = updater(prev)
      cardsRef.current = next
      return next
    })
  }

  function updateGameState(updater) {
    const next = typeof updater === 'function' ? updater(gameStateRef.current) : updater
    gameStateRef.current = next
    setGameState(next)
    if (onlineRef.current && userRef.current) saveGameState(next, userRef.current.id).catch(console.error)
  }

  // ── Game actions ──────────────────────────────────────────────────────────

  const buyCard = useCallback((card, showPrice) => {
    if (gameStateRef.current.money < showPrice) return
    const newCard = { ...card, location: 'collection', shopPrice: null }
    updateCards(prev => [...prev, newCard])
    updateGameState(prev => ({
      ...prev,
      money: Math.round((prev.money - showPrice) * 100) / 100,
      totalSpent: Math.round((prev.totalSpent + showPrice) * 100) / 100,
    }))
    if (online && user) upsertCard(newCard, user.id).catch(console.error)
    showNotification(`Bought ${card.playerName} for ${fmt(showPrice)}!`, 'success')
  }, [online, user])

  const moveToShop = useCallback((cardId, price) => {
    updateCards(prev => prev.map(c =>
      c.id === cardId ? { ...c, location: 'shop', shopPrice: price } : c
    ))
    const card = cardsRef.current.find(c => c.id === cardId)
    if (card && online && user) upsertCard({ ...card, location: 'shop', shopPrice: price }, user.id).catch(console.error)
    scheduleOffer(600)
  }, [online, user])

  const removeFromShop = useCallback((cardId) => {
    updateCards(prev => prev.map(c =>
      c.id === cardId ? { ...c, location: 'collection', shopPrice: null } : c
    ))
    const card = cardsRef.current.find(c => c.id === cardId)
    if (card && online && user) upsertCard({ ...card, location: 'collection', shopPrice: null }, user.id).catch(console.error)
  }, [online, user])

  const updateShopPrice = useCallback((cardId, price) => {
    updateCards(prev => prev.map(c =>
      c.id === cardId ? { ...c, shopPrice: price } : c
    ))
    const card = cardsRef.current.find(c => c.id === cardId)
    if (card && online && user) upsertCard({ ...card, shopPrice: price }, user.id).catch(console.error)
  }, [online, user])

  const submitForGrading = useCallback((cardId) => {
    if (gameStateRef.current.money < GRADING_COST) return
    const now = new Date()
    const completeAt = new Date(now.getTime() + GRADING_MS).toISOString()
    updateCards(prev => prev.map(c =>
      c.id === cardId
        ? { ...c, location: 'grading', gradingSubmittedAt: now.toISOString(), gradingCompleteAt: completeAt }
        : c
    ))
    updateGameState(prev => ({
      ...prev,
      money: Math.round((prev.money - GRADING_COST) * 100) / 100,
      totalSpent: Math.round((prev.totalSpent + GRADING_COST) * 100) / 100,
    }))
    const card = cardsRef.current.find(c => c.id === cardId)
    if (card && online && user) {
      upsertCard({ ...card, location: 'grading', gradingSubmittedAt: now.toISOString(), gradingCompleteAt: completeAt }, user.id).catch(console.error)
    }
    showNotification('Card sent to PSA grading! (~1 min)', 'info')
  }, [online, user])

  function completeGrading(card) {
    const grade = generatePsaGrade(card.condition)
    const updated = { ...card, psaGrade: grade, location: 'collection', gradingCompleteAt: null, gradingSubmittedAt: null }
    updated.currentValue = calcCurrentValue(updated)
    updateCards(prev => prev.map(c => c.id === card.id ? updated : c))
    if (onlineRef.current && userRef.current) upsertCard(updated, userRef.current.id).catch(console.error)
    showNotification(`${card.playerName} graded PSA ${grade}! New value: ${fmt(updated.currentValue)}`, 'success')
  }

  const acceptOffer = useCallback(() => {
    const offer = customerOfferRef.current
    if (!offer) return
    const sale = offer.offerPrice
    updateCards(prev => prev.filter(c => c.id !== offer.card.id))
    updateGameState(prev => ({
      ...prev,
      money: Math.round((prev.money + sale) * 100) / 100,
      totalEarned: Math.round((prev.totalEarned + sale) * 100) / 100,
      cardsSold: prev.cardsSold + 1,
    }))
    if (online) deleteCard(offer.card.id).catch(console.error)
    showNotification(`Sold ${offer.card.playerName} for ${fmt(sale)}!`, 'success')
    setCustomerOffer(null)
    customerOfferRef.current = null
    scheduleOffer(1000)
  }, [online])

  const declineOffer = useCallback(() => {
    setCustomerOffer(null)
    customerOfferRef.current = null
    scheduleOffer(1200)
  }, [])

  const purchasePack = useCallback((price) => {
    updateGameState(prev => ({
      ...prev,
      money: Math.round((prev.money - price) * 100) / 100,
      totalSpent: Math.round((prev.totalSpent + price) * 100) / 100,
    }))
  }, [])

  const addCardsFromPack = useCallback((newCards) => {
    const withLocation = newCards.map(c => ({ ...c, location: 'collection' }))
    updateCards(prev => [...prev, ...withLocation])
    if (online && user) withLocation.forEach(c => upsertCard(c, user.id).catch(console.error))
    const totalValue = newCards.reduce((s, c) => s + c.currentValue, 0)
    showNotification(`Added ${newCards.length} cards! Value: ${fmt(totalValue)}`, 'success')
  }, [online, user])

  // ── Derived state ─────────────────────────────────────────────────────────
  const shopCards       = cards.filter(c => c.location === 'shop')
  const gradingCards    = cards.filter(c => c.location === 'grading')
  const collectionCards = cards.filter(c => c.location === 'collection')

  // ── Auth loading ─────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-dvh bg-slate-900 flex flex-col items-center justify-center gap-4">
        <img src="/icon.png" alt="Card Hustle" className="w-16 h-16 object-contain" />
        <div className="flex gap-1">
          {[0,1,2].map(i => (
            <div key={i} className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    )
  }

  // ── Not logged in — show auth pages only ─────────────────────────────────
  if (!user) {
    return (
      <Routes>
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*"       element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  // ── Game loading screen ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-dvh bg-slate-900 flex flex-col items-center justify-center gap-4">
        <img src="/icon.png" alt="Card Hustle" className="w-16 h-16 object-contain" />
        <h1 className="text-white text-3xl font-black tracking-tight">Card Hustle</h1>
        <div className="flex gap-1 mt-2">
          {[0,1,2].map(i => (
            <div key={i} className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
        <p className="text-slate-400 text-sm">Loading your collection…</p>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <img src="/icon.png" alt="Card Hustle" className="w-7 h-7 object-contain" />
          <div>
            <h1 className="text-white font-black text-base leading-tight tracking-tight">Card Hustle</h1>
            <p className="text-slate-500 text-[10px] leading-none">@{profile?.username}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-amber-950 border border-amber-700 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
            <span className="text-amber-400 text-sm">💰</span>
            <span className="text-amber-300 font-bold text-sm tabular-nums">{fmt(gameState.money)}</span>
          </div>
          {online
            ? <Wifi size={14} className="text-emerald-500" />
            : <WifiOff size={14} className="text-red-500" />
          }
          <button
            onClick={signOut}
            className="text-slate-500 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            title="Sign out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </header>

      {/* PWA update banner */}
      {needRefresh && (
        <button
          onClick={() => updateServiceWorker(true)}
          className="w-full bg-amber-500 text-black text-xs font-bold px-4 py-2.5 flex items-center justify-center gap-2"
        >
          <RefreshCw size={13} />
          Update available — tap to reload
        </button>
      )}

      {/* Notification toast */}
      {notification && (
        <div className={`mx-4 mt-2 rounded-xl px-4 py-3 text-sm font-medium slide-up z-50 relative
          ${notification.type === 'success' ? 'bg-emerald-900 text-emerald-200 border border-emerald-700' :
            notification.type === 'warn'    ? 'bg-amber-900 text-amber-200 border border-amber-700' :
            'bg-blue-900 text-blue-200 border border-blue-700'}`}>
          {notification.message}
        </div>
      )}

      {/* Stats strip */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-2 flex gap-4 overflow-x-auto text-xs text-slate-400">
        <span className="shrink-0">📦 Collection: <strong className="text-white">{collectionCards.length}</strong></span>
        <span className="shrink-0">🏪 Shop: <strong className="text-white">{shopCards.length}</strong></span>
        <span className="shrink-0">🔬 Grading: <strong className="text-white">{gradingCards.length}</strong></span>
        <span className="shrink-0">💸 Sold: <strong className="text-white">{gameState.cardsSold}</strong></span>
        <span className="shrink-0">📈 Earned: <strong className="text-amber-400">{fmt(gameState.totalEarned)}</strong></span>
      </div>

      {/* Main content — routed */}
      <main ref={mainScrollRef} className="flex-1 overflow-y-auto px-4 pt-4 pb-24">
        <Routes>
          {/* ── Game tabs ─────────────────────────────────── */}
          <Route path="/" element={
            <>
              {activeTab === 'shop' && (
                <Shop
                  shopCards={shopCards}
                  customerOffer={customerOffer}
                  onRemoveFromShop={removeFromShop}
                  onUpdatePrice={updateShopPrice}
                  onAcceptOffer={acceptOffer}
                  onDeclineOffer={declineOffer}
                />
              )}
              {activeTab === 'shows' && (
                <CardShows money={gameState.money} onBuyCard={buyCard} />
              )}
              {activeTab === 'grading' && (
                <PSAGrading
                  money={gameState.money}
                  collectionCards={collectionCards}
                  gradingCards={gradingCards}
                  onSubmitForGrading={submitForGrading}
                />
              )}
              {activeTab === 'collection' && (
                <Collection
                  collectionCards={collectionCards}
                  money={gameState.money}
                  onMoveToShop={moveToShop}
                  onSendToGrading={submitForGrading}
                  scrollRef={mainScrollRef}
                />
              )}
              {activeTab === 'packs' && (
                <BuyPacks
                  money={gameState.money}
                  onPurchase={purchasePack}
                  onAddCards={addCardsFromPack}
                />
              )}
            </>
          } />

          {/* ── Social ────────────────────────────────────── */}
          <Route path="/friends" element={<Friends />} />
          <Route path="/trade"   element={
            <TradePage myCards={collectionCards} onRefresh={refreshCards} onRemoveCards={removeCards} />
          } />

          {/* ── Fallback ──────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        gradingCount={gradingCards.length}
      />
    </div>
  )
}
