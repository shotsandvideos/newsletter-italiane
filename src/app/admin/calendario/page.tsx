'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Calendar,
  CalendarDays,
  Clock,
  AlertCircle,
  CheckCircle,
  Users,
  Mail,
  Euro,
  Search,
  Filter,
  Menu,
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
  Edit
} from 'lucide-react'
import AdminSidebar from '../../components/AdminSidebar'

export default function AdminCalendarioPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const router = useRouter()

  useEffect(() => {
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

  const events = [
    {
      id: 1,
      title: 'Scadenza Newsletter "Tech Weekly #46"',
      author: 'Marco Rossi',
      type: 'newsletter_deadline',
      date: '2024-02-22T18:00:00Z',
      status: 'upcoming',
      priority: 'high',
      description: 'Deadline per la pubblicazione della newsletter settimanale'
    },
    {
      id: 2,
      title: 'Pagamento Collaborazione FinanceFlow',
      author: 'Anna Bianchi',
      type: 'payment_due',
      date: '2024-02-23T12:00:00Z',
      status: 'pending',
      priority: 'medium',
      description: 'Rilascio pagamento da escrow per collaborazione completata',
      amount: 1200
    },
    {
      id: 3,
      title: 'Revisione Contenuti - Crypto Newsletter',
      author: 'Luigi Verdi',
      type: 'content_review',
      date: '2024-02-24T10:00:00Z',
      status: 'pending',
      priority: 'high',
      description: 'Revisione contenuti newsletter crypto in attesa di approvazione'
    },
    {
      id: 4,
      title: 'Meeting Onboarding Nuovi Creator',
      author: 'Sistema',
      type: 'meeting',
      date: '2024-02-25T15:00:00Z',
      status: 'scheduled',
      priority: 'medium',
      description: 'Sessione di onboarding per 3 nuovi creator registrati'
    },
    {
      id: 5,
      title: 'Scadenza Campagna MarketingPro Academy',
      author: 'Sistema',
      type: 'campaign_deadline',
      date: '2024-02-26T23:59:00Z',
      status: 'upcoming',
      priority: 'medium',
      description: 'Fine periodo candidature per campagna educativa'
    },
    {
      id: 6,
      title: 'Report Mensile Performance',
      author: 'Sistema',
      type: 'report',
      date: '2024-02-28T09:00:00Z',
      status: 'scheduled',
      priority: 'low',
      description: 'Generazione automatica report performance mensile'
    },
    {
      id: 7,
      title: 'Newsletter "Startup Italia" Completata',
      author: 'Anna Bianchi',
      type: 'newsletter_published',
      date: '2024-02-20T16:45:00Z',
      status: 'completed',
      priority: 'low',
      description: 'Newsletter pubblicata con successo - 7.891 destinatari'
    },
    {
      id: 8,
      title: 'Verifica Identità - Francesco Blu',
      author: 'Francesco Blu',
      type: 'verification',
      date: '2024-02-27T14:00:00Z',
      status: 'pending',
      priority: 'medium',
      description: 'Revisione documenti per verifica identità creator'
    }
  ]

  const getEventTypeInfo = (type: string) => {
    switch (type) {
      case 'newsletter_deadline':
        return { label: 'Deadline Newsletter', icon: Mail, color: 'text-blue-600', bgColor: 'bg-blue-100' }
      case 'payment_due':
        return { label: 'Pagamento', icon: Euro, color: 'text-green-600', bgColor: 'bg-green-100' }
      case 'content_review':
        return { label: 'Revisione Contenuti', icon: Eye, color: 'text-orange-600', bgColor: 'bg-orange-100' }
      case 'meeting':
        return { label: 'Meeting', icon: Users, color: 'text-purple-600', bgColor: 'bg-purple-100' }
      case 'campaign_deadline':
        return { label: 'Scadenza Campagna', icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-100' }
      case 'report':
        return { label: 'Report', icon: CalendarDays, color: 'text-slate-600', bgColor: 'bg-slate-100' }
      case 'newsletter_published':
        return { label: 'Newsletter Pubblicata', icon: CheckCircle, color: 'text-emerald-600', bgColor: 'bg-emerald-100' }
      case 'verification':
        return { label: 'Verifica', icon: AlertCircle, color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
      default:
        return { label: type, icon: Calendar, color: 'text-slate-600', bgColor: 'bg-slate-100' }
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'upcoming':
        return { label: 'In arrivo', color: 'bg-blue-100 text-blue-700' }
      case 'pending':
        return { label: 'In attesa', color: 'bg-yellow-100 text-yellow-700' }
      case 'scheduled':
        return { label: 'Programmato', color: 'bg-purple-100 text-purple-700' }
      case 'completed':
        return { label: 'Completato', color: 'bg-emerald-100 text-emerald-700' }
      case 'overdue':
        return { label: 'Scaduto', color: 'bg-red-100 text-red-700' }
      default:
        return { label: status, color: 'bg-slate-100 text-slate-700' }
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-orange-500'
      default: return 'border-l-slate-300'
    }
  }

  // Get events for today and upcoming
  const today = new Date()
  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.date)
    return eventDate.toDateString() === today.toDateString()
  })

  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.date)
      return eventDate > today && eventDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const eventStats = {
    total: events.length,
    today: todayEvents.length,
    pending: events.filter(e => e.status === 'pending').length,
    overdue: events.filter(e => {
      const eventDate = new Date(e.date)
      return eventDate < today && !['completed'].includes(e.status)
    }).length
  }

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

  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar 
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <Calendar className="w-6 h-6 text-red-600" />
                <h1 className="text-xl font-semibold text-slate-900">Calendario Admin</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-slate-100 p-1 rounded-lg">
                {['month', 'week', 'day'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode as 'month' | 'week' | 'day')}
                    className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                      viewMode === mode
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {mode === 'month' ? 'Mese' : mode === 'week' ? 'Settimana' : 'Giorno'}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                <Plus className="w-4 h-4" />
                Nuovo Evento
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto px-6 py-6">
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <CalendarDays className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {eventStats.total}
                    </p>
                    <p className="text-sm text-slate-600">Eventi totali</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {eventStats.today}
                    </p>
                    <p className="text-sm text-slate-600">Eventi oggi</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {eventStats.pending}
                    </p>
                    <p className="text-sm text-slate-600">In attesa</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {eventStats.overdue}
                    </p>
                    <p className="text-sm text-slate-600">Scaduti</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Today's Events */}
              <div className="bg-white rounded-2xl border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">Eventi di Oggi</h3>
                  <p className="text-sm text-slate-500 mt-1">{new Date().toLocaleDateString('it-IT')}</p>
                </div>

                <div className="p-6">
                  {todayEvents.length === 0 ? (
                    <div className="text-center py-8">
                      <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500">Nessun evento programmato per oggi</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {todayEvents.map((event) => {
                        const typeInfo = getEventTypeInfo(event.type)
                        const statusInfo = getStatusInfo(event.status)
                        const TypeIcon = typeInfo.icon

                        return (
                          <div key={event.id} className={`p-4 rounded-lg border-l-4 ${getPriorityColor(event.priority)} bg-slate-50`}>
                            <div className="flex items-start gap-3">
                              <div className={`p-2 ${typeInfo.bgColor} rounded-lg`}>
                                <TypeIcon className={`w-4 h-4 ${typeInfo.color}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-slate-900">{event.title}</h4>
                                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusInfo.color}`}>
                                    {statusInfo.label}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-600 mb-2">{event.description}</p>
                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                  <span>{new Date(event.date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</span>
                                  <span>{event.author}</span>
                                  {event.amount && (
                                    <span className="font-medium text-green-600">€{event.amount}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white rounded-2xl border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">Prossimi Eventi</h3>
                  <p className="text-sm text-slate-500 mt-1">Prossimi 7 giorni</p>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {upcomingEvents.slice(0, 5).map((event) => {
                      const typeInfo = getEventTypeInfo(event.type)
                      const statusInfo = getStatusInfo(event.status)
                      const TypeIcon = typeInfo.icon

                      return (
                        <div key={event.id} className={`p-4 rounded-lg border-l-4 ${getPriorityColor(event.priority)} hover:bg-slate-50 transition-colors`}>
                          <div className="flex items-start gap-3">
                            <div className={`p-2 ${typeInfo.bgColor} rounded-lg`}>
                              <TypeIcon className={`w-4 h-4 ${typeInfo.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-slate-900">{event.title}</h4>
                                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusInfo.color}`}>
                                  {statusInfo.label}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 mb-2 line-clamp-1">{event.description}</p>
                              <div className="flex items-center gap-4 text-xs text-slate-500">
                                <span>{new Date(event.date).toLocaleDateString('it-IT')}</span>
                                <span>{new Date(event.date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</span>
                                <span>{event.author}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded">
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* All Events Timeline */}
            <div className="bg-white rounded-2xl border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Timeline Eventi</h3>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                      <Filter className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {events.slice(0, 8).map((event) => {
                    const typeInfo = getEventTypeInfo(event.type)
                    const statusInfo = getStatusInfo(event.status)
                    const TypeIcon = typeInfo.icon

                    return (
                      <div key={event.id} className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-lg transition-colors">
                        <div className={`p-3 ${typeInfo.bgColor} rounded-xl`}>
                          <TypeIcon className={`w-5 h-5 ${typeInfo.color}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-slate-900">{event.title}</h4>
                            <span className={`px-3 py-1 text-xs rounded-full font-medium ${statusInfo.color}`}>
                              {statusInfo.label}
                            </span>
                            {event.priority === 'high' && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                                Alta priorità
                              </span>
                            )}
                          </div>
                          
                          <p className="text-sm text-slate-600 mb-3">{event.description}</p>
                          
                          <div className="flex items-center gap-6 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(event.date).toLocaleDateString('it-IT')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(event.date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{event.author}</span>
                            </div>
                            {event.amount && (
                              <div className="flex items-center gap-1">
                                <Euro className="w-4 h-4" />
                                <span className="font-medium text-green-600">€{event.amount}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}