import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (username.trim().length < 3) { setError('Username must be at least 3 characters'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await signUp(email, password, username.trim())
      navigate('/')
    } catch (err) {
      setError(err?.message || err?.error_description || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-slate-900 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/icon.png" alt="Card Hustle" className="mb-3 mx-auto" style={{ width: 40, height: 40 }} />
          <h1 className="text-white text-3xl font-black tracking-tight">Card Hustle</h1>
          <p className="text-slate-400 text-sm mt-1">Create your collector account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl p-6 flex flex-col gap-4">
          {error && (
            <div className="bg-red-900/60 border border-red-700 text-red-200 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-xs font-medium uppercase tracking-wide">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="bg-slate-900 text-white rounded-xl px-4 py-3 border border-slate-700 outline-none focus:border-amber-500 transition-colors placeholder-slate-600"
              placeholder="cardking99"
              minLength={3}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-xs font-medium uppercase tracking-wide">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-slate-900 text-white rounded-xl px-4 py-3 border border-slate-700 outline-none focus:border-amber-500 transition-colors placeholder-slate-600"
              placeholder="you@example.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-xs font-medium uppercase tracking-wide">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="bg-slate-900 text-white rounded-xl px-4 py-3 border border-slate-700 outline-none focus:border-amber-500 transition-colors placeholder-slate-600"
              placeholder="Min. 6 characters"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold rounded-xl py-3 mt-1 transition-colors"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-5">
          Already have one?{' '}
          <Link to="/login" className="text-amber-400 font-medium hover:text-amber-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
