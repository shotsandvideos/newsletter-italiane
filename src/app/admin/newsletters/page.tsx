'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Mail,
  Edit,
  Search,
  Menu,
  User,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  Send
} from 'lucide-react'
import AdminSidebar from '../../components/AdminSidebar'
import { useRequireAdmin } from '../../../hooks/useRequireAdmin'

export default function AdminNewslettersPage() {
  const [pageLoading, setPageLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [newsletters, setNewsletters] = useState<any[]>([])
  const [accessError, setAccessError] = useState<string | null>(null)
  const [selectedNewsletter, setSelectedNewsletter] = useState<any | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [isEditMode, setIsEditMode] = useState(false)
  const [editFormData, setEditFormData] = useState<any>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState('')
  const itemsPerPage = 12
  const { isAdmin, loading: authLoading } = useRequireAdmin()

  const fetchNewsletters = useCallback(async () => {
    try {
      console.log('Fetching newsletters with filter:', selectedFilter)
      
      const response = await fetch('/api/newsletters-all')
      const data = await response.json()
      
      if (response.status === 403) {
        console.error('Admin access denied:', data.error)
        setAccessError('Accesso admin richiesto. Effettua il login con un account amministratore.')
        setNewsletters([])
        return
      }
      
      // Clear any previous access errors
      setAccessError(null)
      
      if (data.success) {
        // Transform API data to match the component structure
        const transformedNewsletters = (data.data || []).map((n: any) => ({
          id: n.id,
          title: n.title,
          author: {
            name: n.author?.first_name && n.author?.last_name 
              ? `${n.author.first_name} ${n.author.last_name}`
              : n.author?.email || 'Sconosciuto',
            email: n.author?.email || n.user_id,
            newsletter: n.title
          },
          publishedAt: n.review_status === 'approved' ? n.updated_at : null,
          status: n.review_status,
          subscribers: n.audience_size || 0,
          category: n.category,
          open_rate: n.open_rate || 0,
          ctr: n.ctr_rate || 0,
          content: {
            excerpt: n.description,
            readTime: '5 min'
          },
          moderation: {
            approved: n.review_status === 'approved',
            flaggedReason: n.review_status === 'in_review' ? 'In attesa di revisione' : undefined,
            rejectedReason: n.review_status === 'rejected' ? (n.rejection_reason || 'Contenuto non conforme') : undefined
          },
          contact_email: n.contact_email,
          signup_url: n.signup_url,
          website_url: n.website_url,
          rawData: n // Keep original data for updates
        }))
        
        setNewsletters(transformedNewsletters)
        console.log(`Loaded ${transformedNewsletters.length} newsletters`)
      } else {
        console.error('Error fetching newsletters:', data.error)
      }
    } catch (error) {
      console.error('Error fetching newsletters:', error)
    }
  }, [selectedFilter])

  useEffect(() => {
    if (authLoading || !isAdmin) return

    setPageLoading(true)
    fetchNewsletters()
      .catch(error => {
        console.error('Error loading newsletters:', error)
      })
      .finally(() => setPageLoading(false))
  }, [authLoading, fetchNewsletters, isAdmin])

  const handleStatusUpdate = async (newsletterId: string, newStatus: 'approved' | 'rejected', rejectionReason?: string) => {
    try {
      const response = await fetch('/api/newsletters-update-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: newsletterId, 
          review_status: newStatus,
          rejection_reason: rejectionReason
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        console.log(`Newsletter ${newsletterId} updated to ${newStatus}`)
        // Refresh the list
        fetchNewsletters()
      } else {
        console.error('Error updating newsletter:', data.error)
        alert(`Errore: ${data.error}`)
      }
    } catch (error) {
      console.error('Error updating newsletter:', error)
      alert('Errore nell\'aggiornamento')
    }
  }

  const openDetailsModal = (newsletter: any) => {
    setSelectedNewsletter(newsletter)
    setShowDetailsModal(true)
    setRejectionReason('')
  }

  const closeDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedNewsletter(null)
    setRejectionReason('')
    setIsEditMode(false)
    setEditFormData({})
    setSaveSuccess(false)
    setSaveError('')
  }

  const handleEditNewsletter = (newsletter: any) => {
    // Resetta messaggi
    setSaveSuccess(false)
    setSaveError('')
    
    // Attiva modalità edit nel modal
    setIsEditMode(true)
    setEditFormData({
      title: newsletter.title,
      description: newsletter.rawData?.description || '',
      category: newsletter.rawData?.category || '',
      language: newsletter.rawData?.language || 'Italiano',
      cadence: newsletter.rawData?.cadence || '',
      signup_url: newsletter.signup_url || '',
      open_rate: newsletter.open_rate || 22.5,
      ctr: newsletter.ctr || 3.5,
      subscribers: newsletter.subscribers || 0
    })
  }

  const handleSendEmail = (newsletter: any) => {
    // Apre il client email con i dati precompilati
    const subject = `Riguardo la newsletter: ${newsletter.title}`
    const body = `Gentile ${newsletter.author.name},\\n\\nSpero che questo messaggio ti trovi bene.\\n\\nMi riferisco alla tua newsletter \"${newsletter.title}\".\\n\\n\\n\\nCordiali saluti,\\nTeam Newsletter Italiane`
    const mailtoLink = `mailto:${newsletter.author.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoLink)
  }

  const handleSaveEdit = async () => {
    try {
      setIsSaving(true)
      
      // Validazione dei dati
      if (!editFormData.title?.trim()) {
        throw new Error('Il titolo è obbligatorio')
      }
      
      // Prepara i dati per l'aggiornamento
      const updateData = {
        title: editFormData.title?.trim(),
        description: editFormData.description?.trim() || '',
        category: editFormData.category || '',
        language: editFormData.language || 'Italiano',
        cadence: editFormData.cadence || '',
        signup_url: editFormData.signup_url?.trim() || '',
        open_rate: parseFloat(editFormData.open_rate) || 0,
        ctr_rate: parseFloat(editFormData.ctr) || 0,
        audience_size: parseInt(editFormData.subscribers) || 0
      }

      // Chiamata API per salvare nel database
      const response = await fetch(`/api/admin/newsletters/${selectedNewsletter.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Errore durante il salvataggio')
      }

      // Aggiorna la newsletter selezionata con i dati dal server
      const updatedSelectedNewsletter = {
        ...selectedNewsletter,
        title: result.data.title,
        signup_url: result.data.signup_url,
        open_rate: result.data.open_rate,
        ctr: result.data.ctr_rate,
        subscribers: result.data.audience_size,
        rawData: result.data
      }
      setSelectedNewsletter(updatedSelectedNewsletter)
      
      // Esce dalla modalità edit
      setIsEditMode(false)
      setEditFormData({})
      
      // Ricarica la lista delle newsletter per assicurarsi che i dati siano sincronizzati
      await fetchNewsletters()
      
      // Mostra messaggio di successo
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
      
    } catch (error) {
      console.error('Error saving newsletter:', error)
      setSaveError(error.message || 'Errore durante il salvataggio')
      setTimeout(() => setSaveError(''), 5000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
    setEditFormData({})
  }

  const handleEditFieldChange = (field: string, value: any) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleApproveFromModal = async () => {
    if (selectedNewsletter) {
      await handleStatusUpdate(selectedNewsletter.id, 'approved')
      closeDetailsModal()
    }
  }

  const handleRejectFromModal = async () => {
    if (selectedNewsletter && rejectionReason.trim()) {
      await handleStatusUpdate(selectedNewsletter.id, 'rejected', rejectionReason)
      closeDetailsModal()
    }
  }


  const filters = [
    { value: 'all', label: 'Tutte', count: newsletters.length },
    { value: 'approved', label: 'Approvate', count: newsletters.filter(n => n.status === 'approved').length },
    { value: 'in_review', label: 'In revisione', count: newsletters.filter(n => n.status === 'in_review').length },
    { value: 'rejected', label: 'Rifiutate', count: newsletters.filter(n => n.status === 'rejected').length }
  ]

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'approved':
        return { label: 'Approvata', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle }
      case 'in_review':
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

  const totalPages = Math.ceil(filteredNewsletters.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedNewsletters = filteredNewsletters.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

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
                <Menu className="icon-inline" />
              </button>
              <div className="flex items-center gap-2">
                <Mail className="icon-counter text-red-600" />
                <h1 className="heading-page text-slate-900">Gestione Newsletter</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto px-6 py-6">
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="card-uniform">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <CheckCircle className="icon-inline text-red-600" />
                  </div>
                  <div>
                    <p className="heading-block font-bold text-slate-900">
                      {newsletters.filter(n => n.status === 'approved').length}
                    </p>
                    <p className="text-micro text-slate-600">Approvate</p>
                  </div>
                </div>
              </div>

              <div className="card-uniform">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="icon-inline text-yellow-600" />
                  </div>
                  <div>
                    <p className="heading-block font-bold text-slate-900">
                      {newsletters.filter(n => n.status === 'in_review').length}
                    </p>
                    <p className="text-micro text-slate-600">In revisione</p>
                  </div>
                </div>
              </div>

              <div className="card-uniform">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle className="icon-inline text-red-600" />
                  </div>
                  <div>
                    <p className="heading-block font-bold text-slate-900">
                      {newsletters.filter(n => n.status === 'rejected').length}
                    </p>
                    <p className="text-micro text-slate-600">Rifiutate</p>
                  </div>
                </div>
              </div>

              <div className="card-uniform">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="icon-inline text-blue-600" />
                  </div>
                  <div>
                    <p className="heading-block font-bold text-slate-900">
                      {newsletters.filter(n => n.status === 'approved').reduce((sum, n) => sum + n.subscribers, 0).toLocaleString()}
                    </p>
                    <p className="text-micro text-slate-600">Iscritti totali</p>
                  </div>
                </div>
              </div>

              <div className="card-uniform">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="icon-inline text-green-600" />
                  </div>
                  <div>
                    <p className="heading-block font-bold text-slate-900">
                      {(() => {
                        const approvedNewsletters = newsletters.filter(n => n.status === 'approved')
                        if (approvedNewsletters.length === 0) return '0%'
                        // Media aritmetica semplice degli open rate individuali
                        const avgOpenRate = approvedNewsletters.reduce((sum, n) => {
                          // Calcola open rate individuale per ogni newsletter
                          const individualOpenRate = n.open_rate || 22.5 // Se non presente, usa valore default
                          return sum + individualOpenRate
                        }, 0) / approvedNewsletters.length
                        return avgOpenRate.toFixed(1) + '%'
                      })()}
                    </p>
                    <p className="text-micro text-slate-600">Open rate medio</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 icon-inline text-slate-400" />
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

            {/* Newsletters Table */}
            <div className="card-uniform">
              <div className="p-4 border-b border-slate-200">
                <h3 className="heading-section text-slate-900">
                  Newsletter ({filteredNewsletters.length})
                </h3>
              </div>

              {accessError ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-slate-900 mb-2">Accesso Negato</h4>
                  <p className="text-slate-500 mb-4">{accessError}</p>
                  <p className="text-sm text-slate-400">
                    Effettua il login come amministratore dal pannello /admin
                  </p>
                </div>
              ) : paginatedNewsletters.length === 0 ? (
                <div className="p-12 text-center">
                  <Mail className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h4 className="font-medium text-slate-900 mb-2">Nessuna newsletter</h4>
                  <p className="text-slate-500">
                    {selectedFilter === 'all' 
                      ? 'Non ci sono newsletter registrate'
                      : `Non ci sono newsletter con stato "${filters.find(f => f.value === selectedFilter)?.label.toLowerCase()}"`
                    }
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Newsletter</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Open Rate</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">CTR</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Iscritti</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Stato</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700">Azioni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedNewsletters.map((newsletter) => {
                        const statusInfo = getStatusInfo(newsletter.status)
                        const StatusIcon = statusInfo.icon
                        
                        // Mock data for CTR if not available
                        const openRate = newsletter.open_rate || 22.5
                        const ctr = newsletter.ctr || (openRate * 0.15) // CTR is typically 10-20% of open rate

                        return (
                          <tr key={newsletter.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4">
                              <div>
                                <h4 className="font-medium text-slate-900 mb-1">{newsletter.title}</h4>
                                <p className="text-sm text-slate-600">{newsletter.author.name}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-sm font-medium text-slate-900">{openRate.toFixed(1)}%</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-sm font-medium text-slate-900">{ctr.toFixed(1)}%</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-sm font-medium text-slate-900">{newsletter.subscribers.toLocaleString()}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                <StatusIcon className="w-3 h-3" />
                                {statusInfo.label}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <button 
                                onClick={() => openDetailsModal(newsletter)}
                                className="btn-uniform bg-slate-600 text-white hover:bg-slate-700"
                                title="Visualizza dettagli"
                              >
                                Dettagli
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Mostrando {startIndex + 1}-{Math.min(endIndex, filteredNewsletters.length)} di {filteredNewsletters.length} newsletter
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="icon-inline" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          currentPage === page
                            ? 'bg-red-600 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="icon-inline" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      
      {/* Modal Dettagli Newsletter */}
      {showDetailsModal && selectedNewsletter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-slate-900">
                Dettagli Newsletter
              </h2>
              <button
                onClick={closeDetailsModal}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="icon-inline" />
              </button>
            </div>
            
            {/* Success Message */}
            {saveSuccess && (
              <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-medium text-green-800">
                    Newsletter aggiornata con successo!
                  </p>
                </div>
              </div>
            )}
            
            {/* Error Message */}
            {saveError && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <p className="text-sm font-medium text-red-800">
                    {saveError}
                  </p>
                </div>
              </div>
            )}
            
            {/* Content Modal */}
            <div className="p-5 space-y-5">
              {/* Info Newsletter */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <h3 className="text-base font-medium text-slate-900 mb-3">Informazioni Base</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-700">Titolo</label>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={editFormData.title || ''}
                          onChange={(e) => handleEditFieldChange('title', e.target.value)}
                          className="w-full mt-1 px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-slate-900 text-xs mt-1">{selectedNewsletter.title}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700">Categoria</label>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={editFormData.category || ''}
                          onChange={(e) => handleEditFieldChange('category', e.target.value)}
                          className="w-full mt-1 px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-slate-900 text-xs mt-1">{selectedNewsletter.rawData?.category || 'Non specificata'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700">Lingua</label>
                      {isEditMode ? (
                        <select
                          value={editFormData.language || 'Italiano'}
                          onChange={(e) => handleEditFieldChange('language', e.target.value)}
                          className="w-full mt-1 px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Italiano">Italiano</option>
                          <option value="Inglese">Inglese</option>
                          <option value="Francese">Francese</option>
                          <option value="Spagnolo">Spagnolo</option>
                        </select>
                      ) : (
                        <p className="text-slate-900 text-xs mt-1">{selectedNewsletter.rawData?.language || 'Italiano'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700">Frequenza</label>
                      {isEditMode ? (
                        <select
                          value={editFormData.cadence || ''}
                          onChange={(e) => handleEditFieldChange('cadence', e.target.value)}
                          className="w-full mt-1 px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Seleziona frequenza</option>
                          <option value="Giornaliera">Giornaliera</option>
                          <option value="Settimanale">Settimanale</option>
                          <option value="Bisettimanale">Bisettimanale</option>
                          <option value="Mensile">Mensile</option>
                          <option value="Irregolare">Irregolare</option>
                        </select>
                      ) : (
                        <p className="text-slate-900 text-xs mt-1">{selectedNewsletter.rawData?.cadence || 'Non specificata'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700">Data Registrazione</label>
                      <p className="text-slate-900 text-xs mt-1">
                        {selectedNewsletter.rawData?.created_at ? new Date(selectedNewsletter.rawData.created_at).toLocaleDateString('it-IT') : 'Non disponibile'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base font-medium text-slate-900 mb-3">Metriche & Business</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-700">Iscritti</label>
                      {isEditMode ? (
                        <input
                          type="number"
                          value={editFormData.subscribers || 0}
                          onChange={(e) => handleEditFieldChange('subscribers', e.target.value)}
                          className="w-full mt-1 px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="0"
                        />
                      ) : (
                        <p className="text-slate-900 text-xs mt-1 font-medium">{selectedNewsletter.subscribers?.toLocaleString() || '0'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700">Open Rate (%)</label>
                      {isEditMode ? (
                        <input
                          type="number"
                          value={editFormData.open_rate || 0}
                          onChange={(e) => handleEditFieldChange('open_rate', e.target.value)}
                          className="w-full mt-1 px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="0"
                          max="100"
                          step="0.1"
                        />
                      ) : (
                        <p className="text-slate-900 text-xs mt-1 font-medium">
                          {selectedNewsletter.open_rate ? `${selectedNewsletter.open_rate}%` : 'Non disponibile'}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700">CTR (%)</label>
                      {isEditMode ? (
                        <input
                          type="number"
                          value={editFormData.ctr || 0}
                          onChange={(e) => handleEditFieldChange('ctr', e.target.value)}
                          className="w-full mt-1 px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="0"
                          max="100"
                          step="0.1"
                        />
                      ) : (
                        <p className="text-slate-900 text-xs mt-1 font-medium">
                          {selectedNewsletter.ctr ? `${selectedNewsletter.ctr}%` : 'Non disponibile'}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700">Prezzo Sponsorizzazione</label>
                      <p className="text-slate-900 text-xs mt-1 font-medium text-green-600">
                        {selectedNewsletter.rawData?.sponsorship_price ? `€${selectedNewsletter.rawData.sponsorship_price}` : 'Non specificato'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700">Monetizzazione</label>
                      <p className="text-slate-900 text-xs mt-1">{selectedNewsletter.rawData?.monetization || 'Non specificata'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-medium text-slate-900 mb-3">Autore & Contatti</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-700">Nome Autore</label>
                      <p className="text-slate-900 text-xs mt-1">{selectedNewsletter.author?.name || 'Non specificato'}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700">Email Business</label>
                      <p className="text-slate-900 text-xs mt-1">{selectedNewsletter.contact_email || selectedNewsletter.author?.email || 'Non specificata'}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700">LinkedIn</label>
                      {selectedNewsletter.rawData?.linkedin_profile ? (
                        <a 
                          href={selectedNewsletter.rawData.linkedin_profile} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-xs break-all"
                        >
                          Visualizza Profilo
                        </a>
                      ) : (
                        <p className="text-slate-500 text-xs">Non disponibile</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Descrizione */}
              <div>
                <h3 className="text-base font-medium text-slate-900 mb-2">Descrizione</h3>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-slate-700 text-xs leading-relaxed">
                    {selectedNewsletter.content?.excerpt || selectedNewsletter.rawData?.description || 'Nessuna descrizione disponibile'}
                  </p>
                </div>
              </div>
              
              {/* Links */}
              <div>
                <h3 className="text-base font-medium text-slate-900 mb-2">Collegamenti</h3>
                <div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Link Archivio Pubblico</label>
                    {selectedNewsletter.signup_url ? (
                      <a 
                        href={selectedNewsletter.signup_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-xs break-all"
                      >
                        {selectedNewsletter.signup_url}
                      </a>
                    ) : (
                      <p className="text-slate-500 text-xs">Non disponibile</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Stato Corrente */}
              <div>
                <h3 className="text-base font-medium text-slate-900 mb-2">Stato di Revisione</h3>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const statusInfo = getStatusInfo(selectedNewsletter.status)
                      const StatusIcon = statusInfo.icon
                      return (
                        <>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo.label}
                          </span>
                          {selectedNewsletter.moderation?.rejectedReason && (
                            <span className="text-xs text-red-600">
                              Motivo: {selectedNewsletter.moderation.rejectedReason}
                            </span>
                          )}
                        </>
                      )
                    })()}
                  </div>
                </div>
              </div>
              
              {/* Azioni di Modifica - Per tutte le newsletter */}
              <div>
                <h3 className="text-base font-medium text-slate-900 mb-2">Azioni</h3>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    {isEditMode ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          disabled={isSaving}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isSaving ? (
                            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <CheckCircle className="w-3 h-3" />
                          )}
                          {isSaving ? 'Salvando...' : 'Salva'}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          disabled={isSaving}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <X className="w-3 h-3" />
                          Annulla
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditNewsletter(selectedNewsletter)}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                          Modifica
                        </button>
                        <button
                          onClick={() => handleSendEmail(selectedNewsletter)}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <Send className="w-3 h-3" />
                          Invia Email
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Azioni Solo per Newsletter in Revisione */}
              {selectedNewsletter.status === 'in_review' && (
                <div>
                  <h3 className="text-base font-medium text-slate-900 mb-2">Azioni di Moderazione</h3>
                  <div className="bg-slate-50 rounded-lg p-3 space-y-3">
                    {/* Campo Motivazione Rifiuto */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Motivazione rifiuto (opzionale)
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Inserisci il motivo del rifiuto se decidi di rifiutare la newsletter..."
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={2}
                      />
                    </div>
                    
                    {/* Pulsanti Azione */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleApproveFromModal}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        <CheckCircle className="w-3 h-3" />
                        Approva
                      </button>
                      <button
                        onClick={handleRejectFromModal}
                        disabled={!rejectionReason.trim()}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <XCircle className="w-3 h-3" />
                        Rifiuta
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">
                      * La motivazione del rifiuto è obbligatoria per rifiutare una newsletter
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
    </div>
  )
}
