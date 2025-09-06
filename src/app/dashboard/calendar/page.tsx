'use client'

import { useAuth } from '../../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, Euro, Users, Mail, Menu, X, CheckCircle, XCircle, ExternalLink } from 'lucide-react'
import Sidebar from '../../components/Sidebar'

interface CalendarEvent {
  id: string
  title: string
  type: 'newsletter' | 'collaboration' | 'payment'
  date: Date
  time?: string
  amount?: number
  status: 'pending' | 'confirmed' | 'completed'
  brandSpecsUrl?: string
  collaborationId?: string
}

export default function CalendarPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [showEventModal, setShowEventModal] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/sign-in')
    }
  }, [authLoading, user, router])

  // Mock events for demonstration
  useEffect(() => {
    const mockEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Newsletter Marketing Express - Invio programmato',
        type: 'newsletter',
        date: new Date(2025, 7, 30), // Aug 30, 2025
        time: '09:00',
        status: 'confirmed'
      },
      {
        id: '2',
        title: 'Pagamento da TechBrand - €250',
        type: 'payment',
        date: new Date(2025, 8, 2), // Sep 2, 2025
        amount: 250,
        status: 'pending'
      },
      {
        id: '3',
        title: 'Call con StartupX - Revisione contenuti',
        type: 'collaboration',
        date: new Date(2025, 8, 5), // Sep 5, 2025
        time: '15:30',
        status: 'confirmed',
        brandSpecsUrl: 'https://docs.google.com/document/d/123abc/edit',
        collaborationId: '1'
      },
      {
        id: '4',
        title: 'Newsletter Tech Weekly - Invio programmato',
        type: 'newsletter',
        date: new Date(2025, 8, 8), // Sep 8, 2025
        time: '08:00',
        status: 'confirmed'
      }
    ]
    setEvents(mockEvents)
  }, [])

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
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    )
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

  const getEventTypeIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'newsletter': return <Mail className="w-3 h-3" />
      case 'payment': return <Euro className="w-3 h-3" />
      case 'collaboration': return <Users className="w-3 h-3" />
    }
  }

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'newsletter': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'payment': return 'bg-green-100 text-green-700 border-green-200'
      case 'collaboration': return 'bg-purple-100 text-purple-700 border-purple-200'
    }
  }

  const getStatusColor = (status: CalendarEvent['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-green-50 border-green-200'
      case 'pending': return 'bg-yellow-50 border-yellow-200'
      case 'completed': return 'bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: CalendarEvent['status']) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-3 h-3" />
      case 'pending': return <Clock className="w-3 h-3" />
      case 'completed': return <CheckCircle className="w-3 h-3" />
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
              <Calendar className="w-5 h-5 text-gray-500" />
              <h1 className="text-xl font-semibold text-gray-900">Calendario</h1>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              Nuovo Evento
            </button>
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
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <h2 className="text-lg font-semibold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
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
                                ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center'
                                : isCurrentMonth
                                ? 'text-gray-900'
                                : 'text-gray-400'
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
                              className={`w-full text-left text-xs p-1.5 rounded border ${getEventTypeColor(event.type)} ${getStatusColor(event.status)} hover:opacity-80 transition-opacity`}
                            >
                              <div className="flex items-center gap-1">
                                {getEventTypeIcon(event.type)}
                                <span className="truncate font-medium">
                                  {event.time && `${event.time} - `}
                                  {event.title.split(' - ')[0]}
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
                .filter(event => typeof window !== 'undefined' && event.date >= new Date())
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .slice(0, 5)
                .map((event) => (
                  <button 
                    key={event.id} 
                    onClick={() => handleEventClick(event)}
                    className="w-full flex items-center gap-4 p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      event.type === 'newsletter' ? 'bg-blue-500' :
                      event.type === 'payment' ? 'bg-green-500' : 'bg-purple-500'
                    }`} />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        {event.amount && (
                          <span className="text-sm font-medium text-green-600">€{event.amount}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {event.date.toLocaleDateString('it-IT')}
                        </div>
                        {event.time && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {event.time}
                          </div>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          event.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          event.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {event.status === 'confirmed' ? 'Confermato' :
                           event.status === 'pending' ? 'In attesa' : 'Completato'}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              
              {events.filter(event => typeof window !== 'undefined' && event.date >= new Date()).length === 0 && (
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
                <div className={`p-2 rounded-lg ${getEventTypeColor(selectedEvent.type)}`}>
                  {getEventTypeIcon(selectedEvent.type)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedEvent.title}</h4>
                  <div className="text-sm text-gray-600 mt-1">
                    {selectedEvent.type === 'newsletter' && 'Newsletter'}
                    {selectedEvent.type === 'collaboration' && 'Collaborazione'}
                    {selectedEvent.type === 'payment' && 'Pagamento'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Data</div>
                  <div className="font-medium">{selectedEvent.date.toLocaleDateString('it-IT')}</div>
                </div>
                {selectedEvent.time && (
                  <div>
                    <div className="text-gray-600">Orario</div>
                    <div className="font-medium">{selectedEvent.time}</div>
                  </div>
                )}
              </div>

              {selectedEvent.amount && (
                <div className="text-sm">
                  <div className="text-gray-600">Importo</div>
                  <div className="font-medium text-green-600">€{selectedEvent.amount}</div>
                </div>
              )}

              <div className="text-sm">
                <div className="text-gray-600">Status</div>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${getStatusColor(selectedEvent.status)}`}>
                  {getStatusIcon(selectedEvent.status)}
                  {selectedEvent.status === 'confirmed' ? 'Confermato' :
                   selectedEvent.status === 'pending' ? 'In attesa' : 'Completato'}
                </span>
              </div>

              {selectedEvent.brandSpecsUrl && (
                <div className="text-sm">
                  <div className="text-gray-600">Specifiche Brand</div>
                  <a
                    href={selectedEvent.brandSpecsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Visualizza specifiche richieste
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <div className="flex gap-2">
                  {selectedEvent.type === 'collaboration' && selectedEvent.collaborationId && (
                    <Link
                      href="/dashboard/collaborations"
                      className="flex-1 px-4 py-2 bg-purple-600 text-white text-center rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                      onClick={() => setShowEventModal(false)}
                    >
                      Vedi Collaborazione
                    </Link>
                  )}
                  {selectedEvent.brandSpecsUrl && (
                    <a
                      href={selectedEvent.brandSpecsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Vedi Specifiche
                    </a>
                  )}
                  <button
                    onClick={() => setShowEventModal(false)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
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
