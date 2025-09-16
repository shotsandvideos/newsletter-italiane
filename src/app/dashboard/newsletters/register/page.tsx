'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../../hooks/useAuth'
import { createNewsletterSchema, NEWSLETTER_CATEGORIES, SENDING_FREQUENCIES } from '../../../lib/validations'
import { ArrowLeft, Check, AlertCircle, Mail, Menu } from 'lucide-react'
import Link from 'next/link'
import Sidebar from '../../../components/Sidebar'

export default function RegisterNewsletterPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    language: 'it',
    signup_url: '',
    cadence: '',
    audience_size: '',
    monetization: '',
    contact_email: user?.email || '',
    linkedin_profile: '',
    open_rate: '',
    ctr_rate: '',
    sponsorship_price: ''
  })

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Redirect if not authenticated
  if (!authLoading && !user) {
    router.push('/auth/sign-in')
    return null
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validazione file
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setErrors(prev => ({ ...prev, logo: 'Il file deve essere massimo 5MB' }))
        return
      }
      
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, logo: 'Il file deve essere un\'immagine' }))
        return
      }
      
      setLogoFile(file)
      setErrors(prev => ({ ...prev, logo: '' }))
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting) return

    setIsSubmitting(true)
    setErrors({})

    try {
      // Validate form data
      const validatedData = createNewsletterSchema.parse({
        ...formData,
        audience_size: parseInt(formData.audience_size) || 0,
        open_rate: parseFloat(formData.open_rate) || 0,
        ctr_rate: parseFloat(formData.ctr_rate) || 0,
        sponsorship_price: parseInt(formData.sponsorship_price) || 0
      })

      const response = await fetch('/api/newsletters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard/newsletters?success=newsletter-created')
        }, 2000)
      } else {
        setErrors({ submit: result.error || 'Errore durante la registrazione della newsletter' })
      }
    } catch (error: any) {
      if (error.errors) {
        // Zod validation errors
        const formErrors: Record<string, string> = {}
        error.errors.forEach((err: any) => {
          if (err.path && err.path.length > 0) {
            formErrors[err.path[0]] = err.message
          }
        })
        setErrors(formErrors)
      } else {
        setErrors({ submit: 'Errore durante la registrazione della newsletter' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar 
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
              <div className="bg-emerald-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Newsletter Registrata!
              </h1>
              <p className="text-muted-foreground mb-4">
                La tua newsletter è stata inviata per la revisione. Ti contatteremo appena sarà approvata.
              </p>
              <p className="text-sm text-muted-foreground">
                Reindirizzamento alla dashboard...
              </p>
            </div>
          </div>
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
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2">
              <Mail className="w-6 h-6 text-red-600" />
              <h1 className="text-xl font-semibold text-foreground">
                Registra Newsletter
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto px-6 py-6">
            {/* Header */}
            <div className="mb-6">
              <Link 
                href="/dashboard/newsletters"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-3 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Torna alla lista
              </Link>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Mail className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Registra la tua Newsletter
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Compila i dettagli della tua newsletter per inviarla in revisione
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-card border border-border rounded-lg p-5">
                <h2 className="text-base font-semibold text-foreground mb-4">
                  Informazioni Base
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-xs font-medium text-foreground mb-1">
                      Nome Newsletter *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="es. Marketing Weekly, Tech Insights..."
                      className={`w-full px-3 py-2 text-sm border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        errors.title ? 'border-red-500' : 'border-border'
                      }`}
                      required
                    />
                    {errors.title && (
                      <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-xs font-medium text-foreground mb-1">
                      Categoria *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 text-sm border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        errors.category ? 'border-red-500' : 'border-border'
                      }`}
                      required
                    >
                      <option value="">Seleziona una categoria</option>
                      {NEWSLETTER_CATEGORIES.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                    )}
                  </div>

                  {/* Logo Newsletter - Span 2 columns */}
                  <div className="md:col-span-2">
                    <label htmlFor="logo" className="block text-xs font-medium text-foreground mb-1">
                      Logo newsletter (300x300px)
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <input
                          type="file"
                          id="logo"
                          name="logo"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Dimensioni consigliate: 300x300px, max 5MB
                        </p>
                      </div>
                      {logoPreview && (
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-border">
                          <img
                            src={logoPreview}
                            alt="Preview logo"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    {errors.logo && (
                      <p className="text-red-500 text-xs mt-1">{errors.logo}</p>
                    )}
                  </div>
            </div>
          </div>

              <div className="bg-card border border-border rounded-lg p-5">
                <h2 className="text-base font-semibold text-foreground mb-4">
                  URL e Collegamenti
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Signup URL */}
                  <div>
                    <label htmlFor="signup_url" className="block text-xs font-medium text-foreground mb-1">
                      Link archivio pubblico *
                    </label>
                    <input
                      type="url"
                      id="signup_url"
                      name="signup_url"
                      value={formData.signup_url}
                      onChange={handleInputChange}
                      placeholder="https://tuanewsletter.substack.com"
                      className={`w-full px-3 py-2 text-sm border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        errors.signup_url ? 'border-red-500' : 'border-border'
                      }`}
                      required
                    />
                    {errors.signup_url && (
                      <p className="text-red-500 text-xs mt-1">{errors.signup_url}</p>
                    )}
                  </div>


                  {/* LinkedIn Profile */}
                  <div>
                    <label htmlFor="linkedin_profile" className="block text-xs font-medium text-foreground mb-1">
                      Profilo LinkedIn (opzionale)
                    </label>
                    <input
                      type="url"
                      id="linkedin_profile"
                      name="linkedin_profile"
                      value={formData.linkedin_profile}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/tuoprofilo"
                      className={`w-full px-3 py-2 text-sm border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        errors.linkedin_profile ? 'border-red-500' : 'border-border'
                      }`}
                    />
                    {errors.linkedin_profile && (
                      <p className="text-red-500 text-xs mt-1">{errors.linkedin_profile}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-5">
                <h2 className="text-base font-semibold text-foreground mb-4">
                  Metriche & Business
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Numero Iscritti */}
                  <div>
                    <label htmlFor="audience_size" className="block text-xs font-medium text-foreground mb-1">
                      Numero iscritti *
                    </label>
                    <input
                      type="number"
                      id="audience_size"
                      name="audience_size"
                      value={formData.audience_size}
                      onChange={handleInputChange}
                      placeholder="es. 1500"
                      min="0"
                      className={`w-full px-3 py-2 text-sm border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        errors.audience_size ? 'border-red-500' : 'border-border'
                      }`}
                      required
                    />
                    {errors.audience_size && (
                      <p className="text-red-500 text-xs mt-1">{errors.audience_size}</p>
                    )}
                  </div>

                  {/* Open Rate */}
                  <div>
                    <label htmlFor="open_rate" className="block text-xs font-medium text-foreground mb-1">
                      Open Rate medio (%) *
                    </label>
                    <input
                      type="number"
                      id="open_rate"
                      name="open_rate"
                      value={formData.open_rate}
                      onChange={handleInputChange}
                      placeholder="es. 45"
                      min="0"
                      max="100"
                      step="0.1"
                      className={`w-full px-3 py-2 text-sm border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        errors.open_rate ? 'border-red-500' : 'border-border'
                      }`}
                      required
                    />
                    {errors.open_rate && (
                      <p className="text-red-500 text-xs mt-1">{errors.open_rate}</p>
                    )}
                  </div>

                  {/* CTR Rate */}
                  <div>
                    <label htmlFor="ctr_rate" className="block text-xs font-medium text-foreground mb-1">
                      Click-Through Rate (%) *
                    </label>
                    <input
                      type="number"
                      id="ctr_rate"
                      name="ctr_rate"
                      value={formData.ctr_rate}
                      onChange={handleInputChange}
                      placeholder="es. 3.5"
                      min="0"
                      max="100"
                      step="0.1"
                      className={`w-full px-3 py-2 text-sm border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        errors.ctr_rate ? 'border-red-500' : 'border-border'
                      }`}
                      required
                    />
                    {errors.ctr_rate && (
                      <p className="text-red-500 text-xs mt-1">{errors.ctr_rate}</p>
                    )}
                  </div>

                  {/* Frequenza Invio */}
                  <div>
                    <label htmlFor="cadence" className="block text-xs font-medium text-foreground mb-1">
                      Frequenza invio (opzionale)
                    </label>
                    <select
                      id="cadence"
                      name="cadence"
                      value={formData.cadence}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Seleziona frequenza...</option>
                      {SENDING_FREQUENCIES.map(frequency => (
                        <option key={frequency} value={frequency}>
                          {frequency}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Prezzo Sponsorizzazione */}
                  <div>
                    <label htmlFor="sponsorship_price" className="block text-xs font-medium text-foreground mb-1">
                      Prezzo sponsorizzazione (€) *
                    </label>
                    <input
                      type="number"
                      id="sponsorship_price"
                      name="sponsorship_price"
                      value={formData.sponsorship_price}
                      onChange={handleInputChange}
                      placeholder="es. 150"
                      min="0"
                      className={`w-full px-3 py-2 text-sm border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        errors.sponsorship_price ? 'border-red-500' : 'border-border'
                      }`}
                      required
                    />
                    {errors.sponsorship_price && (
                      <p className="text-red-500 text-xs mt-1">{errors.sponsorship_price}</p>
                    )}
                  </div>

                  {/* Email di Contatto Business */}
                  <div>
                    <label htmlFor="contact_email" className="block text-xs font-medium text-foreground mb-1">
                      Email di contatto business *
                    </label>
                    <input
                      type="email"
                      id="contact_email"
                      name="contact_email"
                      value={formData.contact_email}
                      onChange={handleInputChange}
                      placeholder="ciao@letmetell.it"
                      className={`w-full px-3 py-2 text-sm border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        errors.contact_email ? 'border-red-500' : 'border-border'
                      }`}
                      required
                    />
                    {errors.contact_email && (
                      <p className="text-red-500 text-xs mt-1">{errors.contact_email}</p>
                    )}
                  </div>
                </div>

                {/* Descrizione Newsletter - Span 2 columns */}
                <div className="md:col-span-2 mt-4">
                  <label htmlFor="description" className="block text-xs font-medium text-foreground mb-1">
                    Descrizione newsletter *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Scrivi qui la descrizione della tua newsletter"
                    rows={3}
                    className={`w-full px-3 py-2 text-sm border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-500 resize-none ${
                      errors.description ? 'border-red-500' : 'border-border'
                    }`}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.description.length}/300 caratteri
                  </p>
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="flex flex-col gap-3 mt-6">
                {errors.submit && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <p className="text-red-700 text-sm">{errors.submit}</p>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-red-600 text-white py-2.5 px-5 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? 'Registrazione...' : 'Registra Newsletter'}
                  </button>
                  
                  <Link
                    href="/dashboard/newsletters"
                    className="px-5 py-2.5 border border-border rounded-lg text-foreground hover:bg-accent transition-colors text-sm"
                  >
                    Annulla
                  </Link>
                </div>

                <p className="text-xs text-muted-foreground">
                  * La newsletter sarà sottoposta a revisione prima della pubblicazione
                </p>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}