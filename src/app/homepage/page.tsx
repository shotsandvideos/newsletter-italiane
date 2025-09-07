'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowRight,
  Search,
  Users,
  Mail,
  TrendingUp,
  CheckCircle,
  Star,
  Euro,
  BarChart3,
  Shield,
  Clock,
  Globe,
  Play,
  ChevronRight,
  Eye,
  MessageSquare,
  Target
} from 'lucide-react'

const featuredNewsletters = [
  { name: 'TechWeek Italia', subscribers: '12,5k', category: 'Technology', engagement: '4.2%' },
  { name: 'Marketing Caffè', subscribers: '8,9k', category: 'Marketing', engagement: '3.8%' },
  { name: 'StartupScene', subscribers: '15,2k', category: 'Business', engagement: '5.1%' },
  { name: 'Design Daily', subscribers: '6,7k', category: 'Design', engagement: '4.7%' },
  { name: 'Crypto Italia', subscribers: '22,3k', category: 'Finance', engagement: '3.9%' }
]

const clientLogos = [
  { name: 'Salesforce', logo: '🌐' },
  { name: 'Talent Garden', logo: '🌱' },
  { name: 'BIP', logo: '💼' },
  { name: 'Learnn', logo: '📚' },
  { name: 'Notion', logo: '📝' },
  { name: 'GetResponse', logo: '📧' },
  { name: 'Hotwire', logo: '🔥' },
  { name: 'Qonto', logo: '💳' }
]

const testimonials = [
  {
    quote: "Newsletter Italiane ci ha permesso di raggiungere il nostro target B2B in modo molto più efficace rispetto agli ads tradizionali.",
    author: "Marco Rossi",
    role: "Marketing Director",
    company: "TechCorp Italia",
    avatar: "MR"
  },
  {
    quote: "Finalmente posso monetizzare la mia newsletter tech. In 3 mesi ho guadagnato più di quanto speravo in un anno.",
    author: "Sofia Bianchi",
    role: "Newsletter Creator",
    company: "DevWeekly",
    avatar: "SB"
  },
  {
    quote: "La qualità dei creator su questa piattaforma è eccezionale. ROI molto superiore ad altre piattaforme advertising.",
    author: "Andrea Conti",
    role: "Growth Manager",
    company: "StartupLab",
    avatar: "AC"
  }
]

const stats = [
  { value: '150+', label: 'Newsletter Attive', icon: <Mail className="w-6 h-6" /> },
  { value: '500k+', label: 'Lettori Raggiunti', icon: <Users className="w-6 h-6" /> },
  { value: '€180k+', label: 'Pagati ai Creator', icon: <Euro className="w-6 h-6" /> },
  { value: '4.2x', label: 'ROI Medio Brand', icon: <TrendingUp className="w-6 h-6" /> }
]

const features = [
  {
    icon: <Target className="w-8 h-8" />,
    title: 'Targeting Preciso',
    description: 'Raggiungi esattamente il tuo pubblico target attraverso newsletter di nicchia con alta engagement.',
    benefits: ['Audience qualificata', 'Alto tasso di conversione', 'Targeting geografico']
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: 'Analytics Dettagliate',
    description: 'Monitora performance, click-through rate e conversioni con dashboard in tempo reale.',
    benefits: ['Tracking completo', 'Report automatici', 'ROI tracking']
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Pagamenti Garantiti',
    description: 'Pagamenti sicuri e puntuali per i creator, fatturazione semplificata per i brand.',
    benefits: ['Pagamenti in 7 giorni', 'Fatturazione automatica', 'Supporto fiscale']
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: 'Supporto Dedicato',
    description: 'Team italiano sempre disponibile per supportare brand e creator in ogni fase.',
    benefits: ['Supporto in italiano', 'Account manager dedicato', 'Onboarding assistito']
  }
]

const pricingPlans = [
  {
    type: 'Creator',
    title: 'Per Newsletter Creator',
    description: 'Monetizza la tua newsletter con brand di qualità',
    price: 'Gratuito',
    features: [
      'Registrazione newsletter illimitata',
      'Dashboard analytics completa',
      'Pagamenti automatici',
      'Supporto via email',
      'Commissione 15% sui guadagni'
    ],
    cta: 'Inizia Gratis',
    href: '/auth/sign-up',
    popular: false
  },
  {
    type: 'Brand',
    title: 'Per Brand e Aziende',
    description: 'Raggiungi nuovi clienti attraverso newsletter di qualità',
    price: 'Su misura',
    features: [
      'Accesso a tutte le newsletter',
      'Targeting avanzato',
      'Analytics dettagliate',
      'Account manager dedicato',
      'Fatturazione mensile'
    ],
    cta: 'Contatta Vendite',
    href: '/contact-sales',
    popular: true
  }
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tutte')

  const categories = ['Tutte', 'Technology', 'Marketing', 'Business', 'Design', 'Finance']

  const filteredNewsletters = featuredNewsletters.filter(newsletter =>
    (selectedCategory === 'Tutte' || newsletter.category === selectedCategory) &&
    newsletter.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-primary">
                Newsletter Italiane
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link href="#come-funziona" className="text-muted-foreground hover:text-foreground transition-colors">
                  Come Funziona
                </Link>
                <Link href="#newsletter" className="text-muted-foreground hover:text-foreground transition-colors">
                  Newsletter
                </Link>
                <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Prezzi
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/auth/sign-in" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Accedi
              </Link>
              <Link 
                href="/auth/sign-up"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Inizia Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-chart-2/5" />
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              La #1 piattaforma italiana per newsletter advertising
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight">
              Dove i <span className="text-primary">Brand</span> incontrano le <span className="text-primary">Newsletter</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              La piattaforma che connette brand italiani con creator di newsletter per sponsorizzazioni 
              trasparenti, misurabili e ad alto ROI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold text-lg"
              >
                Inizia Gratis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/contact-sales"
                className="inline-flex items-center justify-center px-8 py-4 border border-border bg-card text-foreground rounded-lg hover:bg-accent transition-colors font-semibold text-lg"
              >
                <Play className="mr-2 w-5 h-5" />
                Richiedi Demo
              </Link>
            </div>

            {/* Search Section */}
            <div className="max-w-2xl mx-auto">
              <p className="text-muted-foreground mb-4">Esplora le newsletter disponibili per la tua campagna</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Cerca newsletter per nome o settore..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-4 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg text-primary mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Newsletters */}
      <section id="newsletter" className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Newsletter Partner di Qualità
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Raggiungi pubblici altamente coinvolti attraverso newsletter curate e verificate dal nostro team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredNewsletters.map((newsletter, index) => (
              <div key={index} className="p-6 bg-card border border-border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">{newsletter.name}</h3>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {newsletter.category}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Iscritti</span>
                    <div className="font-semibold text-foreground">{newsletter.subscribers}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Engagement</span>
                    <div className="font-semibold text-chart-5">{newsletter.engagement}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center px-6 py-3 border border-border bg-card text-foreground rounded-lg hover:bg-accent transition-colors font-medium"
            >
              Esplora Tutte le Newsletter
              <ChevronRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Client Logos */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-muted-foreground font-medium">Trusted by leading Italian brands</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {clientLogos.map((client, index) => (
              <div key={index} className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                <span className="text-2xl">{client.logo}</span>
                <span className="font-semibold">{client.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="come-funziona" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Perché Scegliere Newsletter Italiane
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              La soluzione completa per il newsletter advertising in Italia, con strumenti professionali 
              e supporto dedicato
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, bIndex) => (
                      <li key={bIndex} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-chart-5" />
                        <span className="text-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Quello che Dicono i Nostri Clienti
            </h2>
            <p className="text-xl text-muted-foreground">
              Brand e creator che hanno trasformato il loro business con Newsletter Italiane
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-6 bg-card border border-border rounded-lg">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-chart-4" />
                  ))}
                </div>
                <blockquote className="text-foreground mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Piani Semplici e Trasparenti
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Nessun costo nascosto, nessun impegno a lungo termine. Paga solo quando guadagni.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`p-8 rounded-lg border-2 ${plan.popular 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border bg-card'
                }`}
              >
                {plan.popular && (
                  <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium mb-6">
                    <Star className="w-4 h-4" />
                    Più Richiesto
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.title}</h3>
                <p className="text-muted-foreground mb-6">{plan.description}</p>
                
                <div className="mb-8">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  {plan.type === 'Creator' && (
                    <span className="text-muted-foreground ml-2">+ 15% commissioni</span>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-chart-5 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-card border border-border text-foreground hover:bg-accent'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-chart-2/10 to-primary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Pronto a Iniziare la Tua Crescita?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Unisciti a centinaia di creator e brand che stanno già crescendo con Newsletter Italiane
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold text-lg"
            >
              Inizia Gratis Oggi
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/contact-sales"
              className="inline-flex items-center justify-center px-8 py-4 border border-border bg-card text-foreground rounded-lg hover:bg-accent transition-colors font-semibold text-lg"
            >
              Parla con un Esperto
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Prodotto</h3>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-muted-foreground hover:text-foreground">Funzionalità</Link></li>
                <li><Link href="/pricing" className="text-muted-foreground hover:text-foreground">Prezzi</Link></li>
                <li><Link href="/integrations" className="text-muted-foreground hover:text-foreground">Integrazioni</Link></li>
                <li><Link href="/api" className="text-muted-foreground hover:text-foreground">API</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Risorse</h3>
              <ul className="space-y-2">
                <li><Link href="/dashboard/help" className="text-muted-foreground hover:text-foreground">Centro Assistenza</Link></li>
                <li><Link href="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
                <li><Link href="/guides" className="text-muted-foreground hover:text-foreground">Guide</Link></li>
                <li><Link href="/webinars" className="text-muted-foreground hover:text-foreground">Webinar</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Azienda</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-muted-foreground hover:text-foreground">Chi Siamo</Link></li>
                <li><Link href="/careers" className="text-muted-foreground hover:text-foreground">Lavora con Noi</Link></li>
                <li><Link href="/press" className="text-muted-foreground hover:text-foreground">Stampa</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contatti</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Legale</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link></li>
                <li><Link href="/terms" className="text-muted-foreground hover:text-foreground">Termini</Link></li>
                <li><Link href="/cookies" className="text-muted-foreground hover:text-foreground">Cookie</Link></li>
                <li><Link href="/gdpr" className="text-muted-foreground hover:text-foreground">GDPR</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="text-2xl font-bold text-primary">Newsletter Italiane</div>
              <div className="text-muted-foreground">© 2025 Tutti i diritti riservati</div>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/status" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <div className="w-2 h-2 bg-chart-5 rounded-full"></div>
                Tutti i servizi operativi
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}