'use client'

import { useState } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { 
  Search, 
  Book, 
  MessageCircle, 
  Mail, 
  Phone,
  ExternalLink,
  ChevronRight,
  Star,
  Clock,
  Users,
  CreditCard,
  Settings,
  Menu,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  HelpCircle,
  FileText,
  Video,
  Download
} from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import Link from 'next/link'

interface HelpCategory {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  articleCount: number
  popularArticles: string[]
}

interface Article {
  id: string
  title: string
  category: string
  readTime: string
  helpful: number
  lastUpdated: string
  preview: string
}

const helpCategories: HelpCategory[] = [
  {
    id: 'getting-started',
    title: 'Iniziare',
    description: 'Tutto quello che devi sapere per iniziare su Newsletter Italiane',
    icon: <Star className="w-6 h-6" />,
    articleCount: 8,
    popularArticles: ['Come registrare la tua newsletter', 'Impostare il tuo profilo', 'Prime collaborazioni']
  },
  {
    id: 'newsletters',
    title: 'Newsletter',
    description: 'Gestire, modificare e ottimizzare le tue newsletter',
    icon: <Mail className="w-6 h-6" />,
    articleCount: 12,
    popularArticles: ['Aggiungere metriche', 'Modificare prezzi', 'Politiche di pubblicazione']
  },
  {
    id: 'collaborations',
    title: 'Collaborazioni',
    description: 'Come funzionano le collaborazioni con i brand',
    icon: <Users className="w-6 h-6" />,
    articleCount: 15,
    popularArticles: ['Accettare una proposta', 'Negoziare prezzi', 'Gestire i deadline']
  },
  {
    id: 'payments',
    title: 'Pagamenti',
    description: 'Fatturazione, pagamenti e gestione delle entrate',
    icon: <CreditCard className="w-6 h-6" />,
    articleCount: 9,
    popularArticles: ['Emettere fatture', 'Tempi di pagamento', 'Metodi di pagamento']
  },
  {
    id: 'account',
    title: 'Account e Impostazioni',
    description: 'Gestire il tuo account e le preferenze',
    icon: <Settings className="w-6 h-6" />,
    articleCount: 6,
    popularArticles: ['Cambiare password', 'Notifiche', 'Eliminare account']
  },
  {
    id: 'policies',
    title: 'Linee Guida e Politiche',
    description: 'Termini di servizio, privacy e linee guida della community',
    icon: <FileText className="w-6 h-6" />,
    articleCount: 5,
    popularArticles: ['Termini di servizio', 'Privacy policy', 'Linee guida community']
  }
]

const popularArticles: Article[] = [
  {
    id: '1',
    title: 'Come registrare la tua prima newsletter',
    category: 'Iniziare',
    readTime: '3 min',
    helpful: 142,
    lastUpdated: '2025-01-10',
    preview: 'Guida passo-passo per registrare la tua newsletter e iniziare a ricevere proposte di collaborazione...'
  },
  {
    id: '2',
    title: 'Impostare prezzi competitivi per la tua newsletter',
    category: 'Newsletter',
    readTime: '5 min',
    helpful: 98,
    lastUpdated: '2025-01-08',
    preview: 'Come calcolare il giusto prezzo per le tue sponsorizzazioni basandoti su metriche di mercato...'
  },
  {
    id: '3',
    title: 'Accettare e gestire le collaborazioni',
    category: 'Collaborazioni',
    readTime: '4 min',
    helpful: 156,
    lastUpdated: '2025-01-12',
    preview: 'Tutto quello che devi sapere su come accettare proposte e gestire il workflow delle collaborazioni...'
  },
  {
    id: '4',
    title: 'Quando e come ricevere i pagamenti',
    category: 'Pagamenti',
    readTime: '2 min',
    helpful: 203,
    lastUpdated: '2025-01-15',
    preview: 'Tempi di pagamento, metodi disponibili e come gestire la fatturazione per le tue collaborazioni...'
  }
]

export default function HelpPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredArticles, setFilteredArticles] = useState(popularArticles)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/sign-in')
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = popularArticles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.preview.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredArticles(filtered)
    } else {
      setFilteredArticles(popularArticles)
    }
  }, [searchQuery])

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
                <h1 className="text-xl font-semibold text-foreground">Centro Assistenza</h1>
                <HelpCircle className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard/help/contact"
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                Contattaci
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Hero Section */}
          <div className="bg-primary/5 border-b border-border">
            <div className="max-w-4xl mx-auto px-6 py-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Come possiamo aiutarti?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Trova risposte alle tue domande, guide dettagliate e supporto per utilizzare al meglio Newsletter Italiane
                </p>
                
                {/* Search Bar */}
                <div className="relative max-w-lg mx-auto">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Cerca nella documentazione..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              <Link 
                href="/dashboard/help/getting-started"
                className="p-6 bg-card border border-border rounded-lg hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Book className="w-6 h-6 text-primary" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Guida Rapida</h3>
                <p className="text-sm text-muted-foreground">Inizia subito con la guida di setup in 5 minuti</p>
              </Link>

              <Link 
                href="/dashboard/help/video-tutorials"
                className="p-6 bg-card border border-border rounded-lg hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-chart-2/10 rounded-lg">
                    <Video className="w-6 h-6 text-chart-2" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-chart-2 transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Video Tutorial</h3>
                <p className="text-sm text-muted-foreground">Guarda i video tutorial passo-passo</p>
              </Link>

              <Link 
                href="/dashboard/help/contact"
                className="p-6 bg-card border border-border rounded-lg hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-chart-5/10 rounded-lg">
                    <MessageCircle className="w-6 h-6 text-chart-5" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-chart-5 transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Contatto Diretto</h3>
                <p className="text-sm text-muted-foreground">Parla con il nostro team di supporto</p>
              </Link>
            </div>

            {/* Search Results or Categories */}
            {searchQuery ? (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-6">
                  Risultati ricerca per "{searchQuery}" ({filteredArticles.length})
                </h3>
                <div className="space-y-4">
                  {filteredArticles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/dashboard/help/articles/${article.id}`}
                      className="block p-6 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-2">{article.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{article.preview}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Book className="w-3 h-3" />
                              {article.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {article.readTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              {article.helpful} utili
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Categories Grid */}
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-6">Esplora per categoria</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {helpCategories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/dashboard/help/category/${category.id}`}
                        className="p-6 bg-card border border-border rounded-lg hover:shadow-md transition-shadow group"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-primary/10 rounded-lg text-primary">
                            {category.icon}
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <h4 className="font-semibold text-foreground mb-2">{category.title}</h4>
                        <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{category.articleCount} articoli</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Popular Articles */}
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-6">Articoli più popolari</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {popularArticles.map((article) => (
                      <Link
                        key={article.id}
                        href={`/dashboard/help/articles/${article.id}`}
                        className="p-6 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-foreground flex-1">{article.title}</h4>
                          <ChevronRight className="w-5 h-5 text-muted-foreground ml-2" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{article.preview}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {article.readTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              {article.helpful}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">{article.category}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Contact Section */}
            <div className="mt-16 p-8 bg-muted rounded-lg">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Non hai trovato quello che cercavi?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Il nostro team di supporto è sempre disponibile per aiutarti
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/dashboard/help/contact"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Contatta il Supporto
                  </Link>
                  <a
                    href="mailto:support@newsletter-italiane.com"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border text-foreground rounded-lg hover:bg-accent font-medium"
                  >
                    <Mail className="w-4 h-4" />
                    Invia Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}