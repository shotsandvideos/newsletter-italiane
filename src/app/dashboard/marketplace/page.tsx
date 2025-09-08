'use client'

import { useState } from 'react'
import { 
  ShoppingBag,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  Eye,
  Star,
  Filter,
  Search,
  ChevronRight,
  Calendar,
  MapPin,
  Target,
  Send,
  CheckCircle,
  AlertCircle,
  Menu,
  X
} from 'lucide-react'
import { useAuth } from '../../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Sidebar from '../../components/Sidebar'

export default function MarketplacePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/sign-in')
    }
  }, [authLoading, user, router])
  const [activeTab, setActiveTab] = useState('campaigns')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { value: 'all', label: 'Tutte le categorie' },
    { value: 'tech', label: 'Tecnologia' },
    { value: 'fintech', label: 'Fintech' },
    { value: 'startup', label: 'Startup' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'lifestyle', label: 'Lifestyle' }
  ]

  const campaigns = [
    {
      id: 1,
      title: 'Lancia la Nuova App Fintech',
      brand: 'FinanceFlow',
      logo: '💰',
      budget: '€2,500 - €5,000',
      category: 'fintech',
      deadline: '2024-03-15',
      requirements: {
        minSubscribers: 5000,
        targetAudience: 'Professionisti 25-45 anni',
        location: 'Italia'
      },
      description: 'Cerchiamo newsletter nel settore finance/business per promuovere il lancio della nostra nuova app di gestione finanziaria personale.',
      tags: ['App Launch', 'Finance', 'B2C'],
      status: 'active',
      applicants: 12,
      featured: true
    },
    {
      id: 2,
      title: 'Promozione Corso Marketing Digitale',
      brand: 'MarketingPro Academy',
      logo: '🎯',
      budget: '€800 - €1,500',
      category: 'marketing',
      deadline: '2024-03-20',
      requirements: {
        minSubscribers: 2000,
        targetAudience: 'Marketer e imprenditori',
        location: 'Italia'
      },
      description: 'Cercamos partnership per promuovere il nostro nuovo corso avanzato di marketing digitale.',
      tags: ['Education', 'Marketing', 'Course'],
      status: 'active',
      applicants: 8
    },
    {
      id: 3,
      title: 'Startup Week Milano 2024',
      brand: 'Startup Events',
      logo: '🚀',
      budget: '€1,200 - €2,000',
      category: 'startup',
      deadline: '2024-03-10',
      requirements: {
        minSubscribers: 3000,
        targetAudience: 'Ecosystem startup',
        location: 'Milano'
      },
      description: 'Partnership per promuovere il più grande evento startup del Nord Italia.',
      tags: ['Event', 'Networking', 'Milano'],
      status: 'closing-soon',
      applicants: 15
    }
  ]

  const myApplications = [
    {
      id: 1,
      campaignTitle: 'Lancia la Nuova App Fintech',
      brand: 'FinanceFlow',
      appliedDate: '2024-02-10',
      status: 'under_review',
      proposedAmount: '€3,500',
      message: 'La mia newsletter Tech Weekly ha oltre 8.000 iscritti nel target ideale...'
    },
    {
      id: 2,
      campaignTitle: 'AI Tool per Designers',
      brand: 'DesignAI',
      appliedDate: '2024-02-08',
      status: 'accepted',
      proposedAmount: '€2,000',
      message: 'Partnership confermata! Invio programmato per il 15 marzo.'
    },
    {
      id: 3,
      campaignTitle: 'Corso Python Avanzato',
      brand: 'CodeAcademy',
      appliedDate: '2024-02-05',
      status: 'rejected',
      proposedAmount: '€1,200',
      message: 'Grazie per la candidatura, ma cerchiamo un target più specifico.'
    }
  ]

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'under_review':
        return { 
          label: 'In revisione', 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Clock
        }
      case 'accepted':
        return { 
          label: 'Accettata', 
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle
        }
      case 'rejected':
        return { 
          label: 'Rifiutata', 
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: AlertCircle
        }
      default:
        return { 
          label: status, 
          color: 'bg-slate-100 text-slate-800 border-slate-200',
          icon: Clock
        }
    }
  }

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesCategory = selectedCategory === 'all' || campaign.category === selectedCategory
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.brand.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (authLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar 
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

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
              <h1 className="text-xl font-semibold text-gray-900">Marketplace</h1>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-lg">
                Beta
              </span>
              <ShoppingBag className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto px-6 py-6">
          <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <p className="text-slate-600 mt-1">
                  Scopri e candidati alle campagne dei brand
                </p>
              </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'campaigns'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Campagne attive
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'applications'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Le mie candidature
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'campaigns' ? (
        <div className="space-y-8">
          {/* How it works */}
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-6 rounded-2xl border border-emerald-100">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <ShoppingBag className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Come funziona</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">Invia candidatura</h4>
                      <p className="text-sm text-slate-600 mt-1">
                        Candidati con le tue idee e proposta economica
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">Revisione brand</h4>
                      <p className="text-sm text-slate-600 mt-1">
                        Il brand valuta compatibilità e audience
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">Collabora</h4>
                      <p className="text-sm text-slate-600 mt-1">
                        Avvia la collaborazione con pagamento gestito
                      </p>
                    </div>
                  </div>
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
                placeholder="Cerca campagne..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors text-sm font-medium">
              <Filter className="w-4 h-4" />
              Altri filtri
            </button>
          </div>

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCampaigns.map((campaign) => (
              <div key={campaign.id} className={`bg-white p-6 rounded-2xl border transition-all hover:shadow-lg ${
                campaign.featured ? 'border-emerald-200 ring-1 ring-emerald-100' : 'border-slate-200 hover:border-slate-300'
              }`}>
                {campaign.featured && (
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    <span className="text-xs font-medium text-amber-600">Campagna in evidenza</span>
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{campaign.logo}</div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{campaign.title}</h3>
                      <p className="text-sm text-slate-600">{campaign.brand}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-emerald-600">{campaign.budget}</div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Users className="w-3 h-3" />
                      {campaign.applicants} candidati
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                  {campaign.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {campaign.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Target className="w-4 h-4" />
                    <span>Min. {campaign.requirements.minSubscribers.toLocaleString()} iscritti</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="w-4 h-4" />
                    <span>{campaign.requirements.targetAudience}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4" />
                    <span>{campaign.requirements.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span className={campaign.status === 'closing-soon' ? 'text-red-600' : 'text-slate-600'}>
                      Scadenza: {new Date(campaign.deadline).toLocaleDateString('it-IT')}
                    </span>
                    {campaign.status === 'closing-soon' && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded">
                        Scade presto
                      </span>
                    )}
                  </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium">
                  <Send className="w-4 h-4" />
                  Candidati ora
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        ) : (
          <div>
          {/* My Applications */}
          <div className="bg-white rounded-2xl border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Le tue candidature</h3>
              <p className="text-sm text-slate-500 mt-1">Monitora lo stato delle tue candidature</p>
            </div>
            
            <div className="divide-y divide-slate-200">
              {myApplications.map((application) => {
                const statusInfo = getStatusInfo(application.status)
                const StatusIcon = statusInfo.icon
                
                return (
                  <div key={application.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div>
                            <h4 className="font-medium text-slate-900">{application.campaignTitle}</h4>
                            <p className="text-sm text-slate-600 mt-1">{application.brand}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                              <span>Candidato il {new Date(application.appliedDate).toLocaleDateString('it-IT')}</span>
                              <span>•</span>
                              <span className="font-medium text-emerald-600">{application.proposedAmount}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mt-3 line-clamp-2">{application.message}</p>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium ${statusInfo.color}`}>
                          <StatusIcon className="w-4 h-4" />
                          {statusInfo.label}
                        </div>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          </div>
        )}
          </div>
        </main>
      </div>
    </div>
  )
}