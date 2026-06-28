import { useState, useEffect } from 'react'
import { PLAYER_IMAGES, PLAYER_LOOKUP } from '../lib/gameData'

function fmt(n) {
  if (n < 1) return Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

// ── Module-level image cache (survives re-renders, cleared on page reload) ──
// IMG_CACHE maps playerName → Promise<url|null>, stored immediately so concurrent
// mounts for the same player share one fetch instead of firing duplicates.
// IMG_RESOLVED maps playerName → url|null once the promise settles, so a card
// that re-mounts can initialize with the URL synchronously (no loading flash).
const IMG_CACHE    = new Map()
const IMG_RESOLVED = new Map()

function fetchPlayerImage(playerName) {
  if (IMG_CACHE.has(playerName)) return IMG_CACHE.get(playerName)
  const promise = (async () => {
    try {
      const res = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(playerName)}`,
        { signal: AbortSignal.timeout(5000) }
      )
      const data = await res.json()
      // Only use cutout (full body, transparent bg) — not strThumb which is a headshot
      const url = data?.player?.[0]?.strCutout || null
      IMG_RESOLVED.set(playerName, url)
      return url
    } catch {
      IMG_RESOLVED.set(playerName, null)
      return null
    }
  })()
  IMG_CACHE.set(playerName, promise)
  return promise
}

// ── Design tokens per card type ───────────────────────────────────────────
const DESIGNS = {
  Base: {
    card: {
      background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
      border: '2px solid #94a3b8',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    },
    photoBg: 'linear-gradient(170deg, #dde6f0 0%, #bdd0e0 100%)',
    footer: { background: '#f8fafc', borderTop: '1px solid #e2e8f0' },
    name: '#0f172a', detail: '#64748b', value: '#b45309',
    badge: { background: '#64748b', color: '#fff' },
    badgeText: 'BASE',
    initials: 'rgba(30,41,59,0.28)',
  },
  Parallel: {
    card: {
      background: 'linear-gradient(145deg, #7a8898 0%, #bcc8d4 18%, #8e9dac 36%, #ccd5de 54%, #7a8898 72%, #b4c2ce 90%)',
      border: '2px solid #b0bfce',
      boxShadow: '0 0 22px rgba(160,180,200,0.55), 0 4px 14px rgba(0,0,0,0.35)',
    },
    photoBg: 'linear-gradient(145deg, #5f7080 0%, #8a9db0 50%, #6a8094 100%)',
    footer: { background: 'rgba(0,0,0,0.18)', borderTop: '1px solid rgba(255,255,255,0.1)' },
    name: '#fff', detail: 'rgba(255,255,255,0.68)', value: '#f1f5f9',
    badge: { background: 'rgba(255,255,255,0.3)', color: '#0f172a' },
    badgeText: '✦ PARALLEL',
    initials: 'rgba(255,255,255,0.32)',
    shimmer: 'chrome',
  },
  'Net to Net': {
    card: {
      background: 'linear-gradient(155deg, #0c3d1e 0%, #185c2e 40%, #0a3c1c 70%, #061c0d 100%)',
      border: '2px solid #c9a227',
      boxShadow: '0 0 24px rgba(201,162,39,0.38), 0 4px 14px rgba(0,0,0,0.55)',
    },
    photoBg: 'linear-gradient(155deg, #175430 0%, #0b3818 100%)',
    footer: { background: 'rgba(0,0,0,0.42)', borderTop: '1px solid rgba(201,162,39,0.22)' },
    name: '#ffd700', detail: 'rgba(255,215,0,0.62)', value: '#ffd700',
    badge: { background: '#c9a227', color: '#0a2010' },
    badgeText: '🏀 NET',
    initials: 'rgba(255,215,0,0.28)',
    netTexture: true,
  },
  Downtown: {
    card: {
      background: '#050810',
      border: '2px solid #c9a227',
      boxShadow: '0 0 32px rgba(201,162,39,0.65), 0 0 64px rgba(201,162,39,0.22), 0 4px 18px rgba(0,0,0,0.88)',
    },
    photoBg: '#090c1a',
    footer: { background: 'rgba(0,0,0,0.72)', borderTop: '1px solid rgba(201,162,39,0.22)' },
    name: '#ffd700', detail: 'rgba(255,215,0,0.52)', value: '#ffd700',
    badge: { background: '#c9a227', color: '#000' },
    badgeText: '🌆 DOWNTOWN',
    initials: 'rgba(255,215,0,0.22)',
    shimmer: 'gold', cityLights: true,
  },
  Kaboom: {
    card: {
      background: 'radial-gradient(ellipse at 28% 22%, #ff8c00 0%, #e63946 44%, #9b1d1d 72%, #280808 100%)',
      border: '2px solid #ff8c00',
      boxShadow: '0 0 30px rgba(230,57,70,0.72), 0 0 58px rgba(255,140,0,0.3), 0 4px 18px rgba(0,0,0,0.68)',
    },
    photoBg: 'radial-gradient(ellipse at 50% 40%, rgba(255,100,0,0.15), #0a0000)',
    footer: { background: 'rgba(0,0,0,0.42)', borderTop: '1px solid rgba(255,140,0,0.28)' },
    name: '#fff', detail: 'rgba(255,210,110,0.88)', value: '#ffe44d',
    badge: { background: '#ff8c00', color: '#000' },
    badgeText: '⚡ KABOOM',
    initials: 'rgba(255,255,255,0.28)',
    lightning: true,
  },
  Signature: {
    card: {
      background: 'linear-gradient(180deg, #fffef4 0%, #fff9e2 50%, #fef5d2 100%)',
      border: '1.5px solid #c9a227',
      boxShadow: '0 0 22px rgba(201,162,39,0.42), 0 4px 14px rgba(0,0,0,0.25)',
    },
    photoBg: 'linear-gradient(175deg, #f5edcc 0%, #e8d898 55%, #f0e4b4 100%)',
    footer: { background: 'rgba(201,162,39,0.07)', borderTop: '1px solid rgba(201,162,39,0.22)' },
    name: '#1a1206', detail: '#7a6535', value: '#8b6914',
    badge: { background: '#c9a227', color: '#1a1206' },
    badgeText: '✍️ AUTO',
    initials: 'rgba(100,70,10,0.3)',
    shimmer: 'gold-subtle', sigLine: true,
  },
  Numbered: {
    card: {
      background: 'linear-gradient(135deg, #000 0%, #0a0a0a 50%, #000 100%)',
      border: '2px solid #c9a227',
      boxShadow: '0 0 28px rgba(201,162,39,0.52), 0 4px 18px rgba(0,0,0,0.92)',
    },
    photoBg: '#060606',
    footer: { background: 'rgba(201,162,39,0.05)', borderTop: '1px solid rgba(201,162,39,0.15)' },
    name: '#c9a227', detail: 'rgba(201,162,39,0.52)', value: '#c9a227',
    badge: { background: '#c9a227', color: '#000' },
    badgeText: '# LIMITED',
    initials: 'rgba(201,162,39,0.2)',
    numbered: true,
  },
  'Patch Jersey': {
    card: {
      background: 'linear-gradient(150deg, #190506 0%, #2c0f0f 38%, #190808 65%, #0d0303 100%)',
      border: '2px solid #dc2626',
      boxShadow: '0 0 24px rgba(220,38,38,0.48), 0 4px 15px rgba(0,0,0,0.72)',
    },
    photoBg: 'linear-gradient(150deg, #2c0f0f 0%, #190808 100%)',
    footer: { background: 'rgba(0,0,0,0.58)', borderTop: '1px solid rgba(220,38,38,0.28)' },
    name: '#fff', detail: 'rgba(252,165,165,0.72)', value: '#fca5a5',
    badge: { background: '#dc2626', color: '#fff' },
    badgeText: '🧵 PATCH',
    initials: 'rgba(255,255,255,0.25)',
    patch: true,
  },
  Sapphire: {
    card: {
      background: 'linear-gradient(140deg, #03011c 0%, #12054a 26%, #0b1870 52%, #05022e 78%, #010112 100%)',
      border: '2px solid #4a90d9',
      boxShadow: '0 0 42px rgba(74,144,217,0.72), 0 0 84px rgba(74,144,217,0.32), 0 4px 22px rgba(0,0,0,0.92)',
    },
    photoBg: 'radial-gradient(circle at 44% 38%, #180e72 0%, #05033a 100%)',
    footer: { background: 'rgba(0,5,50,0.72)', borderTop: '1px solid rgba(74,144,217,0.22)' },
    name: '#93c5fd', detail: 'rgba(147,197,253,0.64)', value: '#60a5fa',
    badge: { background: '#1d4ed8', color: '#fff' },
    badgeText: '💎 SAPPHIRE',
    initials: 'rgba(147,197,253,0.24)',
    shimmer: 'sapphire', sparkle: true,
  },

  // ── Color variants ────────────────────────────────────────────────────────

  'Parallel Gold': {
    card: {
      background: 'linear-gradient(145deg, #8b6914 0%, #d4a832 22%, #a07830 40%, #e8c848 60%, #8b6914 78%, #c9a227 95%)',
      border: '2px solid #d4a832',
      boxShadow: '0 0 22px rgba(212,168,50,0.65), 0 4px 14px rgba(0,0,0,0.4)',
    },
    photoBg: 'linear-gradient(145deg, #6b5012 0%, #a07830 50%, #7a5e20 100%)',
    footer: { background: 'rgba(0,0,0,0.22)', borderTop: '1px solid rgba(212,168,50,0.18)' },
    name: '#ffd700', detail: 'rgba(255,215,0,0.68)', value: '#ffd700',
    badge: { background: 'rgba(212,168,50,0.45)', color: '#1a0f00' },
    badgeText: '✦ PARALLEL GOLD',
    initials: 'rgba(255,215,0,0.32)',
    shimmer: 'gold',
  },
  'Parallel Rose Gold': {
    card: {
      background: 'linear-gradient(145deg, #7a3a40 0%, #c07080 22%, #9a5060 40%, #d8909a 60%, #7a3a40 78%, #b06070 95%)',
      border: '2px solid #c07080',
      boxShadow: '0 0 22px rgba(192,112,128,0.55), 0 4px 14px rgba(0,0,0,0.38)',
    },
    photoBg: 'linear-gradient(145deg, #602830 0%, #9a5060 50%, #782038 100%)',
    footer: { background: 'rgba(0,0,0,0.22)', borderTop: '1px solid rgba(192,112,128,0.18)' },
    name: '#ffd0d8', detail: 'rgba(255,208,216,0.68)', value: '#ffd0d8',
    badge: { background: 'rgba(192,112,128,0.4)', color: '#1a0008' },
    badgeText: '✦ PARALLEL ROSE GOLD',
    initials: 'rgba(255,208,216,0.32)',
    shimmer: 'rose',
  },
  'Net to Net Red': {
    card: {
      background: 'linear-gradient(155deg, #3d0c0c 0%, #5c1818 40%, #3d0a0a 70%, #1c0606 100%)',
      border: '2px solid #dc2626',
      boxShadow: '0 0 24px rgba(220,38,38,0.45), 0 4px 14px rgba(0,0,0,0.55)',
    },
    photoBg: 'linear-gradient(155deg, #541818 0%, #3d0a0a 100%)',
    footer: { background: 'rgba(0,0,0,0.42)', borderTop: '1px solid rgba(220,38,38,0.22)' },
    name: '#fca5a5', detail: 'rgba(252,165,165,0.62)', value: '#fca5a5',
    badge: { background: '#dc2626', color: '#fff' },
    badgeText: '🏀 NET RED',
    initials: 'rgba(252,165,165,0.28)',
    netTexture: true,
  },
  'Net to Net Blue': {
    card: {
      background: 'linear-gradient(155deg, #0c1a3d 0%, #18305c 40%, #0a1a3d 70%, #060c1c 100%)',
      border: '2px solid #2563eb',
      boxShadow: '0 0 24px rgba(37,99,235,0.45), 0 4px 14px rgba(0,0,0,0.55)',
    },
    photoBg: 'linear-gradient(155deg, #18305c 0%, #0a1a3d 100%)',
    footer: { background: 'rgba(0,0,0,0.42)', borderTop: '1px solid rgba(37,99,235,0.22)' },
    name: '#93c5fd', detail: 'rgba(147,197,253,0.62)', value: '#93c5fd',
    badge: { background: '#2563eb', color: '#fff' },
    badgeText: '🏀 NET BLUE',
    initials: 'rgba(147,197,253,0.28)',
    netTexture: true,
  },
  'Downtown Purple': {
    card: {
      background: '#08050e',
      border: '2px solid #9333ea',
      boxShadow: '0 0 32px rgba(147,51,234,0.65), 0 0 64px rgba(147,51,234,0.22), 0 4px 18px rgba(0,0,0,0.88)',
    },
    photoBg: '#0d0718',
    footer: { background: 'rgba(0,0,0,0.72)', borderTop: '1px solid rgba(147,51,234,0.22)' },
    name: '#d946ef', detail: 'rgba(217,70,239,0.52)', value: '#d946ef',
    badge: { background: '#9333ea', color: '#fff' },
    badgeText: '🌆 DOWNTOWN PURPLE',
    initials: 'rgba(217,70,239,0.22)',
    shimmer: 'gold', cityLights: true,
  },
  'Downtown Red': {
    card: {
      background: '#0e0505',
      border: '2px solid #ef4444',
      boxShadow: '0 0 32px rgba(239,68,68,0.65), 0 0 64px rgba(239,68,68,0.22), 0 4px 18px rgba(0,0,0,0.88)',
    },
    photoBg: '#110404',
    footer: { background: 'rgba(0,0,0,0.72)', borderTop: '1px solid rgba(239,68,68,0.22)' },
    name: '#fca5a5', detail: 'rgba(252,165,165,0.52)', value: '#fca5a5',
    badge: { background: '#ef4444', color: '#fff' },
    badgeText: '🌆 DOWNTOWN RED',
    initials: 'rgba(252,165,165,0.22)',
    shimmer: 'chrome', cityLights: true,
  },
  'Kaboom Blue': {
    card: {
      background: 'radial-gradient(ellipse at 28% 22%, #0066cc 0%, #0033a0 44%, #001a6e 72%, #000830 100%)',
      border: '2px solid #3b82f6',
      boxShadow: '0 0 30px rgba(59,130,246,0.72), 0 0 58px rgba(0,102,204,0.3), 0 4px 18px rgba(0,0,0,0.68)',
    },
    photoBg: 'radial-gradient(ellipse at 50% 40%, rgba(0,100,200,0.15), #00050a)',
    footer: { background: 'rgba(0,0,0,0.42)', borderTop: '1px solid rgba(59,130,246,0.28)' },
    name: '#fff', detail: 'rgba(147,197,253,0.88)', value: '#93c5fd',
    badge: { background: '#3b82f6', color: '#fff' },
    badgeText: '⚡ KABOOM BLUE',
    initials: 'rgba(255,255,255,0.28)',
    lightning: true,
  },
  'Kaboom Purple': {
    card: {
      background: 'radial-gradient(ellipse at 28% 22%, #7c3aed 0%, #4c1d95 44%, #2e1065 72%, #0c0520 100%)',
      border: '2px solid #8b5cf6',
      boxShadow: '0 0 30px rgba(139,92,246,0.72), 0 0 58px rgba(124,58,237,0.3), 0 4px 18px rgba(0,0,0,0.68)',
    },
    photoBg: 'radial-gradient(ellipse at 50% 40%, rgba(100,40,200,0.15), #030008)',
    footer: { background: 'rgba(0,0,0,0.42)', borderTop: '1px solid rgba(139,92,246,0.28)' },
    name: '#fff', detail: 'rgba(216,180,254,0.88)', value: '#c4b5fd',
    badge: { background: '#8b5cf6', color: '#fff' },
    badgeText: '⚡ KABOOM PURPLE',
    initials: 'rgba(255,255,255,0.28)',
    lightning: true,
  },
  'Signature Black': {
    card: {
      background: 'linear-gradient(180deg, #0a0a0a 0%, #111 50%, #080808 100%)',
      border: '1.5px solid #6b7280',
      boxShadow: '0 0 22px rgba(107,114,128,0.42), 0 4px 14px rgba(0,0,0,0.5)',
    },
    photoBg: 'linear-gradient(175deg, #1a1a1a 0%, #0d0d0d 100%)',
    footer: { background: 'rgba(200,200,200,0.04)', borderTop: '1px solid rgba(107,114,128,0.22)' },
    name: '#e2e8f0', detail: '#94a3b8', value: '#cbd5e1',
    badge: { background: '#374151', color: '#e2e8f0' },
    badgeText: '✍️ AUTO BLACK',
    initials: 'rgba(226,232,240,0.2)',
    shimmer: 'chrome', sigLine: true,
    sigLineColor: 'rgba(200,200,200,0.45)', sigLabelColor: 'rgba(200,200,200,0.38)',
  },
  'Signature Blue': {
    card: {
      background: 'linear-gradient(180deg, #f0f5ff 0%, #e8f0fe 50%, #d8e8ff 100%)',
      border: '1.5px solid #2563eb',
      boxShadow: '0 0 22px rgba(37,99,235,0.35), 0 4px 14px rgba(0,0,0,0.2)',
    },
    photoBg: 'linear-gradient(175deg, #dbeafe 0%, #bfdbfe 55%, #dbeafe 100%)',
    footer: { background: 'rgba(37,99,235,0.06)', borderTop: '1px solid rgba(37,99,235,0.22)' },
    name: '#1e3a8a', detail: '#3b82f6', value: '#1d4ed8',
    badge: { background: '#2563eb', color: '#fff' },
    badgeText: '✍️ AUTO BLUE',
    initials: 'rgba(30,58,138,0.22)',
    shimmer: 'sapphire', sigLine: true,
    sigLineColor: 'rgba(37,99,235,0.45)', sigLabelColor: 'rgba(37,99,235,0.38)',
  },
  'Numbered Red': {
    card: {
      background: 'linear-gradient(135deg, #0a0000 0%, #100303 50%, #0a0000 100%)',
      border: '2px solid #dc2626',
      boxShadow: '0 0 28px rgba(220,38,38,0.52), 0 4px 18px rgba(0,0,0,0.92)',
    },
    photoBg: '#060303',
    footer: { background: 'rgba(220,38,38,0.05)', borderTop: '1px solid rgba(220,38,38,0.15)' },
    name: '#ef4444', detail: 'rgba(239,68,68,0.52)', value: '#ef4444',
    badge: { background: '#dc2626', color: '#fff' },
    badgeText: '# LIMITED RED',
    initials: 'rgba(220,38,38,0.2)',
    numbered: true,
    numberedColor: '#dc2626', numberedGlow: 'rgba(220,38,38,0.9)',
  },
  'Numbered Blue': {
    card: {
      background: 'linear-gradient(135deg, #00000a 0%, #03030f 50%, #00000a 100%)',
      border: '2px solid #3b82f6',
      boxShadow: '0 0 28px rgba(59,130,246,0.52), 0 4px 18px rgba(0,0,0,0.92)',
    },
    photoBg: '#030306',
    footer: { background: 'rgba(59,130,246,0.05)', borderTop: '1px solid rgba(59,130,246,0.15)' },
    name: '#60a5fa', detail: 'rgba(96,165,250,0.52)', value: '#60a5fa',
    badge: { background: '#3b82f6', color: '#fff' },
    badgeText: '# LIMITED BLUE',
    initials: 'rgba(59,130,246,0.2)',
    numbered: true,
    numberedColor: '#3b82f6', numberedGlow: 'rgba(59,130,246,0.9)',
  },
  'Patch Jersey Blue': {
    card: {
      background: 'linear-gradient(150deg, #050819 0%, #0f183c 38%, #080818 65%, #030310 100%)',
      border: '2px solid #3b82f6',
      boxShadow: '0 0 24px rgba(59,130,246,0.48), 0 4px 15px rgba(0,0,0,0.72)',
    },
    photoBg: 'linear-gradient(150deg, #0f183c 0%, #080818 100%)',
    footer: { background: 'rgba(0,0,0,0.58)', borderTop: '1px solid rgba(59,130,246,0.28)' },
    name: '#fff', detail: 'rgba(147,197,253,0.72)', value: '#93c5fd',
    badge: { background: '#3b82f6', color: '#fff' },
    badgeText: '🧵 PATCH BLUE',
    initials: 'rgba(255,255,255,0.25)',
    patch: true,
    patchBg: 'linear-gradient(135deg,#1d4ed8 0%,#3b82f6 50%,#1d4ed8 100%)',
    patchBorder: 'rgba(59,130,246,0.85)',
  },
  'Patch Jersey Gold': {
    card: {
      background: 'linear-gradient(150deg, #1a1000 0%, #2c2000 38%, #1a1200 65%, #0d0800 100%)',
      border: '2px solid #c9a227',
      boxShadow: '0 0 24px rgba(201,162,39,0.48), 0 4px 15px rgba(0,0,0,0.72)',
    },
    photoBg: 'linear-gradient(150deg, #2c2000 0%, #1a1200 100%)',
    footer: { background: 'rgba(0,0,0,0.58)', borderTop: '1px solid rgba(201,162,39,0.28)' },
    name: '#ffd700', detail: 'rgba(255,215,0,0.72)', value: '#c9a227',
    badge: { background: '#c9a227', color: '#000' },
    badgeText: '🧵 PATCH GOLD',
    initials: 'rgba(255,215,0,0.25)',
    patch: true,
    patchBg: 'linear-gradient(135deg,#b8860b 0%,#d4af37 50%,#b8860b 100%)',
    patchBorder: 'rgba(201,162,39,0.85)',
  },
  Ruby: {
    card: {
      background: 'linear-gradient(140deg, #1c0103 0%, #4a0514 26%, #700b1c 52%, #2e020a 78%, #120002 100%)',
      border: '2px solid #e11d48',
      boxShadow: '0 0 42px rgba(225,29,72,0.72), 0 0 84px rgba(225,29,72,0.32), 0 4px 22px rgba(0,0,0,0.92)',
    },
    photoBg: 'radial-gradient(circle at 44% 38%, #700b1c 0%, #1c0103 100%)',
    footer: { background: 'rgba(28,1,3,0.72)', borderTop: '1px solid rgba(225,29,72,0.22)' },
    name: '#fda4af', detail: 'rgba(253,164,175,0.64)', value: '#fb7185',
    badge: { background: '#be123c', color: '#fff' },
    badgeText: '💎 RUBY',
    initials: 'rgba(253,164,175,0.24)',
    shimmer: 'ruby', sparkle: true,
    sparkleColor: '#fca5a5', sparkleGlow: '#fb7185',
  },
  Emerald: {
    card: {
      background: 'linear-gradient(140deg, #011c0a 0%, #04471e 26%, #086438 52%, #02290e 78%, #011209 100%)',
      border: '2px solid #059669',
      boxShadow: '0 0 42px rgba(5,150,105,0.72), 0 0 84px rgba(5,150,105,0.32), 0 4px 22px rgba(0,0,0,0.92)',
    },
    photoBg: 'radial-gradient(circle at 44% 38%, #086438 0%, #011c0a 100%)',
    footer: { background: 'rgba(1,28,10,0.72)', borderTop: '1px solid rgba(5,150,105,0.22)' },
    name: '#6ee7b7', detail: 'rgba(110,231,183,0.64)', value: '#34d399',
    badge: { background: '#065f46', color: '#fff' },
    badgeText: '💎 EMERALD',
    initials: 'rgba(110,231,183,0.24)',
    shimmer: 'emerald', sparkle: true,
    sparkleColor: '#6ee7b7', sparkleGlow: '#34d399',
  },

  'One of One': {
    card: {
      background: '#000',
      border: 'none',
      boxShadow: 'none',
    },
    photoBg: 'radial-gradient(circle at 50% 40%, #0d0d0d 0%, #000 100%)',
    footer: { background: 'rgba(0,0,0,0.95)', borderTop: '1px solid rgba(255,215,0,0.15)' },
    name: '#ffd700', detail: 'rgba(255,215,0,0.7)', value: '#ffd700',
    badge: { background: '#000', color: '#ffd700', border: '1px solid rgba(255,215,0,0.5)' },
    badgeText: '⭐ 1 OF 1',
    initials: 'rgba(255,215,0,0.2)',
    shimmer: 'rainbow',
    oneOfOne: true,
  },
}

function Shimmer({ type }) {
  const bgMap = {
    chrome:       'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.42) 35%, rgba(255,255,255,0.68) 50%, rgba(255,255,255,0.42) 65%, transparent 100%)',
    gold:         'linear-gradient(90deg, transparent 0%, rgba(201,162,39,0.28) 35%, rgba(255,215,0,0.48) 50%, rgba(201,162,39,0.28) 65%, transparent 100%)',
    'gold-subtle':'linear-gradient(90deg, transparent 0%, rgba(201,162,39,0.14) 35%, rgba(255,215,0,0.26) 50%, rgba(201,162,39,0.14) 65%, transparent 100%)',
    sapphire:     'linear-gradient(120deg, transparent 0%, rgba(147,197,253,0.13) 30%, rgba(96,165,250,0.3) 50%, rgba(147,197,253,0.13) 70%, transparent 100%)',
    rose:         'linear-gradient(90deg, transparent 0%, rgba(212,128,138,0.28) 35%, rgba(230,160,170,0.48) 50%, rgba(212,128,138,0.28) 65%, transparent 100%)',
    ruby:         'linear-gradient(120deg, transparent 0%, rgba(225,29,72,0.13) 30%, rgba(251,113,133,0.3) 50%, rgba(225,29,72,0.13) 70%, transparent 100%)',
    emerald:      'linear-gradient(120deg, transparent 0%, rgba(5,150,105,0.13) 30%, rgba(110,231,183,0.3) 50%, rgba(5,150,105,0.13) 70%, transparent 100%)',
    rainbow:      'linear-gradient(90deg, transparent 0%, rgba(255,50,50,0.22) 10%, rgba(255,200,0,0.22) 25%, rgba(50,255,100,0.22) 40%, rgba(50,200,255,0.22) 55%, rgba(150,50,255,0.22) 70%, rgba(255,50,200,0.22) 85%, transparent 100%)',
  }
  if (!bgMap[type]) return null
  return (
    <div className="absolute inset-0 pointer-events-none z-10" style={{
      borderRadius: 'inherit',
      backgroundImage: bgMap[type],
      backgroundSize: '200% 100%',
      animation: 'chrome-sweep 2.4s linear infinite',
    }} />
  )
}

const SPARKLE_POSITIONS = [
  { top: '10%', left: '14%', delay: '0s',   dur: '2.1s' },
  { top: '7%',  left: '71%', delay: '0.5s', dur: '1.8s' },
  { top: '30%', left: '88%', delay: '0.9s', dur: '2.4s' },
  { top: '51%', left: '7%',  delay: '1.3s', dur: '2.0s' },
  { top: '68%', left: '56%', delay: '0.3s', dur: '1.7s' },
  { top: '80%', left: '24%', delay: '0.7s', dur: '2.2s' },
  { top: '22%', left: '43%', delay: '1.1s', dur: '1.9s' },
  { top: '89%', left: '79%', delay: '0.6s', dur: '2.3s' },
]

const OOF_SPARKLES = [
  { top: '5%',  left: '8%',  delay: '0s',    dur: '1.4s', color: '#ff4444' },
  { top: '8%',  left: '62%', delay: '0.25s', dur: '1.7s', color: '#ffcc00' },
  { top: '18%', left: '85%', delay: '0.55s', dur: '1.3s', color: '#44ff88' },
  { top: '32%', left: '3%',  delay: '0.9s',  dur: '1.6s', color: '#00ccff' },
  { top: '42%', left: '50%', delay: '0.15s', dur: '1.5s', color: '#aa44ff' },
  { top: '55%', left: '78%', delay: '0.75s', dur: '1.9s', color: '#ff44aa' },
  { top: '15%', left: '38%', delay: '1.1s',  dur: '1.8s', color: '#ff8800' },
  { top: '70%', left: '18%', delay: '0.4s',  dur: '1.4s', color: '#00ff88' },
  { top: '62%', left: '92%', delay: '1.3s',  dur: '2.0s', color: '#ffff44' },
  { top: '78%', left: '44%', delay: '0.65s', dur: '1.6s', color: '#44aaff' },
  { top: '85%', left: '67%', delay: '0.05s', dur: '1.5s', color: '#ff6644' },
  { top: '93%', left: '28%', delay: '0.85s', dur: '1.3s', color: '#cc44ff' },
  { top: '25%', left: '55%', delay: '1.45s', dur: '1.7s', color: '#44ffee' },
  { top: '48%', left: '22%', delay: '0.35s', dur: '1.4s', color: '#ff2288' },
  { top: '38%', left: '72%', delay: '1.0s',  dur: '1.8s', color: '#88ff22' },
  { top: '90%', left: '85%', delay: '0.5s',  dur: '1.6s', color: '#2288ff' },
]

function OofWrapper({ enabled, children }) {
  if (!enabled) return children
  return (
    <div className="one-of-one-border" style={{ padding: 3, borderRadius: 13 }}>
      {children}
    </div>
  )
}

// ── Fallback sport silhouette (shown while photo loads or if not found) ────
function SportIcon({ sport, color }) {
  const icons = {
    NBA: '🏀', NFL: '🏈',
    EPL: '⚽', LaLiga: '⚽', Bundesliga: '⚽', SerieA: '⚽', Ligue1: '⚽', MLS: '⚽',
    MLB: '⚾',
  }
  return (
    <div style={{ opacity: 0.18, userSelect: 'none', lineHeight: 1 }}>
      {icons[sport]
        ? <span style={{ fontSize: 48 }}>{icons[sport]}</span>
        : <img src="/icon.png" alt="" style={{ width: 40, height: 40 }} />}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────
export default function CardDisplay({ card, children, compact = false, inSlab = false }) {
  // fromCache: the URL (or null = "player not found") if already resolved this session,
  // undefined if never fetched. Using ?? + has() avoids || masking a legitimate null.
  const fromCache = PLAYER_IMAGES?.[card.playerName] ?? (
    IMG_RESOLVED.has(card.playerName) ? IMG_RESOLVED.get(card.playerName) : undefined
  )
  const knownAlready = fromCache !== undefined

  const [photoUrl, setPhotoUrl]     = useState(fromCache ?? null)
  const [photoError, setPhotoError] = useState(false)
  const [loading, setLoading]       = useState(!knownAlready)
  const [imgKey, setImgKey]         = useState(0)
  const [retried, setRetried]       = useState(false)

  // Fetch real player photo on mount unless the result is already cached
  useEffect(() => {
    if (knownAlready) return
    let cancelled = false
    fetchPlayerImage(card.playerName).then(url => {
      if (!cancelled) {
        setPhotoUrl(url)
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [card.playerName])

  function handleImgError() {
    if (!retried) {
      // First failure: remount the img element to re-request the URL.
      // Handles transient network errors and iOS evicting image data after backgrounding.
      setRetried(true)
      setImgKey(k => k + 1)
    } else {
      setPhotoError(true)
    }
  }

  const d = DESIGNS[card.rarity] || DESIGNS.Base

  const looked   = PLAYER_LOOKUP[card.playerName] || {}
  const team     = card.team     || looked.team     || ''
  const position = card.position || looked.position || ''
  const initials = card.playerName.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase()

  const photoH   = compact ? 102 : 162
  const teamBarW = compact ? 13  : 19

  const outerStyle = inSlab
    ? { ...d.card, border: 'none', boxShadow: 'none', borderRadius: 4, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }
    : { ...d.card, borderRadius: 10, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }

  const showRealPhoto = photoUrl && !photoError && !loading

  return (
    <OofWrapper enabled={d.oneOfOne && !inSlab}>
    <div className="select-none" style={outerStyle}>
      {d.shimmer && <Shimmer type={d.shimmer} />}

      {/* ── Photo area + left team strip ──────────────────────────── */}
      <div className="flex relative" style={{ height: photoH, overflow: 'hidden' }}>

        {/* Colored team strip – vertical team name */}
        <div style={{
          width: teamBarW,
          background: d.badge.background,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2,
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, bottom: 0, width: '40%',
            background: 'rgba(255,255,255,0.12)',
          }} />
          <span style={{
            fontSize: compact ? 5 : 6.5,
            fontWeight: 900,
            color: d.badge.color,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            userSelect: 'none',
            maxHeight: '86%',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            position: 'relative',
            zIndex: 1,
          }}>
            {team || card.sport}
          </span>
        </div>

        {/* ── Main photo / art panel ── */}
        <div className="flex-1 relative overflow-hidden" style={{ background: d.photoBg }}>

          {/* Background effects */}
          {d.netTexture && (
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: [
                'repeating-linear-gradient(0deg,rgba(201,162,39,0.18) 0px,rgba(201,162,39,0.18) 1px,transparent 1px,transparent 7px)',
                'repeating-linear-gradient(90deg,rgba(201,162,39,0.18) 0px,rgba(201,162,39,0.18) 1px,transparent 1px,transparent 7px)',
              ].join(','),
            }} />
          )}
          {d.cityLights && (
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: [
                'radial-gradient(circle at 14% 24%,rgba(255,200,50,0.24) 0%,transparent 15%)',
                'radial-gradient(circle at 79% 17%,rgba(255,120,50,0.18) 0%,transparent 11%)',
                'radial-gradient(circle at 41% 67%,rgba(80,140,255,0.20) 0%,transparent 13%)',
                'radial-gradient(circle at 83% 57%,rgba(255,200,80,0.14) 0%,transparent 9%)',
                'radial-gradient(circle at 23% 79%,rgba(255,90,160,0.12) 0%,transparent 8%)',
                'radial-gradient(circle at 63% 89%,rgba(100,210,255,0.16) 0%,transparent 10%)',
                'radial-gradient(circle at 91% 83%,rgba(255,230,60,0.13) 0%,transparent 8%)',
                'radial-gradient(circle at 52% 38%,rgba(255,180,100,0.08) 0%,transparent 12%)',
              ].join(','),
            }} />
          )}
          {d.lightning && (
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: `conic-gradient(from 0deg at 25% 30%,transparent 0deg,rgba(255,180,0,0.07) 8deg,transparent 18deg,rgba(255,140,0,0.05) 28deg,transparent 38deg,rgba(255,210,0,0.07) 48deg,transparent 58deg,rgba(255,140,0,0.04) 68deg,transparent 78deg,rgba(255,180,0,0.06) 88deg,transparent 98deg,rgba(255,210,0,0.05) 110deg,transparent 124deg,transparent 360deg)`,
            }} />
          )}
          {d.sparkle && SPARKLE_POSITIONS.map((p, i) => (
            <div key={i} className="absolute pointer-events-none rounded-full" style={{
              top: p.top, left: p.left,
              width: compact ? 2 : 3, height: compact ? 2 : 3,
              background: '#fff',
              animation: `sparkle-pop ${p.dur} ease-in-out ${p.delay} infinite`,
              boxShadow: `0 0 4px ${d.sparkleColor || '#93c5fd'},0 0 8px ${d.sparkleGlow || '#60a5fa'}`,
            }} />
          ))}
          {d.oneOfOne && OOF_SPARKLES.map((p, i) => (
            <div key={`oof-${i}`} className="absolute pointer-events-none rounded-full" style={{
              top: p.top, left: p.left,
              width: compact ? 2 : 3.5, height: compact ? 2 : 3.5,
              background: '#fff',
              animation: `sparkle-pop ${p.dur} ease-in-out ${p.delay} infinite`,
              boxShadow: `0 0 5px ${p.color}, 0 0 12px ${p.color}`,
            }} />
          ))}

          {/* ── Player photo (real) ── */}
          {showRealPhoto && (
            <img
              key={imgKey}
              src={photoUrl}
              alt={card.playerName}
              loading="lazy"
              decoding="async"
              className="absolute w-full"
              style={{
                bottom: 0,
                left: 0,
                height: '110%',        // slightly taller so feet reach the bottom
                objectFit: 'contain',
                objectPosition: 'center bottom',
              }}
              onError={handleImgError}
            />
          )}

          {/* ── Loading skeleton / fallback (initials + sport icon) ── */}
          {/* Space is already reserved by the fixed-height container above, so no layout shift. */}
          {!showRealPhoto && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
              {loading && (
                <div className="absolute inset-0 animate-pulse pointer-events-none" style={{ background: 'rgba(255,255,255,0.06)' }} />
              )}
              <SportIcon sport={card.sport} color={d.initials} />
              <span style={{
                fontSize: compact ? 18 : 28,
                fontWeight: 900,
                color: d.initials,
                letterSpacing: '-0.02em',
                userSelect: 'none',
              }}>
                {initials}
              </span>
            </div>
          )}

          {/* ── One of One: 1/1 stamp ── */}
          {d.oneOfOne && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ paddingBottom: compact ? 28 : 44 }}>
              <div style={{
                fontSize: compact ? 28 : 48,
                fontWeight: 900,
                color: '#ffd700',
                fontFamily: 'Georgia, serif',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                animation: 'one-of-one-pulse 2s ease-in-out infinite',
              }}>
                1<span style={{ fontSize: compact ? 20 : 34, opacity: 0.75 }}>/</span>1
              </div>
              <div style={{
                fontSize: compact ? 5 : 7.5,
                color: 'rgba(255,215,0,0.5)',
                fontFamily: 'monospace',
                letterSpacing: '0.4em',
                marginTop: compact ? 2 : 5,
                textTransform: 'uppercase',
              }}>
                UNIQUE
              </div>
            </div>
          )}

          {/* ── Patch swatch (top-right) ── */}
          {d.patch && (
            <div style={{
              position: 'absolute', top: compact ? 4 : 7, right: compact ? 4 : 7,
              width: compact ? 22 : 32, height: compact ? 22 : 32,
              borderRadius: 3, border: `1.5px solid ${d.patchBorder || 'rgba(220,38,38,0.85)'}`,
              overflow: 'hidden',
              background: d.patchBg || 'linear-gradient(135deg,#b91c1c 0%,#ef4444 50%,#b91c1c 100%)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
            }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(-45deg,rgba(255,255,255,0.28) 0px,rgba(255,255,255,0.28) 2px,transparent 2px,transparent 7px)' }} />
            </div>
          )}

          {/* ── Autograph line (Signature cards) ── */}
          {d.sigLine && !compact && (
            <div style={{ position: 'absolute', bottom: 30, left: 10, right: 10 }}>
              <div style={{ borderBottom: `1.5px solid ${d.sigLineColor || 'rgba(120,85,10,0.45)'}` }} />
              <div style={{ fontSize: 5, color: d.sigLabelColor || 'rgba(120,85,10,0.38)', letterSpacing: '0.22em', textAlign: 'center', marginTop: 2, fontFamily: 'monospace' }}>
                AUTOGRAPH
              </div>
            </div>
          )}

          {/* ── Rarity badge (top-right, or shifted left if patch is there) ── */}
          <div style={{ position: 'absolute', top: compact ? 3 : 5, right: d.patch ? (compact ? 30 : 44) : (compact ? 3 : 5) }}>
            <span style={{
              ...d.badge,
              fontSize: compact ? 5 : 6.5,
              padding: compact ? '1px 3px' : '1.5px 5px',
              borderRadius: 3, fontWeight: 800,
              letterSpacing: '0.04em', lineHeight: 1.4, whiteSpace: 'nowrap',
              boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
            }}>
              {d.badgeText}
            </span>
          </div>

          {/* ── Year label (top-left) ── */}
          <div style={{ position: 'absolute', top: compact ? 3 : 5, left: compact ? 3 : 5 }}>
            <span style={{ fontSize: compact ? 5 : 6, color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace', textShadow: '0 1px 3px rgba(0,0,0,0.9)', letterSpacing: '0.04em' }}>
              {card.year}
            </span>
          </div>

          {/* ── Serial number stamp (bottom-right, all card types) ── */}
          {card.serialNumber != null && card.printRun != null && (
            <div style={{
              position: 'absolute',
              bottom: compact ? 22 : 34,
              right: compact ? 5 : 8,
              fontSize: compact ? 9 : 15,
              fontWeight: 700,
              color: '#fff',
              textShadow: '0 1px 4px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,0.8)',
              lineHeight: 1,
              pointerEvents: 'none',
              zIndex: 3,
              fontFamily: 'monospace',
              letterSpacing: '0.02em',
            }}>
              {card.serialNumber}/{card.printRun}
            </div>
          )}

          {/* ── Bottom gradient fade for text readability ── */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: compact ? 36 : 54,
            background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.94))',
            pointerEvents: 'none',
          }} />

          {/* ── Player name + position over gradient ── */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: compact ? '3px 6px 5px' : '5px 8px 7px' }}>
            <p style={{
              fontSize: compact ? 8.5 : 11,
              fontWeight: 900, color: '#fff', lineHeight: 1.1,
              letterSpacing: '0.05em', textTransform: 'uppercase',
              textShadow: '0 1px 6px rgba(0,0,0,1)',
              margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {card.playerName}
            </p>
            {position && !compact && (
              <p style={{
                fontSize: 6.5, color: 'rgba(255,255,255,0.62)',
                margin: '1px 0 0', letterSpacing: '0.08em', textTransform: 'uppercase',
                textShadow: '0 1px 3px rgba(0,0,0,0.9)',
              }}>
                {position}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Footer: grade + value ─────────────────────────────────── */}
      <div style={{
        ...d.footer,
        padding: compact ? '3px 6px 4px' : '4px 8px 5px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3,
      }}>
        {card.psaGrade ? (
          <span style={{ background: '#16a34a', color: '#fff', fontSize: compact ? 6.5 : 7.5, padding: compact ? '1px 3px' : '1.5px 4px', borderRadius: 3, fontWeight: 800, whiteSpace: 'nowrap' }}>
            PSA {card.psaGrade}
          </span>
        ) : (
          <span style={{ background: 'rgba(0,0,0,0.18)', color: d.detail, fontSize: compact ? 6.5 : 7.5, padding: compact ? '1px 3px' : '1.5px 4px', borderRadius: 3, fontWeight: 600, whiteSpace: 'nowrap' }}>
            {card.condition}
          </span>
        )}
        <span style={{ fontSize: compact ? 8.5 : 10.5, fontWeight: 800, color: d.value, whiteSpace: 'nowrap', flexShrink: 0 }}>
          {fmt(card.currentValue)}
        </span>
      </div>

      {children && (
        <div style={{ padding: '0 6px 6px' }}>
          {children}
        </div>
      )}
    </div>
    </OofWrapper>
  )
}
