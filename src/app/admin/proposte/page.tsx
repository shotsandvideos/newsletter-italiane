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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <HandHeart className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {proposals.length}
                    </p>
                    <p className="text-sm text-slate-600">Proposte totali</p>
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
                      {proposals.filter(p => ['pending', 'under_review'].includes(p.status)).length}
                    </p>
                    <p className="text-sm text-slate-600">Da revisionare</p>
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
                      {proposals.filter(p => p.status === 'approved').length}
                    </p>
                    <p className="text-sm text-slate-600">Approvate</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-xl">
                    <Euro className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      €{proposals.reduce((sum, p) => sum + p.budget.max, 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-600">Budget totale</p>
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
            <div className="bg-white rounded-2xl border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">
                  Proposte ({filteredProposals.length})
                </h3>
              </div>

              <div className="divide-y divide-slate-200">
                {filteredProposals.map((proposal) => {
                  const statusInfo = getStatusInfo(proposal.status)
                  const StatusIcon = statusInfo.icon

                  return (
                    <div key={proposal.id} className={`p-6 hover:bg-slate-50 transition-colors border-l-4 ${getPriorityColor(proposal.priority)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-red-100 text-red-600 font-bold text-lg rounded-xl flex items-center justify-center flex-shrink-0">
                              {proposal.brand.logo}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-lg font-semibold text-slate-900">
                                  {proposal.title}
                                </h4>
                                <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                  <StatusIcon className="w-3 h-3" />
                                  {statusInfo.label}
                                </span>
                                {proposal.priority === 'high' && (
                                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                                    Alta priorità
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                                <div className="flex items-center gap-1">
                                  <Building2 className="w-4 h-4" />
                                  <span className="font-medium">{proposal.brand.name}</span>
                                </div>
                                <span className="px-2 py-1 bg-slate-100 rounded-lg">
                                  {proposal.brand.sector}
                                </span>
                                <div className="flex items-center gap-1">
                                  <Euro className="w-4 h-4" />
                                  <span>€{proposal.budget.min.toLocaleString()} - €{proposal.budget.max.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  <span>{proposal.applications} candidature</span>
                                </div>
                              </div>

                              <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                                {proposal.description}
                              </p>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-1 text-xs text-slate-500">
                                    <Target className="w-3 h-3" />
                                    <span>Target Audience</span>
                                  </div>
                                  <p className="text-sm text-slate-700">{proposal.requirements.targetAudience}</p>
                                  <p className="text-xs text-slate-500">Min. {proposal.requirements.minSubscribers.toLocaleString()} iscritti</p>
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex items-center gap-1 text-xs text-slate-500">
                                    <MapPin className="w-3 h-3" />
                                    <span>Localizzazione</span>
                                  </div>
                                  <p className="text-sm text-slate-700">{proposal.requirements.location}</p>
                                  <div className="flex flex-wrap gap-1">
                                    {proposal.requirements.categories.map((category, index) => (
                                      <span key={index} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                                        {category}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex items-center gap-1 text-xs text-slate-500">
                                    <Calendar className="w-3 h-3" />
                                    <span>Timeline</span>
                                  </div>
                                  <p className="text-sm text-slate-700">
                                    Scadenza: {new Date(proposal.timeline.deadline).toLocaleDateString('it-IT')}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    Inizio: {new Date(proposal.timeline.campaignStart).toLocaleDateString('it-IT')}
                                  </p>
                                </div>
                              </div>

                              {proposal.status === 'rejected' && proposal.rejectionReason && (
                                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                                  <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium text-red-800">Proposta rifiutata</p>
                                    <p className="text-sm text-red-700 mt-1">{proposal.rejectionReason}</p>
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-2">
                                <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                                  <Eye className="w-4 h-4" />
                                  Dettagli
                                </button>
                                
                                {['pending', 'under_review'].includes(proposal.status) && (
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

                                <button className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">
                                  <MessageSquare className="w-4 h-4" />
                                  Contatta
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