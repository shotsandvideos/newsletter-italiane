'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createSupabaseClient } from '../../../lib/supabase'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('Accesso in corso...')

  const redirectParam = searchParams.get('redirectTo')
  let redirectTarget = '/dashboard'
  if (redirectParam) {
    try {
      redirectTarget = decodeURIComponent(redirectParam)
    } catch {
      redirectTarget = redirectParam
    }
  }

  const handleSuccessfulAuth = async (session: any) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()
      
      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create it for OAuth user
        console.log('Creating profile for OAuth user...')
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert([{
            id: session.user.id,
            email: session.user.email!,
            first_name: session.user.user_metadata?.first_name || null,
            last_name: session.user.user_metadata?.last_name || null,
            avatar_url: session.user.user_metadata?.avatar_url || null,
            role: 'creator',
            is_active: true
          }])
          .select('role')
          .single()
        
        if (newProfile?.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
      } else if (profile?.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    } catch (profileError) {
      console.log('Could not fetch profile, using default redirect', profileError)
      router.push(redirectTarget)
    }
  }

  useEffect(() => {

    // Safety timeout - redirect after 5 seconds if still stuck (emergency fallback only)
    const safetyTimeout = setTimeout(() => {
      console.log('OAuth callback timeout - redirecting to sign-in')
      setStatus('Timeout - reindirizzamento...')
      router.push('/auth/sign-in?error=' + encodeURIComponent('Timeout durante l\'autenticazione') + (redirectParam ? `&redirectTo=${redirectParam}` : ''))
    }, 5000)

    const handleAuthCallback = async () => {
      try {
        console.log('OAuth callback started')
        setStatus('Verifica in corso...')
        
        const supabase = createSupabaseClient()
        console.log('Supabase client created')
        
        // Get the code from URL params
        const code = searchParams.get('code')
        const error = searchParams.get('error')
        console.log('URL params - code:', code ? 'present' : 'missing', 'error:', error)
        
        if (error) {
          console.error('OAuth error from URL:', error)
          setStatus('Errore di autenticazione')
          setTimeout(() => {
            router.push('/auth/sign-in?error=' + encodeURIComponent(error) + (redirectParam ? `&redirectTo=${redirectParam}` : ''))
          }, 1000)
          return
        }

        // For OAuth, let Supabase automatically detect and handle the URL
        // This approach works better with PKCE flow than manual code exchange
        console.log('Letting Supabase auto-detect OAuth callback...')
        setStatus('Elaborazione automatica...')
        
        // Listen for auth state changes first
        const authListener = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state change detected:', event, !!session)
          
          if (event === 'SIGNED_IN' && session) {
            console.log('OAuth authentication successful via state change')
            setStatus('Accesso completato!')
            clearTimeout(safetyTimeout)
            authListener.data.subscription.unsubscribe()
            await handleSuccessfulAuth(session)
            return
          }
          
          if (event === 'SIGNED_OUT') {
            console.log('OAuth authentication failed')
            setStatus('Autenticazione fallita')
            authListener.data.subscription.unsubscribe()
            setTimeout(() => {
              router.push('/auth/sign-in?error=' + encodeURIComponent('Errore durante l\'autenticazione') + (redirectParam ? `&redirectTo=${redirectParam}` : ''))
            }, 1000)
          }
        })

        if (code) {
          console.log('Found OAuth code - waiting for automatic processing...')
          setStatus('Elaborazione in corso...')
          
          // Clean up auth listener after reasonable time
          setTimeout(() => {
            authListener.data.subscription.unsubscribe()
          }, 8000)
          
          return // Let the auth state listener handle everything
        }
        
        // Fallback: try getting current session
        console.log('No code found, checking current session...')
        setStatus('Verificando sessione...')
        
        const { data, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Error getting session:', sessionError)
          setStatus('Errore di sessione')
          setTimeout(() => {
          router.push('/auth/sign-in?error=' + encodeURIComponent(sessionError.message) + (redirectParam ? `&redirectTo=${redirectParam}` : ''))
          }, 1000)
          return
        }

        if (data.session) {
          console.log('Found existing session')
          setStatus('Accesso trovato! Reindirizzamento...')
          clearTimeout(safetyTimeout)
          await handleSuccessfulAuth(data.session)
        } else {
          console.log('No session found')
          setStatus('Nessuna sessione trovata')
          clearTimeout(safetyTimeout)
          router.push('/auth/sign-in' + (redirectParam ? `?redirectTo=${redirectParam}` : ''))
        }
      } catch (error: any) {
        console.error('Unexpected error during OAuth callback:', error)
        setStatus('Errore imprevisto')
        clearTimeout(safetyTimeout)
        setTimeout(() => {
          router.push('/auth/sign-in?error=' + encodeURIComponent('Si è verificato un errore durante l\'autenticazione') + (redirectParam ? `&redirectTo=${redirectParam}` : ''))
        }, 1000)
      }
    }

    handleAuthCallback()
    
    // Cleanup function
    return () => {
      clearTimeout(safetyTimeout)
    }
  }, [redirectParam, redirectTarget, router, searchParams])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
        <h2 className="mt-6 text-center text-xl font-semibold text-gray-900">
          {status}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Attendere prego...
        </p>
        
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
          <h2 className="mt-6 text-center text-xl font-semibold text-gray-900">
            Caricamento...
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Preparazione autenticazione...
          </p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
