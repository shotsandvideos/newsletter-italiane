'use client'

import { useAuth } from '../../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { 
  Mail, 
  Star, 
  Clock, 
  DollarSign, 
  Users, 
  CheckCircle, 
  XCircle,
  Menu,
  X,
  Eye,
  ArrowLeft
} from 'lucide-react'
import Sidebar from '../../components/Sidebar'

interface Message {
  id: string
  from: string
  from_type: 'admin' | 'brand'
  subject: string
  content: string
  type: 'collaboration' | 'sponsorship' | 'notification' | 'approval'
  status: 'unread' | 'read' | 'replied' | 'accepted' | 'declined'
  created_at: string
  metadata?: {
    amount?: number
    deadline?: string
    newsletter_name?: string
    collaboration_details?: string
  }
}

// Mock data per ora
const mockMessages: Message[] = [
  {
    id: '1',
    from: 'Admin Frames',
    from_type: 'admin',
    subject: 'Newsletter approvata - Congratulazioni!',
    content: `Ciao!

Siamo felici di informarti che la tua newsletter "Tech Weekly" è stata approvata e pubblicata sulla nostra piattaforma.

**Dettagli approvazione:**
- Data approvazione: 5 Settembre 2025
- Status: Attiva e visibile ai brand
- Categoria: Marketing & Growth

Da ora i brand possono contattarti direttamente per proposte di collaborazione e sponsorizzazioni.

Buona fortuna con la tua newsletter!

Il team di Frames`,
    type: 'approval',
    status: 'unread',
    created_at: '2025-09-05T10:30:00Z',
    metadata: {
      newsletter_name: 'Tech Weekly'
    }
  },
  {
    id: '2',
    from: 'GreenTech Solutions',
    from_type: 'brand',
    subject: 'Proposta di Sponsorizzazione - Settore Sostenibilità',
    content: `Ciao,

Sono Marco di GreenTech Solutions, una startup che sviluppa soluzioni innovative per l'energia sostenibile.

**Proposta di Sponsorizzazione:**
- Newsletter: Tech Weekly  
- Budget: €400 per invio
- Formato: Banner header + paragrafo sponsorizzato (200 parole)
- Temi: Tecnologie verdi, innovazione sostenibile
- Timeline: Prossime 3 settimane

Il nostro prodotto si allinea perfettamente con il tuo pubblico tech-savvy interessato alle innovazioni del futuro.

Ti va di organizzare una chiamata per discuterne?

Cordiali saluti,
Marco Verdi
Business Development Manager`,
    type: 'sponsorship',
    status: 'unread',
    created_at: '2025-09-05T08:15:00Z',
    metadata: {
      amount: 400,
      deadline: '2025-09-25',
      newsletter_name: 'Tech Weekly'
    }
  },
  {
    id: '3',
    from: 'Marketing Hub Italia',
    from_type: 'brand',
    subject: 'Collaborazione long-term - Partnership strategica',
    content: `Salve,

Siamo Marketing Hub Italia e vorremmo proporre una collaborazione strategica con la vostra newsletter.

**Dettagli Collaborazione:**
- Tipologia: Partnership long-term (6 mesi)
- Budget mensile: €800
- Contenuto: 2 articoli sponsorizzati al mese
- Temi: Marketing digitale, growth hacking, analytics
- Benefit aggiuntivi: Cross-promotion sui nostri canali social

Questa partnership può essere molto vantaggiosa per entrambe le parti, permettendo una presenza costante e costruendo una relazione duratura con il vostro pubblico.

Siamo aperti a discutere i dettagli e personalizzare l'accordo.

Best regards,
Sofia Martinez
Partnership Manager`,
    type: 'collaboration',
    status: 'read',
    created_at: '2025-09-04T14:22:00Z',
    metadata: {
      amount: 800,
      collaboration_details: '6 mesi - 2 articoli/mese'
    }
  }
]

export default function InboxPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(mockMessages[0]) // Select first message by default
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/sign-in')
    }
  }, [authLoading, user, router])

  const markAsRead = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, status: 'read' } : msg
    ))
  }

  const getTypeIcon = (type: Message['type']) => {
    switch (type) {
      case 'sponsorship': return <DollarSign className="w-4 h-4 text-slate-500" />
      case 'collaboration': return <Users className="w-4 h-4 text-slate-500" />
      case 'approval': return <CheckCircle className="w-4 h-4 text-slate-500" />
      case 'notification': return <Mail className="w-4 h-4 text-slate-500" />
    }
  }

  const getTypeBadge = (type: Message['type']) => {
    const configs = {
      sponsorship: { color: 'bg-slate-100 text-slate-700', label: 'Sponsorizzazione' },
      collaboration: { color: 'bg-slate-100 text-slate-700', label: 'Collaborazione' },
      approval: { color: 'bg-slate-100 text-slate-700', label: 'Approvazione' },
      notification: { color: 'bg-slate-100 text-slate-700', label: 'Notifica' }
    }
    
    const config = configs[type]
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const getStatusBadge = (status: Message['status']) => {
    const configs = {
      unread: { color: 'bg-slate-100 text-slate-700', label: 'Non letto' },
      read: { color: 'bg-slate-100 text-slate-600', label: 'Letto' },
      replied: { color: 'bg-slate-100 text-slate-700', label: 'Risposto' },
      accepted: { color: 'bg-slate-100 text-slate-700', label: 'Accettato' },
      declined: { color: 'bg-slate-100 text-slate-700', label: 'Rifiutato' }
    }
    
    const config = configs[status]
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5

    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)} minuti fa`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} ore fa`
    } else if (diffInHours < 48) {
      return 'Ieri'
    } else {
      return date.toLocaleDateString('it-IT', { 
        day: 'numeric', 
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      })
    }
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
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold text-foreground">Inbox</h1>
                <Mail className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">
                {messages.filter(m => m.status === 'unread').length} messaggi non letti
              </p>
            </div>
          </div>
        </header>

        {/* Split Pane Content */}
        <main className="flex-1 flex overflow-hidden">
          {/* Messages List - Left Pane */}
          <div className="w-1/3 border-r border-border bg-card overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="text-base font-medium text-foreground">
                Messaggi ({messages.length})
              </h3>
            </div>

            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center">
                  <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-base font-medium text-foreground mb-2">Nessun messaggio</h3>
                  <p className="text-sm text-muted-foreground">I nuovi messaggi appariranno qui</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto divide-y divide-border">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 cursor-pointer transition-colors hover:bg-accent ${
                      selectedMessage?.id === message.id 
                        ? 'bg-primary/10 border-r-2 border-primary' 
                        : message.status === 'unread' 
                        ? 'bg-accent/50' 
                        : ''
                    }`}
                    onClick={() => {
                      setSelectedMessage(message)
                      if (message.status === 'unread') {
                        markAsRead(message.id)
                      }
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {getTypeIcon(message.type)}
                        <div className="min-w-0 flex-1">
                          <h4 className={`text-sm truncate ${message.status === 'unread' ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground'}`}>
                            {message.from}
                          </h4>
                          <p className="text-xs text-muted-foreground capitalize">{message.from_type}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        {getTypeBadge(message.type)}
                        {message.status === 'unread' && (
                          <div className="w-2 h-2 bg-primary rounded-full ml-auto" />
                        )}
                      </div>
                    </div>
                    
                    <h5 className={`text-xs mb-1 truncate ${message.status === 'unread' ? 'font-semibold text-foreground' : 'font-normal text-muted-foreground'}`}>
                      {message.subject}
                    </h5>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {message.content.split('\n')[0]}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{formatDate(message.created_at)}</span>
                      {message.metadata?.amount && (
                        <span className="font-semibold text-slate-600">€{message.metadata.amount}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message Detail - Right Pane */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedMessage ? (
              <>
                {/* Message Header */}
                <div className="px-6 py-4 border-b border-border bg-card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground mb-2 truncate">
                        {selectedMessage.subject}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3 flex-wrap">
                        <span>Da: <span className="font-medium text-foreground">{selectedMessage.from}</span></span>
                        <span>•</span>
                        <span className="capitalize">{selectedMessage.from_type}</span>
                        <span>•</span>
                        <span>{formatDate(selectedMessage.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {getTypeBadge(selectedMessage.type)}
                        {getStatusBadge(selectedMessage.status)}
                      </div>
                    </div>
                  </div>

                  {/* Metadata */}
                  {selectedMessage.metadata && Object.keys(selectedMessage.metadata).length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                      {selectedMessage.metadata.amount && (
                        <div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wide">Budget</span>
                          <p className="text-sm font-semibold text-slate-600">€{selectedMessage.metadata.amount}</p>
                        </div>
                      )}
                      {selectedMessage.metadata.newsletter_name && (
                        <div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wide">Newsletter</span>
                          <p className="text-sm font-medium text-foreground">{selectedMessage.metadata.newsletter_name}</p>
                        </div>
                      )}
                      {selectedMessage.metadata.deadline && (
                        <div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wide">Deadline</span>
                          <p className="text-sm font-medium text-foreground">
                            {new Date(selectedMessage.metadata.deadline).toLocaleDateString('it-IT')}
                          </p>
                        </div>
                      )}
                      {selectedMessage.metadata.collaboration_details && (
                        <div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wide">Dettagli</span>
                          <p className="text-sm font-medium text-foreground">{selectedMessage.metadata.collaboration_details}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Message Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-background">
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-foreground leading-relaxed">
                      {selectedMessage.content}
                    </pre>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 border-t border-border bg-card">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90">
                      Rispondi
                    </button>
                    {(selectedMessage.type === 'sponsorship' || selectedMessage.type === 'collaboration') && (
                      <>
                        <button className="px-4 py-2 bg-slate-600 text-white text-sm font-medium rounded-lg hover:bg-slate-700">
                          Accetta
                        </button>
                        <button className="px-4 py-2 bg-destructive text-destructive-foreground text-sm font-medium rounded-lg hover:bg-destructive/90">
                          Rifiuta
                        </button>
                      </>
                    )}
                    <button className="px-4 py-2 border border-border text-foreground text-sm font-medium rounded-lg hover:bg-accent">
                      Archivia
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Mail className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Seleziona un messaggio</h3>
                  <p className="text-sm text-muted-foreground">Scegli un messaggio dalla lista per visualizzarlo</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}