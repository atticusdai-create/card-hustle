// ── Card game data and generation logic ──────────────────────────────────────
import nbaPlayers    from './nbaPlayers.js'
import nflPlayers    from './nflPlayers.js'
import soccerPlayers from './soccerPlayers.js'
import mlbPlayers    from './mlbPlayers.js'

// Map each player file's cardType tier to a base hotness value (1-100).
// A small deterministic spread (±4) is derived from the player's name so
// two players in the same tier still have slightly different card values.
const TIER_HOTNESS = {
  'One of One': 100,
  'Sapphire': 99, 'Ruby': 99, 'Emerald': 99,
  'Patch Jersey': 97, 'Patch Jersey Blue': 97, 'Patch Jersey Gold': 97,
  'Kaboom': 91, 'Kaboom Blue': 91, 'Kaboom Purple': 91,
  'Numbered': 88, 'Numbered Red': 88, 'Numbered Blue': 88,
  'Signature': 84, 'Signature Black': 84, 'Signature Blue': 84,
  'Downtown': 74, 'Downtown Purple': 74, 'Downtown Red': 74,
  'Net to Net': 62, 'Net to Net Red': 62, 'Net to Net Blue': 62,
  'Parallel': 48, 'Parallel Gold': 48, 'Parallel Rose Gold': 48,
  'Base': 35,
}

function nameVariance(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff
  return (h % 9) - 4   // -4 … +4
}

function withHotness(player) {
  const base = TIER_HOTNESS[player.cardType] ?? 50
  return { ...player, hotness: Math.max(1, Math.min(100, base + nameVariance(player.name))) }
}

export const SPORTS = ['Basketball', 'Football', 'Soccer', 'Baseball']

export const SPORT_EMOJIS = {
  Basketball: '🏀',
  Football: '🏈',
  Soccer: '⚽',
  Baseball: '⚾',
}

export const SPORT_COLORS = {
  Basketball: { from: '#ea580c', to: '#b45309' },
  Football: { from: '#16a34a', to: '#15803d' },
  Soccer: { from: '#2563eb', to: '#1d4ed8' },
  Baseball: { from: '#dc2626', to: '#b91c1c' },
}

// hotness: 1-100, derived from each player's cardType tier + name-based spread
export const PLAYERS = {
  Basketball: nbaPlayers.map(withHotness),
  Football:   nflPlayers.map(withHotness),
  Soccer:     soccerPlayers.map(withHotness),
  Baseball:   mlbPlayers.map(withHotness),
}

// Flat name → {team, position} map — lets CardDisplay look up info for old Supabase cards
export const PLAYER_LOOKUP = (() => {
  const map = {}
  for (const players of Object.values(PLAYERS)) {
    for (const p of players) map[p.name] = { team: p.team, position: p.position }
  }
  return map
})()

export const RARITIES = ['Base', 'Parallel', 'Net to Net', 'Downtown', 'Signature', 'Kaboom', 'Numbered', 'Patch Jersey', 'Sapphire', 'One of One']

export const RARITY_COLORS = {
  'Base':               { bg: 'linear-gradient(135deg,#374151,#1f2937)', border: '#6b7280', glow: 'rgba(107,114,128,0.2)' },
  'Parallel':           { bg: 'linear-gradient(135deg,#1e3a8a,#312e81)', border: '#818cf8', glow: 'rgba(129,140,248,0.4)' },
  'Parallel Gold':      { bg: 'linear-gradient(135deg,#92400e,#78350f)', border: '#d4a832', glow: 'rgba(212,168,50,0.5)' },
  'Parallel Rose Gold': { bg: 'linear-gradient(135deg,#7a3a40,#6b1f28)', border: '#c07080', glow: 'rgba(192,112,128,0.4)' },
  'Net to Net':         { bg: 'linear-gradient(135deg,#14532d,#065f46)', border: '#34d399', glow: 'rgba(52,211,153,0.4)' },
  'Net to Net Red':     { bg: 'linear-gradient(135deg,#450a0a,#7f1d1d)', border: '#ef4444', glow: 'rgba(239,68,68,0.4)' },
  'Net to Net Blue':    { bg: 'linear-gradient(135deg,#0c1a3d,#1e3a8a)', border: '#60a5fa', glow: 'rgba(96,165,250,0.4)' },
  'Downtown':           { bg: 'linear-gradient(135deg,#581c87,#4c1d95)', border: '#c084fc', glow: 'rgba(192,132,252,0.5)' },
  'Downtown Purple':    { bg: 'linear-gradient(135deg,#2e1065,#4c1d95)', border: '#a855f7', glow: 'rgba(168,85,247,0.5)' },
  'Downtown Red':       { bg: 'linear-gradient(135deg,#450a0a,#7f1d1d)', border: '#ef4444', glow: 'rgba(239,68,68,0.5)' },
  'Signature':          { bg: 'linear-gradient(135deg,#831843,#9d174d)', border: '#f472b6', glow: 'rgba(244,114,182,0.6)' },
  'Signature Black':    { bg: 'linear-gradient(135deg,#111,#0a0a0a)', border: '#6b7280', glow: 'rgba(107,114,128,0.3)' },
  'Signature Blue':     { bg: 'linear-gradient(135deg,#1e3a8a,#1d4ed8)', border: '#60a5fa', glow: 'rgba(96,165,250,0.5)' },
  'Kaboom':             { bg: 'linear-gradient(135deg,#0c3d5e,#0369a1)', border: '#38bdf8', glow: 'rgba(56,189,248,0.9)' },
  'Kaboom Blue':        { bg: 'linear-gradient(135deg,#0c1a3d,#1e3a8a)', border: '#60a5fa', glow: 'rgba(96,165,250,0.9)' },
  'Kaboom Purple':      { bg: 'linear-gradient(135deg,#2e1065,#4c1d95)', border: '#a855f7', glow: 'rgba(168,85,247,0.9)' },
  'Numbered':           { bg: 'linear-gradient(135deg,#0c4a6e,#164e63)', border: '#22d3ee', glow: 'rgba(34,211,238,0.6)' },
  'Numbered Red':       { bg: 'linear-gradient(135deg,#450a0a,#7f1d1d)', border: '#ef4444', glow: 'rgba(239,68,68,0.5)' },
  'Numbered Blue':      { bg: 'linear-gradient(135deg,#0c1a3d,#1e3a8a)', border: '#60a5fa', glow: 'rgba(96,165,250,0.5)' },
  'Patch Jersey':       { bg: 'linear-gradient(135deg,#7f1d1d,#991b1b)', border: '#fca5a5', glow: 'rgba(252,165,165,0.6)' },
  'Patch Jersey Blue':  { bg: 'linear-gradient(135deg,#0c1a3d,#1e3a8a)', border: '#60a5fa', glow: 'rgba(96,165,250,0.6)' },
  'Patch Jersey Gold':  { bg: 'linear-gradient(135deg,#78350f,#92400e)', border: '#d4a832', glow: 'rgba(212,168,50,0.6)' },
  'Sapphire':           { bg: 'linear-gradient(135deg,#0a1628,#1e3a8a)', border: '#93c5fd', glow: 'rgba(147,197,253,1.0)' },
  'Ruby':               { bg: 'linear-gradient(135deg,#3b0012,#7f1d1d)', border: '#fb7185', glow: 'rgba(251,113,133,1.0)' },
  'Emerald':            { bg: 'linear-gradient(135deg,#052e16,#065f46)', border: '#6ee7b7', glow: 'rgba(110,231,183,1.0)' },
  'One of One':         { bg: '#000', border: '#ffd700', glow: 'rgba(255,215,0,1.0)' },
}

export const RARITY_BADGES = {
  'Base':               'bg-gray-500 text-white',
  'Parallel':           'bg-indigo-500 text-white',
  'Parallel Gold':      'bg-yellow-600 text-black',
  'Parallel Rose Gold': 'bg-pink-400 text-black',
  'Net to Net':         'bg-emerald-600 text-white',
  'Net to Net Red':     'bg-red-600 text-white',
  'Net to Net Blue':    'bg-blue-600 text-white',
  'Downtown':           'bg-purple-600 text-white',
  'Downtown Purple':    'bg-purple-700 text-white',
  'Downtown Red':       'bg-red-600 text-white font-bold',
  'Signature':          'bg-pink-600 text-white font-bold',
  'Signature Black':    'bg-gray-700 text-white font-bold',
  'Signature Blue':     'bg-blue-500 text-white font-bold',
  'Kaboom':             'bg-sky-400 text-black font-black',
  'Kaboom Blue':        'bg-blue-400 text-black font-black',
  'Kaboom Purple':      'bg-purple-400 text-black font-black',
  'Numbered':           'bg-cyan-500 text-black font-bold',
  'Numbered Red':       'bg-red-500 text-white font-bold',
  'Numbered Blue':      'bg-blue-500 text-white font-bold',
  'Patch Jersey':       'bg-red-600 text-white font-bold',
  'Patch Jersey Blue':  'bg-blue-600 text-white font-bold',
  'Patch Jersey Gold':  'bg-yellow-600 text-black font-bold',
  'Sapphire':           'bg-blue-600 text-white font-black',
  'Ruby':               'bg-rose-700 text-white font-black',
  'Emerald':            'bg-emerald-700 text-white font-black',
  'One of One':         'bg-black text-yellow-400 font-black',
}

export const RARITY_VARIANTS = {
  'Parallel':     ['Parallel', 'Parallel Gold', 'Parallel Rose Gold'],
  'Net to Net':   ['Net to Net', 'Net to Net Red', 'Net to Net Blue'],
  'Downtown':     ['Downtown', 'Downtown Purple', 'Downtown Red'],
  'Kaboom':       ['Kaboom', 'Kaboom Blue', 'Kaboom Purple'],
  'Signature':    ['Signature', 'Signature Black', 'Signature Blue'],
  'Numbered':     ['Numbered', 'Numbered Red', 'Numbered Blue'],
  'Patch Jersey': ['Patch Jersey', 'Patch Jersey Blue', 'Patch Jersey Gold'],
  'Sapphire':     ['Sapphire', 'Ruby', 'Emerald'],
}

export const RARITY_BASE = (() => {
  const map = {}
  for (const [base, variants] of Object.entries(RARITY_VARIANTS)) {
    for (const v of variants) map[v] = base
  }
  return map
})()

export const RARITY_ORDER = {
  'Base': 0,
  'Parallel': 1, 'Parallel Gold': 1, 'Parallel Rose Gold': 1,
  'Net to Net': 2, 'Net to Net Red': 2, 'Net to Net Blue': 2,
  'Downtown': 3, 'Downtown Purple': 3, 'Downtown Red': 3,
  'Signature': 4, 'Signature Black': 4, 'Signature Blue': 4,
  'Kaboom': 5, 'Kaboom Blue': 5, 'Kaboom Purple': 5,
  'Numbered': 6, 'Numbered Red': 6, 'Numbered Blue': 6,
  'Patch Jersey': 7, 'Patch Jersey Blue': 7, 'Patch Jersey Gold': 7,
  'Sapphire': 8, 'Ruby': 8, 'Emerald': 8,
  'One of One': 9,
}

export const CONDITIONS = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent', 'Mint', 'Gem Mint']

// Value ranges [min, max] per card type — applied as baseValue before condition/year mods
const TYPE_VALUE_RANGES = {
  'Base':         [0.50, 2],
  'Parallel':     [2, 10],
  'Net to Net':   [3, 25],
  'Downtown':     [150, 1000],
  'Kaboom':       [150, 1500],
  'Signature':    [100, 10000],
  'Patch Jersey': [100, 10000],
  'Sapphire':     [1000, 100000],
  'One of One':   [400000, 4000000],
}

// Numbered: serial (/999, /499, /99, /49, /25, /10, /5) — value scales with print run rarity
const NUMBERED_PRINT_RUNS    = [999, 499, 99, 49, 25, 10, 5]
const NUMBERED_PRINT_WEIGHTS = [35,  25,  18, 10,  6,  4,  2]
const NUMBERED_VALUE_RANGES  = {
  999: [10,   60],
  499: [30,   150],
  99:  [80,   450],
  49:  [200,  900],
  25:  [500,  2500],
  10:  [1500, 6000],
  5:   [4000, 20000],
}

// Default draw weights: Base, Parallel, Net to Net, Downtown, Signature, Kaboom, Numbered, Patch Jersey
// (no Sapphire — only available via Premium Box pack weights)
const RARITY_WEIGHTS = [1600, 300, 60, 24, 6, 4, 40, 1]

export const CONDITION_MULTS = {
  Poor:       0.05,
  Fair:       0.15,
  Good:       0.35,
  'Very Good':0.55,
  Excellent:  0.75,
  Mint:       1.00,
  'Gem Mint': 1.25,
}

export const PSA_MULTS = {
  1: 0.08, 2: 0.12, 3: 0.18, 4: 0.28,
  5: 0.45, 6: 0.65, 7: 0.85, 8: 1.20,
  9: 2.50, 10: 6.00,
}

export const COLLECTOR_NAMES = [
  'CardKing Mike', 'Vintage Vince', 'SlabQueen Sara', 'PSA Pete',
  'Rookie Randy', 'GrailHunter Gary', 'Box Breaker Bob', 'WaxPack Wendy',
  'Flipper Phil', 'Binder Brad', 'SetBuilder Steve', 'HoloHunter Hank',
  'RC Ronnie', 'PatchMan Paul', 'AutoQueen Amy', 'LegendaryLou',
]

function rand(min, max) {
  return Math.random() * (max - min) + min
}

function randInt(min, max) {
  return Math.floor(rand(min, max + 1))
}

function pickWeighted(items, weights) {
  const total = weights.reduce((a, b) => a + b, 0)
  let r = Math.random() * total
  for (let i = 0; i < items.length; i++) {
    r -= weights[i]
    if (r <= 0) return items[i]
  }
  return items[items.length - 1]
}

function yearMult(year) {
  if (year < 1990) return 2.6
  if (year < 2000) return 1.9
  if (year < 2010) return 1.4
  if (year < 2020) return 1.0
  return 0.85
}

export function calcCurrentValue(card) {
  const ym = yearMult(card.year)
  const cm = card.psaGrade ? PSA_MULTS[card.psaGrade] : CONDITION_MULTS[card.condition]
  return Math.max(0.01, Math.round(card.baseValue * ym * cm * 100) / 100)
}

let idCounter = Date.now()
function generateId() {
  return 'card_' + (idCounter++).toString(36) + Math.random().toString(36).slice(2, 7)
}

// Track which players already have a 1/1 this session so duplicates never generate
const generatedOneOfOnes = new Set()

export function generateCard({ sport, rarityBias, forceRarity, condition, forShow = false, oneOfOneChance = 0.000001 } = {}) {
  const chosenSport = sport || SPORTS[randInt(0, SPORTS.length - 1)]
  const players = PLAYERS[chosenSport]
  const player = players[randInt(0, players.length - 1)]

  // One of One: unique per player per session; chance boosted by certain pack types
  if (!generatedOneOfOnes.has(player.name) && Math.random() < oneOfOneChance) {
    generatedOneOfOnes.add(player.name)
    const targetValue = Math.round(rand(500000, 5000000) * 100) / 100
    return {
      id: generateId(),
      playerName: player.name,
      team: player.team,
      position: player.position,
      sport: chosenSport,
      year: 2024,
      rarity: 'One of One',
      condition: 'Gem Mint',
      psaGrade: null,
      baseValue: Math.round((targetValue / 1.25) * 100) / 100,
      currentValue: targetValue,
      location: 'collection',
      shopPrice: null,
      gradingSubmittedAt: null,
      gradingCompleteAt: null,
      createdAt: new Date().toISOString(),
      serialNumber: 1,
      printRun: 1,
    }
  }

  // Hot players boost higher-tier pull rates
  let weights = [...RARITY_WEIGHTS]
  if (player.hotness >= 95)      weights = [400, 220, 150, 110, 60, 35, 45, 5]
  else if (player.hotness >= 85) weights = [520, 220, 130, 75, 30, 13, 35, 4]

  // Default picks from non-Sapphire rarities; Sapphire only via rarityBias from pack logic
  let rarity = forceRarity || rarityBias || pickWeighted(RARITIES.slice(0, -1), weights)

  if (!forceRarity) {
    // Kaboom cards only for notable players (hotness >= 80)
    if (rarity === 'Kaboom' && player.hotness < 80) rarity = 'Signature'
    // Sapphire only for the biggest superstars (hotness >= 90)
    if (rarity === 'Sapphire' && player.hotness < 90) rarity = 'Patch Jersey'
  }

  // Randomly pick a color variant within the same tier
  const variants = RARITY_VARIANTS[rarity]
  if (variants && variants.length > 1) {
    rarity = variants[randInt(0, variants.length - 1)]
  }

  const baseRarity = RARITY_BASE[rarity] || rarity
  const year = randInt(1980, 2024)

  let serialNumber = null
  let printRun = null
  let baseValue

  if (baseRarity === 'Numbered') {
    printRun = pickWeighted(NUMBERED_PRINT_RUNS, NUMBERED_PRINT_WEIGHTS)
    serialNumber = randInt(1, printRun)
    const [nMin, nMax] = NUMBERED_VALUE_RANGES[printRun]
    baseValue = Math.round((nMin + (nMax - nMin) * Math.random()) * 100) / 100
  } else {
    const [tMin, tMax] = TYPE_VALUE_RANGES[baseRarity] || [0.50, 2]
    baseValue = Math.round((tMin + (tMax - tMin) * Math.random()) * 100) / 100
  }

  const conditionWeights = forShow
    ? [0, 2, 5, 12, 25, 36, 20]
    : [3, 5, 10, 18, 28, 25, 11]
  const cond = condition || pickWeighted(CONDITIONS, conditionWeights)

  const card = {
    id: generateId(),
    playerName: player.name,
    team: player.team,
    position: player.position,
    sport: chosenSport,
    year,
    rarity,
    condition: cond,
    psaGrade: null,
    baseValue,
    currentValue: 0,
    location: 'collection',
    shopPrice: null,
    gradingSubmittedAt: null,
    gradingCompleteAt: null,
    createdAt: new Date().toISOString(),
    serialNumber,
    printRun,
  }
  card.currentValue = calcCurrentValue(card)
  return card
}

// Generate a PSA grade biased by the card's condition
export function generatePsaGrade(condition) {
  const gradePools = {
    Poor:         [1,1,2,2,3],
    Fair:         [2,2,3,3,4],
    Good:         [3,3,4,4,5,5],
    'Very Good':  [4,5,5,6,6,7],
    Excellent:    [6,6,7,7,8,8],
    Mint:         [7,7,8,8,9,9],
    'Gem Mint':   [8,8,9,9,9,10,10],
  }
  const pool = gradePools[condition] || [5,6,7,8]
  return pool[randInt(0, pool.length - 1)]
}

// Generate AI trade offers based on player's collection.
// AI never offers Sapphire/Patch Jersey/Signature; offers fair value (80-120% of wanted card).
export function generateTradeOffers(myCards) {
  if (myCards.length === 0) return []

  const PREMIUM_RARITIES = [
    'Sapphire', 'Ruby', 'Emerald',
    'Patch Jersey', 'Patch Jersey Blue', 'Patch Jersey Gold',
    'Signature', 'Signature Black', 'Signature Blue',
  ]
  // AI only wants non-premium cards from the player
  const tradeable = myCards.filter(c => !PREMIUM_RARITIES.includes(c.rarity))
  if (tradeable.length === 0) return []

  const shuffled = [...tradeable].sort(() => Math.random() - 0.5).slice(0, Math.min(3, tradeable.length))
  const offers = []

  shuffled.forEach(wantedCard => {
    const sport = SPORTS[randInt(0, SPORTS.length - 1)]

    // Generate AI card — not premium, value capped at Downtown max ($1000)
    let theirCard
    let attempts = 0
    do {
      theirCard = generateCard({ sport })
      attempts++
    } while (attempts < 15 && (PREMIUM_RARITIES.includes(theirCard.rarity) || theirCard.currentValue > 1000))

    if (PREMIUM_RARITIES.includes(theirCard.rarity) || theirCard.currentValue > 1000) {
      theirCard = generateCard({ sport, rarityBias: 'Downtown' })
    }

    // Fair value: AI total offer targets 80-120% of the wanted card's value
    const targetTotal = wantedCard.currentValue * rand(0.8, 1.2)
    const cashBonus = Math.max(0, Math.round((targetTotal - theirCard.currentValue) * 100) / 100)

    offers.push({
      id: generateId(),
      collectorName: COLLECTOR_NAMES[randInt(0, COLLECTOR_NAMES.length - 1)],
      wantedCardId: wantedCard.id,
      wantedCard,
      offeredCard: theirCard,
      cashBonus,
    })
  })
  return offers
}

// ── Player images from official CDNs ─────────────────────────────────────────
const NBA = id => `https://cdn.nba.com/headshots/nba/latest/1040x760/${id}.png`
const NFL = id => `https://a.espncdn.com/i/headshots/nfl/players/full/${id}.png`
const MLB = id => `https://img.mlbstatic.com/mlb-photos/image/upload/w_180,q_auto:best/v1/people/${id}/headshot/67/current`

export const PLAYER_IMAGES = {
  // Basketball — NBA CDN
  'LeBron James':          NBA(2544),
  'Michael Jordan':        NBA(893),
  'Kobe Bryant':           NBA(977),
  'Stephen Curry':         NBA(201939),
  'Magic Johnson':         NBA(254),
  'Larry Bird':            NBA(1449),
  'Kevin Durant':          NBA(201142),
  'Giannis Antetokounmpo': NBA(203507),
  'Luka Doncic':           NBA(1629029),
  'Nikola Jokic':          NBA(203999),
  'Ja Morant':             NBA(1629630),
  'Jayson Tatum':          NBA(1628369),
  'Anthony Davis':         NBA(203076),
  'Devin Booker':          NBA(1626164),
  'Joel Embiid':           NBA(203954),
  'Zion Williamson':       NBA(1629627),
  'Donovan Mitchell':      NBA(1628378),
  // Football — ESPN CDN
  'Patrick Mahomes':       NFL(3139477),
  'Tom Brady':             NFL(2330),
  'Peyton Manning':        NFL(1025),
  'Josh Allen':            NFL(3918298),
  'Lamar Jackson':         NFL(3916387),
  'Justin Jefferson':      NFL(4262921),
  'Travis Kelce':          NFL(15847),
  'CeeDee Lamb':           NFL(4241478),
  'Joe Burrow':            NFL(4241479),
  'Tyreek Hill':           'https://r2.thesportsdb.com/images/media/player/cutout/c85pj91665496476.png',
  'Cooper Kupp':           NFL(3054124),
  'Davante Adams':         NFL(2576417),
  'Aaron Donald':          NFL(16757),
  'Jerry Rice':            NFL(80),
  'DK Metcalf':            NFL(4047650),
  // Baseball — MLB CDN
  'Mike Trout':            MLB(545361),
  'Shohei Ohtani':         MLB(660271),
  'Aaron Judge':           MLB(592450),
  'Mookie Betts':          MLB(605141),
  'Ronald Acuña Jr.':      MLB(660670),
  'Juan Soto':             MLB(665742),
  'Fernando Tatis Jr.':    MLB(665487),
  'Julio Rodríguez':       MLB(677594),
  'Yordan Alvarez':        MLB(670541),
  'Freddie Freeman':       MLB(518692),
  'Pete Alonso':           MLB(624413),
  'Trea Turner':           MLB(607208),
  // Soccer – TheSportsDB full-body cutouts
  'Rodri':           'https://r2.thesportsdb.com/images/media/player/cutout/6ggnc31769182523.png',
  'Erling Haaland':  'https://r2.thesportsdb.com/images/media/player/cutout/un3jr11769182465.png',
  'Kylian Mbappe':   'https://r2.thesportsdb.com/images/media/player/cutout/h9u9vz1733653583.png',
  'Kylian Mbappé':   'https://r2.thesportsdb.com/images/media/player/cutout/h9u9vz1733653583.png',
  'Vinicius Junior': 'https://r2.thesportsdb.com/images/media/player/cutout/ejuxsh1750271859.png',
  'Mohamed Salah':   'https://r2.thesportsdb.com/images/media/player/cutout/3blc581757088735.png',
  'Bukayo Saka':     'https://r2.thesportsdb.com/images/media/player/cutout/xfwok41769331816.png',
  'Pedri':           'https://r2.thesportsdb.com/images/media/player/cutout/82xtuu1726509836.png',
  'Jude Bellingham': 'https://r2.thesportsdb.com/images/media/player/cutout/trk5271750271712.png',
  'Harry Kane':      'https://r2.thesportsdb.com/images/media/player/cutout/j4ouvd1756408895.png',
  'Gavi':            'https://r2.thesportsdb.com/images/media/player/cutout/amm91q1726510077.png',
}

export const PSA_GRADE_LABELS = {
  10: 'GEM-MT', 9: 'MINT', 8: 'NM-MT', 7: 'NM',
  6: 'EX-MT',  5: 'EX',   4: 'VG-EX', 3: 'VG', 2: 'GOOD', 1: 'PR',
}

export const PACK_TYPES = [
  {
    id: 'base',
    name: 'Base Pack',
    price: 10,
    cardCount: 5,
    icon: '📦',
    color: '#6b7280',
    gradient: 'linear-gradient(135deg, #374151, #1f2937)',
    description: '5 cards · Mostly Base & Parallel',
    weights: [1600, 300, 60, 24, 6, 4, 40, 1],
  },
  {
    id: 'premium',
    name: 'Premium Pack',
    price: 25,
    cardCount: 5,
    icon: '⭐',
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #1d4ed8, #1e3a8a)',
    description: '5 cards · Better Net to Net+ odds',
    weights: [1400, 440, 110, 30, 10, 6, 42, 1],
  },
  {
    id: 'hobby',
    name: 'Hobby Box',
    price: 1000,
    cardCount: 50,
    icon: '📫',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
    description: '10 packs · 50 cards · Guaranteed Net to Net+',
    // RARITIES order: Base, Parallel, Net to Net, Downtown, Signature, Kaboom, Numbered, Patch Jersey
    weights: [1200, 600, 160, 30, 6, 4, 40, 1],
    guarantee: 'Net to Net',
  },
  {
    id: 'premium_box',
    name: 'Premium Box',
    price: 10000,
    cardCount: 50,
    icon: '🏆',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #d97706, #92400e)',
    description: '10 packs · 50 cards · Guaranteed Downtown+',
    weights: [1000, 700, 200, 80, 12, 6, 42, 1],
    guarantee: 'Downtown',
  },
  {
    id: 'numbered_box',
    name: 'Numbered Box',
    price: 50000,
    cardCount: 25,
    icon: '#️⃣',
    color: '#22d3ee',
    gradient: 'linear-gradient(135deg, #0e7490, #164e63)',
    description: '5 packs · 25 cards · All Numbered · Best 1-of-1 odds in the game',
    forceRarity: 'Numbered',
    oneOfOneChance: 0.01,
  },
  {
    id: 'sapphire_box',
    name: 'Sapphire Box',
    price: 800000,
    cardCount: 25,
    icon: '💎',
    color: '#38bdf8',
    gradient: 'linear-gradient(135deg, #0369a1, #0c4a6e)',
    description: '5 packs · 25 cards · 10 Guaranteed Sapphires · Patch Jersey & Numbered',
    // RARITIES order: Base, Parallel, Net to Net, Downtown, Signature, Kaboom, Numbered, Patch Jersey, Sapphire
    // Weights apply to the 15 non-guaranteed slots only; Kaboom excluded
    weights: [0, 0, 0, 0, 0, 0, 40, 60, 0],
    guarantee: 'Sapphire',
    guaranteeCount: 10,
  },
]

export function generatePackCards(packType) {
  // RARITIES.slice(0,-1) = Base…Sapphire (9 items); packs with 8-entry weights never reach Sapphire
  const rarityList = RARITIES.slice(0, -1)
  const cards = []

  if (packType.forceRarity) {
    for (let i = 0; i < packType.cardCount; i++) {
      cards.push(generateCard({ forceRarity: packType.forceRarity, oneOfOneChance: packType.oneOfOneChance }))
    }
    return cards
  }

  if (packType.guarantee === 'Sapphire') {
    const count = packType.guaranteeCount || 1
    for (let i = 0; i < count; i++) {
      cards.push(generateCard({ forceRarity: 'Sapphire' }))
    }
    for (let i = count; i < packType.cardCount; i++) {
      const rarity = pickWeighted(rarityList, packType.weights.slice(0, rarityList.length))
      cards.push(generateCard({ rarityBias: rarity }))
    }
    return cards
  }

  for (let i = 0; i < packType.cardCount; i++) {
    const rarity = pickWeighted(rarityList, packType.weights.slice(0, rarityList.length))
    const card = generateCard({ rarityBias: rarity })
    cards.push(card)
  }
  if (packType.guarantee) {
    const level = RARITY_ORDER[packType.guarantee]
    const hasGuarantee = cards.some(c => (RARITY_ORDER[c.rarity] ?? 0) >= level)
    if (!hasGuarantee) {
      const idx = randInt(0, cards.length - 1)
      cards[idx] = generateCard({ rarityBias: packType.guarantee })
    }
  }
  return cards
}

// Generate a card show (15 cards with show prices)
const SHOW_RARITIES = [
  'Downtown', 'Downtown Purple', 'Downtown Red',
  'Kaboom', 'Kaboom Blue', 'Kaboom Purple',
  'Signature', 'Signature Black', 'Signature Blue',
  'Numbered', 'Numbered Red', 'Numbered Blue',
  'Patch Jersey', 'Patch Jersey Blue', 'Patch Jersey Gold',
  'Sapphire', 'Ruby', 'Emerald',
  'One of One',
]

export function generateCardShow() {
  const cards = []
  let attempts = 0
  while (cards.length < 15 && attempts < 300) {
    attempts++
    const card = generateCard({ forShow: true })
    if (!SHOW_RARITIES.includes(card.rarity)) continue
    const priceRatio = rand(0.55, 1.35)
    const showPrice = Math.max(1, Math.round(card.currentValue * priceRatio * 100) / 100)
    cards.push({ ...card, showPrice, priceRatio })
  }
  return cards
}
