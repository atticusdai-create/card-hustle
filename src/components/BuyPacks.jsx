import { useState } from 'react'
import CardDisplay from './CardDisplay'
import { PACK_TYPES, generatePackCards, RARITY_ORDER, RARITY_BASE } from '../lib/gameData'
import PackRevealFC from './PackRevealFC'

function fmt(n) {
  if (n < 1) return Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

const PACK_RARITY_LABELS = ['Base', 'Parallel', 'Net to Net', 'Downtown', 'Signature', 'Kaboom', 'Numbered', 'Patch Jersey', 'Sapphire']

function fmtPct(p) {
  if (p < 0.001) return '< 0.001%'
  if (p < 0.01) return p.toFixed(3) + '%'
  if (p < 1) return p.toFixed(2) + '%'
  if (p < 10) return p.toFixed(1) + '%'
  return p >= 99.99 ? p.toFixed(3) + '%' : Math.round(p) + '%'
}

function packOdds(pack) {
  if (pack.id === 'sapphire_box') {
    const guaranteed = pack.guaranteeCount
    const fill = pack.cardCount - guaranteed
    const total = pack.cardCount
    const fillTotal = pack.weights[6] + pack.weights[7] // Numbered + Patch Jersey
    return [
      { rarity: 'Sapphire',     pct: (guaranteed / total) * 100 },
      { rarity: 'Patch Jersey', pct: (fill / total) * (pack.weights[7] / fillTotal) * 100 },
      { rarity: 'Numbered',     pct: (fill / total) * (pack.weights[6] / fillTotal) * 100 },
    ]
  }
  if (pack.id === 'numbered_box') {
    const ooo = pack.oneOfOneChance * 100
    return [
      { rarity: 'One of One', pct: ooo },
      { rarity: 'Numbered', pct: 100 - ooo },
    ]
  }
  if (!pack.weights) return []
  const labels = PACK_RARITY_LABELS.slice(0, pack.weights.length)
  const total = pack.weights.reduce((a, b) => a + b, 0)
  return labels
    .map((rarity, i) => ({ rarity, pct: (pack.weights[i] / total) * 100 }))
    .filter(x => x.pct > 0)
    .sort((a, b) => (RARITY_ORDER[b.rarity] ?? 0) - (RARITY_ORDER[a.rarity] ?? 0))
}

const RARITY_TEXT = {
  'One of One':   'text-yellow-400',
  'Sapphire':     'text-blue-400',
  'Patch Jersey': 'text-red-400',
  'Numbered':     'text-cyan-400',
  'Kaboom':       'text-sky-400',
  'Signature':    'text-pink-400',
  'Downtown':     'text-purple-400',
  'Net to Net':   'text-emerald-400',
  'Parallel':     'text-indigo-400',
  'Base':         'text-slate-400',
}

function PackOdds({ pack, accentColor }) {
  const odds = packOdds(pack)
  return (
    <div style={{
      background: 'rgba(10,16,28,0.75)',
      borderRadius: 7,
      padding: '8px 10px',
      border: `1px solid ${accentColor ? accentColor + '22' : 'rgba(255,255,255,0.07)'}`,
    }}>
      <p style={{ color: accentColor ? accentColor + '70' : 'rgba(255,255,255,0.28)', fontSize: 8, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>
        PULL ODDS
      </p>
      {odds.map(({ rarity, pct }) => (
        <div key={rarity} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
          <span className={`text-[10px] font-semibold ${RARITY_TEXT[rarity] || 'text-slate-400'}`}>{rarity}</span>
          <span style={{ color: accentColor ? accentColor + 'bb' : 'rgba(255,255,255,0.55)', fontSize: 10, fontWeight: 700 }}>{fmtPct(pct)}</span>
        </div>
      ))}
    </div>
  )
}

// V-notch cut at top center — the actual pack shape
const PACK_CLIP = 'polygon(0% 0%, 43% 0%, 50% 4.5%, 57% 0%, 100% 0%, 100% 100%, 0% 100%)'

// ── Visual configs ────────────────────────────────────────────────────────────
const PACK_CFG = {
  base: {
    foil: 'linear-gradient(160deg, #ecf2f7 0%, #7a9ab0 7%, #dde8f0 17%, #4e7590 30%, #c8dce8 44%, #3d6278 58%, #8ab0c4 72%, #d2e5ef 85%, #6898b0 100%)',
    border: '#5a8aa0',
    glow: 'rgba(120,165,190,0.55)',
    accent: '#9bbfd4',
    darkPanel: 'rgba(3,10,20,0.93)',
    highlight: '#d2e5ef',
    seriesText: 'BASE SERIES  ·  S1',
    btn: 'linear-gradient(135deg, #3d6278, #243d50)',
    btnText: '#d2e5ef',
    stripe: 'linear-gradient(90deg, #243d50, #5a8aa0, #9bbfd4, #5a8aa0, #243d50)',
    pattern: 'repeating-linear-gradient(45deg, transparent 0px, transparent 6px, rgba(255,255,255,0.035) 6px, rgba(255,255,255,0.035) 7px)',
    dotColor: '#9bbfd4',
    icon: <img src="/icon.png" alt="" style={{ width: 40, height: 40 }} />,
  },
  premium: {
    foil: 'linear-gradient(160deg, #fffcf2 0%, #c8920e 7%, #fdf0c0 17%, #a07208 30%, #fae490 44%, #7a5400 58%, #c8960e 72%, #fef2c0 85%, #b07c10 100%)',
    border: '#b07c10',
    glow: 'rgba(200,145,15,0.6)',
    accent: '#e8b830',
    darkPanel: 'rgba(25,10,0,0.94)',
    highlight: '#fef2c0',
    seriesText: 'PREMIUM  ·  GOLD SERIES',
    btn: 'linear-gradient(135deg, #b07c10, #6a4500)',
    btnText: '#fef2c0',
    stripe: 'linear-gradient(90deg, #6a4500, #b07c10, #e8b830, #b07c10, #6a4500)',
    pattern: 'repeating-linear-gradient(45deg, transparent 0px, transparent 6px, rgba(255,215,60,0.06) 6px, rgba(255,215,60,0.06) 7px)',
    dotColor: '#e8b830',
    icon: '⭐',
  },
}

const BOX_CFG = {
  hobby: {
    lidTop:   'linear-gradient(90deg, #3d1200, #8c3010, #3d1200)',
    lidLine:  '#c04010',
    headerBg: 'linear-gradient(130deg, #7c2d12 0%, #c2410c 25%, #ea580c 48%, #dc2626 72%, #7c2d12 100%)',
    bodyBg:   'linear-gradient(180deg, #180d00 0%, #0e0800 100%)',
    accentColor: '#fb7c35',
    border:   '#c03a0e',
    glow:     'rgba(215,75,15,0.55)',
    labelText: '#fff0e8',
    badgeText: '#fecba8',
    badge:    'HOBBY EXCLUSIVE',
    btn:      'linear-gradient(135deg, #e04a08, #981c00)',
    stripe:   'linear-gradient(90deg, #7c2d12, #ea580c, #fb923c, #ea580c, #7c2d12)',
    pattern:  'repeating-linear-gradient(-48deg, transparent 0px, transparent 12px, rgba(215,75,15,0.07) 12px, rgba(215,75,15,0.07) 13px)',
  },
  numbered_box: {
    lidTop:   'linear-gradient(90deg, #011418, #0e7490, #011418)',
    lidLine:  '#0891b2',
    headerBg: 'linear-gradient(130deg, #083344 0%, #0e7490 28%, #22d3ee 50%, #0891b2 72%, #083344 100%)',
    bodyBg:   'linear-gradient(180deg, #020e10 0%, #010a0c 100%)',
    accentColor: '#22d3ee',
    border:   '#0891b2',
    glow:     'rgba(34,211,238,0.5)',
    labelText: '#e0f7ff',
    badgeText: '#67e8f9',
    badge:    'NUMBERED SERIES',
    btn:      'linear-gradient(135deg, #0e7490, #083344)',
    stripe:   'linear-gradient(90deg, #083344, #0e7490, #22d3ee, #0e7490, #083344)',
    pattern:  'repeating-linear-gradient(-48deg, transparent 0px, transparent 12px, rgba(34,211,238,0.06) 12px, rgba(34,211,238,0.06) 13px)',
  },
  premium_box: {
    lidTop:   'linear-gradient(90deg, #0a0806, #201808, #0a0806)',
    lidLine:  '#806010',
    headerBg: 'linear-gradient(130deg, #111008 0%, #2a2010 25%, #3d3018 48%, #2a2010 72%, #111008 100%)',
    bodyBg:   'linear-gradient(180deg, #0a0800 0%, #060500 100%)',
    accentColor: '#e8b830',
    border:   '#906810',
    glow:     'rgba(190,140,20,0.5)',
    labelText: '#fef5d8',
    badgeText: '#f0c840',
    badge:    'ULTRA PREMIUM',
    btn:      'linear-gradient(135deg, #b07c10, #6a3d00)',
    stripe:   'linear-gradient(90deg, #6a3d00, #a07010, #e8b830, #a07010, #6a3d00)',
    pattern:  'repeating-linear-gradient(-48deg, transparent 0px, transparent 12px, rgba(190,140,20,0.06) 12px, rgba(190,140,20,0.06) 13px)',
  },
}

// Thin vertical barcode bars
function Barcode({ color }) {
  const bars = [3,1,2,1,3,2,1,2,3,1,2,1,3,1,2,2,1,3,2,1]
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
      {bars.map((h, i) => (
        <div key={i} style={{
          width: h === 3 ? 2 : 1.5,
          height: h === 3 ? 14 : h === 2 ? 10 : 7,
          background: color, opacity: 0.38, borderRadius: 0.5, flexShrink: 0,
        }} />
      ))}
    </div>
  )
}

// ── Pack opening animation graphic ────────────────────────────────────────────
function PackGraphic({ packType, opening }) {
  const isBox = packType.cardCount > 5
  const cfg = packType.id === 'premium' ? PACK_CFG.premium
            : packType.id === 'hobby' ? { foil: BOX_CFG.hobby.headerBg, border: BOX_CFG.hobby.border, glow: BOX_CFG.hobby.glow, highlight: BOX_CFG.hobby.labelText }
            : packType.id === 'premium_box' ? { foil: BOX_CFG.premium_box.headerBg, border: BOX_CFG.premium_box.border, glow: BOX_CFG.premium_box.glow, highlight: BOX_CFG.premium_box.labelText }
            : packType.id === 'sapphire_box' ? { foil: 'linear-gradient(155deg,#051828,#0a3554,#0e4870)', border: '#5dc8f5', glow: 'rgba(45,175,240,0.5)', highlight: '#bae6fd' }
            : packType.id === 'numbered_box' ? { foil: 'linear-gradient(155deg,#011418,#083344,#0e7490)', border: '#22d3ee', glow: 'rgba(34,211,238,0.5)', highlight: '#e0f7ff' }
            : PACK_CFG.base

  return (
    <div
      className={opening ? 'pack-open-anim' : ''}
      style={{
        width: isBox ? 180 : 108, height: isBox ? 126 : 175,
        background: cfg.foil,
        border: `2px solid ${cfg.border}`,
        borderRadius: isBox ? 10 : 6,
        boxShadow: `0 0 28px ${cfg.glow}, 0 8px 24px rgba(0,0,0,0.65)`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 8,
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(112deg, transparent 28%, rgba(255,255,255,0.2) 46%, rgba(255,255,255,0.07) 52%, transparent 70%)',
      }} />
      <span style={{ fontSize: 40, position: 'relative', filter: `drop-shadow(0 0 10px ${cfg.border})` }}>
        {packType.icon}
      </span>
      <span style={{
        color: cfg.highlight || 'rgba(255,255,255,0.9)',
        fontSize: 10, fontWeight: 900,
        textAlign: 'center', padding: '0 10px',
        letterSpacing: 1.5, position: 'relative',
      }}>
        {packType.name.toUpperCase()}
      </span>
    </div>
  )
}

// ── Foil pack card — shape driven by clip-path ────────────────────────────────
function PackStoreCard({ pack, money, onBuy }) {
  const [hovered, setHovered] = useState(false)
  const canAfford = money >= pack.price
  const cfg = PACK_CFG[pack.id]
  const isGold = pack.id === 'premium'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
    >
      {/* ── Pack shape — clip-path gives it the real pack silhouette ── */}
      <div style={{
        transform: hovered ? 'translateY(-11px) scale(1.03)' : 'translateY(0) scale(1)',
        transition: 'transform 0.26s cubic-bezier(0.34,1.56,0.64,1), filter 0.26s ease',
        // drop-shadow follows clip-path contour, giving the border + hover glow
        filter: hovered
          ? `drop-shadow(0 0 2px ${cfg.border}) drop-shadow(0 0 2px ${cfg.border}) drop-shadow(0 18px 22px ${cfg.glow})`
          : `drop-shadow(0 0 1.5px ${cfg.border}) drop-shadow(0 6px 14px rgba(0,0,0,0.55))`,
      }}>
        <div style={{
          aspectRatio: '3 / 4.4',
          clipPath: PACK_CLIP,
          background: cfg.foil,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Animated foil sweep */}
          <div style={{
            position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 2,
          }}>
            <div style={{
              position: 'absolute', top: 0, bottom: 0, width: '45%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
              animation: 'foil-sweep 3.8s ease-in-out infinite',
              transform: 'skewX(-15deg)',
            }} />
          </div>

          {/* Diagonal weave texture */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
            backgroundImage: cfg.pattern,
          }} />

          {/* ── Sealed top strip (tear zone) ── */}
          <div style={{
            flexShrink: 0,
            background: cfg.darkPanel,
            padding: '5px 10px',
            borderBottom: `1px dashed ${cfg.accent}45`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            position: 'relative', zIndex: 3,
          }}>
            <span style={{ color: cfg.highlight, fontSize: 7, fontWeight: 900, letterSpacing: 2.5, opacity: 0.8 }}>
              CARD HUSTLE
            </span>
            {/* Perforation row */}
            <div style={{ display: 'flex', gap: 2 }}>
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} style={{
                  width: 2.5, height: 2.5, borderRadius: '50%',
                  background: cfg.dotColor, opacity: 0.42,
                }} />
              ))}
            </div>
          </div>

          {/* ── Main art area ── */}
          <div style={{
            flex: 1,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '14px 10px 10px',
            gap: 8, position: 'relative', zIndex: 3,
          }}>
            {/* Inner border frame */}
            <div style={{
              position: 'absolute', inset: 6, pointerEvents: 'none',
              border: `1px solid ${cfg.accent}28`, borderRadius: 3,
            }} />
            {/* Corner pips */}
            {[[0,0],[0,'auto'],['auto',0],['auto','auto']].map(([t,b,l,r], i) => {
              const pos = [
                { top: 10, left: 10 }, { top: 10, right: 10 },
                { bottom: 10, left: 10 }, { bottom: 10, right: 10 },
              ][i]
              return (
                <div key={i} style={{
                  position: 'absolute', ...pos, width: 6, height: 6,
                  border: `1.5px solid ${cfg.accent}35`,
                  pointerEvents: 'none',
                }} />
              )
            })}
            {/* Faint watermark */}
            <div style={{
              position: 'absolute', fontSize: 32, fontWeight: 900,
              color: 'rgba(255,255,255,0.025)', userSelect: 'none',
              pointerEvents: 'none', letterSpacing: -1, whiteSpace: 'nowrap',
            }}>
              CARD HUSTLE
            </div>

            {/* Centre icon */}
            <div style={{
              fontSize: 52, position: 'relative',
              filter: isGold
                ? 'drop-shadow(0 0 18px rgba(210,155,15,0.95)) drop-shadow(0 3px 6px rgba(0,0,0,0.65))'
                : 'drop-shadow(0 0 12px rgba(130,170,195,0.85)) drop-shadow(0 3px 6px rgba(0,0,0,0.55))',
            }}>
              {cfg.icon}
            </div>

            {/* Small brand line */}
            <div style={{ color: cfg.accent, fontSize: 7, fontWeight: 700, letterSpacing: 3.5, opacity: 0.7 }}>
              CARD HUSTLE
            </div>

            {/* Product name */}
            <div style={{
              color: cfg.highlight, fontSize: 13, fontWeight: 900,
              letterSpacing: 2, textAlign: 'center',
              textShadow: '0 1px 10px rgba(0,0,0,0.95)', lineHeight: 1.1,
            }}>
              {isGold ? 'PREMIUM\nPACK' : 'BASE\nPACK'}
            </div>

            {/* Card count badge */}
            <div style={{
              background: cfg.darkPanel, color: cfg.accent,
              fontSize: 8.5, fontWeight: 800,
              padding: '3px 13px', borderRadius: 20,
              border: `1px solid ${cfg.accent}40`,
              letterSpacing: 1.5,
            }}>
              {pack.cardCount} CARDS
            </div>
          </div>

          {/* ── Footer strip ── */}
          <div style={{
            flexShrink: 0,
            background: cfg.darkPanel, padding: '5px 10px',
            borderTop: `1px solid ${cfg.accent}20`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            position: 'relative', zIndex: 3,
          }}>
            <span style={{ color: cfg.accent, fontSize: 6.5, fontWeight: 700, letterSpacing: 1.5, opacity: 0.65 }}>
              {cfg.seriesText}
            </span>
            <Barcode color={cfg.accent} />
          </div>

          {/* Colour stripe at very bottom */}
          <div style={{ flexShrink: 0, height: 3, background: cfg.stripe, position: 'relative', zIndex: 3 }} />
        </div>
      </div>

      {/* ── Price + buy — outside/below the pack shape ── */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          color: cfg.accent, fontSize: 21, fontWeight: 900,
          textShadow: `0 0 16px ${cfg.glow}`,
        }}>
          {fmt(pack.price)}
        </div>
      </div>
      <button
        onClick={() => onBuy(pack)}
        disabled={!canAfford}
        style={{
          width: '100%', padding: '9px', borderRadius: 7,
          background: canAfford ? cfg.btn : '#111827',
          border: `1.5px solid ${canAfford ? cfg.border : '#1f2937'}`,
          color: canAfford ? cfg.btnText : '#374151',
          fontWeight: 800, fontSize: 11,
          cursor: canAfford ? 'pointer' : 'not-allowed',
          letterSpacing: 1.2,
        }}
      >
        {canAfford ? 'OPEN PACK' : 'NEED FUNDS'}
      </button>
      <PackOdds pack={pack} accentColor={cfg.accent} />
    </div>
  )
}

// ── Box store card ────────────────────────────────────────────────────────────
function BoxStoreCard({ pack, money, onBuy }) {
  const [hovered, setHovered] = useState(false)
  const canAfford = money >= pack.price
  const cfg = BOX_CFG[pack.id]

  return (
    <div
      className="col-span-2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 12, overflow: 'hidden',
        border: `2px solid ${cfg.border}`,
        transform: hovered ? 'translateY(-9px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 22px 48px ${cfg.glow}, 0 4px 16px rgba(0,0,0,0.7)`
          : '0 4px 18px rgba(0,0,0,0.55)',
        transition: 'transform 0.26s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.26s ease',
        cursor: 'pointer',
      }}
    >
      {/* 3D lid effect */}
      <div style={{ height: 7, background: cfg.lidTop, borderBottom: `1px solid ${cfg.lidLine}` }} />
      <div style={{ height: 3, background: cfg.headerBg, opacity: 0.55 }} />

      {/* Header art panel */}
      <div style={{
        background: cfg.headerBg,
        padding: '13px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: cfg.pattern,
        }} />
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(112deg, transparent 28%, rgba(255,255,255,0.08) 48%, rgba(255,255,255,0.03) 52%, transparent 68%)',
        }} />

        {/* Icon in badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
          <div style={{
            width: 50, height: 50, borderRadius: 8,
            background: 'rgba(0,0,0,0.4)',
            border: `1px solid ${cfg.accentColor}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, flexShrink: 0,
            filter: `drop-shadow(0 0 10px ${cfg.accentColor}cc)`,
          }}>
            {pack.icon}
          </div>
          <div>
            <div style={{ color: cfg.accentColor, fontSize: 7.5, fontWeight: 700, letterSpacing: 3, marginBottom: 3 }}>
              CARD HUSTLE
            </div>
            <div style={{
              color: cfg.labelText, fontSize: 18, fontWeight: 900,
              letterSpacing: 0.5, lineHeight: 1,
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
            }}>
              {pack.name.toUpperCase()}
            </div>
            <div style={{ color: cfg.badgeText, fontSize: 7.5, fontWeight: 700, letterSpacing: 3, marginTop: 4 }}>
              {cfg.badge}
            </div>
          </div>
        </div>

        {/* Guarantee badge */}
        {pack.guarantee && (
          <div style={{
            background: 'rgba(0,0,0,0.6)',
            border: `1.5px solid ${cfg.accentColor}55`,
            borderRadius: 8, padding: '7px 12px',
            textAlign: 'center', position: 'relative', flexShrink: 0,
          }}>
            <div style={{ color: cfg.accentColor, fontSize: 7, fontWeight: 700, letterSpacing: 1.5, marginBottom: 3 }}>
              GUARANTEED
            </div>
            <div style={{ color: cfg.labelText, fontSize: 12, fontWeight: 900, lineHeight: 1 }}>
              {pack.guarantee.toUpperCase()}+
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{
        background: cfg.bodyBg,
        padding: '13px 16px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
          {[[String(pack.cardCount / 5), 'PACKS'], [String(pack.cardCount), 'CARDS']].map(([val, label], i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
              {i > 0 && <div style={{ width: 1, background: `${cfg.accentColor}20`, alignSelf: 'stretch', margin: '0 16px' }} />}
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: cfg.labelText, fontSize: 28, fontWeight: 900, lineHeight: 1 }}>{val}</div>
                <div style={{ color: cfg.accentColor, fontSize: 8, fontWeight: 700, letterSpacing: 2, marginTop: 4 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
          <div style={{ color: cfg.accentColor, fontSize: 28, fontWeight: 900, textShadow: `0 0 22px ${cfg.glow}` }}>
            {fmt(pack.price)}
          </div>
          <button
            onClick={() => onBuy(pack)}
            disabled={!canAfford}
            style={{
              padding: '10px 22px', borderRadius: 7,
              background: canAfford ? cfg.btn : '#0d0a04',
              border: `1.5px solid ${canAfford ? cfg.border : '#1a1206'}`,
              color: canAfford ? '#fff' : '#3a2c10',
              fontWeight: 800, fontSize: 12,
              cursor: canAfford ? 'pointer' : 'not-allowed',
              letterSpacing: 1.2, whiteSpace: 'nowrap',
            }}
          >
            {canAfford ? 'OPEN BOX' : 'NEED FUNDS'}
          </button>
        </div>
      </div>

      <div style={{ padding: '10px 16px 12px', borderTop: `1px solid ${cfg.accentColor}18` }}>
        <p style={{ color: `${cfg.accentColor}60`, fontSize: 8, fontWeight: 700, letterSpacing: 2, marginBottom: 7 }}>PULL ODDS</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px 20px' }}>
          {packOdds(pack).map(({ rarity, pct }) => (
            <div key={rarity} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className={`text-[10px] font-semibold ${RARITY_TEXT[rarity] || 'text-slate-400'}`}>{rarity}</span>
              <span style={{ color: `${cfg.accentColor}bb`, fontSize: 10, fontWeight: 700 }}>{fmtPct(pct)}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 4, background: cfg.stripe }} />
    </div>
  )
}

// ── Sapphire Box ──────────────────────────────────────────────────────────────
function SapphireBoxCard({ pack, money, onBuy }) {
  const [hovered, setHovered] = useState(false)
  const canAfford = money >= pack.price

  return (
    <div
      className="col-span-2 relative overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 12,
        border: '2px solid #5dc8f5',
        background: 'linear-gradient(145deg, #051828 0%, #0a3554 25%, #0e4870 50%, #082c48 75%, #0a3554 100%)',
        boxShadow: hovered
          ? '0 24px 58px rgba(45,175,240,0.65), 0 0 80px rgba(14,165,233,0.3)'
          : '0 0 44px rgba(45,175,240,0.32), 0 0 90px rgba(14,165,233,0.14)',
        transform: hovered ? 'translateY(-9px)' : 'translateY(0)',
        transition: 'transform 0.26s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.26s ease',
        cursor: 'pointer',
      }}
    >
      {/* Lid */}
      <div style={{ height: 7, background: 'linear-gradient(90deg, #031220, #0369a1, #031220)', borderBottom: '1px solid #1a6fa8' }} />
      <div style={{ height: 3, background: 'linear-gradient(90deg, #031220, #0c4a6e, #031220)', opacity: 0.7 }} />

      {/* Gem facets */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: [
          'repeating-linear-gradient(58deg, transparent 0, transparent 32px, rgba(56,189,248,0.04) 32px, rgba(56,189,248,0.04) 33px)',
          'repeating-linear-gradient(-58deg, transparent 0, transparent 32px, rgba(56,189,248,0.04) 32px, rgba(56,189,248,0.04) 33px)',
        ].join(', '),
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(110deg, transparent 24%, rgba(186,230,253,0.07) 46%, rgba(186,230,253,0.04) 53%, transparent 76%)',
      }} />

      <div className="absolute top-4 right-4" style={{
        background: 'rgba(45,175,240,0.12)', border: '1px solid rgba(93,200,245,0.4)',
        borderRadius: 20, padding: '3px 11px',
      }}>
        <span style={{ color: '#7dd3fc', fontSize: 8, fontWeight: 900, letterSpacing: 3 }}>ULTRA EXCLUSIVE</span>
      </div>

      <div className="flex flex-col items-center pt-7 pb-2 gap-2 relative">
        <div style={{ fontSize: 54, filter: 'drop-shadow(0 0 22px #38bdf8) drop-shadow(0 0 44px #0ea5e9) drop-shadow(0 4px 8px rgba(0,0,0,0.9))' }}>
          💎
        </div>
        <div style={{ color: '#bae6fd', fontSize: 20, fontWeight: 900, letterSpacing: 6, textShadow: '0 0 20px rgba(56,189,248,0.4)' }}>
          SAPPHIRE BOX
        </div>
        <div style={{ color: 'rgba(93,200,245,0.55)', fontSize: 11, textAlign: 'center', padding: '0 36px' }}>
          The only source of Sapphire cards in the game
        </div>
      </div>

      <div className="flex justify-center py-4" style={{ gap: 0 }}>
        {[['5', 'PACKS'], ['25', 'CARDS'], ['10', 'SAPPHIRE']].map(([val, label], i) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
            {i > 0 && <div style={{ width: 1, height: 36, background: 'rgba(56,189,248,0.18)', margin: '0 24px' }} />}
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#e0f2fe', fontSize: 26, fontWeight: 900, lineHeight: 1 }}>{val}</div>
              <div style={{ color: 'rgba(93,200,245,0.65)', fontSize: 8, fontWeight: 700, letterSpacing: 2, marginTop: 4 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 pb-2 flex flex-col gap-3">
        <div className="text-center" style={{ color: '#e0f2fe', fontSize: 34, fontWeight: 900, textShadow: '0 0 32px rgba(56,189,248,0.75)' }}>
          {fmt(pack.price)}
        </div>
        <button
          onClick={() => onBuy(pack)}
          disabled={!canAfford}
          style={{
            width: '100%', padding: '13px', borderRadius: 8,
            background: canAfford ? 'linear-gradient(135deg, #0369a1, #0284c7, #0369a1)' : '#081520',
            border: `2px solid ${canAfford ? '#5dc8f5' : '#0e2438'}`,
            color: canAfford ? '#e0f2fe' : '#1d3a56',
            fontWeight: 900, fontSize: 13, letterSpacing: 2.5,
            cursor: canAfford ? 'pointer' : 'not-allowed',
            boxShadow: canAfford ? '0 0 30px rgba(56,189,248,0.4)' : 'none',
          }}
        >
          {canAfford ? '💎 OPEN THE VAULT' : 'NEED FUNDS'}
        </button>
      </div>

      <div style={{ padding: '10px 28px 4px', borderTop: '1px solid rgba(56,189,248,0.12)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
          <p style={{ color: 'rgba(93,200,245,0.45)', fontSize: 8, fontWeight: 700, letterSpacing: 2, margin: 0 }}>PULL ODDS</p>
          <span style={{ color: '#38bdf8', fontSize: 9, fontWeight: 800, letterSpacing: 1, background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 4, padding: '2px 7px' }}>
            10 GUARANTEED SAPPHIRE
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {packOdds(pack).map(({ rarity, pct }) => (
            <div key={rarity} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className={`text-[10px] font-semibold ${RARITY_TEXT[rarity] || 'text-slate-400'}`}>{rarity}</span>
              <span style={{ color: 'rgba(125,211,252,0.8)', fontSize: 10, fontWeight: 700 }}>{fmtPct(pct)}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 4, marginTop: 16, background: 'linear-gradient(90deg, #031220, #0369a1, #0ea5e9, #7dd3fc, #38bdf8, #7dd3fc, #0ea5e9, #0369a1, #031220)' }} />
    </div>
  )
}

// ── Store view ────────────────────────────────────────────────────────────────
function StoreView({ money, onBuy }) {
  const packs = PACK_TYPES.filter(p => p.id === 'base' || p.id === 'premium')
  const boxes = PACK_TYPES.filter(p => p.id !== 'base' && p.id !== 'premium')

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-slate-800 rounded-xl p-4">
        <h2 className="text-white font-black text-xl">Buy Packs</h2>
        <p className="text-slate-400 text-sm mt-0.5">Open packs to build your collection</p>
      </div>

      <div>
        <p className="text-slate-500 text-[10px] font-black tracking-widest mb-3 px-1">PACKS</p>
        <div className="grid grid-cols-2 gap-4">
          {packs.map(pack => (
            <PackStoreCard key={pack.id} pack={pack} money={money} onBuy={onBuy} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-slate-500 text-[10px] font-black tracking-widest mb-3 px-1">BOXES</p>
        <div className="grid grid-cols-2 gap-3">
          {boxes.map(pack => {
            if (pack.id === 'sapphire_box') return <SapphireBoxCard key={pack.id} pack={pack} money={money} onBuy={onBuy} />
            return <BoxStoreCard key={pack.id} pack={pack} money={money} onBuy={onBuy} />
          })}
        </div>
      </div>
    </div>
  )
}

// ── Small pack reveal ─────────────────────────────────────────────────────────
function PackReveal({ packType, cards, onAddToCollection }) {
  const [revealed, setRevealed] = useState(0)
  const allDone = revealed >= cards.length
  const totalValue = cards.reduce((s, c) => s + c.currentValue, 0)

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-slate-800 rounded-xl p-3 flex items-center gap-3">
        <span className="text-2xl">{packType.icon}</span>
        <div>
          <p className="text-white font-bold text-sm">{packType.name}</p>
          <p className="text-slate-400 text-xs">{revealed} / {cards.length} revealed</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {cards.map((card, i) => {
          if (i >= revealed) {
            return (
              <div
                key={card.id}
                className="rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform flex items-center justify-center"
                style={{ aspectRatio: '2/3', background: 'linear-gradient(135deg, #1e3a8a, #1e1b4b)', border: '2px solid #3b82f6' }}
                onClick={() => setRevealed(r => Math.min(r + 1, cards.length))}
              >
                <img src="/icon.png" alt="" style={{ width: 40, height: 40, opacity: 0.3 }} />
              </div>
            )
          }
          return <div key={card.id} className="card-flip-in"><CardDisplay card={card} compact /></div>
        })}
      </div>

      {!allDone ? (
        <button
          className="w-full py-3 rounded-xl font-bold text-white"
          style={{ background: packType.gradient, border: `1px solid ${packType.color}` }}
          onClick={() => setRevealed(r => Math.min(r + 1, cards.length))}
        >
          Reveal Card {revealed + 1} of {cards.length}
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="bg-slate-800 rounded-xl p-3 text-center">
            <p className="text-slate-400 text-xs">Pack Total Value</p>
            <p className="text-amber-400 font-black text-2xl">{fmt(totalValue)}</p>
          </div>
          <button onClick={onAddToCollection} className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors">
            Add {cards.length} Cards to Collection
          </button>
        </div>
      )}
    </div>
  )
}

// ── Box reveal ────────────────────────────────────────────────────────────────
function BoxReveal({ packType, cards, onAddToCollection }) {
  const notable = [...cards.filter(c => c.rarity !== 'Base')]
    .sort((a, b) => (RARITY_ORDER[b.rarity] ?? 0) - (RARITY_ORDER[a.rarity] ?? 0))
  const baseCount = cards.filter(c => c.rarity === 'Base').length
  const totalValue = cards.reduce((s, c) => s + c.currentValue, 0)
  const rarityCounts = ['Sapphire','Patch Jersey','Numbered','Kaboom','Signature','Downtown','Net to Net','Parallel','Base']
    .map(r => ({ rarity: r, count: cards.filter(c => (RARITY_BASE[c.rarity] || c.rarity) === r).length }))
    .filter(x => x.count > 0)

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-slate-800 rounded-xl p-3 flex items-center gap-3">
        <span className="text-2xl">{packType.icon}</span>
        <div className="flex-1">
          <p className="text-white font-bold text-sm">{packType.name} Opened!</p>
          <p className="text-slate-400 text-xs">{cards.length} cards total</p>
        </div>
        <div className="text-right">
          <p className="text-amber-400 font-bold">{fmt(totalValue)}</p>
          <p className="text-slate-500 text-xs">total value</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {rarityCounts.map(({ rarity, count }) => (
          <div key={rarity} className="bg-slate-800 rounded-xl p-2 text-center">
            <p className="text-white font-bold text-xl">{count}</p>
            <p className={`text-[10px] font-semibold leading-tight ${RARITY_TEXT[rarity] || 'text-slate-400'}`}>{rarity}</p>
          </div>
        ))}
      </div>

      {notable.length > 0 && (
        <>
          <p className="text-slate-300 text-sm font-semibold">Notable Pulls ({notable.length})</p>
          <div className="grid grid-cols-2 gap-3">
            {notable.map((card, i) => (
              <div key={card.id} className="card-flip-in" style={{ animationDelay: `${Math.min(i * 0.08, 1.5)}s` }}>
                <CardDisplay card={card} compact />
              </div>
            ))}
          </div>
        </>
      )}

      {baseCount > 0 && (
        <div className="bg-slate-800/60 rounded-xl p-3 text-center text-slate-400 text-sm">
          + {baseCount} Base cards
        </div>
      )}

      <button onClick={onAddToCollection} className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors">
        Add All {cards.length} Cards to Collection
      </button>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function BuyPacks({ money, onPurchase, onAddCards }) {
  const [phase, setPhase] = useState('store')
  const [opened, setOpened] = useState(null)

  function handleBuy(packType) {
    if (money < packType.price) return
    const cards = generatePackCards(packType)
    onPurchase(packType.price)
    setOpened({ packType, cards })
    setPhase('opening')
    setTimeout(() => setPhase('reveal'), 1800)
  }

  function handleAddToCollection() {
    if (opened) onAddCards(opened.cards)
    setOpened(null)
    setPhase('store')
  }

  if (phase === 'store') return <StoreView money={money} onBuy={handleBuy} />

  if (phase === 'opening' && opened) {
    const isSapphire = opened.packType.id === 'sapphire_box'
    const isNumbered = opened.packType.id === 'numbered_box'
    return (
      <div className="flex flex-col items-center justify-center gap-8 py-16">
        <p className={`text-sm tracking-widest font-medium ${isSapphire ? 'text-sky-400 animate-pulse' : isNumbered ? 'text-cyan-400 animate-pulse' : 'text-slate-400'}`}>
          {isSapphire ? '💎 OPENING THE VAULT...' : isNumbered ? '#️⃣ BREAKING THE SEAL...' : 'OPENING...'}
        </p>
        <PackGraphic packType={opened.packType} opening />
        <div className="flex gap-1.5">
          {[0,1,2].map(i => (
            <div key={i} className={`w-2 h-2 rounded-full animate-bounce ${isSapphire ? 'bg-sky-400' : isNumbered ? 'bg-cyan-400' : 'bg-amber-500'}`}
              style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    )
  }

  if (phase === 'reveal' && opened) {
    return <PackRevealFC cards={opened.cards} onAddToCollection={handleAddToCollection} />
  }

  return null
}
