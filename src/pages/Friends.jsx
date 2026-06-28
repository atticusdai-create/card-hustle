import { useState, useEffect } from 'react'
import { Users, UserPlus, Search, Check, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  searchProfiles, getFriendships, sendFriendRequest, respondFriendRequest,
} from '../lib/supabase'

function getOtherProfile(friendship, myId) {
  return friendship.sender_id === myId ? friendship.receiver : friendship.sender
}

export default function Friends() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [searchQ, setSearchQ] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [friendships, setFriendships] = useState([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [actioning, setActioning] = useState(new Set())
  const [errorMsg, setErrorMsg] = useState('')

  const friends   = friendships.filter(f => f.status === 'accepted')
  const incoming  = friendships.filter(f => f.status === 'pending' && f.receiver_id === user?.id)
  const sentReqs  = friendships.filter(f => f.status === 'pending' && f.sender_id   === user?.id)

  useEffect(() => { refresh() }, [])

  async function refresh() {
    setLoading(true)
    try {
      setFriendships(await getFriendships())
    } catch { /* offline */ } finally {
      setLoading(false)
    }
  }

  async function handleSearch(e) {
    e.preventDefault()
    if (!searchQ.trim()) return
    setSearching(true)
    setErrorMsg('')
    try {
      const res = await searchProfiles(searchQ)
      setSearchResults(res.filter(p => p.id !== user?.id))
    } catch {
      setErrorMsg('Search failed')
    } finally {
      setSearching(false)
    }
  }

  function existingRelation(profileId) {
    return friendships.find(f => f.sender_id === profileId || f.receiver_id === profileId)
  }

  async function handleSend(toId) {
    setActioning(s => new Set(s).add(toId))
    setErrorMsg('')
    try {
      await sendFriendRequest(toId)
      setSearchResults([])
      setSearchQ('')
      await refresh()
    } catch (e) {
      setErrorMsg(e.message || 'Failed to send request')
    } finally {
      setActioning(s => { const n = new Set(s); n.delete(toId); return n })
    }
  }

  async function handleRespond(friendshipId, status) {
    setActioning(s => new Set(s).add(friendshipId))
    try {
      await respondFriendRequest(friendshipId, status)
      await refresh()
    } catch { /* ignore */ } finally {
      setActioning(s => { const n = new Set(s); n.delete(friendshipId); return n })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="bg-slate-800 rounded-2xl p-4 flex flex-col gap-3">
        <h2 className="text-white font-bold text-base flex items-center gap-2">
          <UserPlus size={16} className="text-amber-400" />
          Add Friends
        </h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by username…"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              className="w-full bg-slate-900 text-white text-sm rounded-xl pl-8 pr-3 py-2.5 border border-slate-700 outline-none placeholder-slate-500 focus:border-amber-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={searching || !searchQ.trim()}
            className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-bold rounded-xl px-4 py-2 text-sm transition-colors"
          >
            {searching ? '…' : 'Search'}
          </button>
        </form>

        {errorMsg && (
          <p className="text-red-400 text-xs">{errorMsg}</p>
        )}

        {searchResults.length > 0 && (
          <div className="flex flex-col gap-2 mt-1">
            {searchResults.map(p => {
              const rel = existingRelation(p.id)
              return (
                <div key={p.id} className="flex items-center justify-between bg-slate-900 rounded-xl px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 text-sm font-bold">
                      {p.username[0].toUpperCase()}
                    </div>
                    <span className="text-white font-medium text-sm">{p.username}</span>
                  </div>
                  {rel ? (
                    <span className="text-slate-400 text-xs">
                      {rel.status === 'accepted' ? 'Friends' : 'Request sent'}
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSend(p.id)}
                      disabled={actioning.has(p.id)}
                      className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-400 text-xs font-semibold rounded-lg px-3 py-1.5 disabled:opacity-40 transition-colors"
                    >
                      {actioning.has(p.id) ? '…' : 'Add Friend'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Incoming requests */}
      {incoming.length > 0 && (
        <div className="bg-slate-800 rounded-2xl p-4 flex flex-col gap-3">
          <h2 className="text-white font-bold text-base">
            Friend Requests
            <span className="ml-2 bg-amber-500 text-black text-[10px] font-black rounded-full px-1.5 py-0.5">{incoming.length}</span>
          </h2>
          {incoming.map(f => {
            const p = f.sender
            return (
              <div key={f.id} className="flex items-center justify-between bg-slate-900 rounded-xl px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-sm font-bold">
                    {p?.username?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <span className="text-white font-medium text-sm">{p?.username}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRespond(f.id, 'accepted')}
                    disabled={actioning.has(f.id)}
                    className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 text-xs font-semibold rounded-lg px-3 py-1.5 disabled:opacity-40 transition-colors flex items-center gap-1"
                  >
                    <Check size={12} />
                    Accept
                  </button>
                  <button
                    onClick={() => handleRespond(f.id, 'declined')}
                    disabled={actioning.has(f.id)}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 disabled:opacity-40 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Friends list */}
      <div className="bg-slate-800 rounded-2xl p-4 flex flex-col gap-3">
        <h2 className="text-white font-bold text-base flex items-center gap-2">
          <Users size={16} className="text-amber-400" />
          Friends
          <span className="text-slate-500 font-normal text-sm">{friends.length}</span>
        </h2>

        {loading ? (
          <p className="text-slate-500 text-sm text-center py-4">Loading…</p>
        ) : friends.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-6">
            No friends yet. Search for players above!
          </p>
        ) : (
          friends.map(f => {
            const p = getOtherProfile(f, user?.id)
            return (
              <div key={f.id} className="flex items-center justify-between bg-slate-900 rounded-xl px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 font-black text-base">
                    {p?.username?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <span className="text-white font-semibold text-sm">{p?.username}</span>
                </div>
                <button
                  onClick={() => navigate('/trade', { state: { friendId: p?.id } })}
                  className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-400 text-xs font-semibold rounded-lg px-3 py-1.5 transition-colors"
                >
                  Trade
                </button>
              </div>
            )
          })
        )}
      </div>

      {/* Sent requests */}
      {sentReqs.length > 0 && (
        <div className="bg-slate-800 rounded-2xl p-4 flex flex-col gap-3">
          <h2 className="text-white font-bold text-sm text-slate-400">Pending Sent</h2>
          {sentReqs.map(f => {
            const p = f.receiver
            return (
              <div key={f.id} className="flex items-center gap-2 bg-slate-900 rounded-xl px-3 py-2.5">
                <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-slate-300 text-sm font-bold">
                  {p?.username?.[0]?.toUpperCase() ?? '?'}
                </div>
                <span className="text-slate-300 text-sm">{p?.username}</span>
                <span className="ml-auto text-slate-500 text-xs">Pending…</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
