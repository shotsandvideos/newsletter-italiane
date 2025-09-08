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
  MoreHorizontal
} from 'lucide-react'
import AdminSidebar from '../../components/AdminSidebar'

export default function AdminUsersPage() {
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
      }
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
      }
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
      suspendedAt: '2024-02-17T16:30:00Z'
    },
    {
      id: 4,
      name: 'Giulia Neri',
      email: 'giulia.neri@email.com',
      role: 'creator',
      status: 'pending_verification',
      joinDate: '2024-02-18T11:00:00Z',
      lastLogin: '2024-02-20T09:15:00Z',
      avatar: 'GN',
      newsletter: {
        name: 'Marketing Pro',
        subscribers: 0,
        totalNewsletters: 0,
        avgOpenRate: 0,
        totalRevenue: 0
      },
      verification: {
        email: true,
        phone: false,
        identity: false
      },
      stats: {
        totalEarnings: 0,
        collaborations: 0,
        rating: 0
      }
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
      featured: true
    }
  ]

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
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {totalStats.totalUsers}
                    </p>
                    <p className="text-sm text-slate-600">Utenti totali</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {totalStats.activeUsers}
                    </p>
                    <p className="text-sm text-slate-600">Utenti attivi</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      €{totalStats.totalRevenue.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-600">Revenue totale</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-xl">
                    <Mail className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {totalStats.totalSubscribers.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-600">Iscritti totali</p>
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
            <div className="bg-white rounded-2xl border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">
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
                    <div key={user.id} className="p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold">
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
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-semibold text-slate-900">
                                {user.name}
                              </h4>
                              <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                <StatusIcon className="w-3 h-3" />
                                {statusInfo.label}
                              </span>
                              <span className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium ${roleInfo.color}`}>
                                <RoleIcon className="w-3 h-3" />
                                {roleInfo.label}
                              </span>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                              <span>{user.email}</span>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>Iscritto il {new Date(user.joinDate).toLocaleDateString('it-IT')}</span>
                              </div>
                              <span>
                                Ultimo accesso: {new Date(user.lastLogin).toLocaleDateString('it-IT')}
                              </span>
                            </div>

                            {user.newsletter.name && (
                              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-medium text-slate-900">{user.newsletter.name}</h5>
                                  <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star key={i} className={`w-3 h-3 ${
                                        i < Math.floor(user.stats.rating) 
                                          ? 'text-amber-400 fill-current' 
                                          : 'text-slate-300'
                                      }`} />
                                    ))}
                                    <span className="text-xs text-slate-500 ml-1">({user.stats.rating})</span>
                                  </div>
                                </div>
                                <div className="grid grid-cols-4 gap-4 text-sm">
                                  <div className="text-center">
                                    <p className="font-semibold text-slate-900">
                                      {user.newsletter.subscribers.toLocaleString()}
                                    </p>
                                    <p className="text-slate-500">Iscritti</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="font-semibold text-slate-900">
                                      {user.newsletter.totalNewsletters}
                                    </p>
                                    <p className="text-slate-500">Newsletter</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="font-semibold text-emerald-600">
                                      {user.newsletter.avgOpenRate}%
                                    </p>
                                    <p className="text-slate-500">Aperture</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="font-semibold text-purple-600">
                                      €{user.stats.totalEarnings.toLocaleString()}
                                    </p>
                                    <p className="text-slate-500">Guadagni</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {user.status === 'suspended' && user.suspendedReason && (
                              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                                <Ban className="w-4 h-4 text-red-600 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-red-800">Account sospeso</p>
                                  <p className="text-sm text-red-700">{user.suspendedReason}</p>
                                  <p className="text-xs text-red-600 mt-1">
                                    Sospeso il {new Date(user.suspendedAt!).toLocaleDateString('it-IT')}
                                  </p>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                                <Eye className="w-4 h-4" />
                                Profilo
                              </button>
                              
                              <button className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">
                                <Edit className="w-4 h-4" />
                                Modifica
                              </button>

                              {user.status === 'suspended' ? (
                                <button className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                                  <CheckCircle className="w-4 h-4" />
                                  Riattiva
                                </button>
                              ) : user.status === 'active' && (
                                <button className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                                  <Ban className="w-4 h-4" />
                                  Sospendi
                                </button>
                              )}

                              <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}