'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  HandHeart,
  Building2,
  Calendar,
  Euro,
  Users,
  Search,
  Filter,
  Menu,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  MessageSquare,
  TrendingUp,
  Target,
  MapPin
} from 'lucide-react'
import AdminSidebar from '../../components/AdminSidebar'

export default function AdminPropostePage() {
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

  const proposals = [
    {
      id: 1,
      title: 'Campagna di Lancio App Fintech',
      brand: {
        name: 'FinanceFlow',
        logo: 'FF',
        website: 'financeflow.com',
        sector: 'Fintech'
      },
      budget: {
        min: 2500,
        max: 5000,
        currency: 'EUR'
      },
      description: 'Cerchiamo newsletter nel settore finance/business per promuovere il lancio della nostra nuova app di gestione finanziaria personale.',
      requirements: {
        minSubscribers: 5000,
        targetAudience: 'Professionisti 25-45 anni',
        location: 'Italia',
        categories: ['Finance', 'Business', 'Technology']
      },
      timeline: {
        submittedAt: '2024-02-18T14:30:00Z',
        deadline: '2024-03-15T23:59:00Z',
        campaignStart: '2024-03-01T00:00:00Z'
      },
      status: 'pending',
      applications: 12,
      priority: 'high',
      contact: {
        name: 'Marco Gentili',
        role: 'Marketing Director',
        email: 'marco.gentili@financeflow.com',
        phone: '+39 02 1234567'
      }
    },
    {
      id: 2,
      title: 'Promozione Corso Marketing Digitale',
      brand: {
        name: 'MarketingPro Academy',
        logo: 'MP',
        website: 'marketingpro.academy',
        sector: 'Education'
      },
      budget: {
        min: 800,
        max: 1500,
        currency: 'EUR'
      },
      description: 'Cerchiamo partnership per promuovere il nostro nuovo corso avanzato di marketing digitale rivolto a imprenditori e professionisti del settore.',
      requirements: {
        minSubscribers: 2000,
        targetAudience: 'Marketer e imprenditori',
        location: 'Italia',
        categories: ['Marketing', 'Business', 'Education']
      },
      timeline: {
        submittedAt: '2024-02-17T10:15:00Z',
        deadline: '2024-03-20T23:59:00Z',
        campaignStart: '2024-03-10T00:00:00Z'
      },
      status: 'approved',
      applications: 8,
      priority: 'medium',
      contact: {
        name: 'Laura Rossi',
        role: 'Head of Growth',
        email: 'laura.rossi@marketingpro.academy',
        phone: '+39 06 9876543'
      },
      approvedAt: '2024-02-17T16:45:00Z',
      approvedBy: 'Admin'
    },
    {
      id: 3,
      title: 'Partnership E-commerce Summit Milano',
      brand: {
        name: 'E-commerce Events',
        logo: 'EE',
        website: 'ecommerceevents.it',
        sector: 'Events'
      },
      budget: {
        min: 1200,
        max: 2500,
        currency: 'EUR'
      },
      description: 'Promozione del più grande summit e-commerce del Nord Italia con speaker internazionali e networking opportunities.',
      requirements: {
        minSubscribers: 3000,
        targetAudience: 'E-commerce managers e imprenditori',
        location: 'Milano e provincia',
        categories: ['E-commerce', 'Business', 'Technology']
      },
      timeline: {
        submittedAt: '2024-02-16T09:20:00Z',
        deadline: '2024-03-05T23:59:00Z',
        campaignStart: '2024-02-25T00:00:00Z'
      },
      status: 'rejected',
      applications: 5,
      priority: 'low',
      contact: {
        name: 'Alessandro Bianchi',
        role: 'Event Manager',
        email: 'alessandro@ecommerceevents.it',
        phone: '+39 02 5551234'
      },
      rejectedAt: '2024-02-16T18:30:00Z',
      rejectedBy: 'Admin',
      rejectionReason: 'Budget insufficiente rispetto ai requisiti di audience'
    },
    {
      id: 4,
      title: 'Lancio Piattaforma SaaS B2B',
      brand: {
        name: 'CloudTech Solutions',
        logo: 'CT',
        website: 'cloudtech.solutions',
        sector: 'SaaS'
      },
      budget: {
        min: 3000,
        max: 6000,
        currency: 'EUR'
      },
      description: 'Promozione del lancio della nostra nuova piattaforma SaaS per la gestione documentale aziendale rivolta alle PMI italiane.',
      requirements: {
        minSubscribers: 7000,
        targetAudience: 'Decision maker aziendali, CTO, IT Manager',
        location: 'Italia',
        categories: ['SaaS', 'Technology', 'Business']
      },
      timeline: {
        submittedAt: '2024-02-20T11:45:00Z',
        deadline: '2024-04-01T23:59:00Z',
        campaignStart: '2024-03-15T00:00:00Z'
      },
      status: 'under_review',
      applications: 0,
      priority: 'high',
      contact: {
        name: 'Stefania Verde',
        role: 'CMO',
        email: 'stefania.verde@cloudtech.solutions',
        phone: '+39 011 7890123'
      }
    }
  ]

  const filters = [
    { value: 'all', label: 'Tutte', count: proposals.length },
    { value: 'pending', label: 'In attesa', count: proposals.filter(p => p.status === 'pending').length },
    { value: 'under_review', label: 'In revisione', count: proposals.filter(p => p.status === 'under_review').length },
    { value: 'approved', label: 'Approvate', count: proposals.filter(p => p.status === 'approved').length },
    { value: 'rejected', label: 'Rifiutate', count: proposals.filter(p => p.status === 'rejected').length }
  ]

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'In attesa', color: 'bg-yellow-100 text-yellow-700', icon: Clock }
      case 'under_review':
        return { label: 'In revisione', color: 'bg-blue-100 text-blue-700', icon: AlertCircle }
      case 'approved':
        return { label: 'Approvata', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle }
      case 'rejected':
        return { label: 'Rifiutata', color: 'bg-red-100 text-red-700', icon: XCircle }
      default:
        return { label: status, color: 'bg-slate-100 text-slate-700', icon: Clock }
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-orange-500'
      default: return 'border-l-slate-300'
    }
  }

  const filteredProposals = proposals.filter(proposal => {
    const matchesFilter = selectedFilter === 'all' || proposal.status === selectedFilter
    const matchesSearch = proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.brand.sector.toLowerCase().includes(searchQuery.toLowerCase())
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
                <HandHeart className="w-6 h-6 text-red-600" />
                <h1 className="text-xl font-semibold text-slate-900">Gestione Proposte</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto px-6 py-6">
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <HandHeart className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      {proposals.length}
                    </p>
                    <p className="text-xs text-slate-600">Proposte</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Clock className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      {proposals.filter(p => ['pending', 'under_review'].includes(p.status)).length}
                    </p>
                    <p className="text-xs text-slate-600">Da revisionare</p>
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
                      {proposals.filter(p => p.status === 'approved').length}
                    </p>
                    <p className="text-xs text-slate-600">Approvate</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Euro className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      €{proposals.reduce((sum, p) => sum + p.budget.max, 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-600">Budget</p>
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
                  placeholder="Cerca proposte, brand o settori..."
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

            {/* Proposals List */}
            <div className="bg-white rounded-lg border border-slate-200">
              <div className="p-4 border-b border-slate-200">
                <h3 className="text-base font-semibold text-slate-900">
                  Proposte ({filteredProposals.length})
                </h3>
              </div>

              <div className="divide-y divide-slate-200">
                {filteredProposals.map((proposal) => {
                  const statusInfo = getStatusInfo(proposal.status)
                  const StatusIcon = statusInfo.icon

                  return (
                    <div key={proposal.id} className={`p-3 hover:bg-slate-50 transition-colors border-l-4 ${getPriorityColor(proposal.priority)}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-red-100 text-red-600 font-bold text-sm rounded-lg flex items-center justify-center flex-shrink-0">
                            {proposal.brand.logo}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-medium text-slate-900 truncate">
                                {proposal.title}
                              </h4>
                              <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                <StatusIcon className="w-3 h-3" />
                                {statusInfo.label}
                              </span>
                              {proposal.priority === 'high' && (
                                <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                                  Alta
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-4 text-xs text-slate-600">
                              <span className="flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                {proposal.brand.name}
                              </span>
                              <span className="px-1.5 py-0.5 bg-slate-100 rounded text-xs">
                                {proposal.brand.sector}
                              </span>
                              <span className="flex items-center gap-1">
                                <Euro className="w-3 h-3" />
                                €{proposal.budget.min.toLocaleString()}-€{proposal.budget.max.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {proposal.applications} candidature
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Scadenza {new Date(proposal.timeline.deadline).toLocaleDateString('it-IT')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Target className="w-3 h-3" />
                                Min. {proposal.requirements.minSubscribers.toLocaleString()} iscritti
                              </span>
                            </div>

                            {proposal.status === 'rejected' && proposal.rejectionReason && (
                              <div className="text-xs text-red-700 bg-red-50 px-2 py-1 rounded mt-1">
                                Rifiutata: {proposal.rejectionReason}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-3">
                          <button className="p-1.5 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors">
                            <Eye className="w-3 h-3" />
                          </button>
                          
                          {['pending', 'under_review'].includes(proposal.status) && (
                            <>
                              <button className="p-1.5 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-700 transition-colors">
                                <CheckCircle className="w-3 h-3" />
                              </button>
                              <button className="p-1.5 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors">
                                <XCircle className="w-3 h-3" />
                              </button>
                            </>
                          )}

                          <button className="p-1.5 bg-slate-100 text-slate-600 text-xs rounded hover:bg-slate-200 transition-colors">
                            <MessageSquare className="w-3 h-3" />
                          </button>
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