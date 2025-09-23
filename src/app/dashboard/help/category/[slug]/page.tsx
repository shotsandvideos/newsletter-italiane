'use client'

import { useState } from 'react'
import { useAuth } from '../../../../../hooks/useAuth'
import { useRouter, useParams } from 'next/navigation'
import { useEffect } from 'react'
import { 
  Menu,
  ArrowLeft,
  ChevronRight,
  BookOpen,
  Search,
  Clock,
  Star,
  FileText,
  PlayCircle,
  Mail,
  Users,
  CreditCard,
  Settings
} from 'lucide-react'
import Sidebar from '../../../../components/Sidebar'
import Link from 'next/link'

// Category configurations
const categoryConfigs: Record<string, {
  title: string
  description: string
  icon: React.ReactNode
  color: string
}> = {
  'newsletters': {
    title: 'Newsletter',
    description: 'Gestire, modificare e ottimizzare le tue newsletter',
    icon: <Mail className="w-6 h-6" />,
    color: 'text-chart-2 bg-chart-2/10'
  },
  'collaborations': {
    title: 'Collaborazioni',
    description: 'Come funzionano le collaborazioni con i brand',
    icon: <Users className="w-6 h-6" />,
    color: 'text-chart-3 bg-chart-3/10'
  },
  'payments': {
    title: 'Pagamenti',
    description: 'Fatturazione, pagamenti e gestione delle entrate',
    icon: <CreditCard className="w-6 h-6" />,
    color: 'text-chart-5 bg-chart-5/10'
  },
  'account': {
    title: 'Account e Impostazioni',
    description: 'Gestire il tuo account e le preferenze',
    icon: <Settings className="w-6 h-6" />,
    color: 'text-chart-4 bg-chart-4/10'
  }
}

// Mock articles for different categories
const mockArticlesByCategory: Record<string, any[]> = {
  'newsletters': [
    {
      id: 'newsletter-metrics',
      title: 'Comprendere le metriche della newsletter',
      description: 'Guida alle metriche importanti: subscriber, open rate, CTR e come migliorarle',
      readTime: '7 min',
      difficulty: 'Intermedio',
      type: 'tutorial',
      helpful: 178
    },
    {
      id: 'newsletter-pricing',
      title: 'Come impostare prezzi competitivi',
      description: 'Strategie per definire prezzi che attraggano brand senza svalutare il tuo lavoro',
      readTime: '5 min',
      difficulty: 'Intermedio',
      type: 'article',
      helpful: 156
    },
    {
      id: 'newsletter-optimization',
      title: 'Ottimizzare le performance della newsletter',
      description: 'Tecniche avanzate per migliorare engagement e conversioni',
      readTime: '9 min',
      difficulty: 'Avanzato',
      type: 'tutorial',
      helpful: 134
    }
  ],
  'collaborations': [
    {
      id: 'first-collaboration',
      title: 'Gestire la prima collaborazione',
      description: 'Guida completa per affrontare al meglio la tua prima partnership',
      readTime: '6 min',
      difficulty: 'Principiante',
      type: 'article',
      helpful: 201
    },
    {
      id: 'negotiation-tips',
      title: 'Negoziare con i brand',
      description: 'Strategie di negoziazione per ottenere condizioni migliori',
      readTime: '8 min',
      difficulty: 'Avanzato',
      type: 'video',
      helpful: 189
    },
    {
      id: 'manage-deadlines',
      title: 'Gestire deadlines e deliverables',
      description: 'Come organizzare il lavoro e rispettare sempre le scadenze',
      readTime: '4 min',
      difficulty: 'Intermedio',
      type: 'tutorial',
      helpful: 145
    }
  ],
  'payments': [
    {
      id: 'payment-methods',
      title: 'Configurare i metodi di pagamento',
      description: 'Come impostare IBAN, PayPal e altri metodi per ricevere pagamenti',
      readTime: '3 min',
      difficulty: 'Principiante',
      type: 'article',
      helpful: 167
    },
    {
      id: 'invoice-guide',
      title: 'Guida alla fatturazione',
      description: 'Come emettere fatture corrette e gestire la contabilità',
      readTime: '7 min',
      difficulty: 'Intermedio',
      type: 'tutorial',
      helpful: 198
    },
    {
      id: 'tax-considerations',
      title: 'Considerazioni fiscali per creators',
      description: 'Aspetti fiscali da considerare quando si monetizza una newsletter',
      readTime: '10 min',
      difficulty: 'Avanzato',
      type: 'article',
      helpful: 123
    }
  ],
  'account': [
    {
      id: 'profile-setup',
      title: 'Configurare il profilo perfetto',
      description: 'Come creare un profilo creator che attragga i brand migliori',
      readTime: '5 min',
      difficulty: 'Principiante',
      type: 'video',
      helpful: 234
    },
    {
      id: 'notification-settings',
      title: 'Gestire le notifiche',
      description: 'Come personalizzare le notifiche per non perdere opportunità importanti',
      readTime: '3 min',
      difficulty: 'Principiante',
      type: 'article',
      helpful: 145
    },
    {
      id: 'account-security',
      title: 'Sicurezza dell\'account',
      description: 'Best practices per mantenere il tuo account sicuro',
      readTime: '6 min',
      difficulty: 'Intermedio',
      type: 'tutorial',
      helpful: 167
    }
  ]
}

export default function CategorySlugPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/sign-in')
    }
  }, [authLoading, user, router])

  // Redirect to getting-started if it's that category
  useEffect(() => {
    if (slug === 'getting-started') {
      router.replace('/dashboard/help/category/getting-started')
    }
  }, [slug, router])

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If it's getting-started, let the redirect handle it
  if (slug === 'getting-started') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const categoryConfig = categoryConfigs[slug]
  const articles = mockArticlesByCategory[slug] || []

  // Filter articles
  const filteredArticles = articles.filter(article => {
    const matchesSearch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesDifficulty = selectedDifficulty === 'all' || article.difficulty === selectedDifficulty
    const matchesType = selectedType === 'all' || article.type === selectedType
    
    return matchesSearch && matchesDifficulty && matchesType
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayCircle className="w-4 h-4" />
      case 'tutorial':
        return <BookOpen className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'text-chart-2 bg-chart-2/10'
      case 'tutorial':
        return 'text-chart-3 bg-chart-3/10'
      default:
        return 'text-muted-foreground bg-muted'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Principiante':
        return 'text-chart-5 bg-chart-5/10'
      case 'Intermedio':
        return 'text-chart-4 bg-chart-4/10'
      case 'Avanzato':
        return 'text-destructive bg-destructive/10'
      default:
        return 'text-muted-foreground bg-muted'
    }
  }

  if (!categoryConfig) {
    // Show 404 for unknown category
    return (
      <div className="flex h-screen">
        <Sidebar 
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
        />
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          <header className="bg-card border-b border-border px-6 py-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md">
                <Menu className="w-5 h-5" />
              </button>
              <Link href="/dashboard/help" className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md">
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-xl font-semibold text-foreground">Categoria Non Trovata</h1>
            </div>
          </header>
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Categoria Non Trovata</h2>
              <p className="text-muted-foreground mb-6">La categoria "{slug}" non esiste.</p>
              <Link href="/dashboard/help" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                Torna al Centro Assistenza
              </Link>
            </div>
          </main>
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
                <h1 className="text-xl font-semibold text-foreground">{categoryConfig.title}</h1>
                <div className={`p-1.5 rounded-lg ${categoryConfig.color}`}>
                  {categoryConfig.icon}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/dashboard/help" className="hover:text-foreground">Centro Assistenza</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">{categoryConfig.title}</span>
            </nav>

            {/* Header Section */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-4 rounded-xl ${categoryConfig.color}`}>
                  {categoryConfig.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-foreground">{categoryConfig.title}</h2>
                  <p className="text-lg text-muted-foreground">{categoryConfig.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span>{articles.length} articoli disponibili</span>
                <span>Aggiornato regolarmente</span>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder={`Cerca in ${categoryConfig.title}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-3">
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">Tutti i livelli</option>
                    <option value="Principiante">Principiante</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzato">Avanzato</option>
                  </select>

                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">Tutti i tipi</option>
                    <option value="article">Articoli</option>
                    <option value="video">Video</option>
                    <option value="tutorial">Tutorial</option>
                  </select>
                </div>
              </div>

              {/* Results count */}
              <p className="text-sm text-muted-foreground">
                {filteredArticles.length} {filteredArticles.length === 1 ? 'articolo trovato' : 'articoli trovati'}
              </p>
            </div>

            {/* Articles List */}
            <div className="space-y-6">
              {filteredArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/dashboard/help/articles/${article.id}`}
                  className="block p-6 bg-card border border-border rounded-lg hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-1.5 rounded ${getTypeColor(article.type)}`}>
                          {getTypeIcon(article.type)}
                        </div>
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {article.title}
                        </h4>
                      </div>
                      <p className="text-muted-foreground mb-4 line-clamp-2">{article.description}</p>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {article.readTime}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(article.difficulty)}`}>
                            {article.difficulty}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Star className="w-4 h-4" />
                            {article.helpful} utili
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors ml-4 flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Nessun risultato trovato</h3>
                <p className="text-muted-foreground mb-4">
                  Prova a modificare i filtri o a cercare con parole chiave diverse
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedDifficulty('all')
                    setSelectedType('all')
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  Cancella filtri
                </button>
              </div>
            )}

            {/* Help Section */}
            <div className="mt-16 p-8 bg-muted rounded-lg text-center">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Non trovi quello che cerchi?
              </h3>
              <p className="text-muted-foreground mb-6">
                Il nostro team è sempre disponibile per aiutarti con domande specifiche
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard/help/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
                >
                  Contatta il Supporto
                </Link>
                <Link
                  href="/dashboard/help"
                  className="inline-flex items-center justify-center px-6 py-3 border border-border text-foreground rounded-lg hover:bg-accent font-medium"
                >
                  Torna al Centro Assistenza
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
