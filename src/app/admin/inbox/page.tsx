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
  Archive,
  CreditCard,
  Users,
  HelpCircle
} from 'lucide-react'
import AdminSidebar from '../../components/AdminSidebar'

export default function AdminInboxPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMessage, setSelectedMessage] = useState(null)
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

  const messages = []

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
      case 'payment': return CreditCard
      case 'technical': return AlertCircle
      case 'business': return Users
      case 'support': return HelpCircle
      case 'moderation': return Search
      default: return Mail
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

        {/* Split View Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Message List - Left Panel */}
          <div className="w-96 bg-white border-r border-slate-200 flex flex-col">
            {/* Filters */}
            <div className="p-4 border-b border-slate-200 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cerca messaggi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-1">
                {filters.map(filter => (
                  <button
                    key={filter.value}
                    onClick={() => setSelectedFilter(filter.value)}
                    className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                      selectedFilter === filter.value
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {filter.label.split(' ')[0]} ({filter.count})
                  </button>
                ))}
              </div>
            </div>
            
            {/* Messages List */}
            <div className="flex-1 overflow-y-auto flex items-center justify-center">
              {filteredMessages.length === 0 && (
                <div className="text-center p-8">
                  <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h4 className="font-medium text-slate-900 mb-2">Inbox vuota</h4>
                  <p className="text-sm text-slate-500">
                    Non ci sono messaggi da visualizzare
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Message Content - Right Panel */}
          <div className="flex-1 bg-white flex flex-col">
            {selectedMessage ? (
              <>
                {/* Message Header */}
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h1 className="text-lg font-semibold text-slate-900 mb-2">
                        {selectedMessage.subject}
                      </h1>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{selectedMessage.from.name} ({selectedMessage.from.email})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(selectedMessage.timestamp).toLocaleString('it-IT')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className={`p-2 rounded-lg transition-colors ${
                        selectedMessage.starred 
                          ? 'text-yellow-500 hover:bg-yellow-50' 
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                      }`}>
                        <Star className={`w-4 h-4 ${selectedMessage.starred ? 'fill-current' : ''}`} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                        <Archive className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Message Body */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="prose prose-sm max-w-none">
                    {selectedMessage.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="text-slate-700 leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Reply Actions */}
                <div className="p-6 border-t border-slate-200 bg-slate-50">
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                      <Reply className="w-4 h-4" />
                      Rispondi
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-white transition-colors">
                      <Archive className="w-4 h-4" />
                      Archivia
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Mail className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    Seleziona un messaggio
                  </h3>
                  <p className="text-slate-500">
                    Scegli un messaggio dalla lista per visualizzarlo
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}