'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '../../../../../hooks/useAuth'
import { SENDING_FREQUENCIES } from '../../../../lib/validations'
import { ArrowLeft, Save, AlertCircle, Menu } from 'lucide-react'
import Link from 'next/link'
import Sidebar from '../../../../components/Sidebar'

export default function EditNewsletterPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const newsletterId = params.id as string
  
  const [newsletter, setNewsletter] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const [formData, setFormData] = useState({
    open_rate: '',
    ctr_rate: '',
    cadence: '',
    signup_url: '',
    sponsorship_price: ''
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/sign-in')
      return
    }
  }, [authLoading, user, router])

  // Fetch newsletter data
  useEffect(() => {
    if (user && newsletterId) {
      fetchNewsletter()
    }
  }, [user, newsletterId])

  const fetchNewsletter = async () => {
    try {
      const response = await fetch('/api/newsletters')
      const result = await response.json()
      
      if (result.success) {
        const userNewsletter = result.data.find((n: any) => n.id === newsletterId)
        
        if (!userNewsletter) {
          router.push('/dashboard/newsletters')
          return
        }

        if (userNewsletter.review_status !== 'approved') {
          router.push('/dashboard/newsletters')
          return
        }

        setNewsletter(userNewsletter)
        setFormData({
          open_rate: userNewsletter.open_rate?.toString() || '',
          ctr_rate: userNewsletter.ctr_rate?.toString() || '',
          cadence: userNewsletter.cadence || '',
          signup_url: userNewsletter.signup_url || '',
          sponsorship_price: userNewsletter.sponsorship_price?.toString() || ''
        })
      }
    } catch (error) {
      console.error('Error fetching newsletter:', error)
      router.push('/dashboard/newsletters')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting) return

    setIsSubmitting(true)
    setErrors({})

    try {
      const response = await fetch('/api/newsletters', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: newsletterId,
          open_rate: parseFloat(formData.open_rate) || 0,
          ctr_rate: parseFloat(formData.ctr_rate) || 0,
          cadence: formData.cadence,
          signup_url: formData.signup_url,
          sponsorship_price: parseInt(formData.sponsorship_price) || 0
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard/newsletters?success=newsletter-updated')
        }, 2000)
      } else {
        setErrors({ submit: result.error || 'Errore durante l\'aggiornamento della newsletter' })
      }
    } catch (error: any) {
      setErrors({ submit: 'Errore durante l\'aggiornamento della newsletter' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex h-screen">
        <Sidebar 
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex h-screen">
        <Sidebar 
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
        />
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
              <div className="bg-emerald-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Save className="w-8 h-8 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Newsletter Aggiornata!
              </h1>
              <p className="text-muted-foreground mb-4">
                Le modifiche sono state salvate e la newsletter è stata rimessa in revisione.
              </p>
              <p className="text-sm text-muted-foreground">
                Reindirizzamento alla lista...
              </p>
            </div>
          </div>
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
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2">
              <Save className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-foreground">
                Modifica Newsletter
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-6 py-6">
            {/* Header */}
            <div className="mb-6">
              <Link 
                href="/dashboard/newsletters"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-3 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Torna alla lista
              </Link>
              
              {newsletter && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Save className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      {newsletter.title}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Modifica i campi consentiti - La newsletter tornerà in revisione dopo la modifica
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-card border border-border rounded-lg p-5">
                <h2 className="text-base font-semibold text-foreground mb-4">
                  Campi Modificabili
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className={`w-full px-3 py-2 text-sm border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                      className={`w-full px-3 py-2 text-sm border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                      className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className={`w-full px-3 py-2 text-sm border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.sponsorship_price ? 'border-red-500' : 'border-border'
                      }`}
                      required
                    />
                    {errors.sponsorship_price && (
                      <p className="text-red-500 text-xs mt-1">{errors.sponsorship_price}</p>
                    )}
                  </div>

                  {/* Link Archivio Pubblico - Span 2 columns */}
                  <div className="md:col-span-2">
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
                      className={`w-full px-3 py-2 text-sm border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.signup_url ? 'border-red-500' : 'border-border'
                      }`}
                      required
                    />
                    {errors.signup_url && (
                      <p className="text-red-500 text-xs mt-1">{errors.signup_url}</p>
                    )}
                  </div>
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

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <p className="text-yellow-800 text-sm font-medium">
                      Attenzione: Dopo la modifica la newsletter tornerà in stato "In revisione"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 text-white py-2.5 px-5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? 'Salvando...' : 'Salva Modifiche'}
                  </button>
                  
                  <Link
                    href="/dashboard/newsletters"
                    className="px-5 py-2.5 border border-border rounded-lg text-foreground hover:bg-accent transition-colors text-sm"
                  >
                    Annulla
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}