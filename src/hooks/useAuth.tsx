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
        const { data: { session }, error } = await supabase.auth.getSession()
        console.log('Session received:', !!session?.user, 'Error:', error)
        
        if (error) {
          console.error('Error getting session:', error)
          setLoading(false)
          return
        }
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          console.log('Fetching profile for user:', session.user.id)
          try {
            await fetchProfile(session.user.id)
          } catch (err) {
            console.error('fetchProfile error in init:', err)
          }
        } else {
          console.log('No session found - user needs to login')
        }
        console.log('Session initialization complete')
        setLoading(false)
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
            try {
              await fetchProfile(session.user.id)
            } catch (err) {
              console.error('fetchProfile error in auth listener:', err)
            } finally {
              setLoading(false)
            }
          } else {
            setProfile(null)
            setLoading(false)
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
    console.log('Fetching profile for user:', userId)
    
    // Create a basic profile immediately as fallback to prevent UI blocking
    const basicProfile = {
      id: userId,
      email: user?.email || '',
      first_name: null,
      last_name: null,
      username: null,
      avatar_url: null,
      role: 'creator' as const,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    // Set basic profile first so UI is not blocked
    setProfile(basicProfile)
    console.log('Basic profile set, UI ready')
    
    // Try to fetch real profile from database in background (non-critical)
    try {
      console.log('Attempting background fetch from database...')
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.log('Database fetch error (non-critical):', error.message)
        return // Keep using basic profile
      }

      if (data) {
        console.log('Profile loaded from database, updating UI:', data)
        setProfile(data) // Upgrade to real profile
      } else {
        console.log('No profile in database, attempting to create...')
        // Try to create profile (non-critical)
        const { data: createdProfile } = await supabase
          .from('profiles')
          .insert([{
            id: userId,
            email: user?.email || '',
            first_name: null,
            last_name: null,
            username: null,
            avatar_url: null,
            role: 'creator' as const,
            is_active: true
          }])
          .select()
          .single()
        
        if (createdProfile) {
          console.log('Profile created successfully:', createdProfile)
          setProfile(createdProfile)
        }
      }
    } catch (error: any) {
      console.log('Non-critical background error:', error?.message || error)
      // Keep using basic profile - no action needed
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
    console.log('useAuth: Signing in user with email:', email)
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('useAuth: Sign in error:', error)
      setLoading(false)
      return { error }
    }

    if (data.user && data.session) {
      console.log('useAuth: Sign in successful, user:', data.user.id)
      // Set user and session immediately after successful login
      setUser(data.user)
      setSession(data.session)
      
      // Fetch profile (but don't wait for it)
      fetchProfile(data.user.id).catch(err => {
        console.error('useAuth: Profile fetch error:', err)
      })
      
      setLoading(false)
      return { error: null }
    }

    setLoading(false)
    return { error: { message: 'Login failed - no user data received' } }
  }

  const signOut = async () => {
    // Don't set loading to true during signout to avoid UI blocking
    try {
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
      setProfile(null)
      // Navigate immediately without waiting
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
      // Even if signout fails, clear local state and redirect
      setUser(null)
      setSession(null)
      setProfile(null)
      router.push('/')
    }
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