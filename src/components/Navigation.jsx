import { Store, ShoppingBag, Award, LayoutGrid, Package, Users, ArrowLeftRight } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

const GAME_TABS = [
  { id: 'shop',       label: 'Shop',    Icon: Store },
  { id: 'shows',      label: 'Shows',   Icon: ShoppingBag },
  { id: 'packs',      label: 'Packs',   Icon: Package },
  { id: 'grading',    label: 'PSA',     Icon: Award },
  { id: 'collection', label: 'Collect', Icon: LayoutGrid },
]

const ROUTE_TABS = [
  { path: '/friends', label: 'Friends', Icon: Users },
  { path: '/trade',   label: 'Trade',   Icon: ArrowLeftRight },
]

export default function Navigation({ activeTab, onTabChange, gradingCount, pendingTradeCount = 0 }) {
  const navigate  = useNavigate()
  const location  = useLocation()
  const isHome    = location.pathname === '/'

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-700 safe-area-inset-bottom">
      <div className="flex">
        {GAME_TABS.map(({ id, label, Icon }) => {
          const active = isHome && activeTab === id
          return (
            <button
              key={id}
              onClick={() => {
                if (!isHome) navigate('/')
                onTabChange(id)
              }}
              className={`flex-1 flex flex-col items-center justify-center py-2 pt-2.5 gap-0.5 transition-colors relative
                ${active ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <div className="relative">
                <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
                {id === 'grading' && gradingCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-black text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {gradingCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${active ? 'text-amber-400' : ''}`}>
                {label}
              </span>
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>
          )
        })}

        {ROUTE_TABS.map(({ path, label, Icon }) => {
          const active = location.pathname === path
          const badgeCount = path === '/trade' ? pendingTradeCount : 0
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex-1 flex flex-col items-center justify-center py-2 pt-2.5 gap-0.5 transition-colors relative
                ${active ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <div className="relative">
                <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
                {badgeCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {badgeCount > 9 ? '9+' : badgeCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${active ? 'text-amber-400' : ''}`}>
                {label}
              </span>
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
