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
  MapPin,
  Plus,
  X,
  Send,
  Image,
  FileText,
  Link2,
  Trash2,
  Edit
} from 'lucide-react'
import AdminSidebar from '../../components/AdminSidebar'

export default function AdminPropostePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewProposalModal, setShowNewProposalModal] = useState(false)
  const [showEditProposalModal, setShowEditProposalModal] = useState(false)
  const [showChatModal, setShowChatModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [proposals, setProposals] = useState([])
  const [approvedNewsletters, setApprovedNewsletters] = useState([])
  const [editingProposal, setEditingProposal] = useState(null)
  const [chatProposal, setChatProposal] = useState(null)
  const [detailsProposal, setDetailsProposal] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoadingChat, setIsLoadingChat] = useState(false)
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [newProposal, setNewProposal] = useState({
    brand_name: '',
    sponsorship_type: '',
    campaign_start_date: '',
    campaign_end_date: '',
    product_type: '',
    ideal_target_audience: '',
    target_newsletter_ids: [],
    admin_copy_text: '',
    admin_brief_text: '',
    admin_assets_images: [],
    admin_tracking_links: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newTrackingUrl, setNewTrackingUrl] = useState('')
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewProposal(prev => ({ ...prev, [name]: value }))
  }

  const handleNewsletterSelection = (newsletterId: string) => {
    setNewProposal(prev => ({
      ...prev,
      target_newsletter_ids: prev.target_newsletter_ids.includes(newsletterId)
        ? prev.target_newsletter_ids.filter(id => id !== newsletterId)
        : [...prev.target_newsletter_ids, newsletterId]
    }))
  }

  const handleAddImage = () => {
    if (newImageUrl && newImageUrl.trim()) {
      setNewProposal(prev => ({
        ...prev,
        admin_assets_images: [...prev.admin_assets_images, newImageUrl.trim()]
      }))
      setNewImageUrl('')
    }
  }

  const handleRemoveImage = (index: number) => {
    setNewProposal(prev => ({
      ...prev,
      admin_assets_images: prev.admin_assets_images.filter((_, i) => i !== index)
    }))
  }

  const handleAddTrackingLink = () => {
    if (newTrackingUrl && newTrackingUrl.trim()) {
      setNewProposal(prev => ({
        ...prev,
        admin_tracking_links: [...prev.admin_tracking_links, newTrackingUrl.trim()]
      }))
      setNewTrackingUrl('')
    }
  }

  const handleRemoveTrackingLink = (index: number) => {
    setNewProposal(prev => ({
      ...prev,
      admin_tracking_links: prev.admin_tracking_links.filter((_, i) => i !== index)
    }))
  }

  const handleEditProposal = (proposal) => {
    setEditingProposal(proposal)
    setNewProposal({
      brand_name: proposal.brand_name,
      sponsorship_type: proposal.sponsorship_type,
      campaign_start_date: proposal.campaign_start_date,
      campaign_end_date: proposal.campaign_end_date,
      product_type: proposal.product_type,
      ideal_target_audience: proposal.ideal_target_audience,
      target_newsletter_ids: proposal.proposal_newsletters?.map(pn => pn.newsletter_id) || [],
      admin_copy_text: proposal.admin_copy_text || '',
      admin_brief_text: proposal.admin_brief_text || '',
      admin_assets_images: proposal.admin_assets_images || [],
      admin_tracking_links: proposal.admin_tracking_links || []
    })
    setShowEditProposalModal(true)
  }

  const handleOpenDetails = (proposal) => {
    setDetailsProposal(proposal)
    setShowDetailsModal(true)
  }

  const handleOpenChat = async (proposal) => {
    setChatProposal(proposal)
    setShowChatModal(true)
    setIsLoadingChat(true)
    
    try {
      // Load chat messages for this proposal
      const response = await fetch(`/api/admin/proposals/${proposal.id}/chat`, {
        headers: {
          'x-admin-auth': 'admin-panel'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setChatMessages(data.data || [])
      } else {
        setChatMessages([])
      }
    } catch (error) {
      console.error('Error loading chat:', error)
      setChatMessages([])
    } finally {
      setIsLoadingChat(false)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !chatProposal) return
    
    setIsSendingMessage(true)
    
    try {
      const response = await fetch(`/api/admin/proposals/${chatProposal.id}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': 'admin-panel'
        },
        body: JSON.stringify({
          message: newMessage.trim(),
          sender_type: 'admin'
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setChatMessages(prev => [...prev, data.data])
        setNewMessage('')
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSendingMessage(false)
    }
  }

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validazione date obbligatorie
    if (!newProposal.campaign_start_date || !newProposal.campaign_end_date) {
      alert('Le date di inizio e fine campagna sono obbligatorie')
      return
    }

    setIsSubmitting(true)

    try {
      const isEditing = !!editingProposal
      const url = isEditing ? `/api/admin/proposals/${editingProposal.id}` : '/api/admin/proposals'
      const method = isEditing ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': 'admin-panel'
        },
        body: JSON.stringify(newProposal)
      })

      if (response.ok) {
        setShowNewProposalModal(false)
        setShowEditProposalModal(false)
        setEditingProposal(null)
        setNewProposal({
          brand_name: '',
          sponsorship_type: '',
          campaign_start_date: '',
          campaign_end_date: '',
          product_type: '',
          ideal_target_audience: '',
          target_newsletter_ids: [],
          admin_copy_text: '',
          admin_brief_text: '',
          admin_assets_images: [],
          admin_tracking_links: []
        })
        // Refresh proposals list
        fetchProposals()
      } else {
        console.error('Error saving proposal')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const fetchProposals = async () => {
    try {
      const response = await fetch('/api/admin/proposals', {
        headers: {
          'x-admin-auth': 'admin-panel'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setProposals(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching proposals:', error)
    }
  }

  const fetchApprovedNewsletters = async () => {
    try {
      const response = await fetch('/api/newsletters-all', {
        headers: {
          'x-admin-auth': 'admin-panel'
        }
      })
      if (response.ok) {
        const data = await response.json()
        // Filter only approved newsletters
        const approved = data.data?.filter(newsletter => newsletter.review_status === 'approved') || []
        setApprovedNewsletters(approved)
      }
    } catch (error) {
      console.error('Error fetching approved newsletters:', error)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchProposals()
      fetchApprovedNewsletters()
    }
  }, [isAuthenticated])

  const filters = [
    { value: 'all', label: 'Tutte', count: proposals.length },
    { value: 'pending', label: 'In attesa', count: proposals.filter(p => p.status === 'pending').length },
    { value: 'accepted', label: 'Accettate', count: proposals.filter(p => p.status === 'accepted').length },
    { value: 'rejected', label: 'Rifiutate', count: proposals.filter(p => p.status === 'rejected').length }
  ]

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'In attesa', color: 'bg-yellow-100 text-yellow-700', icon: Clock }
      case 'accepted':
        return { label: 'Accettata', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle }
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
    const matchesSearch = proposal.brand_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.product_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.sponsorship_type?.toLowerCase().includes(searchQuery.toLowerCase())
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
    <div className="flex h-screen bg-slate-50 admin-panel">
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
            <button
              onClick={() => setShowNewProposalModal(true)}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nuova Proposta
            </button>
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
                      {proposals.filter(p => p.status === 'pending').length}
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
                      {proposals.filter(p => p.status === 'accepted').length}
                    </p>
                    <p className="text-xs text-slate-600">Accettate</p>
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
                      {proposals.length}
                    </p>
                    <p className="text-xs text-slate-600">Totali</p>
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
                {filteredProposals.length === 0 ? (
                  <div className="p-12 text-center">
                    <HandHeart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h4 className="font-medium text-slate-900 mb-2">Nessuna proposta</h4>
                    <p className="text-slate-500">
                      Non ci sono proposte di collaborazione da visualizzare
                    </p>
                  </div>
                ) : (
                  filteredProposals.map((proposal) => {
                    const statusInfo = getStatusInfo(proposal.status)
                    const StatusIcon = statusInfo.icon

                    return (
                      <div key={proposal.id} className="p-3 hover:bg-slate-50 transition-colors border-l-4 border-l-slate-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 bg-red-100 text-red-600 font-bold text-sm rounded-lg flex items-center justify-center flex-shrink-0">
                              {proposal.brand_name?.charAt(0) || 'P'}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-medium text-slate-900 truncate">
                                  {proposal.brand_name} - {proposal.sponsorship_type}
                                </h4>
                                {/* Simple status badge */}
                                {(() => {
                                  const newsletters = proposal.proposal_newsletters || []
                                  const acceptedCount = newsletters.filter(pn => pn.status === 'accepted').length
                                  const rejectedCount = newsletters.filter(pn => pn.status === 'rejected').length
                                  const pendingCount = newsletters.filter(pn => pn.status === 'pending').length
                                  const totalCount = newsletters.length
                                  
                                  if (acceptedCount === totalCount && totalCount > 0) {
                                    return (
                                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                        <CheckCircle className="w-3 h-3" />
                                        Completata
                                      </span>
                                    )
                                  } else if (acceptedCount > 0) {
                                    return (
                                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                        <AlertCircle className="w-3 h-3" />
                                        Parziale
                                      </span>
                                    )
                                  } else if (rejectedCount === totalCount && totalCount > 0) {
                                    return (
                                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                        <XCircle className="w-3 h-3" />
                                        Rifiutata
                                      </span>
                                    )
                                  } else {
                                    return (
                                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                        <Clock className="w-3 h-3" />
                                        In attesa
                                      </span>
                                    )
                                  }
                                })()}
                              </div>

                              <div className="flex items-center gap-4 text-xs text-slate-600">
                                <span className="flex items-center gap-1">
                                  <Building2 className="w-3 h-3" />
                                  {proposal.product_type}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(proposal.campaign_start_date).toLocaleDateString('it-IT')} - {new Date(proposal.campaign_end_date).toLocaleDateString('it-IT')}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {proposal.proposal_newsletters?.length || 0} Newsletter
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-3">
                            <button 
                              onClick={() => handleEditProposal(proposal)}
                              className="p-1.5 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                              title="Modifica proposta"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            
                            <button 
                              onClick={() => handleOpenDetails(proposal)}
                              className="p-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                              title="Visualizza dettagli"
                            >
                              <Eye className="w-3 h-3" />
                            </button>

                            <button 
                              onClick={() => handleOpenChat(proposal)}
                              className="p-1.5 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors"
                              title="Chat con autori"
                            >
                              <MessageSquare className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* New/Edit Proposal Modal */}
      {(showNewProposalModal || showEditProposalModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-slate-900">
                {editingProposal ? 'Modifica Proposta' : 'Nuova Proposta'}
              </h2>
              <button
                onClick={() => {
                  setShowNewProposalModal(false)
                  setShowEditProposalModal(false)
                  setEditingProposal(null)
                }}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitProposal} className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Prima colonna - Campi base */}
                <div className="space-y-6">
                  {/* Brand Name */}
                  <div>
                  <label htmlFor="brand_name" className="block text-sm font-medium text-slate-700 mb-2">
                    Nome Brand *
                  </label>
                  <input
                    type="text"
                    id="brand_name"
                    name="brand_name"
                    value={newProposal.brand_name}
                    onChange={handleInputChange}
                    placeholder="es. Nike, Coca-Cola"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Sponsorship Type */}
                <div>
                  <label htmlFor="sponsorship_type" className="block text-sm font-medium text-slate-700 mb-2">
                    Tipo Sponsorship *
                  </label>
                  <input
                    type="text"
                    id="sponsorship_type"
                    name="sponsorship_type"
                    value={newProposal.sponsorship_type}
                    onChange={handleInputChange}
                    placeholder="es. Product placement, Banner"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Campaign Start Date */}
                <div>
                  <label htmlFor="campaign_start_date" className="block text-sm font-medium text-slate-700 mb-2">
                    Data Inizio Campagna *
                  </label>
                  <input
                    type="date"
                    id="campaign_start_date"
                    name="campaign_start_date"
                    value={newProposal.campaign_start_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Campaign End Date */}
                <div>
                  <label htmlFor="campaign_end_date" className="block text-sm font-medium text-slate-700 mb-2">
                    Data Fine Campagna *
                  </label>
                  <input
                    type="date"
                    id="campaign_end_date"
                    name="campaign_end_date"
                    value={newProposal.campaign_end_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Product Type */}
                <div className="md:col-span-2">
                  <label htmlFor="product_type" className="block text-sm font-medium text-slate-700 mb-2">
                    Tipo Prodotto *
                  </label>
                  <input
                    type="text"
                    id="product_type"
                    name="product_type"
                    value={newProposal.product_type}
                    onChange={handleInputChange}
                    placeholder="es. Scarpe sportive, Bevanda energetica"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Ideal Target Audience */}
              <div>
                <label htmlFor="ideal_target_audience" className="block text-sm font-medium text-slate-700 mb-2">
                  Target Audience Ideale *
                </label>
                <textarea
                  id="ideal_target_audience"
                  name="ideal_target_audience"
                  value={newProposal.ideal_target_audience}
                  onChange={handleInputChange}
                  placeholder="Descrivi il pubblico ideale per questa campagna..."
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              {/* Newsletter Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Newsletter Target * ({newProposal.target_newsletter_ids.length} selezionate)
                </label>
                {approvedNewsletters.length === 0 ? (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">Nessuna newsletter approvata disponibile</p>
                  </div>
                ) : (
                  <div className="max-h-48 overflow-y-auto border border-slate-300 rounded-lg">
                    {approvedNewsletters.map((newsletter) => (
                      <label
                        key={newsletter.id}
                        className="flex items-center p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                      >
                        <input
                          type="checkbox"
                          checked={newProposal.target_newsletter_ids.includes(newsletter.id)}
                          onChange={() => handleNewsletterSelection(newsletter.id)}
                          className="mr-3 h-4 w-4 text-red-600 focus:ring-red-500 border-slate-300 rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-900 truncate">
                            {newsletter.title}
                          </div>
                          <div className="text-xs text-slate-600">
                            {newsletter.author_first_name} {newsletter.author_last_name} • {newsletter.audience_size} iscritti
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
                {newProposal.target_newsletter_ids.length === 0 && (
                  <p className="text-xs text-red-600 mt-1">Seleziona almeno una newsletter</p>
                )}
              </div>
                </div>

                {/* Seconda colonna - Materiali Admin */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Materiali Admin
                  </h3>

                {/* Copy Text */}
                <div className="mb-6">
                  <label htmlFor="admin_copy_text" className="block text-sm font-medium text-slate-700 mb-2">
                    Testo Copy
                  </label>
                  <textarea
                    id="admin_copy_text"
                    name="admin_copy_text"
                    value={newProposal.admin_copy_text}
                    onChange={handleInputChange}
                    placeholder="Inserisci il testo copy per la campagna..."
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Brief Text */}
                <div className="mb-6">
                  <label htmlFor="admin_brief_text" className="block text-sm font-medium text-slate-700 mb-2">
                    Brief / Istruzioni
                  </label>
                  <textarea
                    id="admin_brief_text"
                    name="admin_brief_text"
                    value={newProposal.admin_brief_text}
                    onChange={handleInputChange}
                    placeholder="Inserisci il brief e le istruzioni per la campagna..."
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Assets Images */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Immagini / Asset ({newProposal.admin_assets_images.length})
                  </label>
                  <div className="space-y-2">
                    {newProposal.admin_assets_images.map((url, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                        <Image className="w-4 h-4 text-slate-600" />
                        <span className="flex-1 text-sm text-slate-900 truncate">{url}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="https://esempio.com/immagine.jpg"
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddImage}
                        disabled={!newImageUrl.trim()}
                        className="px-3 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tracking Links */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Link di Tracking ({newProposal.admin_tracking_links.length})
                  </label>
                  <div className="space-y-2">
                    {newProposal.admin_tracking_links.map((url, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                        <Link2 className="w-4 h-4 text-slate-600" />
                        <span className="flex-1 text-sm text-slate-900 truncate">{url}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTrackingLink(index)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={newTrackingUrl}
                        onChange={(e) => setNewTrackingUrl(e.target.value)}
                        placeholder="https://esempio.com/tracking?utm_source=..."
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddTrackingLink}
                        disabled={!newTrackingUrl.trim()}
                        className="px-3 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t">
                <button
                  type="submit"
                  disabled={isSubmitting || (!editingProposal && newProposal.target_newsletter_ids.length === 0)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? (editingProposal ? 'Aggiornamento...' : 'Creazione...') : (editingProposal ? 'Aggiorna Proposta' : 'Crea Proposta')}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setShowNewProposalModal(false)
                    setShowEditProposalModal(false)
                    setEditingProposal(null)
                  }}
                  className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Annulla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChatModal && chatProposal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl h-[80vh] flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Chat - {chatProposal.brand_name}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {chatProposal.sponsorship_type} • {chatProposal.proposal_newsletters?.length || 0} newsletter target
                </p>
              </div>
              <button
                onClick={() => {
                  setShowChatModal(false)
                  setChatProposal(null)
                  setChatMessages([])
                  setNewMessage('')
                }}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Newsletter Authors List */}
            <div className="px-6 py-3 bg-slate-50 border-b">
              <div className="text-xs text-slate-500 mb-2">Newsletter coinvolte:</div>
              <div className="flex flex-wrap gap-2">
                {chatProposal.proposal_newsletters?.map((pn) => (
                  <div key={pn.id} className="flex items-center gap-2 bg-white px-2 py-1 rounded text-xs">
                    <span className="font-medium">{pn.newsletters?.title}</span>
                    <span className="text-slate-500">
                      {pn.newsletters?.author_first_name} {pn.newsletters?.author_last_name}
                    </span>
                    <span className={`px-1 rounded text-xs ${
                      pn.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      pn.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {pn.status === 'pending' ? 'In attesa' : pn.status === 'accepted' ? 'Accettata' : 'Rifiutata'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isLoadingChat ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              ) : chatMessages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h4 className="font-medium text-slate-900 mb-2">Nessun messaggio</h4>
                  <p className="text-slate-500 text-sm">
                    Inizia una conversazione con gli autori delle newsletter
                  </p>
                </div>
              ) : (
                chatMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender_type === 'admin' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-slate-100 text-slate-900'
                    }`}>
                      <div className="text-sm">{message.message}</div>
                      <div className={`text-xs mt-1 ${
                        message.sender_type === 'admin' ? 'text-purple-100' : 'text-slate-500'
                      }`}>
                        {message.sender_type === 'admin' ? 'Admin' : message.sender_name || 'Autore'} • 
                        {new Date(message.created_at).toLocaleString('it-IT')}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Chat Input */}
            <div className="p-6 border-t">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Scrivi un messaggio agli autori..."
                  disabled={isSendingMessage}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || isSendingMessage}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSendingMessage ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && detailsProposal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Details Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {detailsProposal.brand_name} - {detailsProposal.sponsorship_type}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {detailsProposal.product_type}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowDetailsModal(false)
                  setDetailsProposal(null)
                }}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Campaign Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-900 mb-3">Informazioni Campagna</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">Periodo:</span>
                      <span className="font-medium">
                        {new Date(detailsProposal.campaign_start_date).toLocaleDateString('it-IT')} - {new Date(detailsProposal.campaign_end_date).toLocaleDateString('it-IT')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">Prodotto:</span>
                      <span className="font-medium">{detailsProposal.product_type}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-slate-900 mb-3">Target Audience</h3>
                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                    {detailsProposal.ideal_target_audience}
                  </p>
                </div>
              </div>

              {/* Newsletter Details */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Newsletter Coinvolte ({detailsProposal.proposal_newsletters?.length || 0})
                </h3>
                
                {detailsProposal.proposal_newsletters && detailsProposal.proposal_newsletters.length > 0 ? (
                  <div className="space-y-4">
                    {detailsProposal.proposal_newsletters.map((pn) => {
                      const newsletter = pn.newsletters
                      return (
                        <div key={pn.id} className="bg-slate-50 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold text-slate-900">{newsletter?.title}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  pn.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                                  pn.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {pn.status === 'pending' ? 'In attesa' : 
                                   pn.status === 'accepted' ? 'Accettata' : 'Rifiutata'}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-slate-500">Autore:</span>
                                  <div className="font-medium">
                                    {newsletter?.author_first_name} {newsletter?.author_last_name}
                                  </div>
                                  <div className="text-slate-600">{newsletter?.author_email}</div>
                                </div>
                                
                                <div>
                                  <span className="text-slate-500">Audience:</span>
                                  <div className="font-medium flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {newsletter?.audience_size?.toLocaleString()} iscritti
                                  </div>
                                  {newsletter?.category && (
                                    <div className="text-slate-600 text-xs mt-1">{newsletter.category}</div>
                                  )}
                                </div>
                                
                                <div>
                                  <span className="text-slate-500">Frequenza pubblicazione:</span>
                                  <div className="font-medium flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {newsletter?.cadence || 'Non specificata'}
                                  </div>
                                  {newsletter?.language && (
                                    <div className="text-slate-600 text-xs mt-1">Lingua: {newsletter.language}</div>
                                  )}
                                </div>
                                
                                {pn.status === 'accepted' && pn.selected_run_date ? (
                                  <div>
                                    <span className="text-slate-500">Data pubblicazione:</span>
                                    <div className="font-medium flex items-center gap-1">
                                      <Target className="w-3 h-3 text-emerald-600" />
                                      {new Date(pn.selected_run_date).toLocaleDateString('it-IT')}
                                    </div>
                                  </div>
                                ) : (
                                  <div>
                                    <span className="text-slate-500">Performance:</span>
                                    <div className="space-y-1">
                                      {newsletter?.open_rate && (
                                        <div className="text-xs">OR: {newsletter.open_rate}%</div>
                                      )}
                                      {newsletter?.ctr_rate && (
                                        <div className="text-xs">CTR: {newsletter.ctr_rate}%</div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              {/* Additional newsletter details */}
                              <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-slate-500">Descrizione:</span>
                                  <p className="text-slate-700 text-xs mt-1 line-clamp-2">
                                    {newsletter?.description || 'Nessuna descrizione disponibile'}
                                  </p>
                                </div>
                                
                                <div>
                                  <span className="text-slate-500">Monetizzazione:</span>
                                  <div className="flex items-center gap-2 mt-1">
                                    {newsletter?.monetization && (
                                      <span className="text-xs bg-slate-200 px-2 py-1 rounded">
                                        {newsletter.monetization}
                                      </span>
                                    )}
                                    {newsletter?.sponsorship_price && (
                                      <span className="text-xs font-medium text-emerald-700">
                                        €{newsletter.sponsorship_price}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              {pn.decline_reason && (
                                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
                                  <span className="font-medium text-red-700">Motivo rifiuto:</span>
                                  <p className="text-red-600 mt-1">{pn.decline_reason}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    Nessuna newsletter associata a questa proposta
                  </div>
                )}
              </div>

              {/* Admin Materials */}
              {(detailsProposal.admin_copy_text || detailsProposal.admin_brief_text || 
                (detailsProposal.admin_assets_images && detailsProposal.admin_assets_images.length > 0) ||
                (detailsProposal.admin_tracking_links && detailsProposal.admin_tracking_links.length > 0)) && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Materiali Admin</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {detailsProposal.admin_copy_text && (
                      <div>
                        <h4 className="font-medium text-slate-700 mb-2">Testo Copy</h4>
                        <div className="bg-slate-50 p-3 rounded-lg text-sm">
                          {detailsProposal.admin_copy_text}
                        </div>
                      </div>
                    )}
                    
                    {detailsProposal.admin_brief_text && (
                      <div>
                        <h4 className="font-medium text-slate-700 mb-2">Brief</h4>
                        <div className="bg-slate-50 p-3 rounded-lg text-sm">
                          {detailsProposal.admin_brief_text}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {detailsProposal.admin_assets_images && detailsProposal.admin_assets_images.length > 0 && (
                      <div>
                        <h4 className="font-medium text-slate-700 mb-2">Asset Immagini</h4>
                        <div className="space-y-1">
                          {detailsProposal.admin_assets_images.map((url, index) => (
                            <a 
                              key={index} 
                              href={url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block text-xs text-blue-600 hover:text-blue-800 truncate"
                            >
                              {url}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {detailsProposal.admin_tracking_links && detailsProposal.admin_tracking_links.length > 0 && (
                      <div>
                        <h4 className="font-medium text-slate-700 mb-2">Link di Tracking</h4>
                        <div className="space-y-1">
                          {detailsProposal.admin_tracking_links.map((url, index) => (
                            <a 
                              key={index} 
                              href={url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block text-xs text-blue-600 hover:text-blue-800 truncate"
                            >
                              {url}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    setShowDetailsModal(false)
                    setDetailsProposal(null)
                    handleEditProposal(detailsProposal)
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Modifica
                </button>
                
                <button
                  onClick={() => {
                    setShowDetailsModal(false)
                    handleOpenChat(detailsProposal)
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat
                </button>
                
                <button
                  onClick={() => {
                    setShowDetailsModal(false)
                    setDetailsProposal(null)
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Chiudi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}