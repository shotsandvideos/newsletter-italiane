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
  FileText,
  Search
} from 'lucide-react'
import Sidebar from '../../../../components/Sidebar'
import Link from 'next/link'

// Map of available articles
const availableArticles: Record<string, string> = {
  'add-first-newsletter': '/dashboard/help/articles/add-first-newsletter',
  'create-account': '/dashboard/help/articles/create-account',
  'optimize-profile': '/dashboard/help/articles/optimize-profile',
  'set-pricing': '/dashboard/help/articles/set-pricing',
  'understand-metrics': '/dashboard/help/articles/understand-metrics',
  'first-collaboration': '/dashboard/help/articles/first-collaboration',
  'payment-setup': '/dashboard/help/articles/payment-setup'
}

const suggestedArticles = [
  {
    id: 'add-first-newsletter',
    title: 'Come aggiungere la tua prima newsletter',
    description: 'Guida step-by-step per registrare la tua newsletter',
    category: 'Iniziare'
  },
  {
    id: 'create-account',
    title: 'Creare il tuo account Newsletter Italiane',
    description: 'Guida per registrarti e configurare il profilo',
    category: 'Iniziare'
  },
  {
    id: 'first-collaboration',
    title: 'Ricevere la tua prima collaborazione',
    description: 'Cosa aspettarsi dalle prime proposte dei brand',
    category: 'Collaborazioni'
  },
  {
    id: 'set-pricing',
    title: 'Impostare prezzi competitivi',
    description: 'Come calcolare i giusti prezzi per le sponsorizzazioni',
    category: 'Newsletter'
  }
]

export default function ArticleSlugPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/sign-in')
    }
  }, [authLoading, user, router])

  // Redirect to correct article if it exists
  useEffect(() => {
    if (slug && availableArticles[slug]) {
      router.replace(availableArticles[slug])
    }
  }, [slug, router])

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If article exists, redirect will handle it
  if (availableArticles[slug]) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Show 404 page
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
                <h1 className="text-xl font-semibold text-foreground">Articolo Non Trovato</h1>
                <BookOpen className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/dashboard/help" className="hover:text-foreground">Centro Assistenza</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">Articolo Non Trovato</span>
            </nav>

            {/* 404 Content */}
            <div className="text-center py-16">
              <div className="mb-8">
                <FileText className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Articolo Non Trovato
                </h2>
                <p className="text-lg text-muted-foreground mb-2">
                  L'articolo che stai cercando non esiste o è stato spostato.
                </p>
                <p className="text-muted-foreground">
                  URL richiesto: <code className="bg-muted px-2 py-1 rounded text-sm">/help/articles/{slug}</code>
                </p>
              </div>

              {/* Search */}
              <div className="max-w-md mx-auto mb-12">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Cerca nella documentazione..."
                    className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link
                  href="/dashboard/help"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
                >
                  Torna al Centro Assistenza
                </Link>
                <Link
                  href="/dashboard/help/contact"
                  className="inline-flex items-center justify-center px-6 py-3 border border-border text-foreground rounded-lg hover:bg-accent font-medium"
                >
                  Contatta il Supporto
                </Link>
              </div>
            </div>

            {/* Suggested Articles */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-6 text-center">
                Articoli che potrebbero interessarti
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {suggestedArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/dashboard/help/articles/${article.id}`}
                    className="p-6 bg-card border border-border rounded-lg hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {article.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {article.description}
                        </p>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                          {article.category}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors ml-4 flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-16 p-8 bg-muted rounded-lg text-center">
              <h4 className="font-semibold text-foreground mb-2">
                Non riesci a trovare quello che cerchi?
              </h4>
              <p className="text-muted-foreground mb-4">
                Il nostro team di supporto è sempre disponibile per aiutarti
              </p>
              <Link
                href="/dashboard/help/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
              >
                Contatta il Supporto
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}