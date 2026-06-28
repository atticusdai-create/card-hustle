import { useState } from 'react'
import { X, DollarSign, User } from 'lucide-react'
import CardDisplay from './CardDisplay'

function fmt(n) {
  if (n < 1) return Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

export default function Shop({
  shopCards,
  customerOffer,
  onRemoveFromShop,
  onUpdatePrice,
  onAcceptOffer,
  onDeclineOffer,
}) {
  const [editingPrice, setEditingPrice] = useState(null) // { cardId, value }
  const [priceError, setPriceError] = useState('')

  function handlePriceSubmit(cardId) {
    const val = parseFloat(editingPrice.value)
    if (!isNaN(val) && val > 0) {
      const card = shopCards.find(c => c.id === cardId)
      const maxPrice = card.currentValue + 50
      if (val > maxPrice) {
        setPriceError(`Max price is $${Math.round(maxPrice)} (value + $50)`)
        return
      }
      onUpdatePrice(cardId, Math.round(val * 100) / 100)
    }
    setEditingPrice(null)
    setPriceError('')
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Stats bar */}
      <div className="flex gap-3 text-sm">
        <div className="flex-1 bg-slate-800 rounded-xl p-3 text-center">
          <p className="text-slate-400 text-xs">Cards Listed</p>
          <p className="text-white font-bold text-xl">{shopCards.length}</p>
        </div>
        <div className="flex-1 bg-slate-800 rounded-xl p-3 text-center">
          <p className="text-slate-400 text-xs">Shop Value</p>
          <p className="text-amber-400 font-bold text-xl">
            {fmt(shopCards.reduce((s, c) => s + (c.shopPrice || 0), 0))}
          </p>
        </div>
      </div>

      {/* Customer offer popup */}
      {customerOffer && (
        <div className="bg-emerald-900 border border-emerald-500 rounded-xl p-4 slide-up">
          <div className="flex items-start gap-3">
            <div className="bg-emerald-700 rounded-full p-2 shrink-0">
              <User size={18} className="text-emerald-200" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-emerald-300 font-bold text-sm">{customerOffer.collectorName} walked in!</p>
              <p className="text-white font-semibold mt-0.5 truncate">
                Wants: <span className="text-amber-300">{customerOffer.card.playerName}</span>
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-black text-emerald-300">{fmt(customerOffer.offerPrice)}</span>
                <span className="text-slate-400 text-xs">
                  (listed {fmt(customerOffer.card.shopPrice)})
                </span>
              </div>

            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={onAcceptOffer}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg transition-colors text-sm"
            >
              Accept {fmt(customerOffer.offerPrice)}
            </button>
            <button
              onClick={onDeclineOffer}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2.5 rounded-lg transition-colors text-sm"
            >
              Decline
            </button>
          </div>
        </div>
      )}

      {/* Cards grid */}
      {shopCards.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <Store size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">Your shop is empty</p>
          <p className="text-sm mt-1">Add cards from your Collection tab</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {shopCards.map(card => (
            <CardDisplay key={card.id} card={card}>
              {/* Price editor */}
              <div className="space-y-1.5">
                {editingPrice?.cardId === card.id ? (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      <input
                        type="number"
                        className={`flex-1 bg-slate-900 text-white rounded-md px-2 py-1 text-xs border outline-none w-0 ${priceError ? 'border-red-500' : 'border-amber-500'}`}
                        value={editingPrice.value}
                        onChange={e => { setEditingPrice({ cardId: card.id, value: e.target.value }); setPriceError('') }}
                        onKeyDown={e => { if (e.key === 'Enter') handlePriceSubmit(card.id) }}
                        autoFocus
                      />
                      <button
                        onClick={() => handlePriceSubmit(card.id)}
                        className="bg-amber-500 text-black text-xs px-2 py-1 rounded-md font-bold"
                      >
                        ✓
                      </button>
                    </div>
                    {priceError && (
                      <p className="text-red-400 text-xs">{priceError}</p>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => { setEditingPrice({ cardId: card.id, value: card.shopPrice || '' }); setPriceError('') }}
                    className="w-full flex items-center gap-1 bg-black/30 hover:bg-black/50 text-amber-400 text-xs py-1.5 rounded-md transition-colors font-semibold"
                  >
                    <DollarSign size={11} />
                    Listed: {fmt(card.shopPrice)}
                  </button>
                )}
                <button
                  onClick={() => onRemoveFromShop(card.id)}
                  className="w-full flex items-center justify-center gap-1 bg-red-900/40 hover:bg-red-900/60 text-red-400 text-xs py-1.5 rounded-md transition-colors"
                >
                  <X size={11} />
                  Remove
                </button>
              </div>
            </CardDisplay>
          ))}
        </div>
      )}
    </div>
  )
}

// Used in empty state icon
function Store({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 9l1-6h16l1 6" />
      <path d="M3 9a2 2 0 0 0 4 0m-4 0a2 2 0 0 1 4 0m0 0a2 2 0 0 0 4 0m-4 0a2 2 0 0 1 4 0m0 0a2 2 0 0 0 4 0m-4 0a2 2 0 0 1 4 0" />
      <path d="M5 9v12h14V9" />
      <path d="M9 21v-6h6v6" />
    </svg>
  )
}
