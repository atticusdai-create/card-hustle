import { useState, useEffect } from 'react'
import { Award, Clock, CheckCircle, Send } from 'lucide-react'
import { RARITY_COLORS, SPORT_EMOJIS } from '../lib/gameData'

const GRADING_COST = 80
const GRADING_MINUTES = 1

function fmt(n) {
  if (n < 1) return Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function Countdown({ completeAt }) {
  const [remaining, setRemaining] = useState('')

  useEffect(() => {
    function update() {
      const diff = new Date(completeAt) - new Date()
      if (diff <= 0) { setRemaining('Ready!'); return }
      const m = Math.floor(diff / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setRemaining(`${m}:${s.toString().padStart(2, '0')}`)
    }
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [completeAt])

  const isReady = remaining === 'Ready!'
  return (
    <span className={isReady ? 'text-emerald-400 font-bold' : 'text-amber-400 font-mono text-sm'}>
      {remaining}
    </span>
  )
}

export default function PSAGrading({
  money,
  collectionCards,
  gradingCards,
  onSubmitForGrading,
}) {
  const [selected, setSelected] = useState(new Set())
  const cost = selected.size * GRADING_COST
  const canAfford = money >= cost

  function toggleCard(id) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleSubmit() {
    if (!canAfford || selected.size === 0) return
    selected.forEach(id => onSubmitForGrading(id))
    setSelected(new Set())
  }

  const eligibleCards = collectionCards.filter(c => !c.psaGrade)

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl p-4 border border-blue-700">
        <div className="flex items-center gap-2 mb-1">
          <Award size={20} className="text-blue-300" />
          <h2 className="text-white font-bold">PSA Grading Center</h2>
        </div>
        <p className="text-blue-200 text-xs">
          Send cards to be professionally graded (PSA 1–10). Higher grades = higher value.
          Costs {fmt(GRADING_COST)}/card · Takes {GRADING_MINUTES} minutes.
        </p>
      </div>

      {/* Submit bar */}
      {selected.size > 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 slide-up">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white text-sm font-semibold">{selected.size} card{selected.size > 1 ? 's' : ''} selected</p>
            <p className={`font-bold text-sm ${canAfford ? 'text-amber-400' : 'text-red-400'}`}>
              Cost: {fmt(cost)}
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!canAfford}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold transition-colors
              ${canAfford ? 'bg-amber-500 hover:bg-amber-400 text-black' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
          >
            <Send size={15} />
            {canAfford ? `Submit for Grading` : `Need ${fmt(cost - money)} more`}
          </button>
        </div>
      )}

      {/* Grading queue */}
      {gradingCards.length > 0 && (
        <div>
          <h3 className="text-slate-300 font-semibold text-sm mb-2 flex items-center gap-2">
            <Clock size={14} className="text-amber-400" />
            In Grading Queue ({gradingCards.length})
          </h3>
          <div className="flex flex-col gap-2">
            {gradingCards.map(card => {
              const rc = RARITY_COLORS[card.rarity] ?? RARITY_COLORS['Base']
              const isReady = new Date(card.gradingCompleteAt) <= new Date()
              return (
                <div
                  key={card.id}
                  className="flex items-center gap-3 rounded-xl border p-3"
                  style={{ background: rc.bg, borderColor: rc.border }}
                >
                  <div
                    className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center font-black text-white/40 text-sm"
                    style={{ background: 'rgba(0,0,0,0.3)' }}
                  >
                    {(card.playerName ?? '').split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{card.playerName ?? '—'}</p>
                    <p className="text-white/50 text-xs">{SPORT_EMOJIS[card.sport] ?? ''} {card.year} · {card.condition}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {isReady
                      ? <span className="text-emerald-400 text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/>Done!</span>
                      : <Countdown completeAt={card.gradingCompleteAt} />
                    }
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Card selection */}
      {eligibleCards.length > 0 && (
        <div>
          <h3 className="text-slate-300 font-semibold text-sm mb-2">
            Select Cards to Grade
          </h3>
          <div className="flex flex-col gap-2">
            {eligibleCards.map(card => {
              const rc = RARITY_COLORS[card.rarity] ?? RARITY_COLORS['Base']
              const isSelected = selected.has(card.id)
              return (
                <button
                  key={card.id}
                  onClick={() => toggleCard(card.id)}
                  className="flex items-center gap-3 rounded-xl border p-3 text-left transition-all"
                  style={{
                    background: rc.bg,
                    borderColor: isSelected ? '#fbbf24' : rc.border,
                    boxShadow: isSelected ? '0 0 12px rgba(251,191,36,0.4)' : undefined,
                    outline: isSelected ? '2px solid #fbbf24' : undefined,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center font-black text-white/40 text-sm"
                    style={{ background: 'rgba(0,0,0,0.3)' }}
                  >
                    {(card.playerName ?? '').split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{card.playerName ?? '—'}</p>
                    <p className="text-white/50 text-xs">{SPORT_EMOJIS[card.sport] ?? ''} {card.year} · {card.rarity === 'Numbered' && card.printRun ? `#${card.serialNumber}/${card.printRun}` : card.rarity}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-amber-400 font-bold text-sm">{fmt(card.currentValue)}</p>
                    <p className="text-white/40 text-xs">{card.condition}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center
                    ${isSelected ? 'bg-amber-500 border-amber-500' : 'border-white/30'}`}>
                    {isSelected && <span className="text-black text-xs font-bold">✓</span>}
                  </div>
                </button>
              )
            })}
          </div>

        </div>
      )}

      {eligibleCards.length === 0 && gradingCards.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <Award size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No cards to grade</p>
          <p className="text-sm mt-1">Buy cards at Card Shows first</p>
        </div>
      )}

      {eligibleCards.length === 0 && gradingCards.length > 0 && (
        <div className="text-center py-8 text-slate-500 text-sm">
          All your cards are in the grading queue!
        </div>
      )}
    </div>
  )
}
