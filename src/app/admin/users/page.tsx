'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users,
  UserPlus,
  Search,
  Filter,
  Menu,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Mail,
  Calendar,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Ban,
  Shield,
  Crown,
  Star,
  MoreHorizontal,
  MessageCircle,
  Send,
  Phone
} from 'lucide-react'
import AdminSidebar from '../../components/AdminSidebar'

export default function AdminUsersPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showChatModal, setShowChatModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [chatMessage, setChatMessage] = useState('')
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
      } catch (error) {
        console.error('Error parsing admin session:', error)
        router.push('/admin/login')
      }
    } else {
      router.push('/admin/login')
    }
    setLoading(false)
  }, [router])

  // Real users data - will be fetched from API
  const users: any[] = []

  const handleSendMessage = () => {
    if (!chatMessage.trim() || !selectedUser) return
    
    // Here you would implement the actual message sending logic
    console.log('Sending message to:', selectedUser.name)
    console.log('Message:', chatMessage)
    
    // Reset form and close modal
    setChatMessage('')
    setShowChatModal(false)
    setSelectedUser(null)
    
    // Show success message (you can implement proper notifications)
    alert('Messaggio inviato con successo!')
  }

  const handleUserAction = (action: string, userId: number) => {
    console.log(`Action: ${action} for user: ${userId}`)
    // Here you would implement the actual user management logic
    alert(`Azione "${action}" eseguita per l'utente ${userId}`)
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

  const filterOptions = [
    { value: 'all', label: 'Tutti gli utenti', count: users.length },
    { value: 'active', label: 'Attivi', count: users.filter(u => u.status === 'active').length },
    { value: 'pending_verification', label: 'In verifica', count: users.filter(u => u.status === 'pending_verification').length },
    { value: 'suspended', label: 'Sospesi', count: users.filter(u => u.status === 'suspended').length },
    { value: 'creator', label: 'Creator', count: users.filter(u => u.role === 'creator').length }
  ]

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Attivo', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle }
      case 'pending_verification':
        return { label: 'In verifica', color: 'bg-yellow-100 text-yellow-700', icon: Clock }
      case 'suspended':
        return { label: 'Sospeso', color: 'bg-red-100 text-red-700', icon: Ban }
      default:
        return { label: status, color: 'bg-gray-100 text-gray-700', icon: AlertCircle }
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesFilter = selectedFilter === 'all' || user.status === selectedFilter || user.role === selectedFilter
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.newsletter?.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar 
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-slate-900">Gestione Autori</h1>
              <Users className="w-5 h-5 text-slate-500" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto px-6 py-6">
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cerca per nome, email o newsletter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {filterOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setSelectedFilter(option.value)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    selectedFilter === option.value
                      ? 'bg-red-100 text-red-700 border-red-200'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {option.label} ({option.count})
                </button>
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            {filteredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Autore</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Newsletter</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Performance</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((user) => {
                      const statusInfo = getStatusInfo(user.status)
                      const StatusIcon = statusInfo.icon
                      
                      return (
                        <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-red-700">{user.avatar}</span>
                              </div>
                              <div>
                                <div className="font-medium text-slate-900 text-sm">{user.name}</div>
                                <div className="text-xs text-slate-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <div className="text-sm font-medium text-slate-900">{user.newsletter?.name}</div>
                              <div className="text-xs text-slate-500">{user.newsletter?.subscribers?.toLocaleString()} iscritti</div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusInfo.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-xs text-slate-600">
                              <div>Open Rate: {user.newsletter?.avgOpenRate}%</div>
                              <div>Guadagni: €{user.stats?.totalEarnings?.toLocaleString()}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedUser(user)
                                  setShowChatModal(true)
                                }}
                                className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                title="Invia messaggio"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleUserAction('view', user.id)}
                                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                                title="Visualizza dettagli"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleUserAction('suspend', user.id)}
                                className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                title="Sospendi utente"
                              >
                                <Ban className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Nessun autore trovato</h3>
                <p className="text-slate-500 text-sm">Gli autori con newsletter approvate appariranno qui.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Chat Modal */}
      {showChatModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Messaggio a {selectedUser.name}
              </h3>
              <button 
                onClick={() => setShowChatModal(false)}
                className="p-1 hover:bg-slate-100 rounded-md transition-colors"
              >
                <XCircle className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Messaggio
                </label>
                <textarea
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Scrivi il tuo messaggio..."
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button 
                onClick={() => setShowChatModal(false)}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
              >
                Annulla
              </button>
              <button 
                onClick={handleSendMessage}
                disabled={!chatMessage.trim()}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Invia
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}