'use client'

import { useState } from 'react'
import { useAuth } from '../../../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { 
  MessageCircle, 
  Mail, 
  Phone,
  Clock,
  CheckCircle,
  Info,
  Menu,
  ArrowLeft,
  Send,
  FileText,
  Paperclip
} from 'lucide-react'
import Sidebar from '../../../components/Sidebar'
import Link from 'next/link'

interface ContactOption {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  responseTime: string
  availability: string
  action: string
  href?: string
  onClick?: () => void
}

const contactOptions: ContactOption[] = [
  {
    id: 'chat',
    title: 'Chat dal Vivo',
    description: 'Parla direttamente con il nostro team di supporto',
    icon: <MessageCircle className="w-6 h-6" />,
    responseTime: 'Immediata',
    availability: 'Lun-Ven 9:00-18:00',
    action: 'Inizia Chat'
  },
  {
    id: 'email',
    title: 'Email Support',
    description: 'Invia una richiesta dettagliata al nostro team',
    icon: <Mail className="w-6 h-6" />,
    responseTime: 'Entro 24 ore',
    availability: '24/7',
    action: 'Invia Email',
    href: 'mailto:support@newsletter-italiane.com'
  },
  {
    id: 'phone',
    title: 'Supporto Telefonico',
    description: 'Chiamaci per assistenza immediata',
    icon: <Phone className="w-6 h-6" />,
    responseTime: 'Immediata',
    availability: 'Lun-Ven 9:00-17:00',
    action: 'Chiama Ora',
    href: 'tel:+39-02-1234567'
  }
]

const ticketCategories = [
  { value: 'account', label: 'Account e Accesso' },
  { value: 'newsletter', label: 'Gestione Newsletter' },
  { value: 'collaboration', label: 'Collaborazioni e Brand' },
  { value: 'payment', label: 'Pagamenti e Fatturazione' },
  { value: 'technical', label: 'Problemi Tecnici' },
  { value: 'other', label: 'Altro' }
]

const priorityLevels = [
  { value: 'low', label: 'Bassa - Domanda generale', color: 'text-chart-2' },
  { value: 'medium', label: 'Media - Problema non bloccante', color: 'text-chart-4' },
  { value: 'high', label: 'Alta - Problema che blocca il lavoro', color: 'text-destructive' },
  { value: 'urgent', label: 'Urgente - Problema critico', color: 'text-destructive font-semibold' }
]

export default function ContactPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'options' | 'ticket'>('options')
  const [showChatWidget, setShowChatWidget] = useState(false)
  
  // Ticket form state
  const [ticketForm, setTicketForm] = useState({
    category: '',
    priority: 'medium',
    subject: '',
    description: '',
    attachments: [] as File[]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/sign-in')
    }
  }, [authLoading, user, router])

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setSubmitSuccess(true)
    
    // Reset form after success
    setTimeout(() => {
      setTicketForm({
        category: '',
        priority: 'medium',
        subject: '',
        description: '',
        attachments: []
      })
      setSubmitSuccess(false)
      setActiveTab('options')
    }, 3000)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setTicketForm(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files].slice(0, 5) // Max 5 files
    }))
  }

  const removeAttachment = (index: number) => {
    setTicketForm(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
              >
                <Menu className="w-5 h-5" />
              </button>
              <Link 
                href="/dashboard/help"
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold text-foreground">Contatta il Supporto</h1>
                <MessageCircle className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-8">
              <button
                onClick={() => setActiveTab('options')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'options'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Opzioni di Contatto
              </button>
              <button
                onClick={() => setActiveTab('ticket')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'ticket'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Invia Ticket
              </button>
            </div>

            {activeTab === 'options' ? (
              <>
                {/* Contact Options */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Come preferisci contattarci?</h2>
                  <p className="text-muted-foreground mb-8">
                    Scegli il metodo di contatto più adatto alle tue esigenze
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {contactOptions.map((option) => (
                      <div
                        key={option.id}
                        className="p-6 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg text-primary mb-4">
                          {option.icon}
                        </div>
                        
                        <h3 className="font-semibold text-foreground mb-2">{option.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{option.description}</p>
                        
                        <div className="space-y-2 mb-6">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Risposta: </span>
                            <span className="font-medium text-foreground">{option.responseTime}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Info className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Disponibile: </span>
                            <span className="text-foreground">{option.availability}</span>
                          </div>
                        </div>

                        {option.href ? (
                          <a
                            href={option.href}
                            className="w-full inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition-colors"
                          >
                            {option.action}
                          </a>
                        ) : (
                          <button
                            onClick={() => option.id === 'chat' && setShowChatWidget(true)}
                            className="w-full inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition-colors"
                          >
                            {option.action}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Support Status */}
                <div className="bg-chart-5/10 border border-chart-5/20 rounded-lg p-6 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-chart-5" />
                    <div>
                      <h3 className="font-semibold text-foreground">Supporto Attivo</h3>
                      <p className="text-sm text-muted-foreground">
                        Tutti i nostri canali di supporto sono operativi. Tempo medio di risposta: 2 ore
                      </p>
                    </div>
                  </div>
                </div>

                {/* FAQ Quick Links */}
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">Prima di contattarci</h3>
                  <p className="text-muted-foreground mb-6">
                    Controlla se la tua domanda ha già una risposta nella nostra documentazione
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                      href="/dashboard/help/category/getting-started"
                      className="p-4 bg-card border border-border rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <h4 className="font-medium text-foreground mb-1">Come iniziare</h4>
                      <p className="text-sm text-muted-foreground">Guide per i primi passi sulla piattaforma</p>
                    </Link>
                    
                    <Link
                      href="/dashboard/help/category/payments"
                      className="p-4 bg-card border border-border rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <h4 className="font-medium text-foreground mb-1">Pagamenti e Fatturazione</h4>
                      <p className="text-sm text-muted-foreground">Informazioni su pagamenti e tasse</p>
                    </Link>
                    
                    <Link
                      href="/dashboard/help/category/collaborations"
                      className="p-4 bg-card border border-border rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <h4 className="font-medium text-foreground mb-1">Gestire Collaborazioni</h4>
                      <p className="text-sm text-muted-foreground">Come lavorare con i brand</p>
                    </Link>
                    
                    <Link
                      href="/dashboard/help/category/account"
                      className="p-4 bg-card border border-border rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <h4 className="font-medium text-foreground mb-1">Problemi Account</h4>
                      <p className="text-sm text-muted-foreground">Accesso, password e impostazioni</p>
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              /* Ticket Form */
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Invia un Ticket di Supporto</h2>
                  <p className="text-muted-foreground">
                    Fornisci quanti più dettagli possibili per aiutarci a risolvere il tuo problema rapidamente
                  </p>
                </div>

                {submitSuccess ? (
                  <div className="bg-chart-5/10 border border-chart-5/20 rounded-lg p-8 text-center">
                    <CheckCircle className="w-16 h-16 text-chart-5 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Ticket Inviato!</h3>
                    <p className="text-muted-foreground mb-4">
                      Abbiamo ricevuto la tua richiesta. Ti risponderemo entro 24 ore.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ID Ticket: #TK{Math.random().toString().slice(2, 8)}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleTicketSubmit} className="space-y-6">
                    {/* User Info Display */}
                    <div className="bg-muted rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-2">Informazioni Account</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Nome: </span>
                          <span className="text-foreground">{profile?.first_name} {profile?.last_name}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Email: </span>
                          <span className="text-foreground">{user?.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                        Categoria <span className="text-destructive">*</span>
                      </label>
                      <select
                        id="category"
                        required
                        value={ticketForm.category}
                        onChange={(e) => setTicketForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Seleziona una categoria</option>
                        {ticketCategories.map((cat) => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">
                        Priorità <span className="text-destructive">*</span>
                      </label>
                      <div className="space-y-2">
                        {priorityLevels.map((priority) => (
                          <label key={priority.value} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="priority"
                              value={priority.value}
                              checked={ticketForm.priority === priority.value}
                              onChange={(e) => setTicketForm(prev => ({ ...prev, priority: e.target.value }))}
                              className="text-primary focus:ring-primary"
                            />
                            <span className={`text-sm ${priority.color}`}>
                              {priority.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                        Oggetto <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        id="subject"
                        required
                        value={ticketForm.subject}
                        onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Descrivi brevemente il problema..."
                        className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                        Descrizione <span className="text-destructive">*</span>
                      </label>
                      <textarea
                        id="description"
                        required
                        rows={6}
                        value={ticketForm.description}
                        onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Fornisci una descrizione dettagliata del problema, inclusi eventuali messaggi di errore e i passi che hai seguito..."
                        className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      />
                    </div>

                    {/* File Attachments */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Allegati (Opzionale)
                      </label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <input
                          type="file"
                          id="attachments"
                          multiple
                          accept="image/*,.pdf,.doc,.docx,.txt"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <label htmlFor="attachments" className="cursor-pointer">
                          <Paperclip className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground mb-1">
                            Clicca per allegare file o trascinali qui
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG, PDF, DOC, TXT (max 10MB ciascuno, max 5 file)
                          </p>
                        </label>
                      </div>

                      {/* File List */}
                      {ticketForm.attachments.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {ticketForm.attachments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-foreground">{file.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  ({(file.size / 1024 / 1024).toFixed(1)} MB)
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeAttachment(index)}
                                className="text-destructive hover:text-destructive/80 text-sm"
                              >
                                Rimuovi
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 font-medium transition-colors"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground"></div>
                            Invio in corso...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Invia Ticket
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('options')}
                        className="px-6 py-3 border border-border text-foreground rounded-lg hover:bg-accent font-medium transition-colors"
                      >
                        Annulla
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Chat Widget Overlay */}
      {showChatWidget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Chat di Supporto</h3>
                <button
                  onClick={() => setShowChatWidget(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-muted rounded-lg p-4 mb-4">
                <p className="text-sm text-foreground">
                  <strong>Supporto:</strong> Ciao! Come posso aiutarti oggi?
                </p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Scrivi il tuo messaggio..."
                  className="flex-1 px-3 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
