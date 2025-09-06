'use client'

import { useAuth } from '../../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Euro,
  MessageSquare,
  Calendar,
  Building,
  Mail,
  Filter,
  Search,
  MoreHorizontal,
  ExternalLink,
  FileText,
  Star,
  AlertCircle,
  Menu,
  X,
  Link as LinkIcon,
  Image,
  Download,
  Trash2
} from 'lucide-react'
import Sidebar from '../../components/Sidebar'

// Mock data for collaborations - in real app this would come from API
const mockCollaborations = [
  {
    id: '1',
    brand: 'TechStartup Italia',
    brandIcon: TrendingUp,
    newsletter: 'Marketing Espresso',
    status: 'active' as const,
    type: 'sponsored_content',
    value: 250,
    deadline: '2025-01-15',
    createdAt: '2025-01-10',
    description: 'Promozione della nuova piattaforma SaaS per piccole aziende',
    requirements: [
      'Menzione nel subject line',
      'Link primario nella newsletter',
      'Call-to-action chiara'
    ],
    deliverables: [
      { name: 'Bozza newsletter', completed: true, dueDate: '2025-01-12' },
      { name: 'Invio newsletter', completed: false, dueDate: '2025-01-15' },
      { name: 'Report metriche', completed: false, dueDate: '2025-01-17' }
    ],
    brief: 'TechStartup Italia sta lanciando una nuova piattaforma SaaS che aiuta le piccole aziende a gestire i loro processi di vendita. Il target sono imprenditori e manager di PMI italiane.',
    trackingUrl: 'https://techstartup.com/newsletter-signup?ref=marketing-espresso&utm_source=newsletter&utm_campaign=saas-launch',
    materials: [
      { name: 'Logo aziendale', type: 'image', url: '/assets/techstartup-logo.png' },
      { name: 'Screenshot prodotto', type: 'image', url: '/assets/product-screenshot.png' },
      { name: 'Press kit', type: 'document', url: '/assets/press-kit.pdf' }
    ]
  },
  {
    id: '2',
    brand: 'Fintech Solutions',
    brandIcon: Euro,
    newsletter: 'Marketing Espresso',
    status: 'pending' as const,
    type: 'newsletter_mention',
    value: 150,
    deadline: '2025-01-20',
    createdAt: '2025-01-08',
    description: 'Menzione della nuova app di gestione finanziaria',
    requirements: [
      'Breve menzione (50-100 parole)',
      'Link al sito web'
    ],
    deliverables: [
      { name: 'Conferma partecipazione', completed: true, dueDate: '2025-01-10' },
      { name: 'Contenuto da includere', completed: false, dueDate: '2025-01-18' },
      { name: 'Invio newsletter', completed: false, dueDate: '2025-01-20' }
    ]
  },
  {
    id: '3',
    brand: 'EcoProducts',
    brandIcon: Users,
    newsletter: 'Marketing Espresso',
    status: 'completed' as const,
    type: 'sponsored_content',
    value: 300,
    deadline: '2025-01-05',
    createdAt: '2024-12-28',
    description: 'Campagna per prodotti eco-sostenibili',
    requirements: [
      'Articolo dedicato',
      'Immagini fornite dal brand',
      'Sconto esclusivo per lettori'
    ],
    deliverables: [
      { name: 'Bozza articolo', completed: true, dueDate: '2025-01-02' },
      { name: 'Invio newsletter', completed: true, dueDate: '2025-01-05' },
      { name: 'Report finale', completed: true, dueDate: '2025-01-07' }
    ]
  }
]

type CollaborationStatus = 'active' | 'pending' | 'completed' | 'cancelled'

export default function CollaborationsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [collaborations] = useState(mockCollaborations)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | CollaborationStatus>('all')
  const [selectedTab, setSelectedTab] = useState<'active' | 'completed'>('active')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedCollaboration, setSelectedCollaboration] = useState<typeof mockCollaborations[0] | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [collaborationToDelete, setCollaborationToDelete] = useState<typeof mockCollaborations[0] | null>(null)
  const [deleteReason, setDeleteReason] = useState('')

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/sign-in')
    }
  }, [authLoading, user, router])

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const getStatusColor = (status: CollaborationStatus) => {
    switch (status) {
      case 'active': return 'text-blue-700 bg-blue-50 ring-blue-600/20'
      case 'completed': return 'text-green-700 bg-green-50 ring-green-600/20'
      case 'pending': return 'text-yellow-700 bg-yellow-50 ring-yellow-600/20'
      case 'cancelled': return 'text-red-700 bg-red-50 ring-red-600/20'
      default: return 'text-gray-700 bg-gray-50 ring-gray-600/20'
    }
  }

  const getStatusIcon = (status: CollaborationStatus) => {
    switch (status) {
      case 'active': return <Clock className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <AlertCircle className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getStatusText = (status: CollaborationStatus) => {
    switch (status) {
      case 'active': return 'In corso'
      case 'completed': return 'Completata'
      case 'pending': return 'In attesa'
      case 'cancelled': return 'Cancellata'
      default: return 'Sconosciuto'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'sponsored_content': return 'Contenuto sponsorizzato'
      case 'newsletter_mention': return 'Menzione newsletter'
      case 'product_review': return 'Recensione prodotto'
      default: return type
    }
  }

  const filteredCollaborations = collaborations.filter(collab => {
    const matchesSearch = collab.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         collab.newsletter.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || collab.status === statusFilter
    const matchesTab = selectedTab === 'active' 
      ? ['active', 'pending'].includes(collab.status)
      : collab.status === 'completed'
    return matchesSearch && matchesStatus && matchesTab
  })

  const stats = {
    total: collaborations.length,
    active: collaborations.filter(c => c.status === 'active').length,
    pending: collaborations.filter(c => c.status === 'pending').length,
    completed: collaborations.filter(c => c.status === 'completed').length,
    totalEarnings: collaborations
      .filter(c => c.status === 'completed')
      .reduce((sum, c) => sum + c.value, 0),
    pendingEarnings: collaborations
      .filter(c => ['active', 'pending'].includes(c.status))
      .reduce((sum, c) => sum + c.value, 0)
  }

  if (authLoading || loading) {
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
              <h1 className="text-xl font-semibold text-gray-900">Collaborazioni</h1>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
                <MessageSquare className="w-4 h-4" />
                Messaggi
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto px-6 py-6">
          {/* Stats Overview */}
          <div className="mb-8">
            <h2 className="text-base font-medium text-gray-900 mb-4">Panoramica</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
                    <p className="text-sm text-gray-600">Collaborazioni attive</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
                    <p className="text-sm text-gray-600">In attesa</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Euro className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-semibold text-gray-900">€{stats.totalEarnings}</p>
                    <p className="text-sm text-gray-600">Guadagnato</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-semibold text-gray-900">€{stats.pendingEarnings}</p>
                    <p className="text-sm text-gray-600">In attesa di pagamento</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setSelectedTab('active')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === 'active'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Attive ({stats.active + stats.pending})
                </button>
                <button
                  onClick={() => setSelectedTab('completed')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === 'completed'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Completate ({stats.completed})
                </button>
              </nav>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mb-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cerca brand o newsletter..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  Filtri
                </button>
              </div>
            </div>
          </div>

          {/* Collaborations List */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Collaborazioni ({filteredCollaborations.length})
              </h3>
            </div>

            {filteredCollaborations.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Users className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-base font-medium text-gray-900 mb-2">
                  {selectedTab === 'active' ? 'Nessuna collaborazione attiva' : 'Nessuna collaborazione completata'}
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  {selectedTab === 'active' 
                    ? 'Le nuove opportunità di collaborazione appariranno qui quando disponibili'
                    : 'Le collaborazioni completate verranno mostrate in questa sezione'
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredCollaborations.map((collaboration) => (
                  <div key={collaboration.id} className="px-6 py-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <collaboration.brandIcon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="text-base font-medium text-gray-900">
                              {collaboration.brand}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {collaboration.newsletter} • {getTypeText(collaboration.type)}
                            </p>
                          </div>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${getStatusColor(collaboration.status)}`}>
                            {getStatusIcon(collaboration.status)}
                            {getStatusText(collaboration.status)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-4">
                          {collaboration.description}
                        </p>
                        
                        <div className="flex items-center gap-6 text-xs text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Euro className="w-3 h-3" />
                            <span className="font-medium text-gray-900">€{collaboration.value}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Scadenza: {new Date(collaboration.deadline).toLocaleDateString('it-IT')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Creata: {new Date(collaboration.createdAt).toLocaleDateString('it-IT')}</span>
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-700">Progresso</span>
                            <span className="text-gray-500">
                              {collaboration.deliverables.filter(d => d.completed).length}/{collaboration.deliverables.length} completati
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ 
                                width: `${(collaboration.deliverables.filter(d => d.completed).length / collaboration.deliverables.length) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* Next deliverable */}
                        {collaboration.status === 'active' && (
                          <div className="bg-blue-50 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-900">
                                Prossima scadenza:
                              </span>
                              <span className="text-sm text-blue-700">
                                {collaboration.deliverables.find(d => !d.completed)?.name} 
                                - {collaboration.deliverables.find(d => !d.completed)?.dueDate && 
                                   new Date(collaboration.deliverables.find(d => !d.completed)!.dueDate).toLocaleDateString('it-IT')}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-6">
                        <button 
                          onClick={() => setSelectedCollaboration(collaboration)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <FileText className="w-4 h-4" />
                          Dettagli
                        </button>
                        
                        <button 
                          onClick={() => {
                            setCollaborationToDelete(collaboration)
                            setDeleteModalOpen(true)
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                          title="Elimina collaborazione"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Collaboration Detail Modal */}
      {selectedCollaboration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <selectedCollaboration.brandIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedCollaboration.brand}</h2>
                    <p className="text-sm text-gray-500">{selectedCollaboration.newsletter} • {getTypeText(selectedCollaboration.type)}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${getStatusColor(selectedCollaboration.status)}`}>
                    {getStatusIcon(selectedCollaboration.status)}
                    {getStatusText(selectedCollaboration.status)}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCollaboration(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">€{selectedCollaboration.value}</div>
                  <div className="text-sm text-green-700">Valore collaborazione</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {new Date(selectedCollaboration.deadline).toLocaleDateString('it-IT')}
                  </div>
                  <div className="text-sm text-blue-700">Scadenza</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {Math.round((selectedCollaboration.deliverables.filter(d => d.completed).length / selectedCollaboration.deliverables.length) * 100)}%
                  </div>
                  <div className="text-sm text-purple-700">Completamento</div>
                </div>
              </div>

              {/* Brief */}
              {selectedCollaboration.brief && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Brief</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{selectedCollaboration.brief}</p>
                  </div>
                </div>
              )}

              {/* Tracking URL */}
              {selectedCollaboration.trackingUrl && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">URL di tracciamento</h3>
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <LinkIcon className="w-4 h-4 text-blue-600" />
                    <a 
                      href={selectedCollaboration.trackingUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-mono truncate flex-1"
                    >
                      {selectedCollaboration.trackingUrl}
                    </a>
                    <button 
                      onClick={() => navigator.clipboard.writeText(selectedCollaboration.trackingUrl)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Requirements */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Requisiti</h3>
                <ul className="space-y-2">
                  {selectedCollaboration.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Materials */}
              {selectedCollaboration.materials && selectedCollaboration.materials.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Materiali forniti</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedCollaboration.materials.map((material, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {material.type === 'image' ? (
                            <Image className="w-4 h-4 text-gray-600" />
                          ) : (
                            <FileText className="w-4 h-4 text-gray-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{material.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{material.type}</p>
                        </div>
                        <button 
                          onClick={() => window.open(material.url, '_blank')}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Deliverables */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Deliverable</h3>
                <div className="space-y-3">
                  {selectedCollaboration.deliverables.map((deliverable, idx) => (
                    <div key={idx} className={`flex items-center gap-3 p-4 rounded-lg ${
                      deliverable.completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                    }`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        deliverable.completed ? 'bg-green-600' : 'bg-gray-300'
                      }`}>
                        {deliverable.completed && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${deliverable.completed ? 'text-green-900' : 'text-gray-900'}`}>
                          {deliverable.name}
                        </p>
                        <p className={`text-xs ${deliverable.completed ? 'text-green-700' : 'text-gray-500'}`}>
                          Scadenza: {new Date(deliverable.dueDate).toLocaleDateString('it-IT')}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        deliverable.completed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {deliverable.completed ? 'Completato' : 'In attesa'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                    Invia messaggio
                  </button>
                  {selectedCollaboration.status === 'active' && (
                    <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
                      Segna come completato
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setSelectedCollaboration(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
                >
                  Chiudi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Collaboration Modal */}
      {deleteModalOpen && collaborationToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Elimina Collaborazione</h3>
                <p className="text-sm text-gray-500">{collaborationToDelete.brand}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-700 mb-4">
                Stai per eliminare questa collaborazione. Questa azione non può essere annullata.
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivazione della cancellazione *
                </label>
                <textarea
                  rows={4}
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="Spiega il motivo della cancellazione (minimo 80 caratteri)..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {deleteReason.length}/80 caratteri minimi
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false)
                  setCollaborationToDelete(null)
                  setDeleteReason('')
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
              >
                Annulla
              </button>
              <button
                onClick={() => {
                  // Here would be the actual delete logic
                  console.log('Deleting collaboration:', collaborationToDelete.id, 'Reason:', deleteReason)
                  setDeleteModalOpen(false)
                  setCollaborationToDelete(null)
                  setDeleteReason('')
                }}
                disabled={deleteReason.length < 80}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Elimina Collaborazione
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
