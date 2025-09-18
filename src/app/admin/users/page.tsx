'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users,
  Search,
  Menu,
  Mail,
  MessageCircle,
  Send,
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import AdminSidebar from '../../components/AdminSidebar'

interface Author {
  id: string
  author_first_name: string
  author_last_name: string
  author_email: string
  newsletter_name: string
  newsletter_id: string
}

export default function AdminAuthorsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [authors, setAuthors] = useState<Author[]>([])
  const [showChatModal, setShowChatModal] = useState(false)
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null)
  const [chatMessage, setChatMessage] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const [messageStatus, setMessageStatus] = useState<'success' | 'error' | null>(null)
  const router = useRouter()

  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession')
    if (adminSession) {
      try {
        const session = JSON.parse(adminSession)
        if (session.username === 'admin' && session.role === 'admin') {
          setIsAuthenticated(true)
          fetchAuthors()
        } else {
          router.push('/admin/login')
        }
      } catch {
        router.push('/admin/login')
      }
    } else {
      router.push('/admin/login')
    }
    setLoading(false)
  }, [router])

  const fetchAuthors = async () => {
    try {
      const response = await fetch('/api/newsletters-all', {
        headers: {
          'x-admin-auth': 'admin-panel'
        }
      })
      const data = await response.json()
      
      if (data.success) {
        // Transform newsletter data to author data
        const authorsData = data.data.map((newsletter: any) => ({
          id: `${newsletter.author_email}-${newsletter.id}`, // Unique ID combining email and newsletter ID
          author_first_name: newsletter.author_first_name || 'Nome',
          author_last_name: newsletter.author_last_name || 'Cognome',
          author_email: newsletter.author_email || 'email@example.com',
          newsletter_name: newsletter.title,
          newsletter_id: newsletter.id
        }))
        
        setAuthors(authorsData)
        console.log(`Loaded ${authorsData.length} author records`)
      }
    } catch (error) {
      console.error('Error fetching authors:', error)
    }
  }

  const openChatModal = (author: Author) => {
    setSelectedAuthor(author)
    setShowChatModal(true)
    setChatMessage('')
    setMessageStatus(null)
  }

  const closeChatModal = () => {
    setShowChatModal(false)
    setSelectedAuthor(null)
    setChatMessage('')
    setMessageStatus(null)
  }

  const sendChatMessage = async () => {
    if (!selectedAuthor || !chatMessage.trim()) return

    setSendingMessage(true)
    
    try {
      // This would be the actual send_chat_message function/endpoint
      const response = await fetch('/api/admin/send-chat-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': 'admin-panel'
        },
        body: JSON.stringify({
          author_email: selectedAuthor.author_email,
          newsletter_id: selectedAuthor.newsletter_id,
          message: chatMessage.trim()
        })
      })

      if (response.ok) {
        setMessageStatus('success')
        setChatMessage('')
        setTimeout(() => {
          closeChatModal()
        }, 2000)
      } else {
        setMessageStatus('error')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setMessageStatus('error')
    } finally {
      setSendingMessage(false)
    }
  }

  const filteredAuthors = authors.filter(author => {
    const fullName = `${author.author_first_name} ${author.author_last_name}`.toLowerCase()
    const email = author.author_email.toLowerCase()
    const newsletter = author.newsletter_name.toLowerCase()
    const query = searchQuery.toLowerCase()
    
    return fullName.includes(query) || email.includes(query) || newsletter.includes(query)
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
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
                <Users className="icon-counter text-red-600" />
                <h1 className="heading-page text-slate-900">Gestione Autori</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto px-6 py-6">
          <div className="space-y-6">
            {/* Search */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cerca autori, email o newsletter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Authors List */}
            <div className="bg-white rounded-lg border border-slate-200">
              <div className="p-4 border-b border-slate-200">
                <h3 className="text-base font-semibold text-slate-900">
                  Autori ({filteredAuthors.length})
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Elenco autori derivato dalle newsletter registrate
                </p>
              </div>

              <div className="divide-y divide-slate-200">
                {filteredAuthors.length === 0 ? (
                  <div className="p-12 text-center">
                    <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h4 className="font-medium text-slate-900 mb-2">Nessun autore</h4>
                    <p className="text-slate-500">
                      {searchQuery ? 'Nessun autore corrisponde ai criteri di ricerca' : 'Non ci sono autori registrati'}
                    </p>
                  </div>
                ) : (
                  filteredAuthors.map((author) => (
                    <div key={author.id} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-sm font-medium text-slate-900">
                              {author.author_first_name} {author.author_last_name}
                            </h4>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <Mail className="w-3 h-3" />
                              {author.author_email}
                            </span>
                          </div>
                          <div className="text-xs text-slate-600">
                            Newsletter: <span className="font-medium">{author.newsletter_name}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => openChatModal(author)}
                            className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors font-medium flex items-center gap-1"
                            title="Invia messaggio"
                          >
                            <MessageCircle className="w-3 h-3" />
                            Chat
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Chat Modal */}
      {showChatModal && selectedAuthor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            {/* Header Modal */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-slate-900">
                Invia Messaggio
              </h2>
              <button
                onClick={closeChatModal}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Content Modal */}
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Destinatario
                </label>
                <p className="text-sm text-slate-900">
                  {selectedAuthor.author_first_name} {selectedAuthor.author_last_name} ({selectedAuthor.author_email})
                </p>
                <p className="text-xs text-slate-500">
                  Newsletter: {selectedAuthor.newsletter_name}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Messaggio
                </label>
                <textarea
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Scrivi il tuo messaggio qui..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              {messageStatus === 'success' && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <p className="text-green-800 text-sm">Messaggio inviato con successo!</p>
                </div>
              )}

              {messageStatus === 'error' && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <p className="text-red-800 text-sm">Errore nell'invio del messaggio</p>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={sendChatMessage}
                  disabled={!chatMessage.trim() || sendingMessage}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                  {sendingMessage ? 'Invio...' : 'Invia Messaggio'}
                </button>
                
                <button
                  onClick={closeChatModal}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Annulla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}