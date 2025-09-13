'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../hooks/useAuth'
import { Mail, Euro, Users } from 'lucide-react'
import { createSupabaseClient } from '../../../lib/supabase'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  
  const { signIn, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await signIn(email, password)
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      // Wait a moment for state to update
      setTimeout(() => {
        router.push('/dashboard')
      }, 100)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError('')
    
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
        setError('Errore durante l\'accesso con Google')
        setGoogleLoading(false)
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error)
      setError('Errore durante l\'accesso con Google')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">Frames</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12" role="main">
        <div className="max-w-6xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left side - Welcome content */}
            <section className="text-center lg:text-left order-2 lg:order-1" aria-labelledby="welcome-heading">
              <h2 id="welcome-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Benvenuto in <span className="text-primary">Frames</span>
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-8">
                La piattaforma italiana che connette autori di newsletter con brand per sponsorizzazioni trasparenti e misurabili.
              </p>
              
              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-4 mb-8" role="group" aria-labelledby="stats-heading">
                <h3 id="stats-heading" className="sr-only">Statistiche piattaforma</h3>
                <div className="text-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-xl sm:text-2xl font-bold text-primary mb-1" aria-label="Oltre 50 newsletter registrate">50+</div>
                  <div className="text-sm text-gray-600">Newsletter</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-xl sm:text-2xl font-bold text-primary mb-1" aria-label="Prezzo medio di 150 euro">€150</div>
                  <div className="text-sm text-gray-600">Prezzo medio</div>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-4 text-left" role="list" aria-labelledby="features-heading">
                <h3 id="features-heading" className="sr-only">Vantaggi della piattaforma</h3>
                <li className="flex items-center gap-3">
                  <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" role="img" aria-hidden="true">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-gray-700">Monetizza la tua newsletter</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" role="img" aria-hidden="true">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-gray-700">Connetti con brand italiani</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" role="img" aria-hidden="true">
                    <Euro className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-gray-700">Pagamenti garantiti</span>
                </li>
              </ul>
            </section>

            {/* Right side - Sign In Form */}
            <section className="flex justify-center order-1 lg:order-2">
              <div className="w-full max-w-md bg-card p-6 sm:p-8 rounded-lg shadow-md border border-border">
                <header className="text-center mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">Accedi alla Piattaforma</h2>
                  <p className="text-gray-600">Gestisci le tue newsletter e collaborazioni</p>
                </header>

                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20" role="alert" aria-live="polite">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <div className="space-y-4 mb-6">
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading || loading}
                    className="w-full bg-card border border-border text-foreground px-4 py-3 rounded-lg font-medium hover:bg-accent transition-colors flex items-center justify-center disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    aria-label="Accedi con Google"
                    type="button"
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {googleLoading ? 'Connessione...' : 'Continua con Google'}
                  </button>

                  <div className="relative" role="separator" aria-label="Oppure accedi con email">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-card text-muted-foreground">oppure</span>
                    </div>
                  </div>
                </div>

                {/* Email/Password Form */}
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email <span className="text-destructive" aria-label="campo obbligatorio">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      aria-required="true"
                      aria-invalid={error ? 'true' : 'false'}
                      className="w-full px-3 py-2.5 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors text-foreground"
                      placeholder="tu@esempio.com"
                      autoComplete="email"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                      Password <span className="text-destructive" aria-label="campo obbligatorio">*</span>
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      aria-required="true"
                      aria-invalid={error ? 'true' : 'false'}
                      className="w-full px-3 py-2.5 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors text-foreground"
                      placeholder="La tua password"
                      autoComplete="current-password"
                      minLength={6}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || googleLoading}
                    className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-lg font-medium hover:bg-primary/90 focus:bg-primary/90 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    {loading ? (
                      <>
                        <span className="inline-flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Accesso in corso...
                        </span>
                        <span className="sr-only">Accesso in corso</span>
                      </>
                    ) : (
                      'Accedi'
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Non hai un account?{' '}
                    <Link 
                      href="/auth/sign-up" 
                      className="text-primary hover:text-primary/80 font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
                    >
                      Registrati
                    </Link>
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8 sm:mt-12" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              © 2025 Frames. Tutti i diritti riservati.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}