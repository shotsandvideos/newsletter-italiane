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
    <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-md p-4 z-50">
      <div className="flex">
        <CheckCircle className="h-5 w-5 text-green-400" />
        <div className="ml-3">
          <p className="text-sm font-medium text-green-800">
            Newsletter registrata con successo!
          </p>
          <p className="text-sm text-green-700">
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

  console.log('Dashboard render - user:', user, 'authLoading:', authLoading, 'loading:', loading)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/sign-in')
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
    }
  }, [user])

  const fetchNewsletters = async () => {
    try {
      const result: ApiResponse<Newsletter[]> = await cachedFetch('/api/newsletters', undefined, 60000) // 1 minute cache
      
      if (result.success && result.data) {
        setNewsletters(result.data)
      }
    } catch (error) {
      console.error('Error fetching newsletters:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: Newsletter['status']) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      default: return 'text-yellow-600 bg-yellow-100'
    }
  }

  const getStatusIcon = (status: Newsletter['status']) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getStatusText = (status: Newsletter['status']) => {
    switch (status) {
      case 'approved': return 'Approvata'
      case 'rejected': return 'Rifiutata'
      default: return 'In Revisione'
    }
  }


  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  // Debug: se ancora bianca, mostra questo
  if (!user && !authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Debug: No user found</h1>
          <p className="mb-2">authLoading: {String(authLoading)}</p>
          <p className="mb-4">loading: {String(loading)}</p>
          <a href="/auth/sign-in" className="bg-blue-600 text-white px-4 py-2 rounded">
            Go to Sign In
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
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
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-gray-900">
                Ciao {profile?.first_name && profile?.last_name 
                  ? `${profile.first_name} ${profile.last_name}` 
                  : profile?.first_name 
                    || user?.email?.split('@')[0] 
                    || 'Creator'}
              </h1>
              <Home className="w-5 h-5 text-gray-500" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto px-6 py-6">
          {/* Panoramica section */}
          <div className="mb-8">
            <h2 className="text-base font-medium text-gray-900 mb-4">Panoramica</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Unread Messages */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-3xl font-semibold text-gray-900 mb-1">
                      {stats.unreadMessages}
                    </div>
                    <div className="text-sm text-gray-600">Messaggi non letti</div>
                  </div>
                  <MessageSquare className="w-6 h-6 text-gray-400" />
                </div>
                <div className="mt-4">
                  <Link href="/dashboard/inbox" className="text-sm text-gray-500 hover:text-gray-700">
                    Vai alla inbox →
                  </Link>
                </div>
              </div>

              {/* Total Earnings */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-3xl font-semibold text-gray-900 mb-1">
                      €{stats.totalEarnings}
                    </div>
                    <div className="text-sm text-gray-600">Guadagni totali</div>
                    <div className="text-xs text-gray-500 mt-1">€0 questo mese</div>
                  </div>
                  <Euro className="w-6 h-6 text-gray-400" />
                </div>
                <div className="mt-4">
                  <Link href="/dashboard/payments" className="text-sm text-gray-500 hover:text-gray-700">
                    Visualizza tutto →
                  </Link>
                </div>
              </div>

              {/* Next Commitment */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    {stats.nextCommitment ? (
                      <>
                        <div className="text-lg font-semibold text-gray-900 mb-1">
                          {stats.nextCommitment.date}
                        </div>
                        <div className="text-sm text-gray-600 mb-1">
                          {stats.nextCommitment.title}
                        </div>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${
                            stats.nextCommitment.type === 'newsletter' ? 'bg-blue-500' :
                            stats.nextCommitment.type === 'collaboration' ? 'bg-purple-500' : 'bg-green-500'
                          }`} />
                          <span className="text-xs text-gray-500 capitalize">{stats.nextCommitment.type}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-lg font-semibold text-gray-900 mb-1">
                          Nessun impegno
                        </div>
                        <div className="text-sm text-gray-600">
                          Sei libero per nuove opportunità
                        </div>
                      </>
                    )}
                  </div>
                  <Calendar className="w-6 h-6 text-gray-400" />
                </div>
                <div className="mt-4">
                  <Link href="/dashboard/calendar" className="text-sm text-gray-500 hover:text-gray-700">
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
                <h2 className="text-base font-medium text-gray-900">Collaborazioni</h2>
                <Link href="/dashboard/collaborations" className="text-sm text-gray-500 hover:text-gray-700">
                  Visualizza tutto
                </Link>
              </div>

              <div className="bg-white rounded-lg border border-gray-200">
                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <div className="px-6 py-3">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-900">To-dos</span>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MessageSquare className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="divide-y divide-gray-200">
                  <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Bozza per TechStartup Italia</div>
                        <div className="text-xs text-gray-500">Scadenza oggi</div>
                      </div>
                    </div>
                    <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">In ritardo</span>
                  </div>
                  
                  <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Report metriche EcoProducts</div>
                        <div className="text-xs text-gray-500">Scadenza domani</div>
                      </div>
                    </div>
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">In corso</span>
                  </div>

                  <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Call con Fintech Solutions</div>
                        <div className="text-xs text-gray-500">18 Gen, ore 15:00</div>
                      </div>
                    </div>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Programmato</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payments */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-medium text-gray-900">Pagamenti</h2>
                <Link href="/dashboard/payments" className="text-sm text-gray-500 hover:text-gray-700">
                  Visualizza tutto
                </Link>
              </div>

              <div className="bg-white rounded-lg border border-gray-200">
                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <div className="px-6 py-3">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-gray-900">To-dos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-500">Pagati di recente</span>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <MessageSquare className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="divide-y divide-gray-200">
                  <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">EcoProducts - €300</div>
                        <div className="text-xs text-gray-500">Pagato 3 giorni fa</div>
                      </div>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  
                  <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">TechStartup Italia - €250</div>
                        <div className="text-xs text-gray-500">In attesa di conferma</div>
                      </div>
                    </div>
                    <Clock className="w-4 h-4 text-yellow-500" />
                  </div>

                  <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Fintech Solutions - €150</div>
                        <div className="text-xs text-gray-500">Fattura inviata</div>
                      </div>
                    </div>
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Fatturato</span>
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
