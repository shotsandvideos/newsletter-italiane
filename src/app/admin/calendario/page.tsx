'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar,
  CalendarDays,
  Clock,
  AlertCircle,
  CheckCircle,
  Users,
  Mail,
  Search,
  Filter,
  Menu,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react'
import AdminSidebar from '../../components/AdminSidebar'
import { useRequireAdmin } from '../../../hooks/useRequireAdmin'

export default function AdminCalendarioPage() {
  const { isAdmin, loading: authLoading } = useRequireAdmin()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [events, setEvents] = useState([])

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const getEventsForDate = (date: Date) => {
    const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
    return events.filter(event => event.event_date === dateStr)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setSelectedDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ]

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']

  useEffect(() => {
    if (authLoading || !isAdmin) {
      return
    }

    const fetchEvents = async () => {
      try {
        const month = selectedDate.getMonth() + 1
        const year = selectedDate.getFullYear()
        
        const response = await fetch(`/api/admin/calendar?month=${month}&year=${year}`)
        const result = await response.json()
        
        if (result.success) {
          setEvents(result.data)
        } else {
          console.error('Error fetching events:', result.error)
        }
      } catch (error) {
        console.error('Error fetching events:', error)
      }
    }

    fetchEvents()
  }, [authLoading, isAdmin, selectedDate])

  const getEventTypeInfo = (sponsorshipType: string) => {
    const normalized = sponsorshipType?.trim()
    const label = normalized ? `Campagna: ${normalized}` : 'Campagna Sponsorizzata'
    return { label, icon: Users, color: 'text-red-600', bgColor: 'bg-red-100' }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'scheduled':
        return { label: 'Programmato', color: 'bg-blue-100 text-blue-700' }
      case 'completed':
        return { label: 'Completato', color: 'bg-green-100 text-green-700' }
      case 'cancelled':
        return { label: 'Cancellato', color: 'bg-red-100 text-red-700' }
      default:
        return { label: status, color: 'bg-slate-100 text-slate-700' }
    }
  }

  // Get events for today and upcoming
  const today = new Date()
  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.event_date)
    return eventDate.toDateString() === today.toDateString()
  })

  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.event_date)
      return eventDate > today && eventDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    })
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())

  const eventStats = {
    total: events.length,
    scheduled: events.filter(e => e.status === 'scheduled').length,
    completed: events.filter(e => e.status === 'completed').length,
    cancelled: events.filter(e => e.status === 'cancelled').length
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="flex h-screen bg-slate-50 admin-panel">
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
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto px-6 py-6">
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-xl">
                    <CalendarDays className="w-5 h-5 text-red-600" />
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
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {eventStats.scheduled}
                    </p>
                    <p className="text-sm text-slate-600">Programmati</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {eventStats.completed}
                    </p>
                    <p className="text-sm text-slate-600">Completati</p>
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
                      {eventStats.cancelled}
                    </p>
                    <p className="text-sm text-slate-600">Cancellati</p>
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
                        const typeInfo = getEventTypeInfo(event.sponsorship_type)
                        const statusInfo = getStatusInfo(event.status)
                        const TypeIcon = typeInfo.icon

                        return (
                          <div key={event.id} className="p-4 rounded-lg border-l-4 border-l-red-500 bg-slate-50">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 ${typeInfo.bgColor} rounded-lg`}>
                                <TypeIcon className={`w-4 h-4 ${typeInfo.color}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-slate-900">{event.brand_name} - {event.newsletter_title}</h4>
                                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusInfo.color}`}>
                                    {statusInfo.label}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-600 mb-2">{event.description || `${event.sponsorship_type} - ${event.product_type}`}</p>
                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                  <span>{event.newsletter_author}</span>
                                  <span>{event.sponsorship_type}</span>
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
                  {upcomingEvents.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500">Nessun evento programmato</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingEvents.slice(0, 5).map((event) => {
                        const typeInfo = getEventTypeInfo(event.sponsorship_type)
                        const statusInfo = getStatusInfo(event.status)
                        const TypeIcon = typeInfo.icon

                        return (
                          <div key={event.id} className="p-4 rounded-lg border-l-4 border-l-red-500 hover:bg-slate-50 transition-colors">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 ${typeInfo.bgColor} rounded-lg`}>
                                <TypeIcon className={`w-4 h-4 ${typeInfo.color}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-slate-900">{event.brand_name} - {event.newsletter_title}</h4>
                                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusInfo.color}`}>
                                    {statusInfo.label}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-600 mb-2 line-clamp-1">{event.description || `${event.sponsorship_type} - ${event.product_type}`}</p>
                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                  <span>{new Date(event.event_date).toLocaleDateString('it-IT')}</span>
                                  <span>{event.newsletter_author}</span>
                                  <span>{event.sponsorship_type}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded">
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Calendar View */}
            {viewMode === 'month' && (
              <div className="bg-white rounded-2xl border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">Vista Calendario</h3>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => navigateMonth('prev')}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 text-slate-500" />
                      </button>
                      
                      <h4 className="text-lg font-semibold text-slate-900">
                        {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                      </h4>
                      
                      <button
                        onClick={() => navigateMonth('next')}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-slate-500" />
                      </button>
                      
                      <button
                        onClick={() => setSelectedDate(new Date())}
                        className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                      >
                        Oggi
                      </button>
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden">
                  {/* Days header */}
                  <div className="grid grid-cols-7 border-b border-slate-200">
                    {dayNames.map((day) => (
                      <div key={day} className="px-4 py-3 text-sm font-medium text-slate-700 bg-slate-50 text-center">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar days */}
                  <div className="grid grid-cols-7">
                    {getDaysInMonth(selectedDate).map((day, index) => {
                      const dayEvents = day ? getEventsForDate(day) : []
                      const isToday = day && day.toDateString() === new Date().toDateString()
                      const isCurrentMonth = day && day.getMonth() === selectedDate.getMonth()

                      return (
                        <div
                          key={index}
                          className={`min-h-[120px] border-r border-b border-slate-200 p-2 ${
                            !isCurrentMonth ? 'bg-slate-50' : ''
                          }`}
                        >
                          {day && (
                            <>
                              <div className="flex items-center justify-between mb-2">
                                <span
                                  className={`text-sm font-medium ${
                                    isToday
                                      ? 'bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center'
                                      : isCurrentMonth
                                      ? 'text-slate-900'
                                      : 'text-slate-400'
                                  }`}
                                >
                                  {day.getDate()}
                                </span>
                              </div>
                              
                              <div className="space-y-1">
                                {dayEvents.slice(0, 2).map((event) => {
                                  const statusInfo = getStatusInfo(event.status)
                                  return (
                                    <div
                                      key={event.id}
                                      className={`text-xs p-1 rounded truncate ${statusInfo.color}`}
                                      title={`${event.brand_name} - ${event.newsletter_title}`}
                                    >
                                      {event.brand_name}
                                    </div>
                                  )
                                })}
                                {dayEvents.length > 2 && (
                                  <div className="text-xs text-slate-500 p-1">
                                    +{dayEvents.length - 2} altri
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Timeline Events (when not in month view) */}
            {viewMode !== 'month' && (
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
                  {events.length === 0 ? (
                    <div className="text-center py-12">
                      <CalendarDays className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <h4 className="font-medium text-slate-900 mb-2">Nessun evento</h4>
                      <p className="text-slate-500">
                        Non ci sono eventi programmati al momento
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {events.slice(0, 8).map((event) => {
                        const typeInfo = getEventTypeInfo(event.sponsorship_type)
                        const statusInfo = getStatusInfo(event.status)
                        const TypeIcon = typeInfo.icon

                        return (
                          <div key={event.id} className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-lg transition-colors">
                            <div className={`p-3 ${typeInfo.bgColor} rounded-xl`}>
                              <TypeIcon className={`w-5 h-5 ${typeInfo.color}`} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold text-slate-900">{event.brand_name} - {event.newsletter_title}</h4>
                                <span className={`px-3 py-1 text-xs rounded-full font-medium ${statusInfo.color}`}>
                                  {statusInfo.label}
                                </span>
                              </div>
                              
                              <p className="text-sm text-slate-600 mb-3">{event.description || `${event.sponsorship_type} - ${event.product_type}`}</p>
                              
                              <div className="flex items-center gap-6 text-sm text-slate-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{new Date(event.event_date).toLocaleDateString('it-IT')}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  <span>{event.newsletter_author}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Mail className="w-4 h-4" />
                                  <span>{event.newsletter_email}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
