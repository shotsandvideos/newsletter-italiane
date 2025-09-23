'use client'

import { useState } from 'react'
import {
  ShoppingBag,
  Search,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Building,
  Calendar,
  CheckCircle,
  XCircle,
  MessageSquare,
  Send
} from 'lucide-react'
import { useAuth } from '../../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Sidebar from '../../components/Sidebar'

// State for proposals data
const initialProposals: any[] = []

export default function MarketplacePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProposal, setSelectedProposal] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [proposals, setProposals] = useState(initialProposals)
  const [selectedRunDate, setSelectedRunDate] = useState('')
  const [declineReason, setDeclineReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  const itemsPerPage = 12

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/sign-in')
    } else if (user) {
      fetchProposals()
    }
  }, [authLoading, user, router])

  const fetchProposals = async () => {
    try {
      const response = await fetch('/api/proposals')
      if (response.ok) {
        const data = await response.json()
        setProposals(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching proposals:', error)
    }
  }

  const handleShowDetails = (proposal) => {
    setSelectedProposal(proposal)
    setShowDetailsModal(true)
    setSelectedRunDate('')
    setDeclineReason('')
    setChatMessage('')
  }

  const handleCloseDetails = () => {
    setSelectedProposal(null)
    setShowDetailsModal(false)
    setSelectedRunDate('')
    setDeclineReason('')
    setChatMessage('')
  }

  const handleAcceptProposal = async () => {
    if (!selectedProposal || !selectedRunDate) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/proposals', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          proposal_newsletter_id: selectedProposal.proposal_newsletter_id,
          action: 'accept',
          selected_run_date: selectedRunDate
        })
      })

      if (response.ok) {
        await fetchProposals()
        handleCloseDetails()
      }
    } catch (error) {
      console.error('Error accepting proposal:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRejectProposal = async () => {
    if (!selectedProposal || !declineReason.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/proposals', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          proposal_newsletter_id: selectedProposal.proposal_newsletter_id,
          action: 'reject',
          decline_reason: declineReason.trim()
        })
      })

      if (response.ok) {
        await fetchProposals()
        handleCloseDetails()
      }
    } catch (error) {
      console.error('Error rejecting proposal:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Filter and pagination
  const filteredProposals = proposals.filter(proposal => {
    const matchesStatus = proposal.link_status === 'pending'
    const matchesSearch = proposal.brand_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         proposal.product_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         proposal.sponsorship_type?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const totalPages = Math.ceil(filteredProposals.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProposals = filteredProposals.slice(startIndex, startIndex + itemsPerPage)

  if (authLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar 
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar 
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
                className="lg:hidden touch-target p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md smooth-interaction"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-slate-900">Marketplace</h1>
              <ShoppingBag className="w-5 h-5 text-slate-500" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto px-6 py-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cerca proposte per brand, prodotto o tipo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm placeholder-gray-400"
              />
            </div>
          </div>

          {/* Results count */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-slate-600">
              {filteredProposals.length} propost{filteredProposals.length === 1 ? 'a' : 'e'} trovat{filteredProposals.length === 1 ? 'a' : 'e'}
            </p>
            <p className="text-sm text-slate-500">
              Pagina {currentPage} di {totalPages}
            </p>
          </div>

          {/* Proposals Table */}
          <div className="modern-card overflow-hidden">
            {paginatedProposals.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="responsive-table">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Brand</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Newsletter</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Sponsorship</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Prodotto</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Periodo Campagna</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Assets</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Azione</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedProposals.map((proposal) => (
                      <tr key={`${proposal.id}-${proposal.newsletter_id}`} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3" data-label="Brand">
                          <div className="font-medium text-slate-900 text-sm">{proposal.brand_name}</div>
                        </td>
                        <td className="px-4 py-3" data-label="Newsletter">
                          <div className="text-sm text-slate-900 font-medium">{proposal.newsletter_title}</div>
                        </td>
                        <td className="px-4 py-3" data-label="Sponsorship">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {proposal.sponsorship_type}
                          </span>
                        </td>
                        <td className="px-4 py-3" data-label="Prodotto">
                          <div className="flex items-center gap-2">
                            <Building className="w-3 h-3 text-slate-400" />
                            <span className="text-sm text-slate-600">{proposal.product_type}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3" data-label="Periodo Campagna">
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <Calendar className="w-3 h-3" />
                            {new Date(proposal.campaign_start_date).toLocaleDateString('it-IT')} - {new Date(proposal.campaign_end_date).toLocaleDateString('it-IT')}
                          </div>
                        </td>
                        <td className="px-4 py-3" data-label="Assets">
                          {proposal.status === 'accepted' && (
                            (proposal.admin_copy_text || 
                             (proposal.admin_assets_images && proposal.admin_assets_images.length > 0) || 
                             (proposal.admin_tracking_links && proposal.admin_tracking_links.length > 0)) ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : null
                          )}
                        </td>
                        <td className="px-4 py-3" data-label="Azione">
                          <button 
                            onClick={() => handleShowDetails(proposal)}
                            className="btn-enhanced touch-target inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Applica
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Nessuna proposta disponibile</h3>
                <p className="text-slate-500 text-sm">Le proposte di collaborazione appariranno qui quando saranno disponibili.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="touch-target flex items-center gap-2 px-3 py-2 body-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed smooth-interaction"
              >
                <ChevronLeft className="w-4 h-4" />
                Precedente
              </button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-slate-600 text-white'
                          : 'bg-white border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="touch-target flex items-center gap-2 px-3 py-2 body-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed smooth-interaction"
              >
                Successiva
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Proposal Details Modal */}
      {showDetailsModal && selectedProposal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeInUp">
          <div className="modern-card bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Dettagli Proposta</h3>
              <button 
                onClick={handleCloseDetails}
                className="touch-target p-1 hover:bg-slate-100 rounded-md smooth-interaction"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6">
              <div className="space-y-6">
                {/* Proposal Title */}
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">{selectedProposal.brand_name}</h4>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Building className="w-4 h-4" />
                    <span>{selectedProposal.sponsorship_type}</span>
                  </div>
                </div>

                {/* Proposal Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-xs text-slate-500 uppercase font-medium mb-1">Prodotto</div>
                    <div className="text-sm font-medium text-slate-900">{selectedProposal.product_type}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-xs text-slate-500 uppercase font-medium mb-1">Tipo Sponsorship</div>
                    <div className="text-sm font-medium text-slate-900">{selectedProposal.sponsorship_type}</div>
                  </div>
                </div>

                {/* Target Audience */}
                <div>
                  <h5 className="text-sm font-medium text-slate-900 mb-2">Target Audience Ideale</h5>
                  <p className="text-sm text-slate-600 leading-relaxed">{selectedProposal.ideal_target_audience}</p>
                </div>

                {/* Timeline */}
                <div>
                  <h5 className="text-sm font-medium text-slate-900 mb-2">Periodo Campagna</h5>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>Dal {new Date(selectedProposal.campaign_start_date).toLocaleDateString('it-IT')} al {new Date(selectedProposal.campaign_end_date).toLocaleDateString('it-IT')}</span>
                  </div>
                </div>

                {/* Admin Materials - Only show if proposal is accepted */}
                {selectedProposal.status === 'accepted' && (
                  selectedProposal.admin_copy_text || 
                  (selectedProposal.admin_assets_images && selectedProposal.admin_assets_images.length > 0) || 
                  (selectedProposal.admin_tracking_links && selectedProposal.admin_tracking_links.length > 0)
                ) && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="text-sm font-medium text-slate-900 mb-3">Materiali Forniti</h5>
                    
                    {selectedProposal.admin_copy_text && (
                      <div className="mb-3">
                        <div className="text-xs text-slate-500 uppercase font-medium mb-1">Copy Text</div>
                        <p className="text-sm text-slate-700 bg-white p-2 rounded border">{selectedProposal.admin_copy_text}</p>
                      </div>
                    )}
                    
                    {selectedProposal.admin_assets_images && selectedProposal.admin_assets_images.length > 0 && (
                      <div className="mb-3">
                        <div className="text-xs text-slate-500 uppercase font-medium mb-1">Immagini</div>
                        <div className="text-sm text-slate-700 bg-white p-2 rounded border">
                          {selectedProposal.admin_assets_images.join(', ')}
                        </div>
                      </div>
                    )}
                    
                    {selectedProposal.admin_tracking_links && selectedProposal.admin_tracking_links.length > 0 && (
                      <div className="mb-3">
                        <div className="text-xs text-slate-500 uppercase font-medium mb-1">Link di Tracking</div>
                        <div className="text-sm text-slate-700 bg-white p-2 rounded border">
                          {selectedProposal.admin_tracking_links.join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Run Date Selection */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="text-sm font-medium text-slate-900 mb-3">Seleziona Data di Erogazione</h5>
                  <input
                    type="date"
                    value={selectedRunDate}
                    onChange={(e) => setSelectedRunDate(e.target.value)}
                    min={selectedProposal.campaign_start_date}
                    max={selectedProposal.campaign_end_date}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-600 mt-2">Seleziona una data all'interno del periodo della campagna</p>
                </div>

                {/* Decline Reason */}
                <div className="bg-red-50 p-4 rounded-lg">
                  <h5 className="text-sm font-medium text-slate-900 mb-3">Motivo di Rifiuto (opzionale)</h5>
                  <textarea
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    placeholder="Inserisci il motivo del rifiuto se decidi di non accettare..."
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  />
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <button 
                onClick={handleCloseDetails}
                className="touch-target px-4 py-2 body-sm text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md hover:bg-slate-50 smooth-interaction"
              >
                Chiudi
              </button>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleRejectProposal}
                  disabled={!declineReason.trim() || isSubmitting}
                  className="btn-enhanced touch-target flex items-center gap-2 px-4 py-2 bg-red-600 text-white body-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed smooth-interaction"
                >
                  <XCircle className="w-4 h-4" />
                  {isSubmitting ? 'Rifiuto...' : 'Rifiuta'}
                </button>
                
                <button 
                  onClick={handleAcceptProposal}
                  disabled={!selectedRunDate || isSubmitting}
                  className="btn-enhanced touch-target flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white body-sm font-medium rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed smooth-interaction"
                >
                  <CheckCircle className="w-4 h-4" />
                  {isSubmitting ? 'Accetto...' : 'Accetta'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
