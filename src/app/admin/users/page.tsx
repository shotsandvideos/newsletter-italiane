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
      } catch {
        router.push('/admin/login')
      }
    } else {
      router.push('/admin/login')
    }
    setLoading(false)
  }, [router])

  // Only show authors who have at least one approved newsletter
  const users = [
    {
      id: 1,
      name: 'Marco Rossi',
      email: 'marco.rossi@email.com',
      role: 'creator',
      status: 'active',
      joinDate: '2024-01-15T10:00:00Z',
      lastLogin: '2024-02-20T14:30:00Z',
      avatar: 'MR',
      newsletter: {
        name: 'Tech Weekly',
        subscribers: 8234,
        totalNewsletters: 12,
        avgOpenRate: 89.2,
        totalRevenue: 2850
      },
      verification: {
        email: true,
        phone: false,
        identity: true
      },
      stats: {
        totalEarnings: 4250.50,
        collaborations: 8,
        rating: 4.9
      },
      hasApprovedNewsletter: true,
      approvedNewslettersCount: 12
    },
    {
      id: 2,
      name: 'Anna Bianchi',
      email: 'anna.bianchi@email.com',
      role: 'creator',
      status: 'active',
      joinDate: '2024-01-20T14:30:00Z',
      lastLogin: '2024-02-20T16:45:00Z',
      avatar: 'AB',
      newsletter: {
        name: 'Startup Italia',
        subscribers: 7891,
        totalNewsletters: 18,
        avgOpenRate: 76.8,
        totalRevenue: 3200
      },
      verification: {
        email: true,
        phone: true,
        identity: true
      },
      stats: {
        totalEarnings: 5680.75,
        collaborations: 15,
        rating: 4.7
      },
      hasApprovedNewsletter: true,
      approvedNewslettersCount: 18
    },
    {
      id: 3,
      name: 'Luigi Verdi',
      email: 'luigi.verdi@email.com',
      role: 'creator',
      status: 'suspended',
      joinDate: '2024-01-25T09:15:00Z',
      lastLogin: '2024-02-18T10:20:00Z',
      avatar: 'LV',
      newsletter: {
        name: 'Crypto Italia',
        subscribers: 5432,
        totalNewsletters: 6,
        avgOpenRate: 65.3,
        totalRevenue: 980
      },
      verification: {
        email: true,
        phone: false,
        identity: false
      },
      stats: {
        totalEarnings: 1250.25,
        collaborations: 3,
        rating: 3.8
      },
      suspendedReason: 'Contenuto non conforme alle policy',
      suspendedAt: '2024-02-17T16:30:00Z',
      hasApprovedNewsletter: true,
      approvedNewslettersCount: 6
    },
    {
      id: 5,
      name: 'Francesco Blu',
      email: 'francesco.blu@email.com',
      role: 'creator',
      status: 'active',
      joinDate: '2023-12-10T08:30:00Z',
      lastLogin: '2024-02-20T12:00:00Z',
      avatar: 'FB',
      newsletter: {
        name: 'E-commerce Daily',
        subscribers: 12650,
        totalNewsletters: 45,
        avgOpenRate: 82.1,
        totalRevenue: 8750
      },
      verification: {
        email: true,
        phone: true,
        identity: true
      },
      stats: {
        totalEarnings: 15680.90,
        collaborations: 28,
        rating: 4.8
      },
      featured: true,
      hasApprovedNewsletter: true,
      approvedNewslettersCount: 45
    }
  ].filter(user => user.hasApprovedNewsletter) // Only show authors with approved newsletters

  const handleSendMessage = () => {
    if (!chatMessage.trim() || !selectedUser) return
    
    // Here you would implement the actual message sending logic
    console.log('Sending message to:', selectedUser.name)
    console.log('Message:', chatMessage)
    
    // Show success feedback
    alert(`Messaggio inviato a ${selectedUser.name}!`)
    
    // Reset and close
    setChatMessage('')
    setShowChatModal(false)
    setSelectedUser(null)
  }

  const openChat = (user) => {
    setSelectedUser(user)
    setShowChatModal(true)
  }

  const filters = [
    { value: 'all', label: 'Tutti', count: users.length },
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
      case 'inactive':
        return { label: 'Inattivo', color: 'bg-slate-100 text-slate-700', icon: XCircle }
      default:
        return { label: status, color: 'bg-slate-100 text-slate-700', icon: AlertCircle }
    }
  }

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'admin':
        return { label: 'Admin', color: 'text-red-600', icon: Crown }
      case 'creator':
        return { label: 'Creator', color: 'text-blue-600', icon: Mail }
      case 'moderator':
        return { label: 'Moderatore', color: 'text-purple-600', icon: Shield }
      default:
        return { label: role, color: 'text-slate-600', icon: Users }
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesFilter = selectedFilter === 'all' || user.status === selectedFilter || user.role === selectedFilter
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.newsletter.name && user.newsletter.name.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  const totalStats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    totalRevenue: users.reduce((sum, u) => sum + u.stats.totalEarnings, 0),
    totalSubscribers: users.reduce((sum, u) => sum + u.newsletter.subscribers, 0)
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
                <Users className="w-6 h-6 text-red-600" />
                <h1 className="text-xl font-semibold text-slate-900">Gestione Autori</h1>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
              <UserPlus className="w-4 h-4" />
              Nuovo Autore
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto px-6 py-6">
          <div className="space-y-6">
            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-900">Autori con Newsletter Approvate</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Questa sezione mostra solo gli autori che hanno almeno una newsletter approvata dall'admin. 
                    Quando approvi una newsletter, l'autore viene automaticamente aggiunto a questa lista.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Users className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      {totalStats.totalUsers}
                    </p>
                    <p className="text-xs text-slate-600">Autori attivi</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      {users.reduce((sum, u) => sum + u.approvedNewslettersCount, 0)}
                    </p>
                    <p className="text-xs text-slate-600">Newsletter approvate</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      €{totalStats.totalRevenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-600">Revenue</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Mail className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      {totalStats.totalSubscribers.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-600">Iscritti</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cerca per nome, email o newsletter..."
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

            {/* Users List */}
            <div className="bg-white rounded-lg border border-slate-200">
              <div className="p-4 border-b border-slate-200">
                <h3 className="text-base font-semibold text-slate-900">
                  Autori ({filteredUsers.length})
                </h3>
              </div>

              <div className="divide-y divide-slate-200">
                {filteredUsers.map((user) => {
                  const statusInfo = getStatusInfo(user.status)
                  const StatusIcon = statusInfo.icon
                  const roleInfo = getRoleInfo(user.role)
                  const RoleIcon = roleInfo.icon

                  return (
                    <div key={user.id} className="p-3 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="relative flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-semibold">
                                {user.avatar}
                              </span>
                            </div>
                            {user.featured && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                                <Star className="w-2.5 h-2.5 text-white fill-current" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-medium text-slate-900">
                                {user.name}
                              </h4>
                              <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                <StatusIcon className="w-3 h-3" />
                                {statusInfo.label}
                              </span>
                              {user.featured && (
                                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                                  Featured
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-4 text-xs text-slate-600 mb-2">
                              <span>{user.email}</span>
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {user.newsletter.name}
                              </span>
                              <span>{user.newsletter.subscribers.toLocaleString()} iscritti</span>
                              <span>{user.approvedNewslettersCount} newsletter approvate</span>
                              <span className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${
                                    i < Math.floor(user.stats.rating) 
                                      ? 'text-amber-400 fill-current' 
                                      : 'text-slate-300'
                                  }`} />
                                ))}
                                <span className="ml-1">({user.stats.rating})</span>
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-slate-600">
                              <span>€{user.stats.totalEarnings.toLocaleString()} guadagni</span>
                              <span>{user.stats.collaborations} collaborazioni</span>
                              <span>Iscritto il {new Date(user.joinDate).toLocaleDateString('it-IT')}</span>
                              <span>Ultimo accesso: {new Date(user.lastLogin).toLocaleDateString('it-IT')}</span>
                            </div>


                            {user.status === 'suspended' && user.suspendedReason && (
                              <div className="text-xs text-red-700 bg-red-50 px-2 py-1 rounded mt-1">
                                Sospeso: {user.suspendedReason}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-3">
                          <button 
                            onClick={() => openChat(user)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors"
                          >
                            <MessageCircle className="w-3 h-3" />
                            Chat
                          </button>
                          
                          <button className="p-1.5 bg-slate-100 text-slate-600 text-xs rounded hover:bg-slate-200 transition-colors">
                            <Eye className="w-3 h-3" />
                          </button>
                          
                          <button className="p-1.5 bg-slate-100 text-slate-600 text-xs rounded hover:bg-slate-200 transition-colors">
                            <Edit className="w-3 h-3" />
                          </button>

                          {user.status === 'suspended' ? (
                            <button className="p-1.5 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-700 transition-colors">
                              <CheckCircle className="w-3 h-3" />
                            </button>
                          ) : user.status === 'active' && (
                            <button className="p-1.5 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors">
                              <Ban className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </main>

        {/* Chat Modal */}
        {showChatModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {selectedUser.avatar}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Messaggio a {selectedUser.name}</h3>
                      <p className="text-sm text-slate-600">{selectedUser.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowChatModal(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Messaggio
                    </label>
                    <textarea
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                      placeholder="Scrivi il tuo messaggio all'autore..."
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSendMessage}
                      disabled={!chatMessage.trim()}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-1"
                    >
                      <Send className="w-4 h-4" />
                      Invia Messaggio
                    </button>
                    
                    <button
                      onClick={() => setShowChatModal(false)}
                      className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Annulla
                    </button>
                  </div>
                  
                  <div className="text-xs text-slate-500">
                    <p>💡 Suggerimento: Usa questo strumento per comunicare direttamente con gli autori riguardo le loro newsletter, collaborazioni o questioni amministrative.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}