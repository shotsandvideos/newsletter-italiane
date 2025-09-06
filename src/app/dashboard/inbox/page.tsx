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
    from: 'Admin Newsletter Italiane',
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

Il team di Newsletter Italiane`,
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
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list')

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
      case 'sponsorship': return <DollarSign className="w-4 h-4 text-green-600" />
      case 'collaboration': return <Users className="w-4 h-4 text-blue-600" />
      case 'approval': return <CheckCircle className="w-4 h-4 text-purple-600" />
      case 'notification': return <Mail className="w-4 h-4 text-gray-600" />
    }
  }

  const getTypeBadge = (type: Message['type']) => {
    const configs = {
      sponsorship: { color: 'bg-green-100 text-green-800', label: 'Sponsorizzazione' },
      collaboration: { color: 'bg-blue-100 text-blue-800', label: 'Collaborazione' },
      approval: { color: 'bg-purple-100 text-purple-800', label: 'Approvazione' },
      notification: { color: 'bg-gray-100 text-gray-800', label: 'Notifica' }
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
      unread: { color: 'bg-red-100 text-red-800', label: 'Non letto' },
      read: { color: 'bg-gray-100 text-gray-800', label: 'Letto' },
      replied: { color: 'bg-blue-100 text-blue-800', label: 'Risposto' },
      accepted: { color: 'bg-green-100 text-green-800', label: 'Accettato' },
      declined: { color: 'bg-red-100 text-red-800', label: 'Rifiutato' }
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
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
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                {viewMode === 'detail' && selectedMessage && (
                  <button
                    onClick={() => setViewMode('list')}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <h1 className="text-xl font-semibold text-gray-900">Inbox</h1>
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-500">
                {messages.filter(m => m.status === 'unread').length} messaggi non letti
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {viewMode === 'list' ? (
            /* Messages List */
            <div className="p-6">
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Messaggi ({messages.length})
                  </h3>
                </div>

                {messages.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <Mail className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-base font-medium text-gray-900 mb-2">Nessun messaggio</h3>
                    <p className="text-sm text-gray-500">I nuovi messaggi appariranno qui</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                          message.status === 'unread' ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => {
                          setSelectedMessage(message)
                          setViewMode('detail')
                          if (message.status === 'unread') {
                            markAsRead(message.id)
                          }
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {getTypeIcon(message.type)}
                            <div>
                              <h4 className={`text-base ${message.status === 'unread' ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                                {message.from}
                              </h4>
                              <p className="text-sm text-gray-500 capitalize">{message.from_type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getTypeBadge(message.type)}
                            {getStatusBadge(message.status)}
                          </div>
                        </div>
                        
                        <h5 className={`text-sm mb-2 ${message.status === 'unread' ? 'font-semibold' : 'font-normal'}`}>
                          {message.subject}
                        </h5>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {message.content.split('\n')[0]}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{formatDate(message.created_at)}</span>
                            {message.metadata?.amount && (
                              <span className="font-semibold text-green-600">€{message.metadata.amount}</span>
                            )}
                            {message.metadata?.newsletter_name && (
                              <span>Newsletter: {message.metadata.newsletter_name}</span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Message Detail View */
            selectedMessage && (
              <div className="p-6">
                <div className="bg-white rounded-lg border border-gray-200">
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {selectedMessage.subject}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                          <span>Da: <span className="font-medium text-gray-900">{selectedMessage.from}</span></span>
                          <span>•</span>
                          <span className="capitalize">{selectedMessage.from_type}</span>
                          <span>•</span>
                          <span>{formatDate(selectedMessage.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getTypeBadge(selectedMessage.type)}
                          {getStatusBadge(selectedMessage.status)}
                        </div>
                      </div>
                    </div>

                    {/* Metadata */}
                    {selectedMessage.metadata && Object.keys(selectedMessage.metadata).length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                        {selectedMessage.metadata.amount && (
                          <div>
                            <span className="text-xs text-gray-500 uppercase tracking-wide">Budget</span>
                            <p className="text-sm font-semibold text-green-600">€{selectedMessage.metadata.amount}</p>
                          </div>
                        )}
                        {selectedMessage.metadata.newsletter_name && (
                          <div>
                            <span className="text-xs text-gray-500 uppercase tracking-wide">Newsletter</span>
                            <p className="text-sm font-medium text-gray-900">{selectedMessage.metadata.newsletter_name}</p>
                          </div>
                        )}
                        {selectedMessage.metadata.deadline && (
                          <div>
                            <span className="text-xs text-gray-500 uppercase tracking-wide">Deadline</span>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(selectedMessage.metadata.deadline).toLocaleDateString('it-IT')}
                            </p>
                          </div>
                        )}
                        {selectedMessage.metadata.collaboration_details && (
                          <div>
                            <span className="text-xs text-gray-500 uppercase tracking-wide">Dettagli</span>
                            <p className="text-sm font-medium text-gray-900">{selectedMessage.metadata.collaboration_details}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
                        {selectedMessage.content}
                      </pre>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                          Rispondi
                        </button>
                        {(selectedMessage.type === 'sponsorship' || selectedMessage.type === 'collaboration') && (
                          <>
                            <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
                              Accetta
                            </button>
                            <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700">
                              Rifiuta
                            </button>
                          </>
                        )}
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
                          Archivia
                        </button>
                      </div>
                      <button
                        onClick={() => setViewMode('list')}
                        className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
                      >
                        Torna alla lista
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  )
}