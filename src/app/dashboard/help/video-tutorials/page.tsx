'use client'

import { useState } from 'react'
import { useAuth } from '../../../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import {
  Play,
  Clock,
  Users,
  Star,
  Menu,
  ArrowLeft,
  ChevronRight,
  Search,
  PlayCircle,
  Video
} from 'lucide-react'
import Sidebar from '../../../components/Sidebar'
import Link from 'next/link'

interface VideoTutorial {
  id: string
  title: string
  description: string
  duration: string
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzato'
  category: string
  views: number
  rating: number
  thumbnail: string
  publishedAt: string
  featured?: boolean
}

const videoTutorials: VideoTutorial[] = [
  {
    id: 'getting-started-overview',
    title: 'Panoramica della Piattaforma - Tour Completo',
    description: 'Una panoramica completa di Frames: dalla registrazione alle prime collaborazioni. Perfetto per chi inizia.',
    duration: '8:45',
    difficulty: 'Principiante',
    category: 'Iniziare',
    views: 1247,
    rating: 4.8,
    thumbnail: '/api/placeholder/400/225',
    publishedAt: '2025-01-15',
    featured: true
  },
  {
    id: 'add-newsletter-detailed',
    title: 'Come Aggiungere la Tua Prima Newsletter',
    description: 'Guida step-by-step per registrare la tua newsletter con tutte le informazioni necessarie per l\'approvazione.',
    duration: '5:23',
    difficulty: 'Principiante',
    category: 'Newsletter',
    views: 892,
    rating: 4.9,
    thumbnail: '/api/placeholder/400/225',
    publishedAt: '2025-01-12',
    featured: true
  },
  {
    id: 'optimize-newsletter-metrics',
    title: 'Ottimizzare le Metriche della Newsletter',
    description: 'Come migliorare open rate, CTR e engagement per ricevere più collaborazioni e prezzi più alti.',
    duration: '12:15',
    difficulty: 'Intermedio',
    category: 'Newsletter',
    views: 634,
    rating: 4.7,
    thumbnail: '/api/placeholder/400/225',
    publishedAt: '2025-01-10'
  },
  {
    id: 'handle-first-collaboration',
    title: 'Gestire la Prima Collaborazione',
    description: 'Cosa fare quando ricevi la prima proposta: negoziazione, accettazione e gestione del progetto.',
    duration: '7:30',
    difficulty: 'Principiante',
    category: 'Collaborazioni',
    views: 721,
    rating: 4.6,
    thumbnail: '/api/placeholder/400/225',
    publishedAt: '2025-01-08',
    featured: true
  },
  {
    id: 'pricing-strategies',
    title: 'Strategie di Pricing per Massimizzare i Guadagni',
    description: 'Come calcolare e negoziare i prezzi delle sponsorizzazioni basandoti su metriche di mercato.',
    duration: '15:42',
    difficulty: 'Avanzato',
    category: 'Strategia',
    views: 456,
    rating: 4.9,
    thumbnail: '/api/placeholder/400/225',
    publishedAt: '2025-01-05'
  },
  {
    id: 'payment-invoicing',
    title: 'Pagamenti e Fatturazione',
    description: 'Come configurare i metodi di pagamento, emettere fatture e gestire la contabilità.',
    duration: '6:18',
    difficulty: 'Principiante',
    category: 'Pagamenti',
    views: 589,
    rating: 4.5,
    thumbnail: '/api/placeholder/400/225',
    publishedAt: '2025-01-03'
  },
  {
    id: 'dashboard-advanced',
    title: 'Funzionalità Avanzate della Dashboard',
    description: 'Esplora le funzionalità avanzate: analytics, automazioni, integrazioni e report personalizzati.',
    duration: '11:27',
    difficulty: 'Avanzato',
    category: 'Dashboard',
    views: 342,
    rating: 4.4,
    thumbnail: '/api/placeholder/400/225',
    publishedAt: '2024-12-28'
  },
  {
    id: 'profile-optimization',
    title: 'Ottimizzare il Profilo Creator',
    description: 'Come creare un profilo creator che attrae i brand: foto, bio, portfolio e best practices.',
    duration: '9:15',
    difficulty: 'Intermedio',
    category: 'Profilo',
    views: 678,
    rating: 4.7,
    thumbnail: '/api/placeholder/400/225',
    publishedAt: '2024-12-25'
  }
]

const categories = [
  'Tutti',
  'Iniziare',
  'Newsletter',
  'Collaborazioni',
  'Pagamenti',
  'Strategia',
  'Dashboard',
  'Profilo'
]

const difficulties = [
  'Tutti i livelli',
  'Principiante',
  'Intermedio',
  'Avanzato'
]

export default function VideoTutorialsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tutti')
  const [selectedDifficulty, setSelectedDifficulty] = useState('Tutti i livelli')
  const [filteredVideos, setFilteredVideos] = useState(videoTutorials)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/sign-in')
    }
  }, [authLoading, user, router])

  useEffect(() => {
    let filtered = videoTutorials

    // Filter by search
    if (searchQuery.trim()) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'Tutti') {
      filtered = filtered.filter(video => video.category === selectedCategory)
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'Tutti i livelli') {
      filtered = filtered.filter(video => video.difficulty === selectedDifficulty)
    }

    setFilteredVideos(filtered)
  }, [searchQuery, selectedCategory, selectedDifficulty])

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

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`
    }
    return views.toString()
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const featuredVideos = videoTutorials.filter(video => video.featured)

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
                <h1 className="text-xl font-semibold text-foreground">Video Tutorial</h1>
                <Video className="w-5 h-5 text-muted-foreground" />
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
              <span className="text-foreground">Video Tutorial</span>
            </nav>

            {/* Header Section */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Video Tutorial</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Impara a usare Frames con i nostri tutorial video step-by-step
              </p>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <PlayCircle className="w-4 h-4" />
                  <span>{videoTutorials.length} video disponibili</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Durata totale: {Math.floor(videoTutorials.reduce((acc, video) => {
                    const [minutes, seconds] = video.duration.split(':').map(Number)
                    return acc + minutes + seconds / 60
                  }, 0))} minuti</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{videoTutorials.reduce((acc, video) => acc + video.views, 0)} visualizzazioni totali</span>
                </div>
              </div>
            </div>

            {/* Featured Videos */}
            {featuredVideos.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xl font-semibold text-foreground mb-6">Video Consigliati</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {featuredVideos.slice(0, 2).map((video) => (
                    <div key={video.id} className="group cursor-pointer">
                      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 text-primary-foreground ml-1" />
                          </div>
                        </div>
                        <div className="absolute bottom-4 right-4 z-20">
                          <span className="bg-black/80 text-white text-xs px-2 py-1 rounded">
                            {video.duration}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(video.difficulty)}`}>
                            {video.difficulty}
                          </span>
                          <span className="text-sm text-muted-foreground">{video.category}</span>
                        </div>
                        <h4 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {video.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {video.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{formatViews(video.views)} visualizzazioni</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current text-chart-4" />
                            <span>{video.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
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
                    placeholder="Cerca nei video tutorial..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>

                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {difficulties.map((difficulty) => (
                      <option key={difficulty} value={difficulty}>{difficulty}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Results count */}
              <p className="text-sm text-muted-foreground">
                {filteredVideos.length} {filteredVideos.length === 1 ? 'video trovato' : 'video trovati'}
              </p>
            </div>

            {/* Videos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <div key={video.id} className="group cursor-pointer">
                  <div className="relative aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                    <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 z-20">
                      <span className="bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </span>
                    </div>
                    {video.featured && (
                      <div className="absolute top-2 left-2 z-20">
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                          Consigliato
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(video.difficulty)}`}>
                        {video.difficulty}
                      </span>
                      <span className="text-xs text-muted-foreground">{video.category}</span>
                    </div>
                    <h4 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                      {video.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatViews(video.views)} visualizzazioni</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current text-chart-4" />
                        <span>{video.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredVideos.length === 0 && (
              <div className="text-center py-12">
                <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Nessun video trovato</h3>
                <p className="text-muted-foreground mb-4">
                  Prova a modificare i filtri o a cercare con parole chiave diverse
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('Tutti')
                    setSelectedDifficulty('Tutti i livelli')
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  Cancella filtri
                </button>
              </div>
            )}

            {/* Call to Action */}
            <div className="mt-16 p-8 bg-gradient-to-r from-primary/10 to-chart-2/10 rounded-lg text-center">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Hai suggerimenti per nuovi video?
              </h3>
              <p className="text-muted-foreground mb-6">
                Aiutaci a migliorare la nostra libreria di tutorial suggerendoci argomenti che vorresti vedere coperti
              </p>
              <Link
                href="/dashboard/help/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
              >
                Invia Suggerimento
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
