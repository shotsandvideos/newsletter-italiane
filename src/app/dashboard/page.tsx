'use client'
/* eslint-disable @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps */

import { useAuth } from '../../hooks/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { Mail, Euro, TrendingUp, MessageSquare, CheckCircle, Users, Calendar, Home, Menu, XCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
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
    unreadMessages: 0
  })
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendarEvents, setCalendarEvents] = useState<Array<{ title: string, date: string, time?: string }>>([])
  const [loadingEvents, setLoadingEvents] = useState(false)


  // Redirect if not authenticated - only after loading is complete
  useEffect(() => {
    // Only redirect if we're sure auth has finished loading and there's no user
    if (authLoading === false && !user) {
      const redirectTimer = setTimeout(() => {
        router.push('/auth/sign-in')
      }, 1000)
      
      return () => clearTimeout(redirectTimer)
    }
  }, [authLoading, user, router])

  // Fetch newsletters
  useEffect(() => {
    if (user) {
      fetchNewsletters()
      fetchCalendarEvents()
    } else if (!authLoading) {
      // If no user and not loading, set loading to false
      setLoading(false)
    }
  }, [user, authLoading])

  // Fetch calendar events when month changes
  useEffect(() => {
    if (user) {
      fetchCalendarEvents()
    }
  }, [currentMonth, user])

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

  const fetchCalendarEvents = async () => {
    setLoadingEvents(true)
    try {
      const month = currentMonth.getMonth() + 1
      const year = currentMonth.getFullYear()
      console.log('Fetching calendar for month:', month, 'year:', year) // Debug log
      
      const response = await fetch(`/api/calendar?month=${month}&year=${year}`)
      if (response.ok) {
        const data = await response.json()
        console.log('Calendar API response:', data) // Debug log
        
        // L'API restituisce data.data, non data.events
        const events = data.data || []
        console.log('Raw events from API:', events) // Debug log
        
        // Since we're already filtering by month/year in the API, we don't need to filter again
        // Just map and sort the events
        const currentMonthEvents = events
          .map((event: any) => ({
            title: event.brand_name || event.title || 'Evento',
            date: event.event_date,
            time: new Date(event.event_date).toLocaleTimeString('it-IT', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })
          }))
          .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
        
        console.log('Processed calendar events:', currentMonthEvents) // Debug log
        setCalendarEvents(currentMonthEvents)
      } else {
        console.error('Calendar API error:', response.status, response.statusText)
        setCalendarEvents([])
      }
    } catch (error) {
      console.error('Error fetching calendar events:', error)
      setCalendarEvents([])
    } finally {
      setLoadingEvents(false)
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

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const formatCalendarDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('it-IT', { 
      day: 'numeric',
      month: 'short',
      weekday: 'short'
    })
  }


  if (authLoading || loading) {
    return (
      <div className="flex h-screen user-dashboard">
        <Sidebar 
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
        />
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          {/* Header Skeleton */}
          <header className="bg-card border-b border-border px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="skeleton w-6 h-6 rounded"></div>
              <div className="skeleton w-48 h-6 rounded"></div>
            </div>
          </header>
          
          {/* Content Skeleton */}
          <main className="flex-1 overflow-auto px-6 py-6">
            <div className="mb-8">
              <div className="skeleton w-32 h-6 mb-4 rounded"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="skeleton-card p-6">
                  <div className="flex justify-between mb-4">
                    <div className="skeleton w-16 h-8 rounded"></div>
                    <div className="skeleton w-6 h-6 rounded"></div>
                  </div>
                  <div className="skeleton w-24 h-4 rounded"></div>
                </div>
                <div className="skeleton-card p-6">
                  <div className="flex justify-between mb-4">
                    <div className="skeleton w-16 h-8 rounded"></div>
                    <div className="skeleton w-6 h-6 rounded"></div>
                  </div>
                  <div className="skeleton w-24 h-4 rounded"></div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="flex justify-between mb-6">
                  <div className="skeleton w-32 h-6 rounded"></div>
                  <div className="skeleton w-24 h-4 rounded"></div>
                </div>
                <div className="skeleton-card p-6 h-32"></div>
              </div>
              <div>
                <div className="flex justify-between mb-6">
                  <div className="skeleton w-24 h-6 rounded"></div>
                  <div className="skeleton w-24 h-4 rounded"></div>
                </div>
                <div className="skeleton-card p-6 h-32"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Redirect if no user after auth loading is complete
  if (!user && !authLoading) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="flex h-screen user-dashboard">
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
              <Menu className="icon-inline" />
            </button>
            
            <div className="flex items-center gap-2">
              <h1 className="heading-page text-foreground">
                Ciao {profile?.first_name && profile?.last_name 
                  ? `${profile.first_name} ${profile.last_name}` 
                  : profile?.first_name 
                    || user?.email?.split('@')[0] 
                    || 'Creator'}
              </h1>
              <Home className="icon-inline icon-user" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto px-6 py-6">
          {/* Panoramica section */}
          <div className="mb-8">
            <h2 className="heading-section text-foreground mb-4">Panoramica</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Unread Messages */}
              <div className="card-uniform">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="heading-page text-foreground mb-1">
                      {stats.unreadMessages}
                    </div>
                    <div className="body-text text-muted-foreground">Messaggi non letti</div>
                  </div>
                  <MessageSquare className="icon-counter icon-user" />
                </div>
                <div className="mt-4">
                  <Link href="/dashboard/inbox" className="text-sm text-muted-foreground hover:text-foreground">
                    Vai alla inbox →
                  </Link>
                </div>
              </div>

              {/* Total Earnings */}
              <div className="card-uniform">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="heading-page text-foreground mb-1">
                      €{stats.totalEarnings}
                    </div>
                    <div className="body-text text-muted-foreground">Guadagni totali</div>
                    <div className="text-micro text-muted-foreground mt-1">€0 questo mese</div>
                  </div>
                  <Euro className="icon-counter icon-user" />
                </div>
                <div className="mt-4">
                  <Link href="/dashboard/payments" className="text-sm text-muted-foreground hover:text-foreground">
                    Visualizza tutto →
                  </Link>
                </div>
              </div>

              {/* Calendario Mensile */}
              <div className="card-uniform">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="heading-block text-foreground">Calendario</h3>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => navigateMonth('prev')}
                      className="touch-target p-1 hover:bg-accent rounded smooth-interaction"
                    >
                      <ChevronLeft className="icon-inline text-muted-foreground" />
                    </button>
                    <span className="body-text text-foreground font-medium">
                      {currentMonth.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
                    </span>
                    <button 
                      onClick={() => navigateMonth('next')}
                      className="touch-target p-1 hover:bg-accent rounded smooth-interaction"
                    >
                      <ChevronRight className="icon-inline text-muted-foreground" />
                    </button>
                  </div>
                </div>

                {/* Eventi del mese */}
                <div className="space-y-2">
                  {loadingEvents ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="skeleton w-full h-4 rounded"></div>
                    </div>
                  ) : calendarEvents.length > 0 ? (
                    calendarEvents.slice(0, 5).map((event, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 hover:bg-accent rounded smooth-interaction">
                        <div className="flex items-center gap-2">
                          <Calendar className="icon-inline text-muted-foreground" />
                          <span className="body-text text-foreground font-medium">
                            {formatCalendarDate(event.date)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="body-text text-foreground">{event.title}</div>
                          {event.time && (
                            <div className="text-micro text-muted-foreground">{event.time}</div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="icon-counter text-muted-foreground mx-auto mb-2" />
                      <div className="body-text text-muted-foreground">
                        Nessun evento questo mese
                      </div>
                      <p className="text-micro text-muted-foreground mt-1">
                        Gli eventi appariranno qui
                      </p>
                    </div>
                  )}
                </div>

                {calendarEvents.length > 5 && (
                  <div className="mt-4 pt-3 border-t border-border">
                    <Link href="/dashboard/calendar" className="text-sm text-muted-foreground hover:text-foreground">
                      Visualizza tutti ({calendarEvents.length}) →
                    </Link>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Collaborations */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-section text-foreground">Collaborazioni</h2>
                <Link href="/dashboard/collaborations" className="text-sm text-muted-foreground hover:text-foreground">
                  Visualizza tutto
                </Link>
              </div>

              <div className="card-uniform">
                {/* Tabs */}
                <div className="border-b border-border">
                  <div className="p-12px">
                    <div className="flex items-center gap-1">
                      <span className="heading-sub text-foreground">To-dos</span>
                      <button className="p-1 hover:bg-accent rounded">
                        <MessageSquare className="icon-inline text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-16px text-center">
                  <div className="text-muted-foreground body-text">
                    Nessuna collaborazione attiva
                  </div>
                  <p className="text-micro text-muted-foreground mt-1">
                    Le tue collaborazioni appariranno qui
                  </p>
                </div>
              </div>
            </div>

            {/* Payments */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-section text-foreground">Pagamenti</h2>
                <Link href="/dashboard/payments" className="text-sm text-muted-foreground hover:text-foreground">
                  Visualizza tutto
                </Link>
              </div>

              <div className="card-uniform">
                {/* Tabs */}
                <div className="border-b border-border">
                  <div className="p-12px">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1">
                        <span className="heading-sub text-foreground">To-dos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="body-text text-muted-foreground">Pagati di recente</span>
                        <button className="p-1 hover:bg-accent rounded">
                          <MessageSquare className="icon-inline text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-16px text-center">
                  <div className="text-muted-foreground body-text">
                    Nessun pagamento registrato
                  </div>
                  <p className="text-micro text-muted-foreground mt-1">
                    I tuoi pagamenti appariranno qui
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

    </div>
  )
}
