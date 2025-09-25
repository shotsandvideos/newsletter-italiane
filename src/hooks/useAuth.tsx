'use client'

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { User, AuthError, Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '../lib/supabase'
import { devLog, devError, logger } from '../lib/logger'

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
  const [profileLoaded, setProfileLoaded] = useState(false)
  const router = useRouter()
  
  // Create supabase client once
  const supabase = useMemo(() => createSupabaseClient(), [])

  const fetchProfile = useCallback(async (userId: string, userEmail?: string) => {
    if (profileLoaded) {
      return
    }

    devLog('Fetching profile for user:', userId)
    
    try {
      // Optimized profile query with shorter timeout
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (data) {
        devLog('Profile loaded:', data.role)
        setProfile(data)
        setProfileLoaded(true)
        return
      }

      if (error?.code !== 'PGRST116') {
        logger.warn('Profile fetch error:', error.message)
      }

      // If no profile exists, create a basic one
      devLog('Creating new profile...')
      const newProfile = {
        id: userId,
        email: userEmail || user?.email || '',
        first_name: null,
        last_name: null,
        username: null,
        avatar_url: null,
        role: 'creator' as const,
        is_active: true
      }

      const { data: createdProfile, error: createError } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single()
      
      if (createdProfile) {
        devLog('Profile created successfully')
        setProfile(createdProfile)
      } else {
        logger.warn('Profile creation failed:', createError?.message)
        // Use fallback profile with current timestamp
        setProfile({
          ...newProfile,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      }
      setProfileLoaded(true)
      
    } catch (error: any) {
      logger.error('Profile fetch error:', error.message)
      // Always provide a fallback profile to prevent app breakdown
      const fallbackProfile = {
        id: userId,
        email: userEmail || user?.email || '',
        first_name: null,
        last_name: null,
        username: null,
        avatar_url: null,
        role: 'creator' as const,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      setProfile(fallbackProfile)
      setProfileLoaded(true)
    }
  }, [profileLoaded, supabase, user?.email])

  useEffect(() => {
    let mounted = true
    let subscription: any

    const initializeAuth = async () => {
      try {
        devLog('Initializing auth...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        if (error) {
          logger.error('Session error:', error)
          setLoading(false)
          return
        }
        
        // Set initial state
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          devLog('User found, fetching profile...')
          try {
            await fetchProfile(session.user.id, session.user.email)
          } catch (err) {
            logger.error('Profile fetch failed:', err)
          }
        }
        
        setLoading(false)
        devLog('Auth initialization complete')
      } catch (error) {
        logger.error('Auth initialization error:', error)
        if (mounted) setLoading(false)
      }
    }

    // Set up auth state listener
    subscription = supabase.auth.onAuthStateChange(async (event, session) => {
      devLog('Auth state change:', event, !!session?.user)
      
      if (!mounted) return
      
      setSession(session)
      setUser(session?.user ?? null)
      
      if (event === 'SIGNED_IN' && session?.user) {
        setProfileLoaded(false) // Reset profile state
        try {
          await fetchProfile(session.user.id, session.user.email)
        } catch (err) {
          logger.error('Profile fetch error on sign in:', err)
        }
        setLoading(false)
      } else if (event === 'SIGNED_OUT') {
        setProfile(null)
        setProfileLoaded(false)
        setLoading(false)
        router.push('/')
      } else if (event === 'TOKEN_REFRESHED') {
        // Just update session, don't refetch profile
        setLoading(false)
      } else {
        setLoading(false)
      }
    })

    // Initialize auth
    initializeAuth()
    
    // Cleanup function
    return () => {
      mounted = false
      if (subscription?.subscription) {
        subscription.subscription.unsubscribe()
      }
    }
  }, [supabase, fetchProfile, router])

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
    devLog('Signing in user with email:', email)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        logger.error('Sign in error:', error)
        setLoading(false)
        return { error }
      }

      if (data.user && data.session) {
        devLog('Sign in successful, user:', data.user.id)
        // Auth state change listener will handle profile fetching
        // Don't set loading to false here - let the listener handle it
        return { error: null }
      }

      setLoading(false)
      return { error: { message: 'Login failed - no user data received' } as AuthError }
    } catch (error: any) {
      logger.error('Sign in error:', error)
      setLoading(false)
      return { error: { message: error.message || 'Login failed' } as AuthError }
    }
  }

  const signOut = async () => {
    try {
      devLog('Starting sign out process...')
      
      // Clear local state immediately for better UX
      setUser(null)
      setSession(null)
      setProfile(null)
      setProfileLoaded(false)
      
      // Call Supabase signout - don't wait for it to complete
      const signOutPromise = supabase.auth.signOut()
      
      // Navigate immediately for better UX
      router.push('/')
      
      // Wait for actual signout in background
      const { error } = await signOutPromise
      if (error) {
        console.error('Supabase signout error:', error)
      }
      
    } catch (error) {
      logger.error('Error signing out:', error)
      // Always clear state and redirect even if signout fails
      setUser(null)
      setSession(null)
      setProfile(null)
      setProfileLoaded(false)
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

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    updatePassword
  }), [user, profile, session, loading, signUp, signIn, signOut, updateProfile, updatePassword])

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
