'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Shield,
  Users,
  Mail,
  Calendar,
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Euro,
  Menu,
  X,
  BarChart3,
  FileText,
  Crown
} from 'lucide-react'
import AdminSidebar from '../components/AdminSidebar'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [pendingNewsletters, setPendingNewsletters] = useState<any[]>([])
  const [upcomingActivities, setUpcomingActivities] = useState<any[]>([])
  const [stats, setStats] = useState({
    activeAuthors: 0,
    activeNewsletters: 0,
    totalTransactions: 0,
    pendingProposals: 0
  })
  const router = useRouter()

  const fetchPendingNewsletters = async () => {
    try {
      console.log('Fetching all newsletters for admin...')
      
      const response = await fetch('/api/newsletters-all')
      
      if (response.ok) {
        const data = await response.json()
        console.log('All newsletters response:', data)
        
        if (data.success && data.data) {
          // Filter pending newsletters
          const pending = data.data.filter((n: any) => n.status === 'pending')
          const approved = data.data.filter((n: any) => n.status === 'approved')
          
          setPendingNewsletters(pending)
          setStats(prev => ({
            ...prev,
            pendingProposals: pending.length,
            activeNewsletters: approved.length,
            activeAuthors: new Set(approved.map((n: any) => n.user_id)).size
          }))
          
          console.log(`Found ${pending.length} pending newsletters out of ${data.data.length} total`)
        }
      } else {
        console.log('Failed to fetch newsletters:', response.status)
      }
    } catch (error) {
      console.error('Error fetching pending newsletters:', error)
    }
  }

  const fetchUpcomingActivities = async () => {
    try {
      const response = await fetch('/api/admin/upcoming-activities', {
        headers: {
          'x-admin-auth': 'admin-panel'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setUpcomingActivities(data.data.slice(0, 5)) // Mostra solo le prime 5
        }
      }
    } catch (error) {
      console.error('Error fetching upcoming activities:', error)
    }
  }

  const approveNewsletter = async (id: string) => {
    try {
      console.log('Approving newsletter:', id)
      
      const response = await fetch('/api/newsletters-update-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: 'approved' })
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Remove from pending list and update stats
        setPendingNewsletters(prev => prev.filter(n => n.id !== id))
        setStats(prev => ({ ...prev, pendingProposals: prev.pendingProposals - 1 }))
        alert('Newsletter approvata con successo!')
      } else {
        alert('Errore durante l\'approvazione: ' + result.error)
      }
    } catch (error) {
      console.error('Error approving newsletter:', error)
      alert('Errore durante l\'approvazione')
    }
  }

  const rejectNewsletter = async (id: string) => {
    try {
      console.log('Rejecting newsletter:', id)
      
      const response = await fetch('/api/newsletters-update-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: 'rejected' })
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Remove from pending list and update stats
        setPendingNewsletters(prev => prev.filter(n => n.id !== id))
        setStats(prev => ({ ...prev, pendingProposals: prev.pendingProposals - 1 }))
        alert('Newsletter rifiutata con successo!')
      } else {
        alert('Errore durante il rifiuto: ' + result.error)
      }
    } catch (error) {
      console.error('Error rejecting newsletter:', error)
      alert('Errore durante il rifiuto')
    }
  }

  useEffect(() => {
    // Check admin authentication
    try {
      const adminSession = localStorage.getItem('adminSession')
      if (adminSession) {
        const session = JSON.parse(adminSession)
        if (session.username === 'admin' && session.role === 'admin') {
          setIsAuthenticated(true)
          fetchPendingNewsletters()
          fetchUpcomingActivities()
        } else {
          console.log('Invalid admin session, redirecting to login')
          router.push('/admin/login')
        }
      } else {
        console.log('No admin session found, redirecting to login')
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Error parsing admin session:', error)
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const statsData = [
    {
      name: 'Autori Attivi',
      value: stats.activeAuthors.toString(),
      change: '',
      changeType: 'neutral' as const,
      icon: Users,
      color: 'blue'
    },
    {
      name: 'Newsletter Attive',
      value: stats.activeNewsletters.toString(),
      change: '',
      changeType: 'neutral' as const,
      icon: Mail,
      color: 'emerald'
    },
    {
      name: 'Transazioni Totali',
      value: '€0',
      change: '',
      changeType: 'neutral' as const,
      icon: Euro,
      color: 'purple'
    },
    {
      name: 'Newsletter in Revisione',
      value: stats.pendingProposals.toString(),
      change: '',
      changeType: 'neutral' as const,
      icon: AlertCircle,
      color: 'orange'
    }
  ]

  const recentActivities: any[] = []


  return (
    <div className="flex h-screen admin-panel">
      {/* Admin Sidebar */}
      <AdminSidebar 
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
              >
                <Menu className="icon-inline" />
              </button>
              <div className="flex items-center gap-2">
                <Shield className="icon-inline icon-admin" />
                <h1 className="heading-page text-foreground">Admin Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  localStorage.removeItem('adminSession')
                  router.push('/admin/login')
                }}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
              >
                Esci
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto px-6 py-6">
          {/* Panoramica section */}
          <div className="mb-8">
            <h2 className="heading-section text-foreground mb-4">Panoramica</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {statsData.map((stat) => (
                <div key={stat.name} className="card-uniform">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="heading-page text-foreground mb-1">
                        {stat.value}
                      </div>
                      <div className="body-text text-muted-foreground">{stat.name}</div>
                    </div>
                    <stat.icon className="icon-counter icon-admin" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Prossime Attività */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-section text-foreground">Prossime Attività</h2>
              </div>

              <div className="card-uniform">
                <div className="border-b border-border">
                  <div className="p-12px">
                    <div className="flex items-center gap-1">
                      <span className="heading-sub text-foreground">Campagne programmate</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {upcomingActivities.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-4 bg-accent rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium text-foreground">{activity.brand_name}</h4>
                              <span className="px-2 py-1 text-micro rounded-full bg-slate-100 text-slate-700">
                                {activity.sponsorship_type}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {activity.newsletter_title} • {activity.newsletter_author}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              📅 {new Date(activity.selected_run_date).toLocaleDateString('it-IT')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-muted-foreground text-sm">
                        Nessuna attività programmata
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Le campagne pianificate appariranno qui
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Newsletter in Revisione */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-section text-foreground">Newsletter in Revisione</h2>
              </div>

              <div className="card-uniform">
                <div className="border-b border-border">
                  <div className="p-12px">
                    <div className="flex items-center gap-1">
                      <span className="heading-sub text-foreground">In attesa</span>
                    </div>
                  </div>
                </div>

                <div className="p-16px">
                  {pendingNewsletters.length > 0 ? (
                    <div className="space-y-4">
                      {pendingNewsletters.slice(0, 5).map((newsletter) => (
                        <div key={newsletter.id} className="flex items-center justify-between p-12px bg-accent rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="heading-sub text-foreground">{newsletter.nome_newsletter}</h4>
                              <span className="px-2 py-1 text-micro rounded-full bg-slate-100 text-slate-700">
                                In revisione
                              </span>
                            </div>
                            <p className="text-micro text-muted-foreground mt-1">
                              {newsletter.profiles?.first_name} {newsletter.profiles?.last_name} - {newsletter.categoria}
                            </p>
                            <p className="text-micro text-muted-foreground mt-1">
                              {newsletter.descrizione?.substring(0, 80)}...
                            </p>
                          </div>
                          <div className="flex gap-2 ml-3">
                            <button 
                              onClick={() => approveNewsletter(newsletter.id)}
                              className="btn-uniform bg-slate-600 text-white hover:bg-slate-700"
                            >
                              Approva
                            </button>
                            <button 
                              onClick={() => rejectNewsletter(newsletter.id)}
                              className="btn-uniform bg-slate-600 text-white hover:bg-slate-700"
                            >
                              Rifiuta
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-muted-foreground text-sm">
                        Nessuna newsletter in attesa di revisione
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Le richieste di approvazione appariranno qui
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}