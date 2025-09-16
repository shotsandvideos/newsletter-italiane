'use client'

import { useAuth } from '../../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { 
  Mail, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Users,
  Eye,
  Edit,
  Filter,
  Search,
  X,
  Menu,
  Trash2
} from 'lucide-react'
import { 
  Newsletter, 
  ApiResponse, 
  createNewsletterSchema, 
  NEWSLETTER_CATEGORIES, 
  SENDING_FREQUENCIES,
  CreateNewsletterInput
} from '../../lib/validations'
import Sidebar from '../../components/Sidebar'
import { useDebounce } from '../../lib/hooks'
import { cachedFetch } from '../../lib/api-cache'

export default function NewslettersPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_review' | 'approved' | 'rejected'>('all')
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingNewsletter, setDeletingNewsletter] = useState<Newsletter | null>(null)
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/sign-in')
    }
  }, [authLoading, user, router])

  // Check for success message from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('success') === 'newsletter-created') {
      setShowUpdateSuccess(true)
      // Remove the parameter from URL
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
      // Hide message after 3 seconds
      setTimeout(() => setShowUpdateSuccess(false), 3000)
    }
  }, [])

  // Fetch newsletters
  useEffect(() => {
    if (user) {
      fetchNewsletters()
    }
  }, [user])

  const fetchNewsletters = useCallback(async () => {
    try {
      const result: ApiResponse<Newsletter[]> = await cachedFetch('/api/newsletters', undefined, 60000)
      
      if (result.success && result.data) {
        setNewsletters(result.data)
      }
    } catch (error) {
      console.error('Error fetching newsletters:', error)
    } finally {
      setLoading(false)
    }
  }, [])
  
  // Redirect to register page if coming from sidebar
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('new') === 'true') {
      router.push('/dashboard/newsletters/register')
    }
  }, [router])

  const handleInputChange = (field: keyof CreateNewsletterInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)
    setFormErrors({})

    try {
      // Validate form data
      const validatedData = createNewsletterSchema.parse(formData)
      
      // Sanitize data to prevent JSON encoding issues
      const sanitizeString = (str: string | undefined) => {
        if (!str) return str
        return str.replace(/[\u{10000}-\u{10FFFF}]/gu, '').trim()
      }
      
      const sanitizedData = {
        ...validatedData,
        descrizione: sanitizeString(validatedData.descrizione) || '',
        nome_newsletter: sanitizeString(validatedData.nome_newsletter) || '',
        linkedin_profile: validatedData.linkedin_profile ? sanitizeString(validatedData.linkedin_profile) : undefined
      }
      
      // Submit to API - use PUT for updates, POST for new newsletters
      const isUpdating = editingNewsletter !== null
      const response = await fetch(isUpdating ? `/api/newsletters/${editingNewsletter.id}` : '/api/newsletters', {
        method: isUpdating ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
      })

      const result: ApiResponse = await response.json()

      if (result.success) {
        // Reset form and hide it
        setFormData({
          nome_newsletter: '',
          url_archivio: '',
          categoria: undefined,
          numero_iscritti: undefined,
          open_rate: undefined,
          ctr: undefined,
          prezzo_sponsorizzazione: undefined,
          email_contatto: user?.email || '',
          descrizione: '',
          frequenza_invio: undefined,
          linkedin_profile: ''
        })
        // Form removed - using dedicated page
        setEditingNewsletter(null)
        
        // Show success message for updates
        if (isUpdating) {
          setShowUpdateSuccess(true)
          setTimeout(() => setShowUpdateSuccess(false), 3000)
          
          // Update the specific newsletter in the list with returned data
          if (result.data) {
            setNewsletters(newsletters.map(n => 
              n.id === result.data.id ? result.data : n
            ))
          }
        } else {
          // For new newsletters, fetch the complete list
          fetchNewsletters()
        }
      } else {
        if (result.errors) {
          setFormErrors(result.errors)
        } else {
          setFormErrors({ general: result.error || 'Errore durante il salvataggio' })
        }
      }
    } catch (error: any) {
      if (error.issues) {
        // Zod validation errors
        const zodErrors: Record<string, string> = {}
        error.issues.forEach((issue: any) => {
          const field = issue.path[0]
          zodErrors[field] = issue.message
        })
        setFormErrors(zodErrors)
      } else {
        setFormErrors({ general: 'Errore di validazione' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (review_status: Newsletter['review_status']) => {
    switch (review_status) {
      case 'approved': return 'text-emerald-700 bg-emerald-100 ring-emerald-600/20'
      case 'rejected': return 'text-red-700 bg-red-100 ring-red-600/20'
      case 'in_review': return 'text-yellow-700 bg-yellow-100 ring-yellow-600/20'
      default: return 'text-slate-700 bg-slate-100 ring-slate-600/20'
    }
  }

  const getStatusIcon = (review_status: Newsletter['review_status']) => {
    switch (review_status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      case 'in_review': return <Clock className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getStatusText = (review_status: Newsletter['review_status']) => {
    switch (review_status) {
      case 'approved': return 'Approvata'
      case 'rejected': return 'Rifiutata'
      case 'in_review': return 'In Revisione'
      default: return 'In Revisione'
    }
  }

  const filteredNewsletters = useMemo(() => {
    return newsletters.filter(newsletter => {
      const matchesSearch = (newsletter.title?.toLowerCase() || '').includes(debouncedSearchQuery.toLowerCase()) ||
                           (newsletter.category?.toLowerCase() || '').includes(debouncedSearchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || newsletter.review_status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [newsletters, debouncedSearchQuery, statusFilter])

  const stats = useMemo(() => {
    const approvedNewsletters = newsletters.filter(n => n.review_status === 'approved')
    return {
      total: newsletters.length,
      approved: approvedNewsletters.length,
      in_review: newsletters.filter(n => n.review_status === 'in_review').length,
      rejected: newsletters.filter(n => n.review_status === 'rejected').length,
      totalSubscribers: approvedNewsletters.reduce((sum, n) => sum + (n.audience_size || 0), 0)
    }
  }, [newsletters])

  const handleEditNewsletter = (newsletter: Newsletter) => {
    setEditingNewsletter(newsletter)
    // Solo alcuni campi sono modificabili dopo l'approvazione
    setFormData({
      nome_newsletter: newsletter.nome_newsletter,
      url_archivio: newsletter.url_archivio,
      categoria: newsletter.categoria,
      numero_iscritti: newsletter.numero_iscritti,
      open_rate: newsletter.open_rate,
      ctr: newsletter.ctr,
      prezzo_sponsorizzazione: newsletter.prezzo_sponsorizzazione,
      email_contatto: newsletter.email_contatto,
      descrizione: newsletter.descrizione,
      frequenza_invio: newsletter.frequenza_invio || undefined,
      linkedin_profile: newsletter.linkedin_profile || ''
    })
    // Edit functionality removed - using dedicated page
  }

  const handleCloseForm = () => {
    // Form functionality removed - using dedicated page
    setEditingNewsletter(null)
    setFormData({
      nome_newsletter: '',
      url_archivio: '',
      categoria: undefined,
      numero_iscritti: undefined,
      open_rate: undefined,
      ctr: undefined,
      prezzo_sponsorizzazione: undefined,
      email_contatto: user?.email || '',
      descrizione: '',
      frequenza_invio: undefined,
      linkedin_profile: ''
    })
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith('image/')) {
      setFormErrors(prev => ({ ...prev, logo: 'Il file deve essere un\'immagine' }))
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFormErrors(prev => ({ ...prev, logo: 'Il file deve essere più piccolo di 5MB' }))
      return
    }

    setLogoFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Clear any previous errors
    if (formErrors.logo) {
      setFormErrors(prev => ({ ...prev, logo: '' }))
    }
  }

  const handleDeleteNewsletter = (newsletter: Newsletter) => {
    setDeletingNewsletter(newsletter)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!deletingNewsletter) return
    
    try {
      const response = await fetch(`/api/newsletters/${deletingNewsletter.id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setNewsletters(newsletters.filter(n => n.id !== deletingNewsletter.id))
        setShowDeleteModal(false)
        setDeletingNewsletter(null)
      }
    } catch (error) {
      console.error('Error deleting newsletter:', error)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Update Success Message */}
      {showUpdateSuccess && (
        <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-md p-4 z-50">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Newsletter registrata!
              </p>
              <p className="text-sm text-green-700">
                La tua newsletter è stata inviata per la revisione.
              </p>
            </div>
            <button
              onClick={() => setShowUpdateSuccess(false)}
              className="ml-4 text-green-400 hover:text-green-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar 
        onNewNewsletter={() => router.push('/dashboard/newsletters/register')} 
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
              
              <h1 className="text-xl font-semibold text-gray-900">Le mie newsletter</h1>
              <Mail className="w-5 h-5 text-slate-500" />
            </div>
            <Link
              href="/dashboard/newsletters/register"
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Registra Newsletter
            </Link>
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
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Mail className="w-5 h-5" style={{color: '#72e3ad'}} />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                    <p className="text-sm text-gray-600">Newsletter totali</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5" style={{color: '#72e3ad'}} />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-semibold text-gray-900">{stats.approved}</p>
                    <p className="text-sm text-gray-600">Approvate</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-semibold text-gray-900">{stats.in_review}</p>
                    <p className="text-sm text-gray-600">In revisione</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalSubscribers.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Iscritti totali</p>
                  </div>
                </div>
              </div>
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
                    placeholder="Cerca newsletter..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tutti gli stati</option>
                  <option value="in_review">In revisione</option>
                  <option value="approved">Approvate</option>
                  <option value="rejected">Rifiutate</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  Filtri
                </button>
              </div>
            </div>
          </div>

          {/* Newsletters List */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Newsletter ({filteredNewsletters.length})
              </h3>
            </div>

            {filteredNewsletters.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Mail className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-base font-medium text-gray-900 mb-2">
                  {searchQuery || statusFilter !== 'all' ? 'Nessun risultato' : 'Nessuna newsletter'}
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'Prova a modificare i filtri di ricerca'
                    : 'Inizia registrando la tua prima newsletter per ricevere opportunità di sponsorizzazione'
                  }
                </p>
                {(!searchQuery && statusFilter === 'all') && (
                  <Link
                    href="/dashboard/newsletters/register"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Registra newsletter
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-4 py-2 text-xs font-medium text-slate-700 uppercase tracking-wider">Newsletter</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-slate-700 uppercase tracking-wider">Categoria</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-slate-700 uppercase tracking-wider">Iscritti</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-slate-700 uppercase tracking-wider">Status</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-slate-700 uppercase tracking-wider">Data</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-slate-700 uppercase tracking-wider">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredNewsletters.map((newsletter) => (
                        <tr key={newsletter.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <div>
                              <h4 className="text-sm font-medium text-slate-900 mb-1">
                                {newsletter.title}
                              </h4>
                              <p className="text-xs text-slate-500 line-clamp-2">
                                {newsletter.description}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {newsletter.category}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3 text-slate-400" />
                              <span className="text-sm text-slate-900">{newsletter.audience_size?.toLocaleString('it-IT') || 0}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${getStatusColor(newsletter.review_status)}`}>
                              {getStatusIcon(newsletter.review_status)}
                              {getStatusText(newsletter.review_status)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-slate-500">
                              {new Date(newsletter.created_at).toLocaleDateString('it-IT')}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <a
                                href={newsletter.signup_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                                title="Visualizza"
                              >
                                <Eye className="w-4 h-4" />
                              </a>
                              {newsletter.review_status === 'rejected' && (
                                <button
                                  onClick={() => handleDeleteNewsletter(newsletter)}
                                  className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Elimina"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingNewsletter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Elimina Newsletter</h3>
                <p className="text-sm text-gray-500">Questa azione non può essere annullata</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              Sei sicuro di voler eliminare la newsletter "<strong>{deletingNewsletter.title}</strong>"?
              Tutti i dati associati verranno persi definitivamente.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeletingNewsletter(null)
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
              >
                Annulla
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
              >
                Elimina
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
