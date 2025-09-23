'use client'

import { useAuth } from '../../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, ChevronLeft, ChevronRight, Clock, Users, Menu, X, CheckCircle, XCircle } from 'lucide-react'
import Sidebar from '../../components/Sidebar'

interface CalendarEvent {
  id: string
  proposal_id: string
  newsletter_id: string
  event_date: string
  title: string
  description: string
  status: string
  brand_name: string
  sponsorship_type: string
  product_type: string
  newsletter_title: string
  created_at: string
  updated_at: string
}

export default function CalendarPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [showEventModal, setShowEventModal] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/sign-in')
    }
  }, [authLoading, user, router])

  // Fetch calendar events
  useEffect(() => {
    if (!user) {
      return
    }

    const fetchEvents = async () => {
      try {
        const month = currentDate.getMonth() + 1
        const year = currentDate.getFullYear()

        const response = await fetch(`/api/calendar?month=${month}&year=${year}`)
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
  }, [currentDate, user])

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
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'completed': return 'bg-green-100 text-green-700 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="w-3 h-3" />
      case 'completed': return <CheckCircle className="w-3 h-3" />
      case 'cancelled': return <XCircle className="w-3 h-3" />
      default: return <Clock className="w-3 h-3" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Programmato'
      case 'completed': return 'Completato'
      case 'cancelled': return 'Cancellato'
      default: return status
    }
  }

  const monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ]

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setShowEventModal(true)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
      </div>
    )
  }

  const days = getDaysInMonth(currentDate)

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar 
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
              >
                <Menu className="w-5 h-5" />
              </button>
              <Calendar className="w-5 h-5 text-slate-500" />
              <h1 className="text-xl font-semibold text-gray-900">Calendario</h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto px-6 py-6">
          {/* Calendar Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-slate-500" />
              </button>
              
              <h2 className="text-lg font-semibold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              >
                Oggi
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Days header */}
            <div className="grid grid-cols-7 border-b border-gray-200">
              {dayNames.map((day) => (
                <div key={day} className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 text-center">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7">
              {days.map((day, index) => {
                const dayEvents = day ? getEventsForDate(day) : []
                const isToday = day && typeof window !== 'undefined' && day.toDateString() === new Date().toDateString()
                const isCurrentMonth = day && day.getMonth() === currentDate.getMonth()

                return (
                  <div
                    key={index}
                    className={`min-h-[120px] border-r border-b border-gray-200 p-2 ${
                      !isCurrentMonth ? 'bg-gray-50' : ''
                    }`}
                  >
                    {day && (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`text-sm font-medium ${
                              isToday
                                ? 'bg-slate-600 text-white w-6 h-6 rounded-full flex items-center justify-center'
                                : isCurrentMonth
                                ? 'text-slate-900'
                                : 'text-slate-400'
                            }`}
                          >
                            {day.getDate()}
                          </span>
                        </div>
                        
                        {/* Events */}
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <button
                              key={event.id}
                              onClick={() => handleEventClick(event)}
                              className={`w-full text-left text-xs p-1.5 rounded border ${getStatusColor(event.status)} hover:opacity-80 transition-opacity`}
                            >
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span className="truncate font-medium">
                                  {event.brand_name}
                                </span>
                              </div>
                            </button>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-500 font-medium">
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

          {/* Upcoming Events */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prossimi Eventi</h3>
            <div className="bg-white rounded-lg border border-gray-200">
              {events
                .filter(event => typeof window !== 'undefined' && new Date(event.event_date) >= new Date())
                .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
                .slice(0, 5)
                .map((event) => (
                  <button 
                    key={event.id} 
                    onClick={() => handleEventClick(event)}
                    className="w-full flex items-center gap-4 p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      event.status === 'scheduled' ? 'bg-blue-400' :
                      event.status === 'completed' ? 'bg-green-400' : 'bg-red-400'
                    }`} />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">{event.brand_name} - {event.newsletter_title}</h4>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(event.event_date).toLocaleDateString('it-IT')}
                        </div>
                        <span className="text-xs">
                          {event.sponsorship_type}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                          {getStatusLabel(event.status)}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              
              {events.filter(event => typeof window !== 'undefined' && new Date(event.event_date) >= new Date()).length === 0 && (
                <div className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="font-medium text-gray-900 mb-2">Nessun evento programmato</h4>
                  <p className="text-sm text-gray-500">
                    I tuoi prossimi eventi e scadenze appariranno qui.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Event Details Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Dettagli Evento</h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getStatusColor(selectedEvent.status)}`}>
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedEvent.brand_name}</h4>
                  <div className="text-sm text-gray-600 mt-1">
                    Collaborazione Sponsorizzata
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Data Pubblicazione</div>
                  <div className="font-medium">{new Date(selectedEvent.event_date).toLocaleDateString('it-IT')}</div>
                </div>
                <div>
                  <div className="text-gray-600">Newsletter</div>
                  <div className="font-medium">{selectedEvent.newsletter_title}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Tipo Sponsorizzazione</div>
                  <div className="font-medium">{selectedEvent.sponsorship_type}</div>
                </div>
                <div>
                  <div className="text-gray-600">Prodotto</div>
                  <div className="font-medium">{selectedEvent.product_type}</div>
                </div>
              </div>

              <div className="text-sm">
                <div className="text-gray-600">Status</div>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedEvent.status)}`}>
                  {getStatusIcon(selectedEvent.status)}
                  {getStatusLabel(selectedEvent.status)}
                </span>
              </div>

              {selectedEvent.description && (
                <div className="text-sm">
                  <div className="text-gray-600">Descrizione</div>
                  <div className="mt-1 p-2 bg-gray-50 rounded text-gray-900 text-xs">
                    {selectedEvent.description}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <Link
                    href="/dashboard/collaborations"
                    className="flex-1 px-4 py-2 bg-slate-600 text-white text-center rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
                    onClick={() => setShowEventModal(false)}
                  >
                    Vedi Collaborazioni
                  </Link>
                  <button
                    onClick={() => setShowEventModal(false)}
                    className="flex-1 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
                  >
                    Chiudi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
