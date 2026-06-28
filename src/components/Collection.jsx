import { useState } from 'react'
import { LayoutGrid, Store, Award, Search, X, Zap, Check } from 'lucide-react'
import CardDisplay from './CardDisplay'
import PSASlabCard from './PSASlabCard'
import { SPORTS, SPORT_EMOJIS } from '../lib/gameData'

const GRADING_COST = 80

function fmt(n) {
  if (n < 1) return Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

export default function Collection({ collectionCards, money, onMoveToShop, onSendToGrading }) {
  const [sportFilter, setSportFilter] = useState('All')
  const [sortBy, setSortBy] = useState('value')
  const [pricingCard, setPricingCard] = useState(null) // cardId
  const [priceInput, setPriceInput] = useState('')
  const [listError, setListError] = useState('')
  const [search, setSearch] = useState('')
  const [psaFilter, setPsaFilter] = useState('All') // 'All' | 'Ungraded' | '1'–'10'
  const [quickListMode, setQuickListMode] = useState(false)
  const [selectedCardIds, setSelectedCardIds] = useState(new Set())
  const [quickListPrice, setQuickListPrice] = useState('')
  const [quickListError, setQuickListError] = useState('')

  function enterQuickList() {
    setQuickListMode(true)
    setSelectedCardIds(new Set())
    setQuickListPrice('')
    setQuickListError('')
    setPricingCard(null)
  }

  function exitQuickList() {
    setQuickListMode(false)
    setSelectedCardIds(new Set())
    setQuickListPrice('')
    setQuickListError('')
  }

  function toggleCardSelection(cardId) {
    setSelectedCardIds(prev => {
      const next = new Set(prev)
      if (next.has(cardId)) next.delete(cardId)
      else next.add(cardId)
      return next
    })
    setQuickListError('')
  }

  function handleListAll() {
    const selectedCards = collectionCards.filter(c => selectedCardIds.has(c.id))
    if (selectedCards.length === 0) {
      setQuickListError('Select at least one card')
      return
    }
    const price = parseFloat(quickListPrice)
    if (isNaN(price) || price <= 0) {
      setQuickListError('Enter a valid price')
      return
    }
    // Find the card whose max price is the tightest constraint
    const blocking = selectedCards.find(c => price > c.currentValue + 50)
    if (blocking) {
      const minMax = Math.min(...selectedCards.map(c => c.currentValue + 50))
      setQuickListError(`Price too high — max is $${Math.round(minMax)} for the cheapest selected card`)
      return
    }
    selectedCards.forEach(c => onMoveToShop(c.id, Math.round(price * 100) / 100))
    exitQuickList()
  }

  const totalValue = collectionCards.reduce((s, c) => s + c.currentValue, 0)

  let filtered = sportFilter === 'All'
    ? collectionCards
    : collectionCards.filter(c => c.sport === sportFilter)

  if (search.trim()) {
    const q = search.trim().toLowerCase()
    filtered = filtered.filter(c => c.playerName?.toLowerCase().includes(q))
  }

  if (psaFilter === 'Ungraded') {
    filtered = filtered.filter(c => !c.psaGrade)
  } else if (psaFilter !== 'All') {
    filtered = filtered.filter(c => c.psaGrade === Number(psaFilter))
  }

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'value') return b.currentValue - a.currentValue
    if (sortBy === 'rarity') {
      const order = { 'Base': 0, 'Parallel': 1, 'Net to Net': 2, 'Downtown': 3, 'Signature': 4, 'Kaboom': 5, 'Numbered': 6, 'Patch Jersey': 7, 'Sapphire': 8 }
      return (order[b.rarity] ?? 0) - (order[a.rarity] ?? 0)
    }
    if (sortBy === 'year') return b.year - a.year
    return a.playerName.localeCompare(b.playerName)
  })

  function handleListInShop(card) {
    if (pricingCard === card.id) {
      const price = parseFloat(priceInput)
      if (!isNaN(price) && price > 0) {
        const maxPrice = card.currentValue + 50
        if (price > maxPrice) {
          setListError(`Max listing price is $${Math.round(maxPrice)} (value + $50)`)
          return
        }
        onMoveToShop(card.id, Math.round(price * 100) / 100)
        setPricingCard(null)
        setPriceInput('')
        setListError('')
      }
    } else {
      setPricingCard(card.id)
      setPriceInput(Math.round(card.currentValue * 1.15).toString())
      setListError('')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Summary */}
      <div className="bg-slate-800 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-slate-400 text-xs">Cards in Collection</p>
            <p className="text-white font-bold text-2xl">{collectionCards.length}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-slate-400 text-xs">Total Value</p>
              <p className="text-amber-400 font-bold text-2xl">{fmt(totalValue)}</p>
            </div>
            {collectionCards.length > 0 && (
              <button
                onClick={quickListMode ? exitQuickList : enterQuickList}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                  quickListMode
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30'
                }`}
              >
                <Zap size={13} />
                {quickListMode ? 'Cancel' : 'Quick List'}
              </button>
            )}
          </div>
        </div>
      </div>

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

      {/* Cards */}
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
        <div className={`grid grid-cols-2 gap-3 sm:grid-cols-3 items-start ${quickListMode ? 'pb-36' : ''}`}>
          {filtered.map(card => {
            const isSelected = selectedCardIds.has(card.id)

            if (quickListMode) {
              const cardContent = (
                <button
                  onClick={() => toggleCardSelection(card.id)}
                  className={`w-full text-left relative rounded-xl transition-all ${
                    isSelected ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-slate-900' : 'opacity-70 hover:opacity-90'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 z-10 bg-amber-500 rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                      <Check size={12} className="text-black" strokeWidth={3} />
                    </div>
                  )}
                  {card.psaGrade
                    ? <PSASlabCard card={card} />
                    : <CardDisplay card={card} />}
                </button>
              )
              return <div key={card.id}>{cardContent}</div>
            }

            const actionButtons = (
              <div className="space-y-1.5">
                {pricingCard === card.id ? (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      <div className={`flex-1 flex items-center bg-slate-900 rounded-md border overflow-hidden ${listError ? 'border-red-500' : 'border-amber-500'}`}>
                        <span className="text-amber-500 text-xs pl-1.5">$</span>
                        <input
                          type="number"
                          className="flex-1 bg-transparent text-white text-xs px-1 py-1.5 outline-none w-0"
                          value={priceInput}
                          onChange={e => { setPriceInput(e.target.value); setListError('') }}
                          onKeyDown={e => { if (e.key === 'Enter') handleListInShop(card) }}
                          autoFocus
                        />
                      </div>
                      <button
                        onClick={() => handleListInShop(card)}
                        className="bg-amber-500 text-black text-xs px-2 py-1 rounded-md font-bold"
                      >
                        List
                      </button>
                      <button
                        onClick={() => { setPricingCard(null); setListError('') }}
                        className="bg-slate-700 text-white text-xs px-2 py-1 rounded-md"
                      >
                        ✕
                      </button>
                    </div>
                    {listError && (
                      <p className="text-red-400 text-xs">{listError}</p>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleListInShop(card)}
                    className="w-full flex items-center justify-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs py-1.5 rounded-md transition-colors font-semibold border border-amber-500/30"
                  >
                    <Store size={11} />
                    List in Shop
                  </button>
                )}
                {!card.psaGrade && (
                  <button
                    onClick={() => money >= GRADING_COST ? onSendToGrading(card.id) : null}
                    disabled={money < GRADING_COST}
                    className="w-full flex items-center justify-center gap-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs py-1.5 rounded-md transition-colors border border-blue-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Award size={11} />
                    Grade ($80)
                  </button>
                )}
              </div>
            )

            return card.psaGrade ? (
              <PSASlabCard key={card.id} card={card}>
                {actionButtons}
              </PSASlabCard>
            ) : (
              <CardDisplay key={card.id} card={card}>
                {actionButtons}
              </CardDisplay>
            )
          })}
        </div>
      )}

      {/* Quick List bottom panel */}
      {quickListMode && (
        <div className="fixed bottom-16 left-0 right-0 z-30 px-4 pb-2 max-w-lg mx-auto">
          <div className="bg-slate-800 border border-amber-500/40 rounded-2xl p-4 shadow-2xl shadow-black/60">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-amber-400" />
                <span className="text-white text-sm font-bold">Quick List</span>
              </div>
              <span className="text-amber-400 text-sm font-semibold">
                {selectedCardIds.size} card{selectedCardIds.size !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex gap-2">
              <div className={`flex-1 flex items-center bg-slate-900 rounded-xl border overflow-hidden ${quickListError ? 'border-red-500' : 'border-slate-600 focus-within:border-amber-500'} transition-colors`}>
                <span className="text-amber-500 text-sm pl-3">$</span>
                <input
                  type="number"
                  placeholder="Price for all"
                  className="flex-1 bg-transparent text-white text-sm px-2 py-2.5 outline-none placeholder-slate-500"
                  value={quickListPrice}
                  onChange={e => { setQuickListPrice(e.target.value); setQuickListError('') }}
                  onKeyDown={e => { if (e.key === 'Enter') handleListAll() }}
                />
              </div>
              <button
                onClick={handleListAll}
                disabled={selectedCardIds.size === 0}
                className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-black text-sm font-bold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
              >
                List All
              </button>
            </div>
            {quickListError && (
              <p className="text-red-400 text-xs mt-2">{quickListError}</p>
            )}
            <p className="text-slate-500 text-xs mt-2">Tap cards above to select · Max price = card value + $50</p>
          </div>
        </div>
      )}
    </div>
  )
}
