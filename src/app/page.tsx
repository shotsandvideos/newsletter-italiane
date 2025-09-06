'use client'

import { useAuth } from '../hooks/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { Mail, TrendingUp, Euro, Users } from 'lucide-react'
import { createSupabaseClient } from '../lib/supabase'

function HomePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [googleLoading, setGoogleLoading] = useState(false)

  // Handle email confirmation callback
  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const code = searchParams.get('code')
      if (code) {
        try {
          const supabase = createSupabaseClient()
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          
          if (error) {
            console.error('Error confirming email:', error)
            router.push('/auth/sign-in?error=' + encodeURIComponent('Errore durante la conferma email'))
          } else {
            // Email confirmed successfully, user will be redirected to dashboard by the next useEffect
            router.push('/dashboard')
          }
        } catch (error) {
          console.error('Error during email confirmation:', error)
          router.push('/auth/sign-in?error=' + encodeURIComponent('Errore durante la conferma email'))
        }
      }
    }

    handleEmailConfirmation()
  }, [searchParams, router])

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard')
    }
  }, [authLoading, user, router])

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    
    try {
      const supabase = createSupabaseClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        console.error('Google Sign-In Error:', error)
        setGoogleLoading(false)
      }
      // Se non c'è errore, l'utente verrà reindirizzato a Google
    } catch (error: any) {
      console.error('Google Sign-In Error:', error)
      setGoogleLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show sign-in page if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-2xl font-bold text-gray-900">Newsletter Italiane</h1>
              <div className="flex items-center space-x-4">
                <Link href="/onboarding" className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                  Prima volta? Registra la tua Newsletter
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Welcome content */}
              <div className="text-center lg:text-left">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Benvenuto in <span className="text-blue-600">Newsletter Italiane</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  La piattaforma italiana che connette autori di newsletter con brand per sponsorizzazioni trasparenti e misurabili.
                </p>
                
                {/* Quick stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-blue-600 mb-1">50+</div>
                    <div className="text-sm text-gray-600">Newsletter</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-blue-600 mb-1">€150</div>
                    <div className="text-sm text-gray-600">Prezzo medio</div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">
                      <Mail className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-gray-700">Monetizza la tua newsletter</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-gray-700">Connetti con brand italiani</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">
                      <Euro className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-gray-700">Pagamenti garantiti</span>
                  </div>
                </div>
              </div>

              {/* Right side - Sign In Form */}
              <div className="flex justify-center">
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Accedi alla Piattaforma</h2>
                    <p className="text-gray-600 mb-6">Gestisci le tue newsletter e collaborazioni</p>
                    <div className="space-y-4">
                      <button
                        onClick={handleGoogleSignIn}
                        disabled={googleLoading}
                        className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center disabled:opacity-50"
                      >
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        {googleLoading ? 'Connessione...' : 'Continua con Google'}
                      </button>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">oppure</span>
                        </div>
                      </div>
                      <Link href="/auth/sign-in" className="w-full bg-emerald-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors block text-center">
                        Accedi con Email
                      </Link>
                      <Link href="/auth/sign-up" className="w-full border border-emerald-600 text-emerald-600 px-4 py-3 rounded-lg font-medium hover:bg-emerald-50 transition-colors block text-center">
                        Registrati
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">
                © 2025 Newsletter Italiane. Tutti i diritti riservati.
              </p>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  // This should not be reached due to redirect, but just in case
  return null
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <HomePage />
    </Suspense>
  )
}
