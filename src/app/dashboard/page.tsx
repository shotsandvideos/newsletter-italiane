'use client'

import { useAuth } from '../../hooks/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { Mail, Euro, TrendingUp, MessageSquare, CheckCircle, Users, Calendar, Home, Menu, XCircle, Clock } from 'lucide-react'
import { Newsletter, ApiResponse } from '../lib/validations'
import Sidebar from '../components/Sidebar'
import { cachedFetch } from '../lib/api-cache'

function SuccessMessage() {
  const searchParams = useSearchParams()
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (searchParams.get('success') === 'newsletter-created') {
      setShowSuccess(true)
      // Remove success param from URL
      window.history.replaceState({}, '', '/dashboard')
      setTimeout(() => setShowSuccess(false), 5000)
    }
  }, [searchParams])

  if (!showSuccess) return null

  return (
    <div className="fixed top-4 right-4 bg-slate-100 border border-slate-200 rounded-md p-4 z-50">
      <div className="flex">
        <CheckCircle className="h-5 w-5 text-slate-500" />
        <div className="ml-3">
          <p className="text-sm font-medium text-slate-700">
            Newsletter registrata con successo!
          </p>
          <p className="text-sm text-slate-600">
            Ti contatteremo appena ci saranno opportunità.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [stats, setStats] = useState({
    totalEarnings: 0,
    nextCommitment: null as { title: string, date: string, type: string } | null,
    unreadMessages: 3
  })

  console.log('Dashboard render - user:', user?.email || 'no user', 'authLoading:', authLoading, 'loading:', loading)

  // Redirect if not authenticated - only after loading is complete
  useEffect(() => {
    // Only redirect if we're sure auth has finished loading and there's no user
    if (authLoading === false && !user) {
      console.log('Auth loading complete, no user found, redirecting to sign-in')
      const redirectTimer = setTimeout(() => {
        router.push('/auth/sign-in')
      }, 1000) // Give a bit more time for auth state to settle
      
      return () => clearTimeout(redirectTimer)
    }
  }, [authLoading, user, router])

  // Fetch newsletters and set next commitment
  useEffect(() => {
    if (user) {
      fetchNewsletters()
      // Set mock next commitment
      setStats(prev => ({
        ...prev,
        nextCommitment: {
          title: 'Invio Newsletter Marketing Espresso',
          date: '15 Gen',
          type: 'newsletter'
        }
      }))
    } else if (!authLoading) {
      // If no user and not loading, set loading to false
      setLoading(false)
    }
  }, [user, authLoading])

  const fetchNewsletters = async () => {
    try {
      console.log('Fetching newsletters...')
      const result: ApiResponse<Newsletter[]> = await cachedFetch('/api/newsletters', undefined, 60000) // 1 minute cache
      console.log('Newsletters result:', result)
      
      if (result.success && result.data) {
        setNewsletters(result.data)
      }
    } catch (error) {
      console.error('Error fetching newsletters:', error)
    } finally {
      console.log('Setting loading to false')
      setLoading(false)
    }
  }

  const getStatusColor = (status: Newsletter['status']) => {
    switch (status) {
      case 'approved': return 'text-slate-700 bg-slate-100'
      case 'rejected': return 'text-slate-700 bg-slate-100'
      default: return 'text-slate-700 bg-slate-100'
    }
  }

  const getStatusIcon = (status: Newsletter['status']) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-slate-500" />
      case 'rejected': return <XCircle className="w-4 h-4 text-slate-500" />
      default: return <Clock className="w-4 h-4 text-slate-500" />
    }
  }

  const getStatusText = (status: Newsletter['status']) => {
    switch (status) {
      case 'approved': return 'Approvata'
      case 'rejected': return 'Rifiutata'
      default: return 'In Revisione'
    }
  }


  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Debug: se ancora bianca, mostra questo
  if (!user && !authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4 text-foreground">Debug: No user found</h1>
          <p className="mb-2 text-muted-foreground">authLoading: {String(authLoading)}</p>
          <p className="mb-4 text-muted-foreground">loading: {String(loading)}</p>
          <a href="/auth/sign-in" className="bg-primary text-primary-foreground px-4 py-2 rounded">
            Go to Sign In
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      {/* Success Message */}
      <Suspense fallback={null}>
        <SuccessMessage />
      </Suspense>

      {/* Sidebar */}
      <Sidebar 
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-foreground">
                Ciao {profile?.first_name && profile?.last_name 
                  ? `${profile.first_name} ${profile.last_name}` 
                  : profile?.first_name 
                    || user?.email?.split('@')[0] 
                    || 'Creator'}
              </h1>
              <Home className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto px-6 py-6">
          {/* Panoramica section */}
          <div className="mb-8">
            <h2 className="text-base font-medium text-foreground mb-4">Panoramica</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Unread Messages */}
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-3xl font-semibold text-foreground mb-1">
                      {stats.unreadMessages}
                    </div>
                    <div className="text-sm text-muted-foreground">Messaggi non letti</div>
                  </div>
                  <MessageSquare className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="mt-4">
                  <Link href="/dashboard/inbox" className="text-sm text-muted-foreground hover:text-foreground">
                    Vai alla inbox →
                  </Link>
                </div>
              </div>

              {/* Total Earnings */}
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-3xl font-semibold text-foreground mb-1">
                      €{stats.totalEarnings}
                    </div>
                    <div className="text-sm text-muted-foreground">Guadagni totali</div>
                    <div className="text-xs text-muted-foreground mt-1">€0 questo mese</div>
                  </div>
                  <Euro className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="mt-4">
                  <Link href="/dashboard/payments" className="text-sm text-muted-foreground hover:text-foreground">
                    Visualizza tutto →
                  </Link>
                </div>
              </div>

              {/* Next Commitment */}
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-start justify-between">
                  <div>
                    {stats.nextCommitment ? (
                      <>
                        <div className="text-lg font-semibold text-foreground mb-1">
                          {stats.nextCommitment.date}
                        </div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {stats.nextCommitment.title}
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-slate-400" />
                          <span className="text-xs text-muted-foreground capitalize">{stats.nextCommitment.type}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-lg font-semibold text-foreground mb-1">
                          Nessun impegno
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Sei libero per nuove opportunità
                        </div>
                      </>
                    )}
                  </div>
                  <Calendar className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="mt-4">
                  <Link href="/dashboard/calendar" className="text-sm text-muted-foreground hover:text-foreground">
                    Vedi calendario →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Collaborations */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-medium text-foreground">Collaborazioni</h2>
                <Link href="/dashboard/collaborations" className="text-sm text-muted-foreground hover:text-foreground">
                  Visualizza tutto
                </Link>
              </div>

              <div className="bg-card rounded-lg border border-border">
                {/* Tabs */}
                <div className="border-b border-border">
                  <div className="px-6 py-3">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-foreground">To-dos</span>
                      <button className="p-1 hover:bg-accent rounded">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="divide-y divide-border">
                  <div className="px-6 py-4 flex items-center justify-between hover:bg-accent">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-chart-4 rounded-full"></div>
                      <div>
                        <div className="text-sm font-medium text-foreground">Bozza per TechStartup Italia</div>
                        <div className="text-xs text-muted-foreground">Scadenza oggi</div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-full">In ritardo</span>
                  </div>
                  
                  <div className="px-6 py-4 flex items-center justify-between hover:bg-accent">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
                      <div>
                        <div className="text-sm font-medium text-foreground">Report metriche EcoProducts</div>
                        <div className="text-xs text-muted-foreground">Scadenza domani</div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-full">In corso</span>
                  </div>

                  <div className="px-6 py-4 flex items-center justify-between hover:bg-accent">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-chart-5 rounded-full"></div>
                      <div>
                        <div className="text-sm font-medium text-foreground">Call con Fintech Solutions</div>
                        <div className="text-xs text-muted-foreground">18 Gen, ore 15:00</div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-full">Programmato</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payments */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-medium text-foreground">Pagamenti</h2>
                <Link href="/dashboard/payments" className="text-sm text-muted-foreground hover:text-foreground">
                  Visualizza tutto
                </Link>
              </div>

              <div className="bg-card rounded-lg border border-border">
                {/* Tabs */}
                <div className="border-b border-border">
                  <div className="px-6 py-3">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-foreground">To-dos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-muted-foreground">Pagati di recente</span>
                        <button className="p-1 hover:bg-accent rounded">
                          <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="divide-y divide-border">
                  <div className="px-6 py-4 flex items-center justify-between hover:bg-accent">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-chart-5 rounded-full"></div>
                      <div>
                        <div className="text-sm font-medium text-foreground">EcoProducts - €300</div>
                        <div className="text-xs text-muted-foreground">Pagato 3 giorni fa</div>
                      </div>
                    </div>
                    <CheckCircle className="w-4 h-4 text-slate-500" />
                  </div>
                  
                  <div className="px-6 py-4 flex items-center justify-between hover:bg-accent">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-chart-4 rounded-full"></div>
                      <div>
                        <div className="text-sm font-medium text-foreground">TechStartup Italia - €250</div>
                        <div className="text-xs text-muted-foreground">In attesa di conferma</div>
                      </div>
                    </div>
                    <Clock className="w-4 h-4 text-slate-500" />
                  </div>

                  <div className="px-6 py-4 flex items-center justify-between hover:bg-accent">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
                      <div>
                        <div className="text-sm font-medium text-foreground">Fintech Solutions - €150</div>
                        <div className="text-xs text-muted-foreground">Fattura inviata</div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-full">Fatturato</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

    </div>
  )
}
