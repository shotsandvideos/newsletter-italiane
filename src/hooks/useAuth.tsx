'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthError, Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '../lib/supabase'

interface Profile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  username: string | null
  avatar_url: string | null
  role: 'creator' | 'admin'
  is_active: boolean
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, userData?: { firstName?: string, lastName?: string }) => Promise<{ error?: AuthError }>
  signIn: (email: string, password: string) => Promise<{ error?: AuthError }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error?: any }>
  updatePassword: (newPassword: string) => Promise<{ error?: AuthError }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    // Timeout fallback to prevent infinite loading
    const timeout = setTimeout(() => {
      console.log('Auth loading timeout - forcing completion')
      setLoading(false)
    }, 5000) // 5 second timeout

    // Get initial session
    const getSession = async () => {
      try {
        console.log('Getting session...')
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Session received:', !!session?.user)
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          console.log('Fetching profile...')
          await fetchProfile(session.user.id)
        }
        console.log('Session initialization complete')
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        clearTimeout(timeout)
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          console.log('Auth state change:', event, !!session?.user)
          setSession(session)
          setUser(session?.user ?? null)
          
          if (session?.user) {
            await fetchProfile(session.user.id)
          } else {
            setProfile(null)
          }
          
          if (event === 'SIGNED_OUT') {
            router.push('/')
          }
        } catch (error) {
          console.error('Error in auth state change:', error)
        } finally {
          setLoading(false)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [supabase.auth, router])

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        // Don't block auth even if profile fails to load
        setProfile(null)
        return
      }

      if (data) {
        console.log('Profile loaded:', data)
        setProfile(data)
      } else {
        console.log('No profile data found')
        setProfile(null)
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error)
      // Don't block auth even if profile fails to load
      setProfile(null)
    }
    console.log('fetchProfile completed')
  }

  const signUp = async (email: string, password: string, userData?: { firstName?: string, lastName?: string }) => {
    setLoading(true)
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData?.firstName,
          last_name: userData?.lastName,
          role: 'creator'
        }
      }
    })

    if (error) {
      setLoading(false)
      return { error }
    }

    // Create profile record
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email: data.user.email!,
            first_name: userData?.firstName || null,
            last_name: userData?.lastName || null,
            role: 'creator',
            is_active: true
          }
        ])

      if (profileError) {
        console.error('Error creating profile:', profileError)
      }
    }

    setLoading(false)
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    setLoading(false)
    return { error }
  }

  const signOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setProfile(null)
    setLoading(false)
    router.push('/')
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'No user found' }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)

    if (!error && profile) {
      setProfile({ ...profile, ...updates })
    }

    return { error }
  }

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    return { error }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    updatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}