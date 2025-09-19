'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createSupabaseClient } from '../../../lib/supabase'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('Processando autenticazione...')
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    // Set current URL for debugging (client-side only)
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href)
    }

    // Safety timeout - redirect after 30 seconds if still stuck
    const safetyTimeout = setTimeout(() => {
      console.log('OAuth callback timeout - redirecting to sign-in')
      setStatus('Timeout - reindirizzamento...')
      router.push('/auth/sign-in?error=' + encodeURIComponent('Timeout durante l\'autenticazione'))
    }, 30000)

    const handleAuthCallback = async () => {
      try {
        console.log('OAuth callback started')
        setStatus('Verificando credenziali...')
        
        const supabase = createSupabaseClient()
        
        // Get the code from URL params
        const code = searchParams.get('code')
        const error = searchParams.get('error')
        
        if (error) {
          console.error('OAuth error from URL:', error)
          setStatus('Errore di autenticazione')
          setTimeout(() => {
            router.push('/auth/sign-in?error=' + encodeURIComponent(error))
          }, 1000)
          return
        }

        if (code) {
          console.log('Found OAuth code, exchanging for session...')
          setStatus('Completando l\'accesso...')
          
          // Use getUser to handle the OAuth callback properly with PKCE
          let data, exchangeError
          try {
            // First, let Supabase handle the OAuth callback
            const result = await supabase.auth.getUser()
            data = { session: result.data }
            exchangeError = result.error
            
            if (!result.data.user) {
              // If no user found, try exchangeCodeForSession
              const sessionResult = await supabase.auth.exchangeCodeForSession(code)
              data = sessionResult.data
              exchangeError = sessionResult.error
            }
          } catch (methodError: any) {
            console.log('Trying getSession as fallback...')
            // Final fallback
            const result = await supabase.auth.getSession()
            data = result.data
            exchangeError = result.error
          }
          
          if (exchangeError) {
            console.error('Error exchanging code for session:', exchangeError)
            setStatus('Errore durante l\'accesso')
            setTimeout(() => {
              router.push('/auth/sign-in?error=' + encodeURIComponent(exchangeError.message))
            }, 1000)
            return
          }
          
          if (data.session) {
            console.log('Session established successfully')
            setStatus('Accesso completato! Reindirizzamento...')
            clearTimeout(safetyTimeout)
            
            // Wait a moment for the session to propagate
            setTimeout(() => {
              router.push('/dashboard')
            }, 500)
            return
          }
        }
        
        // Fallback: try getting current session
        console.log('No code found, checking current session...')
        setStatus('Verificando sessione...')
        
        const { data, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Error getting session:', sessionError)
          setStatus('Errore di sessione')
          setTimeout(() => {
            router.push('/auth/sign-in?error=' + encodeURIComponent(sessionError.message))
          }, 1000)
          return
        }

        if (data.session) {
          console.log('Found existing session')
          setStatus('Accesso trovato! Reindirizzamento...')
          clearTimeout(safetyTimeout)
          setTimeout(() => {
            router.push('/dashboard')
          }, 500)
        } else {
          console.log('No session found')
          setStatus('Nessuna sessione trovata')
          clearTimeout(safetyTimeout)
          setTimeout(() => {
            router.push('/auth/sign-in')
          }, 1000)
        }
      } catch (error: any) {
        console.error('Unexpected error during OAuth callback:', error)
        setStatus('Errore imprevisto')
        clearTimeout(safetyTimeout)
        setTimeout(() => {
          router.push('/auth/sign-in?error=' + encodeURIComponent('Si è verificato un errore durante l\'autenticazione'))
        }, 1000)
      }
    }

    handleAuthCallback()
    
    // Cleanup function
    return () => {
      clearTimeout(safetyTimeout)
    }
  }, [router, searchParams])

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
        
        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs">
            <p><strong>URL:</strong> {currentUrl}</p>
            <p><strong>Code:</strong> {searchParams.get('code') ? 'Present' : 'Not found'}</p>
            <p><strong>Error:</strong> {searchParams.get('error') || 'None'}</p>
          </div>
        )}
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