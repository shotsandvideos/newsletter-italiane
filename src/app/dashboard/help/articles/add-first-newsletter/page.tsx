'use client'

import { useState } from 'react'
import { useAuth } from '../../../../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { 
  Clock,
  Star,
  ThumbsUp,
  ThumbsDown,
  Share2,
  BookOpen,
  Menu,
  ArrowLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
  PlayCircle,
  FileText,
  Users,
  Mail,
  BarChart3,
  DollarSign,
  Eye,
  ExternalLink
} from 'lucide-react'
import Sidebar from '../../../../components/Sidebar'
import Link from 'next/link'

interface TableOfContentsItem {
  id: string
  title: string
  level: 1 | 2 | 3
}

const tableOfContents: TableOfContentsItem[] = [
  { id: 'overview', title: 'Panoramica', level: 1 },
  { id: 'requirements', title: 'Requisiti preliminari', level: 1 },
  { id: 'step-1', title: 'Accedere alla sezione Newsletter', level: 1 },
  { id: 'step-2', title: 'Inserire le informazioni base', level: 1 },
  { id: 'step-2-1', title: 'Nome e descrizione', level: 2 },
  { id: 'step-2-2', title: 'Categoria e pubblico', level: 2 },
  { id: 'step-3', title: 'Configurare le metriche', level: 1 },
  { id: 'step-3-1', title: 'Numero di iscritti', level: 2 },
  { id: 'step-3-2', title: 'Open rate e CTR', level: 2 },
  { id: 'step-4', title: 'Impostare prezzi e disponibilità', level: 1 },
  { id: 'step-5', title: 'Revisione e invio', level: 1 },
  { id: 'next-steps', title: 'Prossimi passi', level: 1 },
  { id: 'faq', title: 'Domande frequenti', level: 1 }
]

const relatedArticles = [
  {
    id: 'optimize-profile',
    title: 'Ottimizzare il tuo profilo creator',
    category: 'Iniziare',
    readTime: '6 min'
  },
  {
    id: 'set-pricing',
    title: 'Impostare prezzi competitivi',
    category: 'Newsletter',
    readTime: '5 min'
  },
  {
    id: 'understand-metrics',
    title: 'Comprendere le metriche',
    category: 'Newsletter',
    readTime: '7 min'
  }
]

export default function AddFirstNewsletterPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('overview')
  const [wasHelpful, setWasHelpful] = useState<boolean | null>(null)
  const [showShareMenu, setShowShareMenu] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/sign-in')
    }
  }, [authLoading, user, router])

  // Handle scroll spy for table of contents
  useEffect(() => {
    const handleScroll = () => {
      const sections = tableOfContents.map(item => document.getElementById(item.id)).filter(Boolean)
      const scrollPosition = window.scrollY + 100

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(section.id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleFeedback = (helpful: boolean) => {
    setWasHelpful(helpful)
    // Here you would typically send feedback to your analytics service
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
      <div className="flex-1 flex overflow-hidden lg:ml-0">
        {/* Article Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
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
                  href="/dashboard/help/category/getting-started"
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-semibold text-foreground">Guida</h1>
                  <BookOpen className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  {showShareMenu && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-lg z-10">
                      <div className="p-2">
                        <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md">
                          Copia link
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md">
                          Condividi via email
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-6 py-8">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Link href="/dashboard/help" className="hover:text-foreground">Centro Assistenza</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/dashboard/help/category/getting-started" className="hover:text-foreground">Iniziare</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground">Aggiungere la tua prima newsletter</span>
              </nav>

              {/* Article Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-chart-2/10 text-chart-2 rounded-lg">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                  <span className="text-sm text-muted-foreground">Video Tutorial</span>
                </div>
                
                <h1 className="text-3xl font-bold text-foreground mb-4">
                  Aggiungere la tua prima newsletter
                </h1>
                
                <p className="text-lg text-muted-foreground mb-6">
                  Guida step-by-step per registrare la tua newsletter sulla piattaforma con tutte le informazioni necessarie per iniziare a ricevere proposte di collaborazione.
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-b border-border pb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>4 min di lettura</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Principiante</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    <span>312 persone hanno trovato utile questo articolo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>Ultimo aggiornamento: 12 Gen 2025</span>
                  </div>
                </div>
              </div>

              {/* Video Embed Placeholder */}
              <div className="mb-8">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-border">
                  <div className="text-center">
                    <PlayCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Video Tutorial: Aggiungere la tua prima newsletter</p>
                    <button className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                      Guarda il video (4:23)
                    </button>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose max-w-none">
                <section id="overview">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Panoramica</h2>
                  <p className="text-foreground mb-4">
                    Registrare la tua newsletter su Newsletter Italiane è il primo passo fondamentale per iniziare a monetizzare i tuoi contenuti. 
                    In questa guida ti mostreremo come compilare correttamente tutte le informazioni necessarie per far approvare rapidamente 
                    la tua newsletter dal nostro team.
                  </p>
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-foreground font-medium mb-1">Importante</p>
                        <p className="text-muted-foreground text-sm">
                          La qualità delle informazioni che fornisci influenza direttamente la velocità di approvazione 
                          e il numero di collaborazioni che riceverai. Prenditi il tempo necessario per completare accuratamente ogni sezione.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <section id="requirements" className="mt-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Requisiti preliminari</h2>
                  <p className="text-foreground mb-4">Prima di iniziare, assicurati di avere:</p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-chart-5 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">Un account Newsletter Italiane verificato</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-chart-5 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">Accesso alle metriche della tua newsletter (subscriber count, open rate, CTR)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-chart-5 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">Esempi di newsletter precedenti da mostrare come portfolio</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-chart-5 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">Idea chiara dei prezzi che vuoi applicare per le sponsorizzazioni</span>
                    </li>
                  </ul>
                </section>

                <section id="step-1" className="mt-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">1. Accedere alla sezione Newsletter</h2>
                  <p className="text-foreground mb-4">
                    Dalla tua dashboard, naviga verso la sezione "Newsletter" nel menu laterale. Qui vedrai una panoramica 
                    di tutte le newsletter che hai registrato. Per aggiungerne una nuova, clicca sul pulsante "Aggiungi Newsletter".
                  </p>
                  <div className="bg-muted rounded-lg p-4 mb-6">
                    <p className="text-foreground text-sm">
                      💡 <strong>Suggerimento:</strong> Se è la tua prima newsletter, vedrai un messaggio di benvenuto 
                      con tips per iniziare.
                    </p>
                  </div>
                </section>

                <section id="step-2" className="mt-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">2. Inserire le informazioni base</h2>
                  
                  <h3 id="step-2-1" className="text-xl font-semibold text-foreground mb-3">Nome e descrizione</h3>
                  <p className="text-foreground mb-4">
                    Il nome della newsletter deve essere chiaro e riconoscibile. La descrizione dovrebbe spiegare in 2-3 frasi 
                    di cosa parla la tua newsletter e perché i lettori dovrebbero essere interessati.
                  </p>

                  <div className="bg-card border border-border rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-foreground mb-2">Esempio di buona descrizione:</h4>
                    <p className="text-muted-foreground text-sm italic mb-3">
                      "Tech Weekly è una newsletter settimanale che esplora le ultime innovazioni nel mondo della tecnologia, 
                      con focus su startup italiane, intelligenza artificiale e sostenibilità digitale. Ogni settimana raggiungo 
                      5,000+ professionisti tech con analisi approfondite e trend emergenti."
                    </p>
                    <p className="text-foreground text-sm">
                      ✅ <strong>Perché funziona:</strong> Chiara, specifica, mostra il valore e include metriche concrete.
                    </p>
                  </div>

                  <h3 id="step-2-2" className="text-xl font-semibold text-foreground mb-3">Categoria e pubblico</h3>
                  <p className="text-foreground mb-4">
                    Seleziona la categoria più appropriata per la tua newsletter. Questo aiuta i brand a trovarti più facilmente. 
                    Descrivi il tuo pubblico target in modo specifico: età, professione, interessi, ubicazione geografica.
                  </p>
                </section>

                <section id="step-3" className="mt-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">3. Configurare le metriche</h2>
                  
                  <h3 id="step-3-1" className="text-xl font-semibold text-foreground mb-3">Numero di iscritti</h3>
                  <p className="text-foreground mb-4">
                    Inserisci il numero attuale di iscritti attivi. Questo è il dato più importante per i brand, 
                    quindi assicurati che sia accurato. Potrai aggiornarlo mensilmente dal tuo dashboard.
                  </p>

                  <div className="bg-chart-4/10 border border-chart-4/20 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-chart-4 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-foreground font-medium mb-1">Attenzione</p>
                        <p className="text-muted-foreground text-sm">
                          I dati inseriti potrebbero essere verificati dal nostro team. Inserire informazioni false 
                          può portare alla sospensione dell'account.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 id="step-3-2" className="text-xl font-semibold text-foreground mb-3">Open rate e CTR</h3>
                  <p className="text-foreground mb-4">
                    L'open rate e il CTR (Click Through Rate) sono metriche fondamentali che mostrano l'engagement del tuo pubblico. 
                    Se non li conosci, puoi trovarli nella piattaforma email che utilizzi (Mailchimp, ConvertKit, Substack, etc.).
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-card border border-border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-4 h-4 text-primary" />
                        <h4 className="font-medium text-foreground">Open Rate tipici</h4>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Tech/Business: 20-25%</li>
                        <li>• Lifestyle: 18-22%</li>
                        <li>• Marketing: 15-20%</li>
                        <li>• News: 22-28%</li>
                      </ul>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ExternalLink className="w-4 h-4 text-primary" />
                        <h4 className="font-medium text-foreground">CTR tipici</h4>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Tech/Business: 2-4%</li>
                        <li>• Lifestyle: 1.5-3%</li>
                        <li>• Marketing: 3-5%</li>
                        <li>• News: 1-2%</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section id="step-4" className="mt-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">4. Impostare prezzi e disponibilità</h2>
                  <p className="text-foreground mb-4">
                    Definisci i tuoi prezzi per diversi tipi di sponsorizzazioni. Puoi sempre modificarli in seguito. 
                    I nostri suggerimenti di prezzo sono basati su dati di mercato reali.
                  </p>

                  <div className="bg-card border border-border rounded-lg p-6 mb-6">
                    <h4 className="font-medium text-foreground mb-4">Tipi di sponsorizzazione disponibili:</h4>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 text-chart-5 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">Banner Header</h5>
                          <p className="text-sm text-muted-foreground">Logo e link in cima alla newsletter</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 text-chart-5 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">Contenuto Sponsorizzato</h5>
                          <p className="text-sm text-muted-foreground">Paragrafo dedicato al brand (100-200 parole)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 text-chart-5 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">Newsletter Dedicata</h5>
                          <p className="text-sm text-muted-foreground">Intera newsletter focalizzata sul brand</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section id="step-5" className="mt-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">5. Revisione e invio</h2>
                  <p className="text-foreground mb-4">
                    Prima di inviare la tua newsletter per l'approvazione, rivedi attentamente tutte le informazioni. 
                    Una volta inviata, il nostro team la revisonerà entro 2-3 giorni lavorativi.
                  </p>

                  <div className="bg-chart-5/10 border border-chart-5/20 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-chart-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-foreground font-medium mb-1">Checklist finale</p>
                        <ul className="text-muted-foreground text-sm space-y-1">
                          <li>✓ Tutte le informazioni sono accurate e aggiornate</li>
                          <li>✓ Le metriche riflettono i dati reali</li>
                          <li>✓ I prezzi sono competitivi per il tuo mercato</li>
                          <li>✓ La descrizione è chiara e professionale</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                <section id="next-steps" className="mt-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Prossimi passi</h2>
                  <p className="text-foreground mb-4">
                    Dopo aver inviato la tua newsletter, riceverai una email di conferma. Durante la revisione:
                  </p>
                  <ol className="space-y-2 mb-6 list-decimal list-inside text-foreground">
                    <li>Completa il tuo profilo creator se non l'hai già fatto</li>
                    <li>Prepara esempi delle tue newsletter migliori</li>
                    <li>Ottimizza le tue impostazioni di notifica</li>
                    <li>Inizia a seguire i brand che ti interessano</li>
                  </ol>
                </section>

                <section id="faq" className="mt-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Domande frequenti</h2>
                  
                  <div className="space-y-4">
                    <div className="border border-border rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-2">Quanto tempo richiede l'approvazione?</h4>
                      <p className="text-muted-foreground text-sm">
                        L'approvazione richiede tipicamente 2-3 giorni lavorativi. Newsletter con informazioni complete 
                        e metriche verificabili vengono processate più rapidamente.
                      </p>
                    </div>
                    
                    <div className="border border-border rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-2">Posso modificare i dati dopo l'approvazione?</h4>
                      <p className="text-muted-foreground text-sm">
                        Sì, puoi aggiornare metriche, prezzi e descrizione in qualsiasi momento. Modifiche significative 
                        potrebbero richiedere una nuova revisione.
                      </p>
                    </div>
                    
                    <div className="border border-border rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-2">Cosa succede se la newsletter viene rifiutata?</h4>
                      <p className="text-muted-foreground text-sm">
                        Riceverai un feedback dettagliato sui motivi del rifiuto e potrai correggere i problemi per 
                        reinviare la candidatura.
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Article Footer */}
              <div className="mt-12 pt-8 border-t border-border">
                {/* Feedback */}
                <div className="mb-8">
                  <h3 className="font-semibold text-foreground mb-4">È stato utile questo articolo?</h3>
                  {wasHelpful === null ? (
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleFeedback(true)}
                        className="flex items-center gap-2 px-4 py-2 text-chart-5 hover:bg-chart-5/10 rounded-lg transition-colors"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        Sì, utile
                      </button>
                      <button
                        onClick={() => handleFeedback(false)}
                        className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                      >
                        <ThumbsDown className="w-4 h-4" />
                        No, non utile
                      </button>
                    </div>
                  ) : (
                    <div className={`p-4 rounded-lg ${wasHelpful ? 'bg-chart-5/10 text-chart-5' : 'bg-muted text-muted-foreground'}`}>
                      {wasHelpful ? (
                        <p>Grazie per il feedback! Siamo felici che l'articolo ti sia stato utile.</p>
                      ) : (
                        <div>
                          <p className="mb-2">Grazie per il feedback. Come possiamo migliorare questo articolo?</p>
                          <Link 
                            href="/dashboard/help/contact"
                            className="text-sm underline hover:no-underline"
                          >
                            Inviaci i tuoi suggerimenti
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Related Articles */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Articoli correlati</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {relatedArticles.map((article) => (
                      <Link
                        key={article.id}
                        href={`/dashboard/help/articles/${article.id}`}
                        className="p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <h4 className="font-medium text-foreground mb-2 line-clamp-2">{article.title}</h4>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{article.category}</span>
                          <span>{article.readTime}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Table of Contents Sidebar */}
        <div className="hidden xl:block w-64 border-l border-border bg-card">
          <div className="sticky top-0 p-6">
            <h3 className="font-semibold text-foreground mb-4">Indice dei contenuti</h3>
            <nav className="space-y-1">
              {tableOfContents.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left text-sm py-1 px-2 rounded transition-colors ${
                    activeSection === item.id
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  } ${item.level === 2 ? 'ml-4' : item.level === 3 ? 'ml-8' : ''}`}
                >
                  {item.title}
                </button>
              ))}
            </nav>
            
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Hai bisogno di aiuto?</p>
              <Link
                href="/dashboard/help/contact"
                className="text-xs text-primary hover:underline"
              >
                Contatta il supporto
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}