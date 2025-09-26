'use client'

import React, { useState, useEffect } from 'react'
import {
  Users,
  CheckCircle,
  XCircle,
  Calendar,
  Search,
  ChevronRight,
  ChevronLeft,
  Menu,
  AlertCircle,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Link,
} from 'lucide-react'
import { useAuth } from '../../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/Sidebar'

interface Collaboration {
  id: string
  proposal_id: string
  newsletter_id: string
  brand: string
  newsletter: string
  status: string
  sponsorship_type: string
  product_type: string
  campaign_start_date: string
  campaign_end_date: string
  selected_run_date: string
  ideal_target_audience: string
  admin_assets_images?: string[]
  admin_copy_text?: string
  admin_brief_text?: string
  admin_tracking_links?: string[]
  calendar_event?: any
  creator_preview_url?: string | null
  creator_results_views?: number | null
  creator_results_open_rate?: number | null
  creator_results_ctr?: number | null
  creator_results_clicks?: number | null
  creator_results_submitted_at?: string | null
}

const statusFilters = [
  { value: 'all', label: 'Tutti gli stati' },
  { value: 'active', label: 'Attive' },
  { value: 'scheduled', label: 'Programmate' },
  { value: 'completed', label: 'Completate' }
]

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'active':
      return { label: 'Attiva', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle }
    case 'scheduled':
      return { label: 'Programmata', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: Calendar }
    case 'completed':
      return { label: 'Completata', color: 'text-slate-600', bgColor: 'bg-slate-100', icon: CheckCircle }
    default:
      return { label: status, color: 'text-slate-600', bgColor: 'bg-slate-100', icon: AlertCircle }
  }
}

export default function CollaborationsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [collaborations, setCollaborations] = useState<Collaboration[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCollaboration, setSelectedCollaboration] = useState<Collaboration | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const [isSavingPreview, setIsSavingPreview] = useState(false)
  const [previewSuccess, setPreviewSuccess] = useState<string | null>(null)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const [resultsForm, setResultsForm] = useState({
    views: '',
    openRate: '',
    ctr: '',
    clicks: ''
  })
  const [isSavingResults, setIsSavingResults] = useState(false)
  const [resultsSuccess, setResultsSuccess] = useState<string | null>(null)
  const [resultsError, setResultsError] = useState<string | null>(null)
  const itemsPerPage = 12

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/sign-in')
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (user) {
      fetchCollaborations()
    }
  }, [user])

  const fetchCollaborations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/collaborations')
      if (response.status === 401) {
        router.push('/auth/sign-in?redirectTo=%2Fdashboard%2Fcollaborations')
        return
      }

      const result = await response.json()
      
      if (result.success) {
        setCollaborations(result.data)
      } else {
        console.error('Error fetching collaborations:', result.error)
      }
    } catch (error) {
      console.error('Error fetching collaborations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSavePreview = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!selectedCollaboration) return

    setIsSavingPreview(true)
    setPreviewSuccess(null)
    setPreviewError(null)

    try {
      const response = await fetch(`/api/collaborations/${selectedCollaboration.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: 'preview', previewUrl })
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Errore durante il salvataggio della preview')
      }

      const updatedUrl = result.data?.creator_preview_url || null
      setPreviewSuccess('Link alla preview salvato con successo')
      setSelectedCollaboration(prev => prev ? { ...prev, creator_preview_url: updatedUrl } : prev)
      setCollaborations(prev => prev.map(collab => collab.id === selectedCollaboration.id ? { ...collab, creator_preview_url: updatedUrl } : collab))
      setTimeout(() => setPreviewSuccess(null), 3000)
    } catch (error: any) {
      setPreviewError(error.message || 'Errore inatteso durante il salvataggio')
    } finally {
      setIsSavingPreview(false)
    }
  }

  const handleSaveResults = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!selectedCollaboration) return

    setIsSavingResults(true)
    setResultsSuccess(null)
    setResultsError(null)

    const parsedOpenRate = parseFloat(resultsForm.openRate)
    const parsedCtr = parseFloat(resultsForm.ctr)
    const parsedClicks = parseInt(resultsForm.clicks, 10)
    const parsedViews = resultsForm.views ? parseInt(resultsForm.views, 10) : null

    if (Number.isNaN(parsedOpenRate) || Number.isNaN(parsedCtr) || Number.isNaN(parsedClicks)) {
      setResultsError('Compila tutti i campi obbligatori con valori numerici validi')
      setIsSavingResults(false)
      return
    }

    if (parsedOpenRate < 0 || parsedOpenRate > 100 || parsedCtr < 0 || parsedCtr > 100) {
      setResultsError('Open rate e CTR devono essere compresi tra 0 e 100')
      setIsSavingResults(false)
      return
    }

    if (parsedClicks < 0 || (parsedViews !== null && parsedViews < 0)) {
      setResultsError('Inserisci valori positivi per visualizzazioni e click')
      setIsSavingResults(false)
      return
    }

    try {
      const response = await fetch(`/api/collaborations/${selectedCollaboration.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'results',
          views: parsedViews ?? undefined,
          openRate: parsedOpenRate,
          ctr: parsedCtr,
          clicks: parsedClicks
        })
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Errore durante il salvataggio dei risultati')
      }

      const updatedData = result.data || {}
      const updatedViews = updatedData.creator_results_views ?? null
      const updatedOpenRate = updatedData.creator_results_open_rate !== null && updatedData.creator_results_open_rate !== undefined
        ? Number(updatedData.creator_results_open_rate)
        : null
      const updatedCtr = updatedData.creator_results_ctr !== null && updatedData.creator_results_ctr !== undefined
        ? Number(updatedData.creator_results_ctr)
        : null
      const updatedClicks = updatedData.creator_results_clicks ?? null
      const updatedSubmittedAt = updatedData.creator_results_submitted_at || new Date().toISOString()

      setResultsSuccess('Risultati salvati con successo')
      setSelectedCollaboration(prev => prev ? {
        ...prev,
        creator_results_views: updatedViews,
        creator_results_open_rate: updatedOpenRate,
        creator_results_ctr: updatedCtr,
        creator_results_clicks: updatedClicks,
        creator_results_submitted_at: updatedSubmittedAt
      } : prev)
      setCollaborations(prev => prev.map(collab => collab.id === selectedCollaboration.id ? {
        ...collab,
        creator_results_views: updatedViews,
        creator_results_open_rate: updatedOpenRate,
        creator_results_ctr: updatedCtr,
        creator_results_clicks: updatedClicks,
        creator_results_submitted_at: updatedSubmittedAt
      } : collab))
      setTimeout(() => setResultsSuccess(null), 3000)
    } catch (error: any) {
      setResultsError(error.message || 'Errore inatteso durante il salvataggio dei risultati')
    } finally {
      setIsSavingResults(false)
    }
  }

  useEffect(() => {
    if (selectedCollaboration) {
      setPreviewUrl(selectedCollaboration.creator_preview_url || '')
      setResultsForm({
        views: selectedCollaboration.creator_results_views !== null && selectedCollaboration.creator_results_views !== undefined
          ? String(selectedCollaboration.creator_results_views)
          : '',
        openRate: selectedCollaboration.creator_results_open_rate !== null && selectedCollaboration.creator_results_open_rate !== undefined
          ? String(selectedCollaboration.creator_results_open_rate)
          : '',
        ctr: selectedCollaboration.creator_results_ctr !== null && selectedCollaboration.creator_results_ctr !== undefined
          ? String(selectedCollaboration.creator_results_ctr)
          : '',
        clicks: selectedCollaboration.creator_results_clicks !== null && selectedCollaboration.creator_results_clicks !== undefined
          ? String(selectedCollaboration.creator_results_clicks)
          : ''
      })
      setPreviewSuccess(null)
      setPreviewError(null)
      setResultsSuccess(null)
      setResultsError(null)
    } else {
      setPreviewUrl('')
      setResultsForm({ views: '', openRate: '', ctr: '', clicks: '' })
    }
  }, [selectedCollaboration])

  // Filter and pagination
  const filteredCollaborations = collaborations.filter(collaboration => {
    const matchesStatus = statusFilter === 'all' || collaboration.status === statusFilter
    const matchesSearch = collaboration.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         collaboration.newsletter.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const totalPages = Math.ceil(filteredCollaborations.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCollaborations = filteredCollaborations.slice(startIndex, startIndex + itemsPerPage)

  if (authLoading || loading) {
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
    <div className="flex h-screen">
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
                className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-slate-900">Collaborazioni</h1>
              <Users className="w-5 h-5 text-slate-500" />
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
                placeholder="Cerca collaborazioni..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {statusFilters.map(filter => (
                <option key={filter.value} value={filter.value}>{filter.label}</option>
              ))}
            </select>
          </div>

          {/* Results count */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-slate-600">
              {filteredCollaborations.length} collaborazion{filteredCollaborations.length === 1 ? 'e' : 'i'} trovat{filteredCollaborations.length === 1 ? 'a' : 'e'}
            </p>
            <p className="text-sm text-slate-500">
              Pagina {currentPage} di {totalPages}
            </p>
          </div>

          {/* Collaborations Table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Brand</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Newsletter</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Stato</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Tipo</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Data Pubblicazione</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Assets</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Azione</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedCollaborations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                        Nessuna collaborazione trovata
                      </td>
                    </tr>
                  ) : (
                    paginatedCollaborations.map((collaboration) => {
                      const statusInfo = getStatusInfo(collaboration.status)
                      const StatusIcon = statusInfo.icon
                      
                      // Check if assets are available
                      const hasAssets = collaboration.admin_copy_text || 
                                      (collaboration.admin_assets_images && collaboration.admin_assets_images.length > 0) || 
                                      (collaboration.admin_tracking_links && collaboration.admin_tracking_links.length > 0)
                      
                      return (
                        <tr key={collaboration.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-900 text-sm">{collaboration.brand}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">{collaboration.newsletter}</td>
                          <td className="px-4 py-3">
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusInfo.label}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-slate-600">
                              {collaboration.sponsorship_type}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <Calendar className="w-3 h-3" />
                              {new Date(collaboration.selected_run_date).toLocaleDateString('it-IT')}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {hasAssets ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : null}
                          </td>
                          <td className="px-4 py-3">
                            <button 
                              onClick={() => {
                                setSelectedCollaboration(collaboration)
                                setShowDetailModal(true)
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-slate-600 text-white text-xs rounded-md hover:bg-slate-700 transition-colors"
                            >
                              Dettagli
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Successiva
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedCollaboration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">
                    Collaborazione con {selectedCollaboration.brand}
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(selectedCollaboration.status).bgColor} ${getStatusInfo(selectedCollaboration.status).color}`}>
                      {React.createElement(getStatusInfo(selectedCollaboration.status).icon, { className: 'w-3 h-3' })}
                      {getStatusInfo(selectedCollaboration.status).label}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Campaign Details */}
                <div className="space-y-4">
                  <h3 className="font-medium text-slate-900 border-b pb-2">Dettagli Campagna</h3>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-600">Newsletter</label>
                    <p className="text-sm text-slate-900">{selectedCollaboration.newsletter}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-600">Tipo Sponsorizzazione</label>
                    <p className="text-sm text-slate-900">{selectedCollaboration.sponsorship_type}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-600">Tipo Prodotto</label>
                    <p className="text-sm text-slate-900">{selectedCollaboration.product_type}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-600">Data Pubblicazione Scelta</label>
                    <p className="text-sm text-slate-900">
                      {new Date(selectedCollaboration.selected_run_date).toLocaleDateString('it-IT')}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-600">Periodo Campagna</label>
                    <p className="text-sm text-slate-900">
                      {new Date(selectedCollaboration.campaign_start_date).toLocaleDateString('it-IT')} - {new Date(selectedCollaboration.campaign_end_date).toLocaleDateString('it-IT')}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-600">Target Audience</label>
                    <p className="text-sm text-slate-900">{selectedCollaboration.ideal_target_audience}</p>
                  </div>
                </div>

                {/* Admin Materials */}
                <div className="space-y-4">
                  <h3 className="font-medium text-slate-900 border-b pb-2">Materiali Admin</h3>
                  
                  {selectedCollaboration.admin_copy_text && (
                    <div>
                      <label className="text-sm font-medium text-slate-600 flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        Testo Copy
                      </label>
                      <div className="mt-1 p-3 bg-slate-50 rounded-lg text-sm text-slate-900 whitespace-pre-wrap">
                        {selectedCollaboration.admin_copy_text}
                      </div>
                    </div>
                  )}

                  {selectedCollaboration.admin_brief_text && (
                    <div>
                      <label className="text-sm font-medium text-slate-600 flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        Brief
                      </label>
                      <div className="mt-1 p-3 bg-slate-50 rounded-lg text-sm text-slate-900 whitespace-pre-wrap">
                        {selectedCollaboration.admin_brief_text}
                      </div>
                    </div>
                  )}

                  {selectedCollaboration.admin_assets_images && selectedCollaboration.admin_assets_images.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-slate-600 flex items-center gap-1">
                        <ImageIcon className="w-4 h-4" />
                        Immagini ({selectedCollaboration.admin_assets_images.length})
                      </label>
                      <div className="mt-1 grid grid-cols-2 gap-2">
                        {selectedCollaboration.admin_assets_images.map((image, index) => (
                          <div key={index} className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center">
                            <a href={image} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1">
                              <ExternalLink className="w-3 h-3" />
                              Immagine {index + 1}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedCollaboration.admin_tracking_links && selectedCollaboration.admin_tracking_links.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-slate-600 flex items-center gap-1">
                        <Link className="w-4 h-4" />
                        Link di Tracking
                      </label>
                      <div className="mt-1 space-y-1">
                        {selectedCollaboration.admin_tracking_links.map((link, index) => (
                          <a
                            key={index}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-blue-600 hover:text-blue-800 break-all"
                          >
                            {link}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedCollaboration && (
                <div className="mt-6 space-y-6">
                  {/* Preview Section */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-slate-900">Preview della campagna</h3>
                      {selectedCollaboration.creator_preview_url && (
                        <a
                          href={selectedCollaboration.creator_preview_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Apri anteprima
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Condividi un link alla versione di anteprima della campagna. Sarà visibile anche allo staff admin.
                    </p>

                    <form className="mt-4 space-y-3" onSubmit={handleSavePreview}>
                      <label className="block text-xs font-medium text-slate-700">
                        Link Preview
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={previewUrl}
                        onChange={(event) => setPreviewUrl(event.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          disabled={isSavingPreview}
                          className="px-4 py-2 bg-slate-700 text-white text-sm rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSavingPreview ? 'Salvataggio…' : 'Salva Preview'}
                        </button>
                        {previewSuccess && (
                          <span className="text-xs text-emerald-600">{previewSuccess}</span>
                        )}
                        {previewError && (
                          <span className="text-xs text-red-600">{previewError}</span>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Results Section */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-slate-900">Risultati campagna</h3>
                      {selectedCollaboration.creator_results_submitted_at && (
                        <span className="text-xs text-slate-500">
                          Aggiornato il {new Date(selectedCollaboration.creator_results_submitted_at).toLocaleDateString('it-IT')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      Compila i risultati finali una volta concluso il periodo della campagna. I campi contrassegnati con * sono obbligatori.
                    </p>

                    {(() => {
                      const campaignEnd = new Date(selectedCollaboration.campaign_end_date)
                      const campaignFinished = new Date() > campaignEnd
                      if (!campaignFinished && !selectedCollaboration.creator_results_submitted_at) {
                        return (
                          <div className="mt-3 p-3 bg-slate-100 rounded-lg text-xs text-slate-600">
                            Potrai inserire i risultati solo dopo la fine della campagna ({campaignEnd.toLocaleDateString('it-IT')}).
                          </div>
                        )
                      }

                      return (
                        <form className="mt-4 space-y-3" onSubmit={handleSaveResults}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-slate-700">
                                Visualizzazioni
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={resultsForm.views}
                                onChange={(event) => setResultsForm(prev => ({ ...prev, views: event.target.value }))}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                placeholder="Es. 15000"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-700">
                                Open rate *
                              </label>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                required
                                value={resultsForm.openRate}
                                onChange={(event) => setResultsForm(prev => ({ ...prev, openRate: event.target.value }))}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                placeholder="Percentuale"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-700">
                                CTR *
                              </label>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                required
                                value={resultsForm.ctr}
                                onChange={(event) => setResultsForm(prev => ({ ...prev, ctr: event.target.value }))}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                placeholder="Percentuale"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-700">
                                Click sul link *
                              </label>
                              <input
                                type="number"
                                min="0"
                                required
                                value={resultsForm.clicks}
                                onChange={(event) => setResultsForm(prev => ({ ...prev, clicks: event.target.value }))}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                placeholder="Es. 320"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="submit"
                              disabled={isSavingResults}
                              className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isSavingResults ? 'Salvataggio…' : 'Salva Risultati'}
                            </button>
                            {resultsSuccess && (
                              <span className="text-xs text-emerald-600">{resultsSuccess}</span>
                            )}
                            {resultsError && (
                              <span className="text-xs text-red-600">{resultsError}</span>
                            )}
                          </div>

                          {(() => {
                            const hasResults = [
                              selectedCollaboration.creator_results_views,
                              selectedCollaboration.creator_results_open_rate,
                              selectedCollaboration.creator_results_ctr,
                              selectedCollaboration.creator_results_clicks
                            ].some(value => value !== null && value !== undefined)

                            if (!hasResults) return null

                            return (
                              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-600">
                                {selectedCollaboration.creator_results_views !== null && selectedCollaboration.creator_results_views !== undefined && (
                                  <div className="bg-white border border-slate-200 rounded-lg p-3">
                                    <span className="block text-[11px] uppercase tracking-wide text-slate-500">Visualizzazioni</span>
                                    <span className="text-sm font-semibold text-slate-900">{selectedCollaboration.creator_results_views.toLocaleString()}</span>
                                  </div>
                                )}
                                {selectedCollaboration.creator_results_open_rate !== null && (
                                  <div className="bg-white border border-slate-200 rounded-lg p-3">
                                    <span className="block text-[11px] uppercase tracking-wide text-slate-500">Open rate</span>
                                    <span className="text-sm font-semibold text-slate-900">{selectedCollaboration.creator_results_open_rate}%</span>
                                  </div>
                                )}
                                {selectedCollaboration.creator_results_ctr !== null && (
                                  <div className="bg-white border border-slate-200 rounded-lg p-3">
                                    <span className="block text-[11px] uppercase tracking-wide text-slate-500">CTR</span>
                                    <span className="text-sm font-semibold text-slate-900">{selectedCollaboration.creator_results_ctr}%</span>
                                  </div>
                                )}
                                {selectedCollaboration.creator_results_clicks !== null && (
                                  <div className="bg-white border border-slate-200 rounded-lg p-3">
                                    <span className="block text-[11px] uppercase tracking-wide text-slate-500">Click</span>
                                    <span className="text-sm font-semibold text-slate-900">{selectedCollaboration.creator_results_clicks.toLocaleString()}</span>
                                  </div>
                                )}
                              </div>
                            )
                          })()}
                        </form>
                      )
                    })()}
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
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
