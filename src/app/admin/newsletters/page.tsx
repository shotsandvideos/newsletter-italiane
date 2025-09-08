'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Mail,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Menu,
  Calendar,
  User,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
  ExternalLink
} from 'lucide-react'
import AdminSidebar from '../../components/AdminSidebar'

export default function AdminNewslettersPage() {
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

  const newsletters = [
    {
      id: 1,
      title: 'AI Revolution: 10 Tool che Cambieranno il Tuo Business',
      author: {
        name: 'Marco Rossi',
        email: 'marco.rossi@email.com',
        newsletter: 'Tech Weekly'
      },
      publishedAt: '2024-02-20T10:00:00Z',
      status: 'published',
      subscribers: 8234,
      openRate: 89.2,
      clickRate: 12.4,
      revenue: 850,
      category: 'Technology',
      content: {
        excerpt: 'Una panoramica completa sui tool di AI più innovativi che stanno rivoluzionando il mondo del business...',
        readTime: '8 min'
      },
      moderation: {
        approved: true,
        approvedBy: 'Admin',
        approvedAt: '2024-02-20T09:45:00Z'
      }
    },
    {
      id: 2,
      title: 'Startup Italiana Raccoglie 50M: La Storia di TechFlow',
      author: {
        name: 'Anna Bianchi',
        email: 'anna.bianchi@email.com',
        newsletter: 'Startup Italia'
      },
      publishedAt: '2024-02-19T15:30:00Z',
      status: 'published',
      subscribers: 7891,
      openRate: 76.8,
      clickRate: 8.9,
      revenue: 720,
      category: 'Business',
      content: {
        excerpt: 'La straordinaria storia di TechFlow, la startup milanese che ha appena chiuso un round da 50 milioni...',
        readTime: '6 min'
      },
      moderation: {
        approved: true,
        approvedBy: 'Admin',
        approvedAt: '2024-02-19T14:15:00Z'
      }
    },
    {
      id: 3,
      title: 'Investimenti Crypto: Guida Completa 2024',
      author: {
        name: 'Luigi Verdi',
        email: 'luigi.verdi@email.com',
        newsletter: 'Crypto Italia'
      },
      publishedAt: null,
      status: 'pending_review',
      subscribers: 0,
      openRate: 0,
      clickRate: 0,
      revenue: 0,
      category: 'Finance',
      content: {
        excerpt: 'Una guida dettagliata per investire in criptovalute nel 2024, con analisi dei trend e strategie...',
        readTime: '12 min'
      },
      moderation: {
        approved: false,
        flaggedReason: 'Contenuto finanziario da verificare'
      }
    },
    {
      id: 4,
      title: 'Marketing Automation: Le Migliori Strategie',
      author: {
        name: 'Giulia Neri',
        email: 'giulia.neri@email.com',
        newsletter: 'Marketing Pro'
      },
      publishedAt: '2024-02-18T11:00:00Z',
      status: 'published',
      subscribers: 6543,
      openRate: 82.1,
      clickRate: 9.7,
      revenue: 480,
      category: 'Marketing',
      content: {
        excerpt: 'Scopri come automatizzare i tuoi processi di marketing per massimizzare conversioni e ROI...',
        readTime: '10 min'
      },
      moderation: {
        approved: true,
        approvedBy: 'Admin',
        approvedAt: '2024-02-18T10:30:00Z'
      }
    },
    {
      id: 5,
      title: 'E-commerce Trends 2024: Cosa Aspettarsi',
      author: {
        name: 'Francesco Blu',
        email: 'francesco.blu@email.com',
        newsletter: 'E-commerce Daily'
      },
      publishedAt: null,
      status: 'rejected',
      subscribers: 0,
      openRate: 0,
      clickRate: 0,
      revenue: 0,
      category: 'E-commerce',
      content: {
        excerpt: 'Analisi dei trend emergenti nell\'e-commerce per il 2024 e come prepararsi ai cambiamenti...',
        readTime: '7 min'
      },
      moderation: {
        approved: false,
        rejectedReason: 'Contenuto duplicato rispetto ad altra newsletter',
        rejectedBy: 'Admin',
        rejectedAt: '2024-02-17T16:20:00Z'
      }
    }
  ]

  const filters = [
    { value: 'all', label: 'Tutte', count: newsletters.length },
    { value: 'published', label: 'Pubblicate', count: newsletters.filter(n => n.status === 'published').length },
    { value: 'pending_review', label: 'In revisione', count: newsletters.filter(n => n.status === 'pending_review').length },
    { value: 'rejected', label: 'Rifiutate', count: newsletters.filter(n => n.status === 'rejected').length }
  ]

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'published':
        return { label: 'Pubblicata', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle }
      case 'pending_review':
        return { label: 'In revisione', color: 'bg-yellow-100 text-yellow-700', icon: Clock }
      case 'rejected':
        return { label: 'Rifiutata', color: 'bg-red-100 text-red-700', icon: XCircle }
      default:
        return { label: status, color: 'bg-slate-100 text-slate-700', icon: Clock }
    }
  }

  const filteredNewsletters = newsletters.filter(newsletter => {
    const matchesFilter = selectedFilter === 'all' || newsletter.status === selectedFilter
    const matchesSearch = newsletter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      newsletter.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      newsletter.category.toLowerCase().includes(searchQuery.toLowerCase())
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
                <Mail className="w-6 h-6 text-red-600" />
                <h1 className="text-xl font-semibold text-slate-900">Gestione Newsletter</h1>
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
                  <div className="p-2 bg-emerald-100 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {newsletters.filter(n => n.status === 'published').length}
                    </p>
                    <p className="text-sm text-slate-600">Newsletter pubblicate</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-xl">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {newsletters.filter(n => n.status === 'pending_review').length}
                    </p>
                    <p className="text-sm text-slate-600">In attesa di revisione</p>
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
                      €{newsletters.filter(n => n.status === 'published').reduce((sum, n) => sum + n.revenue, 0)}
                    </p>
                    <p className="text-sm text-slate-600">Revenue generata</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <Eye className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {Math.round(newsletters.filter(n => n.status === 'published').reduce((sum, n) => sum + n.openRate, 0) / newsletters.filter(n => n.status === 'published').length)}%
                    </p>
                    <p className="text-sm text-slate-600">Tasso apertura medio</p>
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
                  placeholder="Cerca newsletter, autori o categorie..."
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

            {/* Newsletters List */}
            <div className="bg-white rounded-2xl border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">
                  Newsletter ({filteredNewsletters.length})
                </h3>
              </div>

              <div className="divide-y divide-slate-200">
                {filteredNewsletters.map((newsletter) => {
                  const statusInfo = getStatusInfo(newsletter.status)
                  const StatusIcon = statusInfo.icon

                  return (
                    <div key={newsletter.id} className="p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-lg font-semibold text-slate-900 truncate">
                                  {newsletter.title}
                                </h4>
                                <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                  <StatusIcon className="w-3 h-3" />
                                  {statusInfo.label}
                                </span>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                                <div className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  <span>{newsletter.author.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Mail className="w-4 h-4" />
                                  <span>{newsletter.author.newsletter}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>
                                    {newsletter.publishedAt ? 
                                      new Date(newsletter.publishedAt).toLocaleDateString('it-IT') :
                                      'Non pubblicata'
                                    }
                                  </span>
                                </div>
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs">
                                  {newsletter.category}
                                </span>
                              </div>

                              <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                                {newsletter.content.excerpt}
                              </p>

                              {newsletter.status === 'published' && (
                                <div className="grid grid-cols-4 gap-4 mb-4">
                                  <div className="text-center">
                                    <p className="text-lg font-semibold text-slate-900">
                                      {newsletter.subscribers.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-slate-500">Iscritti</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-lg font-semibold text-emerald-600">
                                      {newsletter.openRate}%
                                    </p>
                                    <p className="text-xs text-slate-500">Aperture</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-lg font-semibold text-blue-600">
                                      {newsletter.clickRate}%
                                    </p>
                                    <p className="text-xs text-slate-500">Click</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-lg font-semibold text-purple-600">
                                      €{newsletter.revenue}
                                    </p>
                                    <p className="text-xs text-slate-500">Revenue</p>
                                  </div>
                                </div>
                              )}

                              {newsletter.status === 'pending_review' && newsletter.moderation.flaggedReason && (
                                <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                  <p className="text-sm text-yellow-700">
                                    <strong>Motivo:</strong> {newsletter.moderation.flaggedReason}
                                  </p>
                                </div>
                              )}

                              {newsletter.status === 'rejected' && newsletter.moderation.rejectedReason && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                                  <XCircle className="w-4 h-4 text-red-600" />
                                  <p className="text-sm text-red-700">
                                    <strong>Rifiutata:</strong> {newsletter.moderation.rejectedReason}
                                  </p>
                                </div>
                              )}

                              <div className="flex items-center gap-2">
                                <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                                  <Eye className="w-4 h-4" />
                                  Anteprima
                                </button>
                                
                                {newsletter.status === 'pending_review' && (
                                  <>
                                    <button className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                                      <CheckCircle className="w-4 h-4" />
                                      Approva
                                    </button>
                                    <button className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                                      <XCircle className="w-4 h-4" />
                                      Rifiuta
                                    </button>
                                  </>
                                )}

                                {newsletter.status === 'published' && (
                                  <button className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">
                                    <ExternalLink className="w-4 h-4" />
                                    Visualizza
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