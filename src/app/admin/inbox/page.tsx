'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Inbox,
  Mail,
  MessageSquare,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  Reply,
  Trash2,
  Search,
  Filter,
  Menu,
  Star,
  Archive
} from 'lucide-react'
import AdminSidebar from '../../components/AdminSidebar'

export default function AdminInboxPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
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

  const messages = [
    {
      id: 1,
      from: {
        name: 'Marco Rossi',
        email: 'marco.rossi@email.com',
        avatar: 'MR'
      },
      subject: 'Problema con pagamento newsletter',
      preview: 'Ciao, ho un problema con il pagamento della mia ultima newsletter. Non riesco a ricevere...',
      content: 'Ciao, ho un problema con il pagamento della mia ultima newsletter. Non riesco a ricevere i fondi nonostante siano passati 3 giorni dalla pubblicazione. Potreste aiutarmi a risolvere questa situazione? Grazie.',
      timestamp: '2024-02-20T10:30:00Z',
      status: 'unread',
      priority: 'high',
      category: 'payment',
      starred: true
    },
    {
      id: 2,
      from: {
        name: 'Anna Bianchi',
        email: 'anna.bianchi@email.com',
        avatar: 'AB'
      },
      subject: 'Richiesta supporto tecnico',
      preview: 'Buongiorno, sto avendo difficoltà con la piattaforma di editing delle newsletter...',
      content: 'Buongiorno, sto avendo difficoltà con la piattaforma di editing delle newsletter. Quando provo a caricare le immagini, il sistema si blocca. Potreste aiutarmi?',
      timestamp: '2024-02-20T09:15:00Z',
      status: 'unread',
      priority: 'medium',
      category: 'technical',
      starred: false
    },
    {
      id: 3,
      from: {
        name: 'Luigi Verdi',
        email: 'luigi.verdi@email.com',
        avatar: 'LV'
      },
      subject: 'Proposta di collaborazione',
      preview: 'Salve, rappresento TechStartup Italia e vorremmo proporre una collaborazione...',
      content: 'Salve, rappresento TechStartup Italia e vorremmo proporre una collaborazione per promuovere il nostro nuovo prodotto attraverso le newsletter dei vostri creator.',
      timestamp: '2024-02-20T08:45:00Z',
      status: 'read',
      priority: 'low',
      category: 'business',
      starred: false
    },
    {
      id: 4,
      from: {
        name: 'Giulia Neri',
        email: 'giulia.neri@email.com',
        avatar: 'GN'
      },
      subject: 'Aggiornamento profilo autore',
      preview: 'Ciao, vorrei aggiornare le informazioni del mio profilo ma non trovo...',
      content: 'Ciao, vorrei aggiornare le informazioni del mio profilo ma non trovo l\'opzione nelle impostazioni. Come posso modificare la mia bio e le informazioni di contatto?',
      timestamp: '2024-02-19T16:20:00Z',
      status: 'read',
      priority: 'low',
      category: 'support',
      starred: false
    },
    {
      id: 5,
      from: {
        name: 'Francesco Blu',
        email: 'francesco.blu@email.com',
        avatar: 'FB'
      },
      subject: 'Problema moderazione contenuto',
      preview: 'La mia newsletter è stata bloccata per moderazione ma non capisco il motivo...',
      content: 'La mia newsletter è stata bloccata per moderazione ma non capisco il motivo. Il contenuto rispetta tutte le linee guida della piattaforma. Potreste rivedere la decisione?',
      timestamp: '2024-02-19T14:10:00Z',
      status: 'unread',
      priority: 'high',
      category: 'moderation',
      starred: true
    }
  ]

  const filters = [
    { value: 'all', label: 'Tutti i messaggi', count: messages.length },
    { value: 'unread', label: 'Non letti', count: messages.filter(m => m.status === 'unread').length },
    { value: 'starred', label: 'Importanti', count: messages.filter(m => m.starred).length },
    { value: 'high', label: 'Alta priorità', count: messages.filter(m => m.priority === 'high').length }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-orange-600 bg-orange-100'
      default: return 'text-slate-600 bg-slate-100'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'payment': return '💳'
      case 'technical': return '🔧'
      case 'business': return '💼'
      case 'support': return '❓'
      case 'moderation': return '🔍'
      default: return '📧'
    }
  }

  const filteredMessages = messages.filter(message => {
    const matchesFilter = selectedFilter === 'all' ||
      (selectedFilter === 'unread' && message.status === 'unread') ||
      (selectedFilter === 'starred' && message.starred) ||
      (selectedFilter === 'high' && message.priority === 'high')
    
    const matchesSearch = message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.preview.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

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
                <Inbox className="w-6 h-6 text-red-600" />
                <h1 className="text-xl font-semibold text-slate-900">Inbox Admin</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto px-6 py-6">
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cerca messaggi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                {filters.map(filter => (
                  <button
                    key={filter.value}
                    onClick={() => setSelectedFilter(filter.value)}
                    className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                      selectedFilter === filter.value
                        ? 'bg-red-600 text-white'
                        : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    {filter.label} ({filter.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Messages List */}
            <div className="bg-white rounded-2xl border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Messaggi ({filteredMessages.length})
                  </h3>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                      <Archive className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-200">
                {filteredMessages.map((message) => (
                  <div key={message.id} className={`p-6 hover:bg-slate-50 transition-colors ${
                    message.status === 'unread' ? 'bg-blue-50/30' : ''
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {message.from.avatar}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-slate-900">
                                {message.from.name}
                              </h4>
                              {message.status === 'unread' && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            <span className="text-xs text-slate-500">
                              {new Date(message.timestamp).toLocaleString('it-IT')}
                            </span>
                            <span className="text-lg">{getCategoryIcon(message.category)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-medium text-slate-900 truncate">
                              {message.subject}
                            </h5>
                            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getPriorityColor(message.priority)}`}>
                              {message.priority === 'high' ? 'Alta' : message.priority === 'medium' ? 'Media' : 'Bassa'}
                            </span>
                          </div>
                          
                          <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                            {message.preview}
                          </p>
                          
                          <div className="flex items-center gap-2">
                            <button className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors">
                              <Reply className="w-3 h-3" />
                              Rispondi
                            </button>
                            <button className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-200 transition-colors">
                              <Archive className="w-3 h-3" />
                              Archivia
                            </button>
                            {message.starred ? (
                              <Star className="w-4 h-4 text-amber-500 fill-current" />
                            ) : (
                              <button className="p-1 text-slate-400 hover:text-amber-500">
                                <Star className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Messaggi oggi</p>
                    <p className="text-lg font-semibold text-slate-900">12</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Da rispondere</p>
                    <p className="text-lg font-semibold text-slate-900">3</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Risolti oggi</p>
                    <p className="text-lg font-semibold text-slate-900">8</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Clock className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Tempo medio</p>
                    <p className="text-lg font-semibold text-slate-900">2.5h</p>
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