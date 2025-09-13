'use client'

import { useState } from 'react'
import { useAuth } from '../../../../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { 
  Search, 
  Book, 
  Clock,
  Star,
  CheckCircle,
  Menu,
  ArrowLeft,
  ChevronRight,
  Users,
  Mail,
  CreditCard,
  Settings,
  PlayCircle,
  FileText
} from 'lucide-react'
import Sidebar from '../../../../components/Sidebar'
import Link from 'next/link'

interface Article {
  id: string
  title: string
  description: string
  readTime: string
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzato'
  helpful: number
  lastUpdated: string
  tags: string[]
  type: 'article' | 'video' | 'tutorial'
  featured?: boolean
}

const gettingStartedArticles: Article[] = [
  {
    id: 'create-account',
    title: 'Creare il tuo account Frames',
    description: 'Guida step-by-step per registrarti e configurare il tuo profilo creator',
    readTime: '2 min',
    difficulty: 'Principiante',
    helpful: 245,
    lastUpdated: '2025-01-15',
    tags: ['registrazione', 'profilo', 'setup'],
    type: 'article',
    featured: true
  },
  {
    id: 'add-first-newsletter',
    title: 'Aggiungere la tua prima newsletter',
    description: 'Come registrare la tua newsletter sulla piattaforma con tutte le informazioni necessarie',
    readTime: '4 min',
    difficulty: 'Principiante',
    helpful: 312,
    lastUpdated: '2025-01-12',
    tags: ['newsletter', 'registrazione', 'metriche'],
    type: 'video',
    featured: true
  },
  {
    id: 'understand-dashboard',
    title: 'Navigare la Dashboard',
    description: 'Panoramica completa della dashboard e delle sue funzionalità principali',
    readTime: '3 min',
    difficulty: 'Principiante',
    helpful: 189,
    lastUpdated: '2025-01-10',
    tags: ['dashboard', 'navigazione', 'overview'],
    type: 'tutorial'
  },
  {
    id: 'set-pricing',
    title: 'Impostare i prezzi delle sponsorizzazioni',
    description: 'Come calcolare e impostare prezzi competitivi per le tue sponsorizzazioni',
    readTime: '5 min',
    difficulty: 'Intermedio',
    helpful: 156,
    lastUpdated: '2025-01-08',
    tags: ['prezzi', 'sponsorizzazioni', 'strategia'],
    type: 'article'
  },
  {
    id: 'first-collaboration',
    title: 'Ricevere la tua prima collaborazione',
    description: 'Cosa aspettarsi quando ricevi la prima proposta di collaborazione da un brand',
    readTime: '3 min',
    difficulty: 'Principiante',
    helpful: 201,
    lastUpdated: '2025-01-05',
    tags: ['collaborazioni', 'brand', 'proposte'],
    type: 'article',
    featured: true
  },
  {
    id: 'optimize-profile',
    title: 'Ottimizzare il tuo profilo creator',
    description: 'Tips e best practices per rendere il tuo profilo più attraente per i brand',
    readTime: '6 min',
    difficulty: 'Intermedio',
    helpful: 134,
    lastUpdated: '2025-01-03',
    tags: ['profilo', 'ottimizzazione', 'brand'],
    type: 'article'
  },
  {
    id: 'newsletter-metrics',
    title: 'Comprendere le metriche della newsletter',
    description: 'Guida alle metriche importanti: subscriber, open rate, CTR e come migliorarle',
    readTime: '7 min',
    difficulty: 'Intermedio',
    helpful: 178,
    lastUpdated: '2024-12-28',
    tags: ['metriche', 'analytics', 'performance'],
    type: 'tutorial'
  },
  {
    id: 'payment-setup',
    title: 'Configurare i metodi di pagamento',
    description: 'Come impostare i tuoi dati di fatturazione e scegliere i metodi di pagamento',
    readTime: '4 min',
    difficulty: 'Principiante',
    helpful: 167,
    lastUpdated: '2024-12-25',
    tags: ['pagamenti', 'fatturazione', 'setup'],
    type: 'article'
  }
]

const quickStartSteps = [
  {
    title: 'Crea il tuo account',
    description: 'Registrati gratuitamente e verifica la tua email',
    icon: <Users className="w-5 h-5" />,
    completed: true
  },
  {
    title: 'Configura il profilo',
    description: 'Aggiungi foto, bio e informazioni di contatto',
    icon: <Settings className="w-5 h-5" />,
    completed: true
  },
  {
    title: 'Registra la newsletter',
    description: 'Aggiungi la tua newsletter con metriche e prezzi',
    icon: <Mail className="w-5 h-5" />,
    completed: false
  },
  {
    title: 'Attendi approvazione',
    description: 'Il nostro team revisonará la tua newsletter',
    icon: <CheckCircle className="w-5 h-5" />,
    completed: false
  },
  {
    title: 'Ricevi collaborazioni',
    description: 'Inizia a ricevere proposte dai brand',
    icon: <CreditCard className="w-5 h-5" />,
    completed: false
  }
]

export default function GettingStartedPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [filteredArticles, setFilteredArticles] = useState(gettingStartedArticles)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/sign-in')
    }
  }, [authLoading, user, router])

  useEffect(() => {
    let filtered = gettingStartedArticles

    // Filter by search
    if (searchQuery.trim()) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(article => article.difficulty === selectedDifficulty)
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(article => article.type === selectedType)
    }

    setFilteredArticles(filtered)
  }, [searchQuery, selectedDifficulty, selectedType])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayCircle className="w-4 h-4" />
      case 'tutorial':
        return <Book className="w-4 h-4" />
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

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const featuredArticles = gettingStartedArticles.filter(article => article.featured)

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
                <h1 className="text-xl font-semibold text-foreground">Iniziare</h1>
                <Book className="w-5 h-5 text-muted-foreground" />
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
              <span className="text-foreground">Iniziare</span>
            </nav>

            {/* Header Section */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Iniziare con Frames</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Tutto quello che devi sapere per iniziare a monetizzare la tua newsletter
              </p>

              {/* Quick Start Progress */}
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-foreground mb-4">Il tuo percorso di setup</h3>
                <div className="space-y-4">
                  {quickStartSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed 
                          ? 'bg-chart-5 text-white' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Featured Articles */}
            {featuredArticles.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xl font-semibold text-foreground mb-6">Guide Essenziali</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredArticles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/dashboard/help/articles/${article.id}`}
                      className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg hover:shadow-md transition-shadow group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-lg ${getTypeColor(article.type)}`}>
                          {getTypeIcon(article.type)}
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <h4 className="font-semibold text-foreground mb-2">{article.title}</h4>
                      <p className="text-sm text-muted-foreground mb-4">{article.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {article.readTime}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(article.difficulty)}`}>
                            {article.difficulty}
                          </span>
                        </div>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="w-3 h-3" />
                          {article.helpful}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Search and Filters */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Cerca nelle guide..."
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
                        <div className="flex flex-wrap gap-2">
                          {article.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                              {tag}
                            </span>
                          ))}
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

            {/* Need Help Section */}
            <div className="mt-16 p-8 bg-muted rounded-lg text-center">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Hai bisogno di aiuto personalizzato?
              </h3>
              <p className="text-muted-foreground mb-6">
                Il nostro team è qui per aiutarti a iniziare nel modo giusto
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