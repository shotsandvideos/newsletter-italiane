'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users,
  Search,
  Menu,
  Mail,
  Eye,
  X,
  ExternalLink
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

interface AuthorDetails {
  newsletters: string[]
  activeCampaigns: number
  collaborationValue: number
  email: string
}

export default function AdminAuthorsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [authors, setAuthors] = useState<Author[]>([])
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null)
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
        // Transform newsletter data to author data, removing duplicates by email
        const uniqueAuthors = new Map()
        data.data.forEach((newsletter: any) => {
          const email = newsletter.author?.email || newsletter.user_id
          if (!uniqueAuthors.has(email)) {
            uniqueAuthors.set(email, {
              id: newsletter.user_id || email,
              author_first_name: newsletter.author?.first_name || 'Nome',
              author_last_name: newsletter.author?.last_name || 'Cognome',
              author_email: email,
              newsletter_name: newsletter.title,
              newsletter_id: newsletter.id
            })
          }
        })
        
        const authorsData = Array.from(uniqueAuthors.values())
        
        setAuthors(authorsData)
        console.log(`Loaded ${authorsData.length} author records`)
      }
    } catch (error) {
      console.error('Error fetching authors:', error)
    }
  }

  const openDetailsModal = (author: Author) => {
    setSelectedAuthor({
      id: author.id,
      author_first_name: author.author_first_name,
      author_last_name: author.author_last_name,
      author_email: author.author_email,
      newsletter_name: author.newsletter_name,
      newsletter_id: author.newsletter_id
    })
    setShowDetailsModal(true)
  }

  const closeDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedAuthor(null)
  }

  const handleContactAuthor = (email: string) => {
    window.open(`mailto:${email}?subject=Contatto da Newsletter Italiane`, '_blank')
  }

  // Mock data for author details - in a real app this would come from API
  const getAuthorDetails = (author: Author): AuthorDetails => {
    return {
      newsletters: [author.newsletter_name, 'Tech Weekly', 'Marketing Insights'].slice(0, Math.floor(Math.random() * 3) + 1),
      activeCampaigns: Math.floor(Math.random() * 5) + 1,
      collaborationValue: Math.floor(Math.random() * 5000) + 500,
      email: author.author_email
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
                            onClick={() => openDetailsModal(author)}
                            className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors font-medium flex items-center gap-1"
                            title="Vedi dettagli autore"
                          >
                            <Eye className="w-3 h-3" />
                            Dettagli
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
      
      {/* Author Details Modal */}
      {showDetailsModal && selectedAuthor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {selectedAuthor.author_first_name} {selectedAuthor.author_last_name}
                  </h3>
                  <p className="text-sm text-slate-600">{selectedAuthor.author_email}</p>
                </div>
              </div>
              <button
                onClick={closeDetailsModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {(() => {
                const details = getAuthorDetails(selectedAuthor)
                return (
                  <>
                    {/* Newsletter Gestite */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 mb-3">Newsletter Gestite</h4>
                      <div className="space-y-2">
                        {details.newsletters.map((newsletter, index) => (
                          <div key={index} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-slate-900 font-medium">{newsletter}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Statistiche */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{details.activeCampaigns}</div>
                        <div className="text-sm text-blue-800">Campagne Attive</div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">€{details.collaborationValue.toLocaleString()}</div>
                        <div className="text-sm text-green-800">Valore Collaborazione</div>
                      </div>
                    </div>

                    {/* Contatto */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 mb-3">Contatto</h4>
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-slate-400" />
                          <span className="text-sm text-slate-900">{details.email}</span>
                        </div>
                        <button
                          onClick={() => handleContactAuthor(details.email)}
                          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Contatta
                        </button>
                      </div>
                    </div>
                  </>
                )
              })()} 
            </div>
          </div>
        </div>
      )}
    </div>
  )
}