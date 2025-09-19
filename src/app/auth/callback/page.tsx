'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createSupabaseClient } from '../../../lib/supabase'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('Accesso in corso...')

  useEffect(() => {

    // Safety timeout - redirect after 5 seconds if still stuck (emergency fallback only)
    const safetyTimeout = setTimeout(() => {
      console.log('OAuth callback timeout - redirecting to sign-in')
      setStatus('Timeout - reindirizzamento...')
      router.push('/auth/sign-in?error=' + encodeURIComponent('Timeout durante l\'autenticazione'))
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
            router.push('/auth/sign-in?error=' + encodeURIComponent(error))
          }, 1000)
          return
        }

        if (code) {
          console.log('Found OAuth code, exchanging for session...')
          setStatus('Quasi fatto...')
          
          // Direct exchange approach for better performance
          let data, exchangeError
          try {
            console.log('Exchanging code for session...')
            const sessionResult = await supabase.auth.exchangeCodeForSession(code)
            console.log('exchangeCodeForSession result:', sessionResult)
            data = sessionResult.data
            exchangeError = sessionResult.error
          } catch (methodError: any) {
            console.log('Exchange failed, trying getSession fallback...', methodError)
            const result = await supabase.auth.getSession()
            console.log('getSession fallback result:', result)
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
            setStatus('Accesso completato!')
            clearTimeout(safetyTimeout)
            
            // Immediate redirect for better performance
            router.push('/dashboard')
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
          router.push('/dashboard')
        } else {
          console.log('No session found')
          setStatus('Nessuna sessione trovata')
          clearTimeout(safetyTimeout)
          router.push('/auth/sign-in')
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
        
        {/* Debug info for production only */}
        {process.env.NODE_ENV === 'production' && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs max-w-md mx-auto">
            <p><strong>URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Loading...'}</p>
            <p><strong>Code:</strong> {searchParams.get('code') ? 'Present' : 'Not found'}</p>
            <p><strong>Error:</strong> {searchParams.get('error') || 'None'}</p>
            <p><strong>Status:</strong> {status}</p>
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