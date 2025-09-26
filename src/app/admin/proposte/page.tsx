'use client'

import { useState, useEffect } from 'react'
import { 
  HandHeart,
  Building2,
  Calendar,
  Euro,
  Users,
  Search,
  Menu,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  Target,
  Plus,
  X,
  Send,
  Image as ImageIcon,
  FileText,
  Link2,
  Trash2
} from 'lucide-react'
import AdminSidebar from '../../components/AdminSidebar'
import { useRequireAdmin } from '../../../hooks/useRequireAdmin'
import { devLog, logger } from '../../../lib/logger'

export default function AdminPropostePage() {
  const { isAdmin, loading: authLoading } = useRequireAdmin()
  const [pageLoading, setPageLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewProposalModal, setShowNewProposalModal] = useState(false)
  const [showEditProposalModal, setShowEditProposalModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [proposals, setProposals] = useState([])
  const [approvedNewsletters, setApprovedNewsletters] = useState<any[]>([])
  const [editingProposal, setEditingProposal] = useState(null)
  const [detailsProposal, setDetailsProposal] = useState(null)
  const [communicationMessage, setCommunicationMessage] = useState('')
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailSuccessMessage, setEmailSuccessMessage] = useState('')
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [proposalToDelete, setProposalToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editedProposal, setEditedProposal] = useState<{
    brand_name: string
    sponsorship_type: string
    campaign_start_date: string
    campaign_end_date: string
    product_type: string
    ideal_target_audience: string
    admin_copy_text: string
    admin_brief_text: string
    target_newsletter_ids: string[]
  }>({
    brand_name: '',
    sponsorship_type: '',
    campaign_start_date: '',
    campaign_end_date: '',
    product_type: '',
    ideal_target_audience: '',
    admin_copy_text: '',
    admin_brief_text: '',
    target_newsletter_ids: []
  })
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

  const handleDetailsNewsletterSelection = (newsletterId: string) => {
    setEditedProposal(prev => ({
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
    setCommunicationMessage('')
    setEditedProposal({
      brand_name: proposal.brand_name,
      sponsorship_type: proposal.sponsorship_type,
      campaign_start_date: proposal.campaign_start_date,
      campaign_end_date: proposal.campaign_end_date,
      product_type: proposal.product_type,
      ideal_target_audience: proposal.ideal_target_audience,
      admin_copy_text: proposal.admin_copy_text || '',
      admin_brief_text: proposal.admin_brief_text || '',
      target_newsletter_ids: proposal.proposal_newsletters?.map(pn => pn.newsletter_id) || []
    })
    setShowDetailsModal(true)
  }

  const handleDeleteProposal = (proposal) => {
    setProposalToDelete(proposal)
    setShowDeleteModal(true)
  }

  const confirmDeleteProposal = async () => {
    if (!proposalToDelete) return
    
    setIsDeleting(true)
    
    try {
      const response = await fetch(`/api/admin/proposals/${proposalToDelete.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Remove the proposal from the local state
        setProposals(prev => prev.filter(p => p.id !== proposalToDelete.id))
        setShowDeleteModal(false)
        setProposalToDelete(null)
        // You could add a success message here if needed
      } else {
        const errorData = await response.json()
        logger.error('Error deleting proposal:', errorData.error)
        alert('Errore durante l\'eliminazione della proposta: ' + errorData.error)
      }
    } catch (error) {
      logger.error('Error deleting proposal:', error)
      alert('Errore durante l\'eliminazione della proposta')
    } finally {
      setIsDeleting(false)
    }
  }

  const cancelDeleteProposal = () => {
    setShowDeleteModal(false)
    setProposalToDelete(null)
  }

  const handleSendCommunication = async () => {
    if (!communicationMessage.trim() || !detailsProposal) return
    
    setIsSendingEmail(true)
    console.log('🚀 Starting email communication for proposal:', detailsProposal.id)
    
    try {
      // Fetch author emails using the new API endpoint
      console.log('📡 Fetching authors for proposal:', detailsProposal.id)
      const response = await fetch(`/api/admin/proposals/${detailsProposal.id}/emails`)
      
      console.log('📡 Authors API response status:', response.status)
      const result = await response.json()
      console.log('📡 Authors API response data:', result)
      
      if (!result.success) {
        console.error('❌ Failed to fetch authors:', result.error)
        setEmailSuccessMessage(`❌ Errore nel recupero degli autori: ${result.error}`)
        return
      }
      
      const authors = result.data.authors || []
      console.log('👥 Authors found:', authors.length, authors)
      devLog('Authors found:', authors)
      
      if (authors.length === 0) {
        console.warn('⚠️ No authors found for this proposal')
        setEmailSuccessMessage('❌ Nessun autore trovato per questa proposta')
        return
      }

      // Send notification email to each author via Resend with rate limiting
      const results = []
      for (let i = 0; i < authors.length; i++) {
        const author = authors[i]
        console.log(`📧 Processing email ${i + 1}/${authors.length} for author:`, author.email)
        
        const subject = `Aggiornamento proposta: ${detailsProposal.brand_name} - ${detailsProposal.sponsorship_type}`
        const newsletterInfo = author.newsletter_title ? ` per "${author.newsletter_title}"` : ''
        const body = `Gentile ${author.name},

Abbiamo un aggiornamento riguardo alla proposta${newsletterInfo}:

${communicationMessage}


Cordiali saluti,
Team Frames`
        
        const emailData = {
          to: author.email,
          subject: subject,
          text: body,
          from: 'Newsletter Italiane <support@meetframes.com>'
        }
        
        console.log('📧 Sending email with data:', emailData)
        
        try {
          const emailResponse = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData)
          })

          console.log('📧 Email API response status:', emailResponse.status)
          
          if (emailResponse.ok) {
            const emailResult = await emailResponse.json()
            console.log('✅ Email sent successfully to', author.email, '- Response:', emailResult)
            devLog(`Email sent successfully to ${author.email}`)
            results.push({ success: true, email: author.email })
          } else {
            const errorText = await emailResponse.text()
            console.error('❌ Email failed for', author.email, '- Status:', emailResponse.status, '- Error:', errorText)
            logger.error(`Failed to send email to ${author.email}:`, errorText)
            results.push({ success: false, email: author.email, error: errorText })
          }
        } catch (error) {
          console.error('❌ Email exception for', author.email, ':', error)
          logger.error(`Error sending email to ${author.email}:`, error)
          results.push({ success: false, email: author.email, error: error.message })
        }

        // Add delay between emails to respect Resend rate limit (2 req/sec)
        if (i < authors.length - 1) {
          console.log('⏳ Waiting 600ms before next email...')
          await new Promise(resolve => setTimeout(resolve, 600)) // 600ms delay
        }
      }
      const successfulEmails = results.filter(result => result.success).length
      const failedEmails = results.length - successfulEmails
      
      setCommunicationMessage('')
      
      if (failedEmails === 0) {
        setEmailSuccessMessage(`✅ Messaggio inviato con successo a ${successfulEmails} autore${successfulEmails > 1 ? 'i' : ''}`)
      } else if (successfulEmails === 0) {
        setEmailSuccessMessage(`❌ Invio fallito per tutti gli ${results.length} autori`)
      } else {
        setEmailSuccessMessage(`⚠️ Messaggio inviato a ${successfulEmails} autori, ${failedEmails} invii falliti`)
      }
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setEmailSuccessMessage('')
      }, 5000)
      
    } catch (error) {
      logger.error('Error sending communication:', error)
      setEmailSuccessMessage('❌ Errore durante l\'invio delle email')
    } finally {
      setIsSendingEmail(false)
    }
  }

  const handleSaveProposal = async () => {
    if (!detailsProposal || !editedProposal) return
    
    try {
      const response = await fetch(`/api/admin/proposals/${detailsProposal.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedProposal)
      })

      if (response.ok) {
        await response.json()
        // Update the local proposal data
        setDetailsProposal(prev => ({ ...prev, ...editedProposal }))
        // Refresh the proposals list
        await fetchProposals()
        setSaveSuccessMessage('Proposta aggiornata con successo!')
        setTimeout(() => setSaveSuccessMessage(''), 3000)
      } else {
        throw new Error('Errore durante il salvataggio')
      }
    } catch (error) {
      logger.error('Error saving proposal:', error)
      setSaveSuccessMessage('Errore durante il salvataggio della proposta')
      setTimeout(() => setSaveSuccessMessage(''), 5000)
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
        },
        body: JSON.stringify(newProposal)
      })

      if (response.ok) {
        setShowNewProposalModal(false)
        setShowEditProposalModal(false)
        setEditingProposal(null)
        setSaveSuccessMessage('')
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
      const response = await fetch('/api/admin/proposals')
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
      const response = await fetch('/api/newsletters-all')
      if (response.ok) {
        const data = await response.json()
        // Filter approved and in_review newsletters for proposal targeting
        const available = data.data?.filter(newsletter => 
          newsletter.review_status === 'approved' || newsletter.review_status === 'in_review'
        ) || []
        setApprovedNewsletters(available)
      }
    } catch (error) {
      console.error('Error fetching available newsletters:', error)
    }
  }

  useEffect(() => {
    if (authLoading || !isAdmin) return

    setPageLoading(true)
    Promise.all([fetchProposals(), fetchApprovedNewsletters()])
      .finally(() => setPageLoading(false))
  }, [authLoading, isAdmin])

  const filters = [
    { value: 'all', label: 'Tutte', count: proposals.length },
    { value: 'pending', label: 'In attesa', count: proposals.filter(p => p.status === 'pending').length },
    { value: 'accepted', label: 'Accettate', count: proposals.filter(p => p.status === 'accepted').length },
    { value: 'rejected', label: 'Rifiutate', count: proposals.filter(p => p.status === 'rejected').length }
  ]

  const filteredProposals = proposals.filter(proposal => {
    const matchesFilter = selectedFilter === 'all' || proposal.status === selectedFilter
    const matchesSearch = proposal.brand_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.product_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.sponsorship_type?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  if (authLoading || pageLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!isAdmin) {
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
                              className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs rounded hover:bg-slate-200 transition-colors"
                              title="Modifica proposta"
                              type="button"
                            >
                              Modifica
                            </button>
                            <button 
                              onClick={() => handleOpenDetails(proposal)}
                              className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                              title="Gestisci proposta"
                            >
                              <Eye className="w-3 h-3" />
                              Dettagli
                            </button>
                            <button 
                              onClick={() => handleDeleteProposal(proposal)}
                              className="px-3 py-1.5 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors flex items-center gap-1"
                              title="Elimina proposta"
                            >
                              <Trash2 className="w-3 h-3" />
                              Elimina
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
                  setSaveSuccessMessage('')
                }}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitProposal} className="p-6">
              {/* Success Message */}
              {saveSuccessMessage && (
                <div className={`p-3 rounded-lg text-sm font-medium mb-6 ${
                  saveSuccessMessage.includes('successo') 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {saveSuccessMessage}
                </div>
              )}

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
                  <div>
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
                      Seleziona almeno una newsletter * ({newProposal.target_newsletter_ids.length} selezionate)
                    </label>
                    {approvedNewsletters.length === 0 ? (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">Nessuna newsletter disponibile per targeting</p>
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
                  <div>
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
                  <div>
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
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Immagini / Asset ({newProposal.admin_assets_images.length})
                    </label>
                    <div className="space-y-2">
                      {newProposal.admin_assets_images.map((url, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                          <ImageIcon className="w-4 h-4 text-slate-600" />
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
                  <div>
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
                    setSaveSuccessMessage('')
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
                  setEditedProposal({
                    brand_name: '',
                    sponsorship_type: '',
                    campaign_start_date: '',
                    campaign_end_date: '',
                    product_type: '',
                    ideal_target_audience: '',
                    admin_copy_text: '',
                    admin_brief_text: '',
                    target_newsletter_ids: []
                  })
                  setEmailSuccessMessage('')
                }}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Read-only Campaign Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-slate-900 mb-3">Informazioni Campagna</h3>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Nome Brand</label>
                    <div className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg">
                      {detailsProposal.brand_name || <span className="text-slate-400">Non specificato</span>}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Tipo Sponsorship</label>
                    <div className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg">
                      {detailsProposal.sponsorship_type || <span className="text-slate-400">Non specificato</span>}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Tipo Prodotto</label>
                    <div className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg">
                      {detailsProposal.product_type || <span className="text-slate-400">Non specificato</span>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Data Inizio</label>
                      <div className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg">
                        {detailsProposal.campaign_start_date ? new Date(detailsProposal.campaign_start_date).toLocaleDateString('it-IT') : <span className="text-slate-400">Non specificata</span>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Data Fine</label>
                      <div className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg">
                        {detailsProposal.campaign_end_date ? new Date(detailsProposal.campaign_end_date).toLocaleDateString('it-IT') : <span className="text-slate-400">Non specificata</span>}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-slate-900 mb-3">Target Audience</h3>
                  <div className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg min-h-[8rem]">
                    {detailsProposal.ideal_target_audience || <span className="text-slate-400">Nessun target audience specificato</span>}
                  </div>
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
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Materiali Admin</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Testo Copy</label>
                    <div className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg min-h-[6rem]">
                      {detailsProposal.admin_copy_text || <span className="text-slate-400">Nessun testo copy disponibile</span>}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Brief / Istruzioni</label>
                    <div className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg min-h-[6rem]">
                      {detailsProposal.admin_brief_text || <span className="text-slate-400">Nessun brief disponibile</span>}
                    </div>
                  </div>
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

              {/* Communications Section */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Comunicazioni</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="communication_message" className="block text-sm font-medium text-slate-700 mb-2">
                      Messaggio per gli autori
                    </label>
                    <textarea
                      id="communication_message"
                      value={communicationMessage}
                      onChange={(e) => setCommunicationMessage(e.target.value)}
                      placeholder="Scrivi un messaggio che verrà inviato via email a tutti gli autori coinvolti in questa proposta..."
                      rows={4}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                  
                  {/* Success/Error Message */}
                  {emailSuccessMessage && (
                    <div className={`p-3 rounded-lg text-sm font-medium ${
                      emailSuccessMessage.startsWith('✅') 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {emailSuccessMessage}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSendCommunication}
                      disabled={!communicationMessage.trim() || isSendingEmail}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSendingEmail ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      {isSendingEmail ? 'Invio...' : 'Invia Email'}
                    </button>
                    <span className="text-sm text-slate-500">
                      Verrà inviato a {detailsProposal.proposal_newsletters?.length || 0} autori
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-6 border-t border-slate-200">
                <button
                  onClick={() => {
                    setShowDetailsModal(false)
                    setDetailsProposal(null)
                    setEditedProposal({
                      brand_name: '',
                      sponsorship_type: '',
                      campaign_start_date: '',
                      campaign_end_date: '',
                      product_type: '',
                      ideal_target_audience: '',
                      admin_copy_text: '',
                      admin_brief_text: '',
                      target_newsletter_ids: []
                    })
                    setCommunicationMessage('')
                    setEmailSuccessMessage('')
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && proposalToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Elimina Proposta</h3>
                  <p className="text-sm text-slate-600">Questa azione è irreversibile</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-slate-700 mb-2">
                  Sei sicuro di voler eliminare definitivamente la proposta:
                </p>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="font-semibold text-slate-900">
                    {proposalToDelete.brand_name} - {proposalToDelete.sponsorship_type}
                  </p>
                  <p className="text-sm text-slate-600">
                    {proposalToDelete.product_type}
                  </p>
                </div>
                <p className="text-sm text-red-600 mt-3">
                  ⚠️ Questa azione eliminerà anche tutte le associazioni con le newsletter e gli eventi del calendario collegati.
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={confirmDeleteProposal}
                  disabled={isDeleting}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isDeleting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  {isDeleting ? 'Eliminazione...' : 'Elimina Definitivamente'}
                </button>
                
                <button
                  onClick={cancelDeleteProposal}
                  disabled={isDeleting}
                  className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  Annulla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
