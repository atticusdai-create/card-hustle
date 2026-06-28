import { useState, useCallback } from 'react'
import { RefreshCw, TrendingUp, TrendingDown, Minus, ShoppingBag } from 'lucide-react'
import { generateCardShow, SPORTS, SPORT_EMOJIS, RARITY_COLORS, RARITY_BADGES } from '../lib/gameData'

function fmt(n) {
  if (n < 1) return Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function DealBadge({ ratio }) {
  if (ratio <= 0.75)  return <span className="text-xs text-emerald-400 font-bold flex items-center gap-0.5"><TrendingDown size={12}/>Hot Deal</span>
  if (ratio <= 0.9)   return <span className="text-xs text-green-400 flex items-center gap-0.5"><TrendingDown size={12}/>Good Buy</span>
  if (ratio <= 1.1)   return <span className="text-xs text-slate-400 flex items-center gap-0.5"><Minus size={12}/>Fair</span>
  if (ratio <= 1.25)  return <span className="text-xs text-orange-400 flex items-center gap-0.5"><TrendingUp size={12}/>Pricey</span>
  return <span className="text-xs text-red-400 flex items-center gap-0.5"><TrendingUp size={12}/>Overpriced</span>
}

export default function CardShows({ money, onBuyCard }) {
  const [showCards, setShowCards] = useState(() => generateCardShow())
  const [sportFilter, setSportFilter] = useState('All')
  const [buying, setBuying] = useState(null)
  const [boughtIds, setBoughtIds] = useState(new Set())

  const refresh = useCallback(() => {
    setShowCards(generateCardShow())
    setBoughtIds(new Set())
  }, [])

  const filtered = sportFilter === 'All'
    ? showCards
    : showCards.filter(c => c.sport === sportFilter)

  function handleBuy(card) {
    if (money < card.showPrice) return
    setBuying(card.id)
    setTimeout(() => {
      onBuyCard(card, card.showPrice)
      setBoughtIds(prev => new Set([...prev, card.id]))
      setBuying(null)
    }, 400)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-lg leading-tight">Card Show</h2>
          <p className="text-slate-400 text-xs">Find deals on real player cards</p>
        </div>
        <button
          onClick={refresh}
          className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm px-3 py-2 rounded-xl transition-colors"
        >
          <RefreshCw size={14} />
          New Show
        </button>
      </div>

      {/* Sport filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['All', ...SPORTS].map(s => (
          <button
            key={s}
            onClick={() => setSportFilter(s)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors
              ${sportFilter === s
                ? 'bg-amber-500 text-black'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            {s === 'All' ? 'All' : `${SPORT_EMOJIS[s]} ${s}`}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {filtered.map(card => {
          const rc = RARITY_COLORS[card.rarity]
          const bought = boughtIds.has(card.id)
          const isBuying = buying === card.id
          const canAfford = money >= card.showPrice

          return (
            <div
              key={card.id}
              className="flex gap-3 rounded-xl border p-3 transition-opacity"
              style={{
                background: rc.bg,
                borderColor: rc.border,
                opacity: bought ? 0.4 : 1,
              }}
            >
              {/* Mini art */}
              <div
                className="shrink-0 w-14 h-14 rounded-lg flex items-center justify-center font-black text-white/40"
                style={{ background: 'rgba(0,0,0,0.25)', fontSize: 18 }}
              >
                {card.playerName.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm truncate">{card.playerName}</p>
                <p className="text-white/50 text-xs">{SPORT_EMOJIS[card.sport]} {card.sport} · {card.year}</p>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${RARITY_BADGES[card.rarity] || 'bg-gray-500 text-white'}`}>
                    {card.rarity === 'Numbered' && card.printRun ? `#${card.serialNumber}/${card.printRun}` : card.rarity}
                  </span>
                  <span className="text-[9px] text-white/40">{card.condition}</span>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <DealBadge ratio={card.priceRatio} />
                </div>
              </div>

              {/* Buy */}
              <div className="flex flex-col items-end justify-between shrink-0">
                <div className="text-right">
                  <p className="text-amber-400 font-bold text-sm">{fmt(card.showPrice)}</p>
                  <p className="text-white/30 text-[10px] line-through">{fmt(card.currentValue)}</p>
                </div>
                {!bought ? (
                  <button
                    onClick={() => handleBuy(card)}
                    disabled={!canAfford || isBuying}
                    className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors
                      ${canAfford
                        ? 'bg-amber-500 hover:bg-amber-400 text-black'
                        : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                  >
                    {isBuying ? '...' : canAfford ? 'Buy' : 'No $'}
                  </button>
                ) : (
                  <span className="text-emerald-400 text-xs font-bold">Bought!</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <ShoppingBag size={40} className="mx-auto mb-2 opacity-30" />
          <p>No {sportFilter} cards at this show</p>
        </div>
      )}
    </div>
  )
}
