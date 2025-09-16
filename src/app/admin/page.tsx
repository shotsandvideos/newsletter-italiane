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
            activeNewsletters: data.data.length,
            activeAuthors: new Set(data.data.map((n: any) => n.user_id)).size
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
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
    <div className="flex h-screen bg-slate-50">
      {/* Admin Sidebar */}
      <AdminSidebar 
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-red-600" />
                <h1 className="text-lg font-semibold text-slate-900">Admin Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  localStorage.removeItem('adminSession')
                  router.push('/admin/login')
                }}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Esci
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto px-6 py-6">
          <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-3 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Benvenuto, Admin</h2>
                  <p className="text-red-100 text-sm">
                    Gestisci la piattaforma Frames
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsData.map((stat) => (
                <div key={stat.name} className="bg-white p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="p-1.5 rounded-lg bg-red-50">
                      <stat.icon className="w-4 h-4 text-red-600" />
                    </div>
                    {stat.change && (
                      <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${
                        stat.changeType === 'positive' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        <TrendingUp className={`w-3 h-3 ${
                          stat.changeType === 'negative' ? 'rotate-180' : ''
                        }`} />
                        {stat.change}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <div className="text-lg font-bold text-slate-900">{stat.value}</div>
                    <div className="text-xs text-slate-500">{stat.name}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activities */}
              <div className="bg-white rounded-lg border border-slate-200">
                <div className="p-4 border-b border-slate-200">
                  <h3 className="text-base font-semibold text-slate-900">Attività Recenti</h3>
                </div>
                <div className="p-4">
                  {recentActivities.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-2">
                          <div className="p-1.5 rounded-lg bg-red-50">
                            <activity.icon className="w-3.5 h-3.5 text-red-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-900">{activity.message}</p>
                            <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <p className="text-sm">Nessuna attività recente</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Newsletter in Revisione */}
              <div className="bg-white rounded-lg border border-slate-200">
                <div className="p-4 border-b border-slate-200">
                  <h3 className="text-base font-semibold text-slate-900">Newsletter in Revisione</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {pendingNewsletters.length > 0 ? (
                      pendingNewsletters.slice(0, 5).map((newsletter) => (
                        <div key={newsletter.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium text-slate-900">{newsletter.nome_newsletter}</h4>
                              <span className="px-1.5 py-0.5 text-xs rounded-full bg-orange-100 text-orange-700">
                                Pending
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5">
                              {newsletter.profiles?.first_name} {newsletter.profiles?.last_name} - {newsletter.categoria}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {newsletter.descrizione?.substring(0, 80)}...
                            </p>
                          </div>
                          <div className="flex gap-2 ml-3">
                            <button 
                              onClick={() => approveNewsletter(newsletter.id)}
                              className="px-2.5 py-1 bg-emerald-600 text-white text-xs font-medium rounded hover:bg-emerald-700 transition-colors"
                            >
                              Approva
                            </button>
                            <button 
                              onClick={() => rejectNewsletter(newsletter.id)}
                              className="px-2.5 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors"
                            >
                              Rifiuta
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                        <p className="text-sm">Nessuna newsletter in attesa di revisione</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <h3 className="text-base font-semibold text-slate-900 mb-3">Azioni Rapide</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-50 transition-colors">
                  <Users className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-slate-900">Gestisci Autori</span>
                </button>
                <button className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-50 transition-colors">
                  <Mail className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-slate-900">Modera Newsletter</span>
                </button>
                <button className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-50 transition-colors">
                  <BarChart3 className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-slate-900">Visualizza Report</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}