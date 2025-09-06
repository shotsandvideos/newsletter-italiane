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
  MoreHorizontal,
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
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [editingNewsletter, setEditingNewsletter] = useState<Newsletter | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingNewsletter, setDeletingNewsletter] = useState<Newsletter | null>(null)
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<Partial<CreateNewsletterInput>>({
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

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/sign-in')
    }
  }, [authLoading, user, router])

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
  
  // Auto-show form if coming from sidebar
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('new') === 'true') {
      setShowForm(true)
      // Clean the URL
      window.history.replaceState({}, '', '/dashboard/newsletters')
    }
  }, [])

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
        setShowForm(false)
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

  const getStatusColor = (status: Newsletter['status']) => {
    switch (status) {
      case 'approved': return 'text-green-700 bg-green-50 ring-green-600/20'
      case 'rejected': return 'text-red-700 bg-red-50 ring-red-600/20'
      default: return 'text-yellow-700 bg-yellow-50 ring-yellow-600/20'
    }
  }

  const getStatusIcon = (status: Newsletter['status']) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getStatusText = (status: Newsletter['status']) => {
    switch (status) {
      case 'approved': return 'Approvata'
      case 'rejected': return 'Rifiutata'
      default: return 'In Review'
    }
  }

  const filteredNewsletters = useMemo(() => {
    return newsletters.filter(newsletter => {
      const matchesSearch = (newsletter.nome_newsletter?.toLowerCase() || '').includes(debouncedSearchQuery.toLowerCase()) ||
                           (newsletter.categoria?.toLowerCase() || '').includes(debouncedSearchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || newsletter.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [newsletters, debouncedSearchQuery, statusFilter])

  const stats = useMemo(() => {
    const approvedNewsletters = newsletters.filter(n => n.status === 'approved')
    return {
      total: newsletters.length,
      approved: approvedNewsletters.length,
      pending: newsletters.filter(n => n.status === 'pending').length,
      rejected: newsletters.filter(n => n.status === 'rejected').length,
      totalEarnings: approvedNewsletters.reduce((sum, n) => sum + (n.prezzo_sponsorizzazione || 0), 0)
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
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingNewsletter(null)
    setFormErrors({})
    setLogoFile(null)
    setLogoPreview(null)
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      {/* Update Success Message */}
      {showUpdateSuccess && (
        <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-md p-4 z-50">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Newsletter aggiornata!
              </p>
              <p className="text-sm text-green-700">
                Le modifiche sono state salvate con successo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar 
        onNewNewsletter={() => setShowForm(true)} 
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
              <Mail className="w-5 h-5 text-gray-400" />
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nuova newsletter
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto px-6 py-6">
          {/* Newsletter Form */}
          {showForm && (
            <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingNewsletter ? 'Modifica newsletter' : 'Registra nuova newsletter'}
                </h2>
                <button
                  onClick={handleCloseForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              

              <form onSubmit={handleFormSubmit}>
                {/* General Error */}
                {formErrors.general && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-800 text-sm">{formErrors.general}</p>
                  </div>
                )}

                {/* Two Column Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                    {/* Left Column */}
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        Informazioni Newsletter
                      </h3>
                      <div className="space-y-4">
                      {/* Nome Newsletter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome della newsletter *
                        </label>
                        <input
                          type="text"
                          value={formData.nome_newsletter}
                          onChange={(e) => handleInputChange('nome_newsletter', e.target.value)}
                          placeholder="es. Marketing Espresso"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.nome_newsletter ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {formErrors.nome_newsletter && (
                          <p className="text-red-600 text-xs mt-1">{formErrors.nome_newsletter}</p>
                        )}
                      </div>

                      {/* Logo Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Logo newsletter <span className="text-gray-400 font-normal">(300x300px)</span>
                        </label>
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                formErrors.logo ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                            {formErrors.logo && (
                              <p className="text-red-600 text-xs mt-1">{formErrors.logo}</p>
                            )}
                            <p className="text-gray-500 text-xs mt-1">
                              Dimensioni consigliate: 300x300px, max 5MB
                            </p>
                          </div>
                          {logoPreview && (
                            <div className="w-16 h-16 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                              <img 
                                src={logoPreview} 
                                alt="Logo preview" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* URL Archivio */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Link archivio pubblico *
                        </label>
                        <input
                          type="url"
                          value={formData.url_archivio}
                          onChange={(e) => handleInputChange('url_archivio', e.target.value)}
                          placeholder="https://tuanewsletter.substack.com"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.url_archivio ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {formErrors.url_archivio && (
                          <p className="text-red-600 text-xs mt-1">{formErrors.url_archivio}</p>
                        )}
                      </div>

                      {/* Categoria */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Categoria principale *
                        </label>
                        <select
                          value={formData.categoria || ''}
                          onChange={(e) => handleInputChange('categoria', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.categoria ? 'border-red-300' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Seleziona categoria...</option>
                          {NEWSLETTER_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        {formErrors.categoria && (
                          <p className="text-red-600 text-xs mt-1">{formErrors.categoria}</p>
                        )}
                      </div>

                      {/* Email Contatto */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email di contatto business *
                        </label>
                        <input
                          type="email"
                          value={formData.email_contatto}
                          onChange={(e) => handleInputChange('email_contatto', e.target.value)}
                          placeholder="business@tuoemail.com"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.email_contatto ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {formErrors.email_contatto && (
                          <p className="text-red-600 text-xs mt-1">{formErrors.email_contatto}</p>
                        )}
                      </div>

                      {/* LinkedIn Profile */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Profilo LinkedIn <span className="text-gray-400 font-normal">(opzionale)</span>
                        </label>
                        <input
                          type="url"
                          value={formData.linkedin_profile}
                          onChange={(e) => handleInputChange('linkedin_profile', e.target.value)}
                          placeholder="https://linkedin.com/in/tuoprofilo"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.linkedin_profile ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {formErrors.linkedin_profile && (
                          <p className="text-red-600 text-xs mt-1">{formErrors.linkedin_profile}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Metriche & Business
                    </h3>
                    <div className="space-y-4">
                      {/* Numero Iscritti */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Numero iscritti *
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={formData.numero_iscritti || ''}
                          onChange={(e) => handleInputChange('numero_iscritti', parseInt(e.target.value) || undefined)}
                          placeholder="es. 1500"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.numero_iscritti ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {formErrors.numero_iscritti && (
                          <p className="text-red-600 text-xs mt-1">{formErrors.numero_iscritti}</p>
                        )}
                      </div>

                      {/* Open Rate */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Open Rate medio (%) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          value={formData.open_rate || ''}
                          onChange={(e) => handleInputChange('open_rate', parseFloat(e.target.value) || undefined)}
                          placeholder="es. 45"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.open_rate ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {formErrors.open_rate && (
                          <p className="text-red-600 text-xs mt-1">{formErrors.open_rate}</p>
                        )}
                      </div>

                      {/* CTR */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Click-Through Rate (%) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          value={formData.ctr || ''}
                          onChange={(e) => handleInputChange('ctr', parseFloat(e.target.value) || undefined)}
                          placeholder="es. 3.5"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.ctr ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {formErrors.ctr && (
                          <p className="text-red-600 text-xs mt-1">{formErrors.ctr}</p>
                        )}
                      </div>

                      {/* Frequenza */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Frequenza invio <span className="text-gray-400 font-normal">(opzionale)</span>
                        </label>
                        <select
                          value={formData.frequenza_invio || ''}
                          onChange={(e) => handleInputChange('frequenza_invio', e.target.value || undefined)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Seleziona frequenza...</option>
                          {SENDING_FREQUENCIES.map((freq) => (
                            <option key={freq} value={freq}>{freq}</option>
                          ))}
                        </select>
                      </div>

                      {/* Prezzo Sponsorizzazione */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prezzo sponsorizzazione (€) *
                        </label>
                        <input
                          type="number"
                          min="10"
                          value={formData.prezzo_sponsorizzazione || ''}
                          onChange={(e) => handleInputChange('prezzo_sponsorizzazione', parseInt(e.target.value) || undefined)}
                          placeholder="es. 150"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.prezzo_sponsorizzazione ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {formErrors.prezzo_sponsorizzazione && (
                          <p className="text-red-600 text-xs mt-1">{formErrors.prezzo_sponsorizzazione}</p>
                        )}
                      </div>
                      </div>
                    </div>
                  </div>

                  {/* Description - Full Width */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrizione newsletter *
                    </label>
                    <textarea
                      rows={3}
                      value={formData.descrizione}
                      onChange={(e) => handleInputChange('descrizione', e.target.value)}
                      placeholder="Descrivi in breve di cosa parla la tua newsletter, il tuo stile e il tuo pubblico..."
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm ${
                        formErrors.descrizione ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.descrizione && (
                      <p className="text-red-600 text-xs mt-1">{formErrors.descrizione}</p>
                    )}
                    <p className="text-gray-500 text-xs mt-1">
                      {formData.descrizione?.length || 0}/300 caratteri
                    </p>
                  </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? 'Salvando...' : editingNewsletter ? 'Salva Modifiche' : 'Registra Newsletter'}
                  </button>
                </div>
              </form>
            </div>
          )}
          {/* Stats Overview */}
          <div className="mb-8">
            <h2 className="text-base font-medium text-gray-900 mb-4">Panoramica</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
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
                    <CheckCircle className="w-5 h-5 text-green-600" />
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
                    <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
                    <p className="text-sm text-gray-600">In review</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-semibold text-gray-900">€{stats.totalEarnings}</p>
                    <p className="text-sm text-gray-600">Valore potenziale</p>
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
                  <option value="pending">In review</option>
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
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Registra newsletter
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredNewsletters.map((newsletter) => (
                  <div key={newsletter.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-base font-medium text-gray-900 truncate">
                            {newsletter.nome_newsletter}
                          </h4>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${getStatusColor(newsletter.status)}`}>
                            {getStatusIcon(newsletter.status)}
                            {getStatusText(newsletter.status)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {newsletter.descrizione}
                        </p>
                        
                        <div className="flex items-center gap-6 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{newsletter.numero_iscritti_tier}</span>
                          </div>
                          <span>{newsletter.categoria}</span>
                          <span>OR: {newsletter.open_rate}%</span>
                          <span>CTR: {newsletter.ctr}%</span>
                          <span className="font-medium text-gray-900">€{newsletter.prezzo_sponsorizzazione}</span>
                          {newsletter.frequenza_invio && (
                            <span>{newsletter.frequenza_invio}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-6">
                        <button 
                          onClick={() => handleEditNewsletter(newsletter)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <Edit className="w-4 h-4" />
                          Modifica
                        </button>
                        
                        <div className="relative group">
                          <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          
                          {/* Dropdown menu */}
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <div className="py-1">
                              <a
                                href={newsletter.url_archivio}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Eye className="w-4 h-4" />
                                Visualizza archivio
                              </a>
                              <button
                                onClick={() => handleDeleteNewsletter(newsletter)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                              >
                                <Trash2 className="w-4 h-4" />
                                Elimina newsletter
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Elimina Newsletter</h3>
                <p className="text-sm text-gray-500">Questa azione non può essere annullata</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              Sei sicuro di voler eliminare la newsletter "<strong>{deletingNewsletter.nome_newsletter}</strong>"?
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
