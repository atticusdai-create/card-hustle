import { useState, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { Check, ChevronLeft, ArrowLeftRight, Send, X, Search } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import {
  getFriendships, getFriendCards, proposeTrade,
  getTrades, respondTrade, acceptTradeRPC, getCardsByIds,
} from '../lib/supabase'
import { RARITY_BADGES } from '../lib/gameData'

function fmt(n) {
  if (n == null) return '—'
  if (n < 1) return Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function mapCard(c) {
  return {
    id: c.id,
    playerName: c.player_name,
    rarity: c.rarity,
    year: c.year,
    currentValue: Number(c.current_value),
    serialNumber: c.serial_number,
    printRun: c.print_run,
    psaGrade: c.psa_grade,
  }
}

function CardRow({ card, selected, onToggle }) {
  return (
    <button
      onClick={() => onToggle(card.id)}
      className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border transition-colors text-left
        ${selected
          ? 'bg-amber-500/15 border-amber-500/60'
          : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}
    >
      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors
        ${selected ? 'bg-amber-500 border-amber-500' : 'border-slate-500'}`}>
        {selected && <Check size={9} className="text-black" strokeWidth={3.5} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${RARITY_BADGES[card.rarity] || 'bg-slate-600 text-white'}`}>
            {card.rarity}
          </span>
          <span className="text-white text-xs font-semibold truncate">{card.playerName}</span>
          {card.serialNumber && (
            <span className="text-slate-400 text-[9px]">/{card.printRun}</span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-slate-500 text-[10px]">{card.year}</span>
          {card.psaGrade && <span className="text-yellow-400 text-[10px]">PSA {card.psaGrade}</span>}
        </div>
      </div>
      <span className="text-amber-400 text-xs font-bold shrink-0">{fmt(card.currentValue)}</span>
    </button>
  )
}

function TradeRow({ trade, myId, cardMap, onAccept, onDecline, onCancel }) {
  const isIncoming = trade.receiver_id === myId
  const partner = isIncoming ? trade.sender : trade.receiver

  function cardChip(cardId) {
    const c = cardMap[cardId]
    if (!c) return <span key={cardId} className="text-slate-500 text-[10px]">card</span>
    return (
      <span key={cardId} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${RARITY_BADGES[c.rarity] || 'bg-slate-600 text-white'}`}>
        {c.player_name}
      </span>
    )
  }

  return (
    <div className="bg-slate-900 rounded-xl p-3 flex flex-col gap-2.5 border border-slate-700">
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-xs">
          {isIncoming ? `From @${partner?.username}` : `To @${partner?.username}`}
        </span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
          ${trade.status === 'pending'  ? 'bg-amber-500/20 text-amber-400' :
            trade.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' :
            'bg-slate-700 text-slate-400'}`}>
          {trade.status}
        </span>
      </div>

      {trade.sender_cards?.length > 0 && (
        <div>
          <p className="text-slate-500 text-[10px] mb-1">{isIncoming ? 'They offer:' : 'You offer:'}</p>
          <div className="flex flex-wrap gap-1">{trade.sender_cards.map(cardChip)}</div>
        </div>
      )}
      {trade.receiver_cards?.length > 0 && (
        <div>
          <p className="text-slate-500 text-[10px] mb-1">{isIncoming ? 'They want:' : 'You request:'}</p>
          <div className="flex flex-wrap gap-1">{trade.receiver_cards.map(cardChip)}</div>
        </div>
      )}
      {trade.message && (
        <p className="text-slate-400 text-xs italic border-t border-slate-800 pt-2">"{trade.message}"</p>
      )}

      {trade.status === 'pending' && (
        <div className="flex gap-2 pt-1">
          {isIncoming ? (
            <>
              <button
                onClick={() => onAccept(trade.id)}
                className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 text-xs font-bold rounded-lg py-2 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={() => onDecline(trade.id)}
                className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded-lg px-3 py-2 transition-colors"
              >
                Decline
              </button>
            </>
          ) : (
            <button
              onClick={() => onCancel(trade.id)}
              className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded-lg px-3 py-2 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function TradePage({ myCards = [], onRefresh, onRemoveCards }) {
  const { user } = useAuth()
  const location = useLocation()
  const preselectedFriendId = location.state?.friendId

  const [tab, setTab] = useState('propose')
  const [friends, setFriends] = useState([])
  const [selectedFriend, setSelectedFriend] = useState(null)
  const [friendCards, setFriendCards] = useState([])
  const [mySelected, setMySelected] = useState(new Set())
  const [theirSelected, setTheirSelected] = useState(new Set())
  const [message, setMessage] = useState('')
  const [trades, setTrades] = useState([])
  const [cardMap, setCardMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [loadingFriendCards, setLoadingFriendCards] = useState(false)
  const [sending, setSending] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [mySearch, setMySearch]             = useState('')
  const [theirSearch, setTheirSearch]       = useState('')
  const [debouncedMySearch, setDebouncedMySearch]       = useState('')
  const [debouncedTheirSearch, setDebouncedTheirSearch] = useState('')

  // 200ms debounce on both search fields
  useEffect(() => {
    const id = setTimeout(() => setDebouncedMySearch(mySearch), 200)
    return () => clearTimeout(id)
  }, [mySearch])
  useEffect(() => {
    const id = setTimeout(() => setDebouncedTheirSearch(theirSearch), 200)
    return () => clearTimeout(id)
  }, [theirSearch])

  // collection cards only
  const myCollectionCards = useMemo(
    () => myCards.filter(c => c.location === 'collection'),
    [myCards]
  )

  useEffect(() => { loadAll() }, [])

  // Pre-select friend passed from Friends page
  useEffect(() => {
    if (preselectedFriendId && friends.length > 0) {
      const f = friends.find(fr => fr.id === preselectedFriendId)
      if (f) selectFriend(f)
    }
  }, [preselectedFriendId, friends])

  async function loadAll() {
    setLoading(true)
    try {
      const [friendships, tradesData] = await Promise.all([
        getFriendships(),
        getTrades(),
      ])

      const accepted = friendships
        .filter(f => f.status === 'accepted')
        .map(f => f.sender_id === user?.id ? f.receiver : f.sender)
        .filter(Boolean)
      setFriends(accepted)

      setTrades(tradesData)

      const allCardIds = [...new Set(tradesData.flatMap(t => [
        ...(t.sender_cards || []),
        ...(t.receiver_cards || []),
      ]))]
      if (allCardIds.length > 0) {
        const details = await getCardsByIds(allCardIds)
        setCardMap(Object.fromEntries(details.map(c => [c.id, c])))
      }
    } catch (e) {
      console.error(e)
      setErrorMsg(e.message || 'Failed to load trades — check your connection and try again')
    } finally {
      setLoading(false)
    }
  }

  async function selectFriend(friend) {
    setSelectedFriend(friend)
    setMySelected(new Set())
    setTheirSelected(new Set())
    setMessage('')
    setMySearch('')
    setTheirSearch('')
    setLoadingFriendCards(true)
    try {
      const raw = await getFriendCards(friend.id)
      const mapped = raw.map(mapCard)
      console.log('[Trade] friend cards loaded:', mapped.map(c => ({ id: c.id, playerName: c.playerName })))
      setFriendCards(mapped)
    } catch (e) {
      setFriendCards([])
      setErrorMsg(`Could not load ${friend.username}'s cards: ${e.message}`)
    } finally {
      setLoadingFriendCards(false)
    }
  }

  function toggleMy(id) {
    setMySelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  function toggleTheir(id) {
    console.log('[Trade] toggleTheir called with id:', id)
    setTheirSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  async function handleSend() {
    if (!selectedFriend) return
    if (mySelected.size === 0 && theirSelected.size === 0) {
      setErrorMsg('Select at least one card to offer or request')
      return
    }
    setErrorMsg('')
    setSending(true)
    try {
      console.log('[Trade] proposeTrade args — senderCards:', [...mySelected], 'receiverCards:', [...theirSelected])
      await proposeTrade(selectedFriend.id, [...mySelected], [...theirSelected], message)
      setSelectedFriend(null)
      setMySelected(new Set())
      setTheirSelected(new Set())
      setMessage('')
      setFriendCards([])
      await loadAll()
      setTab('sent')
    } catch (e) {
      setErrorMsg(e.message || 'Failed to send trade')
    } finally {
      setSending(false)
    }
  }

  async function handleAccept(tradeId) {
    try {
      await acceptTradeRPC(tradeId)
      // Immediately remove the cards we gave away from local state so they
      // disappear without waiting for the DB round-trip.
      const trade = trades.find(t => t.id === tradeId)
      console.log('[handleAccept] trade:', trade)
      console.log('[handleAccept] receiver_cards:', trade?.receiver_cards)
      console.log('[handleAccept] onRemoveCards defined:', typeof onRemoveCards)
      if (trade?.receiver_cards?.length) onRemoveCards?.(trade.receiver_cards)
      await Promise.all([loadAll(), onRefresh?.()])
    } catch (e) {
      setErrorMsg(e.message || 'Failed to accept trade')
    }
  }

  async function handleDecline(tradeId) {
    try {
      await respondTrade(tradeId, 'declined')
      await loadAll()
    } catch (e) {
      setErrorMsg(e.message || 'Failed to decline trade')
    }
  }

  async function handleCancel(tradeId) {
    try {
      await respondTrade(tradeId, 'cancelled')
      await loadAll()
    } catch (e) {
      setErrorMsg(e.message || 'Failed to cancel trade')
    }
  }

  const incoming = useMemo(() => trades.filter(t => t.receiver_id === user?.id && t.status === 'pending'), [trades, user?.id])
  const sent     = useMemo(() => trades.filter(t => t.sender_id   === user?.id && t.status === 'pending'), [trades, user?.id])
  const history  = useMemo(() => trades.filter(t => t.status !== 'pending'), [trades])

  const filteredMyCards = useMemo(() => {
    if (!debouncedMySearch.trim()) return myCollectionCards
    const q = debouncedMySearch.trim().toLowerCase()
    return myCollectionCards.filter(c => c.playerName.toLowerCase().includes(q))
  }, [myCollectionCards, debouncedMySearch])

  const filteredTheirCards = useMemo(() => {
    if (!debouncedTheirSearch.trim()) return friendCards
    const q = debouncedTheirSearch.trim().toLowerCase()
    return friendCards.filter(c => c.playerName.toLowerCase().includes(q))
  }, [friendCards, debouncedTheirSearch])

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs */}
      <div className="flex bg-slate-800 rounded-xl p-1 gap-1">
        {[
          { id: 'propose',  label: 'Propose' },
          { id: 'incoming', label: `Incoming${incoming.length ? ` (${incoming.length})` : ''}` },
          { id: 'sent',     label: 'Sent' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors
              ${tab === t.id ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {errorMsg && (
        <div className="bg-red-900/60 border border-red-700 text-red-200 text-sm rounded-xl px-4 py-3 flex items-center justify-between">
          {errorMsg}
          <button onClick={() => setErrorMsg('')}><X size={14} /></button>
        </div>
      )}

      {/* Propose tab */}
      {tab === 'propose' && (
        <>
          {!selectedFriend ? (
            <div className="bg-slate-800 rounded-2xl p-4 flex flex-col gap-3">
              <h2 className="text-white font-bold text-base flex items-center gap-2">
                <ArrowLeftRight size={16} className="text-amber-400" />
                Pick a Friend to Trade With
              </h2>
              {loading ? (
                <p className="text-slate-500 text-sm text-center py-4">Loading…</p>
              ) : friends.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-6">
                  Add friends first to start trading!
                </p>
              ) : (
                friends.map(f => (
                  <button
                    key={f?.id}
                    onClick={() => selectFriend(f)}
                    className="flex items-center gap-3 bg-slate-900 hover:bg-slate-700 rounded-xl px-3 py-3 text-left transition-colors border border-slate-700 hover:border-slate-500"
                  >
                    <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 font-black text-lg">
                      {f?.username?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{f?.username}</p>
                      <p className="text-slate-500 text-xs">Tap to propose a trade</p>
                    </div>
                    <ArrowLeftRight size={16} className="ml-auto text-slate-600" />
                  </button>
                ))
              )}
            </div>
          ) : (
            <>
              {/* Back button */}
              <button
                onClick={() => { setSelectedFriend(null); setFriendCards([]) }}
                className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm font-medium transition-colors"
              >
                <ChevronLeft size={16} />
                Back to friends
              </button>

              <div className="bg-slate-800 rounded-2xl p-4 flex flex-col gap-3">
                <h2 className="text-white font-bold text-sm">
                  Trade with <span className="text-amber-400">@{selectedFriend.username}</span>
                </h2>

                {/* My cards */}
                <div>
                  <p className="text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wide">
                    Your cards to offer
                    {mySelected.size > 0 && <span className="text-amber-400 ml-2">{mySelected.size} selected</span>}
                  </p>
                  {myCollectionCards.length === 0 ? (
                    <p className="text-slate-500 text-xs py-2">No cards in collection</p>
                  ) : (
                    <>
                      <div className="relative mb-2">
                        <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="Search your cards…"
                          value={mySearch}
                          onChange={e => setMySearch(e.target.value)}
                          className="w-full bg-slate-900 text-white text-xs rounded-lg pl-7 pr-7 py-2 border border-slate-700 outline-none placeholder-slate-600 focus:border-amber-500 transition-colors"
                        />
                        {mySearch && (
                          <button onClick={() => setMySearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                            <X size={11} />
                          </button>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
                        {filteredMyCards.map(c => (
                          <CardRow key={c.id} card={c} selected={mySelected.has(c.id)} onToggle={toggleMy} />
                        ))}
                        {debouncedMySearch.trim() && filteredMyCards.length === 0 && (
                          <p className="text-slate-500 text-xs py-2 text-center">No cards match</p>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Their cards */}
                <div>
                  <p className="text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wide">
                    {selectedFriend.username}'s cards to request
                    {theirSelected.size > 0 && <span className="text-amber-400 ml-2">{theirSelected.size} selected</span>}
                  </p>
                  {loadingFriendCards ? (
                    <p className="text-slate-500 text-xs py-2">Loading their cards…</p>
                  ) : friendCards.length === 0 ? (
                    <p className="text-slate-500 text-xs py-2">They have no cards in collection</p>
                  ) : (
                    <>
                      <div className="relative mb-2">
                        <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                        <input
                          type="text"
                          placeholder={`Search ${selectedFriend.username}'s cards…`}
                          value={theirSearch}
                          onChange={e => setTheirSearch(e.target.value)}
                          className="w-full bg-slate-900 text-white text-xs rounded-lg pl-7 pr-7 py-2 border border-slate-700 outline-none placeholder-slate-600 focus:border-amber-500 transition-colors"
                        />
                        {theirSearch && (
                          <button onClick={() => setTheirSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                            <X size={11} />
                          </button>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
                        {filteredTheirCards.map(c => (
                          <CardRow key={c.id} card={c} selected={theirSelected.has(c.id)} onToggle={toggleTheir} />
                        ))}
                        {debouncedTheirSearch.trim() && filteredTheirCards.length === 0 && (
                          <p className="text-slate-500 text-xs py-2 text-center">No cards match</p>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Message */}
                <div>
                  <p className="text-slate-400 text-xs font-semibold mb-1.5 uppercase tracking-wide">Message (optional)</p>
                  <input
                    type="text"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Hey, fair trade?"
                    className="w-full bg-slate-900 text-white text-sm rounded-xl px-3 py-2.5 border border-slate-700 outline-none placeholder-slate-600 focus:border-amber-500 transition-colors"
                    maxLength={200}
                  />
                </div>

                {/* Send */}
                <button
                  onClick={handleSend}
                  disabled={sending || (mySelected.size === 0 && theirSelected.size === 0)}
                  className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-colors"
                >
                  <Send size={15} />
                  {sending ? 'Sending…' : 'Send Trade Offer'}
                </button>
              </div>
            </>
          )}
        </>
      )}

      {/* Incoming tab */}
      {tab === 'incoming' && (
        <div className="flex flex-col gap-3">
          {loading ? (
            <p className="text-slate-500 text-sm text-center py-8">Loading…</p>
          ) : incoming.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <ArrowLeftRight size={36} className="mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No incoming trades</p>
            </div>
          ) : (
            incoming.map(t => (
              <TradeRow
                key={t.id}
                trade={t}
                myId={user?.id}
                cardMap={cardMap}
                onAccept={handleAccept}
                onDecline={handleDecline}
                onCancel={handleCancel}
              />
            ))
          )}

          {history.length > 0 && (
            <>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mt-2">History</p>
              {history.map(t => (
                <TradeRow
                  key={t.id}
                  trade={t}
                  myId={user?.id}
                  cardMap={cardMap}
                  onAccept={() => {}}
                  onDecline={() => {}}
                  onCancel={() => {}}
                />
              ))}
            </>
          )}
        </div>
      )}

      {/* Sent tab */}
      {tab === 'sent' && (
        <div className="flex flex-col gap-3">
          {loading ? (
            <p className="text-slate-500 text-sm text-center py-8">Loading…</p>
          ) : sent.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Send size={36} className="mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No pending trades</p>
              <p className="text-xs mt-1">Propose a trade in the Propose tab</p>
            </div>
          ) : (
            sent.map(t => (
              <TradeRow
                key={t.id}
                trade={t}
                myId={user?.id}
                cardMap={cardMap}
                onAccept={handleAccept}
                onDecline={handleDecline}
                onCancel={handleCancel}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}
