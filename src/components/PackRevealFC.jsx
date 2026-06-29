import { useState, useEffect } from 'react'
import CardDisplay from './CardDisplay'

// Rarities that trigger the epic reveal sequence
const EPIC_BASES = ['Kaboom', 'Signature', 'Patch Jersey', 'Numbered', 'Sapphire', 'Ruby', 'Emerald', 'One of One']

const RARITY_COLORS = {
  'Kaboom':            '#ff4400',
  'Kaboom Blue':       '#0088ff',
  'Kaboom Purple':     '#9933ff',
  'Signature':         '#ffd700',
  'Signature Black':   '#e0e0e0',
  'Signature Blue':    '#66aaff',
  'Numbered':          '#ffd700',
  'Numbered Red':      '#ff3333',
  'Numbered Blue':     '#3399ff',
  'Patch Jersey':      '#cc2200',
  'Patch Jersey Blue': '#0044cc',
  'Patch Jersey Gold': '#ffd700',
  'Sapphire':          '#00aaff',
  'Ruby':              '#ff2244',
  'Emerald':           '#00cc44',
  'One of One':        '#ffd700',
}

const RARITY_LABELS = {
  'Kaboom':            '🔥 KABOOM',
  'Kaboom Blue':       '🔥 KABOOM BLUE',
  'Kaboom Purple':     '🔥 KABOOM PURPLE',
  'Signature':         '✍️ SIGNATURE',
  'Signature Black':   '✍️ SIGNATURE BLACK',
  'Signature Blue':    '✍️ SIGNATURE BLUE',
  'Numbered':          '# NUMBERED',
  'Numbered Red':      '# NUMBERED RED',
  'Numbered Blue':     '# NUMBERED BLUE',
  'Patch Jersey':      '🔲 PATCH JERSEY',
  'Patch Jersey Blue': '🔲 PATCH JERSEY BLUE',
  'Patch Jersey Gold': '🔲 PATCH JERSEY GOLD',
  'Sapphire':          '💎 SAPPHIRE',
  'Ruby':              '🔴 RUBY',
  'Emerald':           '💚 EMERALD',
  'One of One':        '👑 ONE OF ONE',
}

function isEpic(card) {
  if (!card?.rarity) return false
  return EPIC_BASES.some(b => card.rarity.startsWith(b))
}

function glowColor(rarity) {
  if (!rarity) return '#ffffff'
  if (RARITY_COLORS[rarity]) return RARITY_COLORS[rarity]
  const entry = Object.entries(RARITY_COLORS).find(([k]) => rarity.startsWith(k.split(' ')[0]))
  return entry ? entry[1] : '#ffffff'
}

// ── Particle burst (deterministic, no Math.random) ──────────────────────────

function Particles({ rarity, active }) {
  const color = glowColor(rarity)
  return (
    <div className="pfc-particles" aria-hidden="true">
      {Array.from({ length: 32 }, (_, i) => {
        const angle = (360 / 32) * i + (i % 5) * 7
        const dist  = 120 + ((i * 53) % 180)
        const rad   = angle * Math.PI / 180
        const size  = 4 + ((i * 11) % 9)
        const dur   = (0.5 + ((i * 7) % 50) / 100).toFixed(2)
        const delay = ((i * 3) % 16) / 100
        const shape = i % 3 === 0 ? '50%' : i % 3 === 1 ? '2px' : '30%'
        return (
          <div
            key={i}
            className={`pfc-particle${active ? ' pfc-particle--active' : ''}`}
            style={{
              '--dx':    `${(Math.cos(rad) * dist).toFixed(1)}px`,
              '--dy':    `${(Math.sin(rad) * dist).toFixed(1)}px`,
              '--color': color,
              '--dur':   `${dur}s`,
              '--delay': `${delay}s`,
              width:       size,
              height:      size,
              borderRadius: shape,
            }}
          />
        )
      })}
    </div>
  )
}

// ── Card back ────────────────────────────────────────────────────────────────

function CardBack({ epicSuspense, glowCol }) {
  return (
    <div className="pfc-back-shell">
      <div className="pfc-back-grid" />
      <div className="pfc-back-logo">
        <span className="pfc-back-logo-top">CARD</span>
        <span className="pfc-back-logo-main">HUSTLE</span>
      </div>
      <div className="pfc-back-sweep" />
      {epicSuspense && (
        <div className="pfc-back-epic-glow" style={{ '--g': glowCol }} />
      )}
    </div>
  )
}

// ── Rarity badge that pops in after epic reveal ───────────────────────────────

function RarityBadge({ rarity }) {
  const label = RARITY_LABELS[rarity] || rarity
  const color = glowColor(rarity)
  return (
    <div className="pfc-rarity-badge" style={{ '--c': color }}>
      {label}
    </div>
  )
}

// ── Single-card reveal state machine ─────────────────────────────────────────
// Phases: entering → suspense → flipping → revealed

function CardReveal({ card, epic, onDone }) {
  const [phase, setPhase]       = useState('entering')
  const [flashing, setFlashing] = useState(false)
  const [particles, setParticles] = useState(false)
  const color = glowColor(card?.rarity)

  useEffect(() => {
    const timers = []
    if (phase === 'entering') {
      timers.push(setTimeout(() => setPhase('suspense'), 750))
    }
    if (phase === 'suspense') {
      timers.push(setTimeout(() => setPhase('flipping'), epic ? 2300 : 1400))
    }
    if (phase === 'flipping') {
      if (epic) {
        setFlashing(true)
        setParticles(true)
        timers.push(setTimeout(() => setFlashing(false), 900))
        timers.push(setTimeout(() => setParticles(false), 1100))
      }
      timers.push(setTimeout(() => setPhase('revealed'), epic ? 1500 : 750))
    }
    return () => timers.forEach(clearTimeout)
  }, [phase, epic])

  function handleTap() {
    if (phase === 'revealed') return onDone()
    // tap during suspense skips the wait and triggers the flip immediately
    if (phase === 'suspense') setPhase('flipping')
  }

  // Once we start flipping we stay flipped — prevents transform snap when
  // removing the animation class in the revealed phase.
  const flipped = phase === 'flipping' || phase === 'revealed'

  const flipClass = [
    'pfc-flip',
    flipped          && 'pfc-flip--flipped',
    phase === 'flipping' && (epic ? 'pfc-flip--epic' : 'pfc-flip--normal'),
    phase === 'revealed' && epic && 'pfc-flip--glow',
  ].filter(Boolean).join(' ')

  const shakeClass = [
    'pfc-shake-wrap',
    phase === 'suspense' && (epic ? 'pfc-shake--epic' : 'pfc-shake'),
  ].filter(Boolean).join(' ')

  return (
    <>
      {flashing && <div className="pfc-flash" style={{ '--fc': color }} />}

      <div
        className={`pfc-anchor pfc-anchor--${phase}`}
        onClick={handleTap}
        role="button"
        tabIndex={0}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleTap()}
      >
        <div className={shakeClass} style={{ '--g': color }}>
          <div className={flipClass} style={{ '--g': color }}>
            <div className="pfc-face pfc-face--back">
              <CardBack epicSuspense={epic && phase === 'suspense'} glowCol={color} />
            </div>
            <div className="pfc-face pfc-face--front">
              {card && <CardDisplay card={card} />}
            </div>
          </div>
        </div>
      </div>

      {epic && <Particles rarity={card?.rarity} active={particles} />}

      {phase === 'revealed' && epic && <RarityBadge rarity={card?.rarity} />}

      {phase === 'revealed' && (
        <p className="pfc-hint">tap to continue</p>
      )}
    </>
  )
}

// ── Complete view ────────────────────────────────────────────────────────────

function CompleteView({ cards, onAddToCollection }) {
  const total = cards.reduce((s, c) => s + (c.currentValue || 0), 0)
  const fmt = n => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
  return (
    <div className="pfc-complete" onClick={e => e.stopPropagation()}>
      <h2 className="pfc-complete-title">Pack Opened!</h2>
      <p className="pfc-complete-value">{fmt(total)}</p>
      <div className="pfc-complete-grid">
        {cards.map((card, i) => (
          <div
            key={card.id || i}
            className="pfc-complete-card card-flip-in"
            style={{ animationDelay: `${Math.min(i * 0.04, 1.2)}s` }}
          >
            <CardDisplay card={card} compact />
          </div>
        ))}
      </div>
      <button className="pfc-add-btn" onClick={() => onAddToCollection()}>
        Add {cards.length} Cards to Collection
      </button>
    </div>
  )
}

// Rarity rank — higher = better
const RARITY_RANK = {
  'One of One':        10,
  'Sapphire':          9,
  'Ruby':              9,
  'Emerald':           9,
  'Patch Jersey Gold': 8,
  'Patch Jersey Blue': 8,
  'Patch Jersey':      8,
  'Kaboom Purple':     7,
  'Kaboom Blue':       7,
  'Kaboom':            7,
  'Signature Black':   6,
  'Signature Blue':    6,
  'Signature':         6,
  'Numbered Red':      5,
  'Numbered Blue':     5,
  'Numbered':          5,
  'Downtown':          4,
  'Net to Net':        3,
  'Parallel':          2,
  'Base':              1,
}

function rarityRank(card) {
  if (!card?.rarity) return 0
  if (RARITY_RANK[card.rarity] !== undefined) return RARITY_RANK[card.rarity]
  const match = Object.entries(RARITY_RANK).find(([k]) => card.rarity.startsWith(k))
  return match ? match[1] : 0
}

function bestCard(arr) {
  return arr.reduce((best, c) => (c.currentValue || 0) >= (best.currentValue || 0) ? c : best, arr[0])
}

// ── Main export ──────────────────────────────────────────────────────────────

export default function PackRevealFC({ cards = [], onAddToCollection }) {
  const [idx, setIdx]         = useState(0)
  const [done, setDone]       = useState([])
  const [complete, setComplete] = useState(false)
  const [skipCard, setSkipCard] = useState(null) // best card shown after skip

  if (!cards.length) return null

  function next() {
    const nowDone = [...done, cards[idx]]
    setDone(nowDone)
    const nextIdx = idx + 1
    if (nextIdx >= cards.length) {
      setComplete(true)
    } else {
      setIdx(nextIdx)
    }
  }

  function handleSkip() {
    const remaining = cards.slice(idx)
    const best = bestCard(remaining)
    setSkipCard(best)
  }

  if (complete) {
    return (
      <div className="pfc-overlay pfc-overlay--complete">
        <CompleteView cards={cards} onAddToCollection={onAddToCollection} />
      </div>
    )
  }

  // Skip mode: show the single best card face-down, full epic reveal, then complete
  if (skipCard !== null) {
    return (
      <div className="pfc-overlay">
        <div className="pfc-progress">
          <span className="text-slate-400 text-xs tracking-widest">BEST CARD</span>
        </div>
        <div className="pfc-stage">
          <CardReveal
            key="skip-best"
            card={skipCard}
            epic={true}
            onDone={() => setComplete(true)}
          />
        </div>
      </div>
    )
  }

  // Normal sequential mode
  const card = cards[idx]
  const epic = isEpic(card)

  return (
    <div className="pfc-overlay">
      <div className="pfc-progress">
        <span>{idx + 1} / {cards.length}</span>
        <button className="pfc-skip" onClick={handleSkip}>
          Skip
        </button>
      </div>

      <div className="pfc-stage">
        <CardReveal key={idx} card={card} epic={epic} onDone={next} />
      </div>

      {done.length > 0 && (
        <div className="pfc-strip">
          {done.map((c, i) => (
            <div key={c.id || i} className="pfc-mini">
              <CardDisplay card={c} compact />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
