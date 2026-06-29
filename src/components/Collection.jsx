import { useState, useMemo, useEffect, memo } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { LayoutGrid, Store, Award, Search, X, Zap, Trash2, Check } from 'lucide-react'
import CardDisplay from './CardDisplay'
import PSASlabCard from './PSASlabCard'
import { SPORTS, SPORT_EMOJIS } from '../lib/gameData'

const GRADING_COST = 80
const RARITY_ORDER = { 'Base': 0, 'Parallel': 1, 'Net to Net': 2, 'Downtown': 3, 'Signature': 4, 'Kaboom': 5, 'Numbered': 6, 'Patch Jersey': 7, 'Sapphire': 8 }

function fmt(n) {
  if (n < 1) return Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

// Memoized card item — only re-renders when this specific card's data changes,
// or when `canAffordGrading` flips (balance crosses $80), preventing the entire
// list from repainting on every filter/sort/search update.
const CollectionCard = memo(function CollectionCard({ card, canAffordGrading, onMoveToShop, onSendToGrading, isSelectionMode, isSelected, onToggleSelect }) {
  const [pricing, setPricing] = useState(false)
  const [priceInput, setPriceInput] = useState('')
  const [listError, setListError] = useState('')

  function handleList() {
    if (pricing) {
      const price = parseFloat(priceInput)
      if (!isNaN(price) && price > 0) {
        const maxPrice = card.currentValue + 50
        if (price > maxPrice) {
          setListError(`Max listing price is $${Math.round(maxPrice)} (value + $50)`)
          return
        }
        onMoveToShop(card.id, Math.round(price * 100) / 100)
        setPricing(false)
        setPriceInput('')
        setListError('')
      }
    } else {
      setPricing(true)
      setPriceInput(Math.round(card.currentValue * 1.15).toString())
      setListError('')
    }
  }

  if (isSelectionMode) {
    const inner = card.psaGrade
      ? <PSASlabCard card={card} />
      : <CardDisplay card={card} />
    return (
      <div
        onClick={() => onToggleSelect(card.id)}
        className={`relative cursor-pointer rounded-xl transition-all select-none ${isSelected ? 'ring-2 ring-amber-400' : 'ring-1 ring-slate-700 opacity-60'}`}
      >
        {inner}
        {isSelected && (
          <div className="absolute inset-0 rounded-xl bg-amber-500/10 pointer-events-none" />
        )}
        <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-lg transition-all z-10 ${isSelected ? 'bg-amber-500 text-black' : 'bg-slate-800 border-2 border-slate-500'}`}>
          {isSelected && <Check size={14} strokeWidth={3} />}
        </div>
      </div>
    )
  }

  const buttons = (
    <div className="space-y-1.5">
      {pricing ? (
        <div className="space-y-1">
          <div className="flex gap-1">
            <div className={`flex-1 flex items-center bg-slate-900 rounded-md border overflow-hidden ${listError ? 'border-red-500' : 'border-amber-500'}`}>
              <span className="text-amber-500 text-xs pl-1.5">$</span>
              <input
                type="number"
                className="flex-1 bg-transparent text-white text-xs px-1 py-1.5 outline-none w-0"
                value={priceInput}
                onChange={e => { setPriceInput(e.target.value); setListError('') }}
                onKeyDown={e => { if (e.key === 'Enter') handleList() }}
                autoFocus
              />
            </div>
            <button onClick={handleList} className="bg-amber-500 text-black text-xs px-2 py-1 rounded-md font-bold">
              List
            </button>
            <button onClick={() => { setPricing(false); setListError('') }} className="bg-slate-700 text-white text-xs px-2 py-1 rounded-md">
              ✕
            </button>
          </div>
          {listError && <p className="text-red-400 text-xs">{listError}</p>}
        </div>
      ) : (
        <button
          onClick={handleList}
          className="w-full flex items-center justify-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs py-1.5 rounded-md transition-colors font-semibold border border-amber-500/30"
        >
          <Store size={11} />
          List in Shop
        </button>
      )}
      {!card.psaGrade && (
        <button
          onClick={() => canAffordGrading ? onSendToGrading(card.id) : null}
          disabled={!canAffordGrading}
          className="w-full flex items-center justify-center gap-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs py-1.5 rounded-md transition-colors border border-blue-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Award size={11} />
          Grade ($80)
        </button>
      )}
    </div>
  )

  return card.psaGrade
    ? <PSASlabCard card={card}>{buttons}</PSASlabCard>
    : <CardDisplay card={card}>{buttons}</CardDisplay>
})


export default function Collection({ collectionCards, money, onMoveToShop, onSendToGrading, onSellAll, scrollRef }) {
  const [sportFilter, setSportFilter] = useState('All')
  const [sortBy, setSortBy] = useState('value')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [psaFilter, setPsaFilter] = useState('All')
  const [quickListMode, setQuickListMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [sellAllConfirm, setSellAllConfirm] = useState(false)
  const [cols, setCols] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 640 ? 3 : 2)

  // 200ms debounce on search to avoid refiltering on every keystroke
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 200)
    return () => clearTimeout(id)
  }, [search])

  // Track responsive column count
  useEffect(() => {
    function update() { setCols(window.innerWidth >= 640 ? 3 : 2) }
    window.addEventListener('resize', update, { passive: true })
    return () => window.removeEventListener('resize', update)
  }, [])

  function enterQuickListMode() {
    setQuickListMode(true)
    setSelectedIds(new Set())
  }

  function exitQuickListMode() {
    setQuickListMode(false)
    setSelectedIds(new Set())
  }

  function toggleCardSelect(id) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleListSelected() {
    collectionCards
      .filter(c => selectedIds.has(c.id))
      .forEach(c => onMoveToShop(c.id, Math.round(c.currentValue * 100) / 100))
    exitQuickListMode()
  }

  const totalValue = useMemo(
    () => collectionCards.reduce((s, c) => s + c.currentValue, 0),
    [collectionCards]
  )

  const canAffordGrading = money >= GRADING_COST

  // Memoize filter + sort so it only recomputes when inputs change, not on every render
  const filtered = useMemo(() => {
    let result = sportFilter === 'All' ? collectionCards : collectionCards.filter(c => c.sport === sportFilter)
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.trim().toLowerCase()
      result = result.filter(c => c.playerName?.toLowerCase().includes(q))
    }
    if (psaFilter === 'Ungraded') result = result.filter(c => !c.psaGrade)
    else if (psaFilter !== 'All') result = result.filter(c => c.psaGrade === Number(psaFilter))
    return [...result].sort((a, b) => {
      if (sortBy === 'value') return b.currentValue - a.currentValue
      if (sortBy === 'rarity') return (RARITY_ORDER[b.rarity] ?? 0) - (RARITY_ORDER[a.rarity] ?? 0)
      if (sortBy === 'year') return b.year - a.year
      return a.playerName.localeCompare(b.playerName)
    })
  }, [collectionCards, sportFilter, debouncedSearch, psaFilter, sortBy])

  // Group cards into rows of `cols` for the virtualizer
  const rows = useMemo(() => {
    const result = []
    for (let i = 0; i < filtered.length; i += cols) {
      result.push(filtered.slice(i, i + cols))
    }
    return result
  }, [filtered, cols])

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef?.current ?? null,
    estimateSize: () => 295,
    overscan: 3,
  })

  const virtualItems = virtualizer.getVirtualItems()

  return (
    <div className="flex flex-col gap-4">
      {/* Summary */}
      <div className="bg-slate-800 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-slate-400 text-xs">Cards in Collection</p>
            <p className="text-white font-bold text-2xl">{collectionCards.length}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-xs">Total Value</p>
            <p className="text-amber-400 font-bold text-2xl">{fmt(totalValue)}</p>
          </div>
        </div>
      </div>

      {/* Quick List + Sell All buttons */}
      {collectionCards.length > 0 && (
        <div className="flex gap-2">
          <button
            onClick={quickListMode ? exitQuickListMode : enterQuickListMode}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-colors ${quickListMode ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-amber-500 hover:bg-amber-400 text-black'}`}
          >
            <Zap size={16} />
            <span>{quickListMode ? 'Cancel' : 'Quick List'}</span>
          </button>
          {!quickListMode && (
            <button
              onClick={() => setSellAllConfirm(true)}
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-bold text-sm transition-colors bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
            >
              <Trash2 size={16} />
              <span>Delete All</span>
            </button>
          )}
          {quickListMode && (
            <button
              onClick={handleListSelected}
              disabled={selectedIds.size === 0}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-colors bg-amber-500 hover:bg-amber-400 text-black disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Store size={16} />
              <span>List Selected{selectedIds.size > 0 ? ` (${selectedIds.size})` : ''}</span>
            </button>
          )}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search players…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-slate-800 text-white text-sm rounded-xl pl-8 pr-8 py-2.5 border border-slate-700 outline-none placeholder-slate-500 focus:border-amber-500 transition-colors"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
            <X size={13} />
          </button>
        )}
      </div>

      {/* Sport + sort filters */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1.5 overflow-x-auto flex-1">
          {['All', ...SPORTS].map(s => (
            <button
              key={s}
              onClick={() => setSportFilter(s)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                ${sportFilter === s
                  ? 'bg-amber-500 text-black'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              {s === 'All' ? 'All' : SPORT_EMOJIS[s]}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="shrink-0 bg-slate-800 text-slate-300 text-xs rounded-lg px-2 py-1.5 border border-slate-700 outline-none"
        >
          <option value="value">By Value</option>
          <option value="rarity">By Rarity</option>
          <option value="year">By Year</option>
          <option value="name">By Name</option>
        </select>
      </div>

      {/* PSA grade filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5">
        {['All', 'Ungraded', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1'].map(g => (
          <button
            key={g}
            onClick={() => setPsaFilter(g)}
            className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition-colors
              ${psaFilter === g
                ? g === 'All' ? 'bg-amber-500 text-black'
                  : g === 'Ungraded' ? 'bg-slate-500 text-white'
                  : Number(g) >= 9 ? 'bg-yellow-400 text-black'
                  : Number(g) >= 7 ? 'bg-blue-500 text-white'
                  : 'bg-slate-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            {g === 'All' ? 'PSA: All' : g === 'Ungraded' ? 'Ungraded' : `PSA ${g}`}
          </button>
        ))}
      </div>

      {/* Cards — virtualized grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <LayoutGrid size={48} className="mx-auto mb-3 opacity-30" />
          {collectionCards.length === 0 ? (
            <>
              <p className="font-semibold">No cards here yet</p>
              <p className="text-sm mt-1">Visit Card Shows to buy your first cards</p>
            </>
          ) : (
            <>
              <p className="font-semibold">No cards match</p>
              <p className="text-sm mt-1">Try a different search or filter</p>
            </>
          )}
        </div>
      ) : (
        <div
          style={{ height: virtualizer.getTotalSize(), position: 'relative' }}
          className=""
        >
          {virtualItems.map(virtualRow => (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${virtualRow.start}px)` }}
            >
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 items-start pb-3">
                {rows[virtualRow.index].map(card => (
                  <CollectionCard
                    key={card.id}
                    card={card}
                    canAffordGrading={canAffordGrading}
                    onMoveToShop={onMoveToShop}
                    onSendToGrading={onSendToGrading}
                    isSelectionMode={quickListMode}
                    isSelected={selectedIds.has(card.id)}
                    onToggleSelect={toggleCardSelect}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sell All confirmation modal */}
      {sellAllConfirm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 px-4 pb-6 sm:pb-0">
          <div className="bg-slate-800 border border-red-500/40 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-white font-bold text-lg mb-1">Delete All Cards?</h2>
            <p className="text-slate-400 text-sm mb-5">
              Permanently delete all <span className="text-white font-semibold">{collectionCards.length} card{collectionCards.length !== 1 ? 's' : ''}</span> from your collection. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setSellAllConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { setSellAllConfirm(false); onSellAll() }}
                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-sm transition-colors"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
