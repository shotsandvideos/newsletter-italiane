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
  const router = useRouter()

  useEffect(() => {
    // Check admin authentication
    const adminSession = localStorage.getItem('adminSession')
    if (adminSession) {
      try {
        const session = JSON.parse(adminSession)
        if (session.username === 'admin' && session.role === 'admin') {
          setIsAuthenticated(true)
        } else {
          router.push('/admin/login')
        }
      } catch {
        router.push('/admin/login')
      }
    } else {
      router.push('/admin/login')
    }
    setLoading(false)
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

  const stats = [
    {
      name: 'Autori Attivi',
      value: '47',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'blue'
    },
    {
      name: 'Newsletter Pubblicate',
      value: '234',
      change: '+18%',
      changeType: 'positive' as const,
      icon: Mail,
      color: 'emerald'
    },
    {
      name: 'Transazioni Totali',
      value: '€15,847',
      change: '+24%',
      changeType: 'positive' as const,
      icon: Euro,
      color: 'purple'
    },
    {
      name: 'Proposte Pending',
      value: '8',
      change: '-2',
      changeType: 'negative' as const,
      icon: AlertCircle,
      color: 'orange'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'new_author',
      message: 'Nuovo autore registrato: Marco Rossi',
      time: '2 ore fa',
      icon: Users,
      color: 'blue'
    },
    {
      id: 2,
      type: 'newsletter_published',
      message: 'Newsletter "Tech Weekly #45" pubblicata',
      time: '4 ore fa',
      icon: Mail,
      color: 'emerald'
    },
    {
      id: 3,
      type: 'payment_processed',
      message: 'Pagamento di €500 processato per Anna Bianchi',
      time: '6 ore fa',
      icon: CreditCard,
      color: 'purple'
    },
    {
      id: 4,
      type: 'proposal_submitted',
      message: 'Nuova proposta di collaborazione da TechStartup',
      time: '1 giorno fa',
      icon: FileText,
      color: 'orange'
    }
  ]

  const pendingActions = [
    {
      id: 1,
      title: 'Approvazione Newsletter',
      description: '3 newsletter in attesa di moderazione',
      priority: 'high',
      action: 'Revisiona'
    },
    {
      id: 2,
      title: 'Verifica Pagamenti',
      description: '2 pagamenti necessitano conferma',
      priority: 'medium',
      action: 'Verifica'
    },
    {
      id: 3,
      title: 'Supporto Autori',
      description: '5 ticket di supporto aperti',
      priority: 'low',
      action: 'Rispondi'
    }
  ]

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
                <h1 className="text-xl font-semibold text-slate-900">Admin Dashboard</h1>
                <Crown className="w-5 h-5 text-red-500" />
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
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Benvenuto, Admin!</h2>
                  <p className="text-red-100 mt-1">
                    Gestisci la piattaforma Newsletter Italiane
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.name} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-xl ${
                      stat.color === 'blue' ? 'bg-blue-100' :
                      stat.color === 'emerald' ? 'bg-emerald-100' :
                      stat.color === 'purple' ? 'bg-purple-100' :
                      'bg-orange-100'
                    }`}>
                      <stat.icon className={`w-5 h-5 ${
                        stat.color === 'blue' ? 'text-blue-600' :
                        stat.color === 'emerald' ? 'text-emerald-600' :
                        stat.color === 'purple' ? 'text-purple-600' :
                        'text-orange-600'
                      }`} />
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                      stat.changeType === 'positive' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      <TrendingUp className={`w-3 h-3 ${
                        stat.changeType === 'negative' ? 'rotate-180' : ''
                      }`} />
                      {stat.change}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-sm text-slate-500 mt-1">{stat.name}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activities */}
              <div className="bg-white rounded-2xl border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">Attività Recenti</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          activity.color === 'blue' ? 'bg-blue-100' :
                          activity.color === 'emerald' ? 'bg-emerald-100' :
                          activity.color === 'purple' ? 'bg-purple-100' :
                          'bg-orange-100'
                        }`}>
                          <activity.icon className={`w-4 h-4 ${
                            activity.color === 'blue' ? 'text-blue-600' :
                            activity.color === 'emerald' ? 'text-emerald-600' :
                            activity.color === 'purple' ? 'text-purple-600' :
                            'text-orange-600'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-900">{activity.message}</p>
                          <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pending Actions */}
              <div className="bg-white rounded-2xl border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">Azioni Richieste</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {pendingActions.map((action) => (
                      <div key={action.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-slate-900">{action.title}</h4>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              action.priority === 'high' ? 'bg-red-100 text-red-700' :
                              action.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {action.priority === 'high' ? 'Alta' :
                               action.priority === 'medium' ? 'Media' : 'Bassa'}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">{action.description}</p>
                        </div>
                        <button className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors ml-4">
                          {action.action}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Azioni Rapide</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-colors">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-900">Gestisci Autori</span>
                </button>
                <button className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-colors">
                  <Mail className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-slate-900">Modera Newsletter</span>
                </button>
                <button className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-colors">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-slate-900">Visualizza Report</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}