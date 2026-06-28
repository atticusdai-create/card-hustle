import CardDisplay from './CardDisplay'
import { PSA_GRADE_LABELS, SPORT_EMOJIS } from '../lib/gameData'

export default function PSASlabCard({ card, children }) {
  const gradeLabel = PSA_GRADE_LABELS[card.psaGrade] || ''

  return (
    <div
      className="rounded-xl overflow-hidden select-none"
      style={{
        background: 'linear-gradient(180deg, #d8d8d8 0%, #efefef 100%)',
        border: '5px solid #b8b8b8',
        boxShadow: '0 6px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.9)',
      }}
    >
      {/* PSA Red Label */}
      <div
        className="mx-1 mt-1 rounded-t-md overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #cc0001 0%, #990000 100%)' }}
      >
        <div className="flex items-center px-2 py-1.5 gap-2">
          {/* Left: PSA + player info */}
          <div className="flex-1 min-w-0">
            <div
              className="text-white font-black tracking-widest leading-none"
              style={{ fontSize: 13, letterSpacing: '0.2em' }}
            >
              PSA
            </div>
            <div className="text-white/90 font-bold truncate leading-tight mt-0.5" style={{ fontSize: 9 }}>
              {SPORT_EMOJIS[card.sport]} {card.playerName}
            </div>
            <div className="text-white/60 leading-tight" style={{ fontSize: 8 }}>
              {card.sport} &middot; {card.year} &middot; {card.rarity === 'Numbered' && card.printRun ? `#${card.serialNumber}/${card.printRun}` : card.rarity}
            </div>
          </div>
          {/* Right: grade number */}
          <div className="text-right shrink-0">
            <div
              className="text-white font-black leading-none"
              style={{ fontSize: 34, textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}
            >
              {card.psaGrade}
            </div>
            <div className="text-white/80 font-bold" style={{ fontSize: 7.5 }}>
              {gradeLabel}
            </div>
          </div>
        </div>
      </div>

      {/* Card inside slab (no outer border — inSlab mode) */}
      <div className="mx-1 mb-0">
        <CardDisplay card={card} compact inSlab />
      </div>

      {/* Slab bottom bar */}
      <div className="mx-1 mb-1 rounded-b-sm h-1" style={{ background: '#cc0001' }} />

      {/* Action buttons */}
      {children && (
        <div className="px-2 pb-2">
          {children}
        </div>
      )}
    </div>
  )
}
