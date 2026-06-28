import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, authSignUp, authSignIn, authSignOut } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Batch user + loading=true so App never sees user=set with authLoading=false before profile loads
        setUser(session.user)
        setLoading(true)
        fetchProfile(session.user.id)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        // Both run synchronously before the first await → React 18 batches into one render
        setUser(session.user)
        setLoading(true)
        await fetchProfile(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(data)
    setLoading(false)
  }

  async function signUp(email, password, username) {
    const data = await authSignUp(email, password, username)
    return data
  }

  async function signIn(email, password) {
    const data = await authSignIn(email, password)
    return data
  }

  async function signOut() {
    await authSignOut()
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
