import { useState, useEffect } from 'react'
import { RefreshCw, ArrowLeftRight, TrendingUp, TrendingDown } from 'lucide-react'
import { generateTradeOffers, RARITY_COLORS, RARITY_BADGES, SPORT_EMOJIS } from '../lib/gameData'

function fmt(n) {
  if (n < 1) return Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function MiniCard({ card, label }) {
  if (!card) return null
  const rc = RARITY_COLORS[card.rarity] || RARITY_COLORS['Base']
  const initials = (card.playerName || '?').split(' ').map(w => w[0] || '').join('').slice(0, 2)
  return (
    <div className="flex flex-col items-center">
      <p className="text-slate-400 text-[10px] mb-1.5 uppercase tracking-wide font-semibold">{label}</p>
      <div
        className="w-full rounded-xl border p-3 text-center"
        style={{ background: rc.bg, borderColor: rc.border }}
      >
        <div
          className="w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center font-black text-white/40 text-base"
          style={{ background: 'rgba(0,0,0,0.3)' }}
        >
          {initials}
        </div>
        <p className="text-white font-bold text-xs leading-tight truncate">{card.playerName || 'Unknown'}</p>
        <p className="text-white/50 text-[10px] mt-0.5">{SPORT_EMOJIS[card.sport] || ''} {card.year || ''}</p>
        <span className={`inline-block text-[9px] px-1.5 py-0.5 rounded-full mt-1 font-semibold ${RARITY_BADGES[card.rarity] || 'bg-gray-500 text-white'}`}>
          {card.rarity === 'Numbered' && card.printRun ? `#${card.serialNumber}/${card.printRun}` : (card.rarity || 'Base')}
        </span>
        <p className="text-amber-400 font-bold text-sm mt-1.5">{fmt(card.currentValue ?? 0)}</p>
      </div>
    </div>
  )
}

export default function Trade({ collectionCards, money, onAcceptTrade }) {
  const [offers, setOffers] = useState([])
  const [acceptedIds, setAcceptedIds] = useState(new Set())
  const [declinedIds, setDeclinedIds] = useState(new Set())

  function refreshOffers() {
    setOffers(generateTradeOffers(collectionCards))
    setAcceptedIds(new Set())
    setDeclinedIds(new Set())
  }

  useEffect(() => {
    if (collectionCards.length > 0) {
      setOffers(generateTradeOffers(collectionCards))
    }
  }, []) // eslint-disable-line

  function handleAccept(offer) {
    onAcceptTrade(offer)
    setAcceptedIds(prev => new Set([...prev, offer.id]))
  }

  function handleDecline(offerId) {
    setDeclinedIds(prev => new Set([...prev, offerId]))
  }

  const activeOffers = offers.filter(o => !acceptedIds.has(o.id) && !declinedIds.has(o.id))

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-lg">Trade Market</h2>
          <p className="text-slate-400 text-xs">Collectors want your cards</p>
        </div>
        <button
          onClick={refreshOffers}
          className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm px-3 py-2 rounded-xl transition-colors"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {collectionCards.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <ArrowLeftRight size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No cards to trade</p>
          <p className="text-sm mt-1">Buy cards at Card Shows first</p>
        </div>
      ) : activeOffers.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <ArrowLeftRight size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No active offers</p>
          <button
            onClick={refreshOffers}
            className="mt-3 bg-amber-500 text-black px-4 py-2 rounded-xl text-sm font-bold"
          >
            Get New Offers
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {activeOffers.filter(o => o.wantedCard && o.offeredCard).map(offer => {
            const yourValue = offer.wantedCard.currentValue ?? 0
            const theirValue = (offer.offeredCard.currentValue ?? 0) + (offer.cashBonus ?? 0)
            const isGoodDeal = theirValue >= yourValue * 0.95

            return (
              <div key={offer.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
                {/* Collector name */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-slate-400 text-xs">Offer from</p>
                    <p className="text-white font-bold">{offer.collectorName}</p>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full
                    ${isGoodDeal ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700' : 'bg-red-900/50 text-red-400 border border-red-800'}`}>
                    {isGoodDeal
                      ? <><TrendingUp size={12}/>Good deal</>
                      : <><TrendingDown size={12}/>You lose value</>
                    }
                  </div>
                </div>

                {/* Cards display */}
                <div className="grid grid-cols-2 gap-3 relative">
                  <MiniCard card={offer.wantedCard} label="You give" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10
                    bg-slate-700 border border-slate-600 rounded-full w-8 h-8 flex items-center justify-center">
                    <ArrowLeftRight size={14} className="text-amber-400" />
                  </div>
                  <MiniCard card={offer.offeredCard} label="You get" />
                </div>

                {/* Cash bonus */}
                {offer.cashBonus > 0 && (
                  <div className="mt-3 bg-emerald-900/30 border border-emerald-800 rounded-xl p-2.5 text-center">
                    <p className="text-emerald-400 font-bold text-sm">
                      + {fmt(offer.cashBonus)} cash included
                    </p>
                  </div>
                )}

                {/* Value comparison */}
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400 bg-slate-900/50 rounded-lg p-2">
                  <span>Your card value: <span className="text-white font-semibold">{fmt(yourValue)}</span></span>
                  <span>You receive: <span className={`font-semibold ${isGoodDeal ? 'text-emerald-400' : 'text-red-400'}`}>{fmt(theirValue)}</span></span>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleAccept(offer)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition-colors text-sm"
                  >
                    Accept Trade
                  </button>
                  <button
                    onClick={() => handleDecline(offer.id)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2.5 rounded-xl transition-colors text-sm"
                  >
                    Decline
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
