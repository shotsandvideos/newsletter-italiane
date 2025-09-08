'use client'

import Link from 'next/link'
import { 
  ArrowRight,
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
import Image from 'next/image'

const featuredNewsletters = [
  { name: 'TechWeek Italia', subscribers: '12,5k', category: 'Technology', engagement: '4.2%' },
  { name: 'Marketing Caffè', subscribers: '8,9k', category: 'Marketing', engagement: '3.8%' },
  { name: 'StartupScene', subscribers: '15,2k', category: 'Business', engagement: '5.1%' },
  { name: 'Design Daily', subscribers: '6,7k', category: 'Design', engagement: '4.7%' },
  { name: 'Crypto Italia', subscribers: '22,3k', category: 'Finance', engagement: '3.9%' },
  { name: 'Food & Wine Italia', subscribers: '18,7k', category: 'Lifestyle', engagement: '4.8%' }
]

const clientLogos = [
  { name: 'Salesforce', logo: '/images/salesforce.png' },
  { name: 'Talent Garden', logo: '/images/talent.png' },
  { name: 'BIP', logo: '/images/bip.png' },
  { name: 'Learnn', logo: '/images/learnn.png' },
  { name: 'Notion', logo: '/images/notion.png' },
  { name: 'GetResponse', logo: '/images/getresponse.png' },
  { name: 'Hotwire', logo: '/images/hotwire.png' },
  { name: 'Qonto', logo: '/images/qonto.png' },
  { name: 'Pomilio Blumm', logo: '/images/pomilio.png' },
  { name: 'WeMakeFuture', logo: '/images/wemakefuture.png' }
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
    title: 'Per i Creator',
    description: 'Monetizza la tua newsletter con brand di qualità',
    price: 'Gratuito',
    features: [
      'Registrazione newsletter illimitata',
      'Dashboard analytics completa',
      'Pagamenti automatici',
      'Supporto via email',
      'Commissione 15% sui guadagni'
    ],
    cta: 'Iscriviti',
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
    href: '/contatti',
    popular: true
  }
]

export default function HomePage() {

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
                Iscriviti
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen">
        {/* Animated Background with Floating Gradient Blobs */}
        <div className="absolute inset-0 w-full bg-white relative">
          {/* Subtle Moving Background Gradient */}
          <div 
            className="absolute inset-0 opacity-50"
            style={{
              background: 'linear-gradient(45deg, #10b981, #06d6a0, #118ab2, #073b4c)',
              backgroundSize: '400% 400%',
              animation: 'gradientShift 20s ease infinite'
            }}
          />
          
          {/* Enhanced Floating Gradient Blobs */}
          <div className="absolute inset-0">
            <div 
              className="absolute w-96 h-96 rounded-full blur-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(6,214,160,0.2) 50%, transparent 100%)',
                top: '15%',
                left: '12%',
                transform: 'translate3d(0, 0, 0)',
                animation: 'subtleFloat 25s ease-in-out infinite'
              }}
            />
            <div 
              className="absolute w-80 h-80 rounded-full blur-2xl"
              style={{
                background: 'radial-gradient(circle, rgba(17,138,178,0.25) 0%, rgba(7,59,76,0.15) 50%, transparent 100%)',
                top: '55%',
                right: '18%',
                animation: 'subtleFloat 30s ease-in-out infinite reverse',
                animationDelay: '8s'
              }}
            />
            <div 
              className="absolute w-[28rem] h-[28rem] rounded-full blur-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(6,214,160,0.2) 0%, rgba(16,185,129,0.15) 50%, transparent 100%)',
                bottom: '25%',
                left: '25%',
                animation: 'subtleFloat 35s ease-in-out infinite',
                animationDelay: '15s'
              }}
            />
          </div>
        </div>
        
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-bold mb-6 border border-primary/30">
              <Star className="w-4 h-4" />
              La #1 piattaforma italiana per newsletter advertising
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight">
              Dove i <span style={{
                background: 'linear-gradient(135deg, #32c2db 0%, #67e294 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>brand</span> incontrano le <span style={{
                background: 'linear-gradient(135deg, #32c2db 0%, #67e294 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Newsletter</span>
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
                Iscriviti
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/contatti"
                className="inline-flex items-center justify-center px-8 py-4 border border-border bg-card text-foreground rounded-lg hover:bg-accent transition-colors font-semibold text-lg"
              >
                <Play className="mr-2 w-5 h-5" />
                Richiedi Demo
              </Link>
            </div>

            {/* Client Logos in Hero */}
            <div className="mt-16 py-8 px-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden max-w-5xl mx-auto">
              {/* Scrolling logos container with proper fade */}
              <div className="relative">
                {/* Left fade out - smooth disappearing effect */}
                <div className="absolute left-0 top-0 z-10 h-full w-40 bg-gradient-to-r from-white/80 via-white/60 via-white/30 via-white/10 to-transparent pointer-events-none"></div>
                
                {/* Right fade out - smooth disappearing effect */}
                <div className="absolute right-0 top-0 z-10 h-full w-40 bg-gradient-to-l from-white/80 via-white/60 via-white/30 via-white/10 to-transparent pointer-events-none"></div>
                
                {/* Scrolling content */}
                <div 
                  className="flex items-center space-x-12"
                  style={{
                    animation: 'scrollRight 30s linear infinite',
                    width: 'max-content'
                  }}
                >
                  {/* Triple logos for smoother infinite scroll */}
                  {[...clientLogos, ...clientLogos, ...clientLogos].map((client, index) => (
                    <div key={index} className="flex-shrink-0">
                      <div className="relative w-20 h-20 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                        <Image
                          src={client.logo}
                          alt={`${client.name} logo`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Featured Newsletters */}
      <section id="newsletter" className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Newsletter partner di qualità
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Raggiungi pubblici altamente coinvolti attraverso newsletter curate e verificate dal nostro team
            </p>
          </div>

          {/* Scrolling Newsletter Cards */}
          <div className="space-y-6 mb-12 overflow-hidden">
            {/* First row - normal speed */}
            <div className="relative">
              <div className="absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-white via-white/60 via-white/30 to-transparent pointer-events-none"></div>
              <div className="absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-white via-white/60 via-white/30 to-transparent pointer-events-none"></div>
              <div 
                className="flex items-center space-x-6"
                style={{
                  animation: 'scrollRight 40s linear infinite',
                  width: 'max-content'
                }}
              >
                {[...featuredNewsletters.slice(0, 3), ...featuredNewsletters.slice(0, 3)].map((newsletter, index) => (
                  <div key={index} className="flex-shrink-0 w-80">
                    <div className="p-6 bg-card border border-border rounded-lg hover:shadow-md transition-shadow">
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
                  </div>
                ))}
              </div>
            </div>
            
            {/* Second row - slower speed, opposite direction */}
            <div className="relative">
              <div className="absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-white via-white/60 via-white/30 to-transparent pointer-events-none"></div>
              <div className="absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-white via-white/60 via-white/30 to-transparent pointer-events-none"></div>
              <div 
                className="flex items-center space-x-6"
                style={{
                  animation: 'scrollLeft 50s linear infinite',
                  width: 'max-content'
                }}
              >
                {[...featuredNewsletters.slice(3), ...featuredNewsletters.slice(3)].map((newsletter, index) => (
                  <div key={index} className="flex-shrink-0 w-80">
                    <div className="p-6 bg-card border border-border rounded-lg hover:shadow-md transition-shadow">
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
                  </div>
                ))}
              </div>
            </div>
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


      {/* Features */}
      <section id="come-funziona" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Perché scegliere newsletter Italiane
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              La soluzione completa per il newsletter advertising in Italia, con strumenti professionali 
              e supporto dedicato
            </p>
          </div>

          <div className="space-y-24">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`flex flex-col lg:flex-row items-center gap-12 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                } opacity-0`}
                style={{ 
                  animation: `fadeInUp 0.8s ease-out ${index * 200}ms forwards`
                }}
              >
                {/* Content */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-chart-2/20 text-primary rounded-2xl flex items-center justify-center shadow-lg">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">{feature.title}</h3>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, bIndex) => (
                      <li key={bIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-chart-5 flex-shrink-0" />
                        <span className="text-foreground font-medium">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Placeholder Image */}
                <div className="flex-1 max-w-md">
                  <div 
                    className="relative h-80 bg-gradient-to-br from-primary/10 to-chart-2/10 rounded-2xl border border-border/20 shadow-lg overflow-hidden group cursor-pointer card-tilt"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      const centerX = rect.width / 2;
                      const centerY = rect.height / 2;
                      const rotateX = (y - centerY) / 4;
                      const rotateY = (centerX - x) / 4;
                      
                      e.currentTarget.style.setProperty('--rotate-x', `${rotateX}deg`);
                      e.currentTarget.style.setProperty('--rotate-y', `${rotateY}deg`);
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.setProperty('--rotate-x', '0deg');
                      e.currentTarget.style.setProperty('--rotate-y', '0deg');
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-chart-2/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-3 opacity-50 group-hover:opacity-80 transition-all duration-300">
                        {feature.icon && <div className="mx-auto w-12 h-12 text-primary group-hover:text-primary/90 transition-colors duration-300">{feature.icon}</div>}
                        <p className="text-sm text-muted-foreground font-medium group-hover:text-foreground/80 transition-colors duration-300">{feature.title}</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 ring-2 ring-transparent group-hover:ring-primary/20 rounded-2xl transition-all duration-300"></div>
                  </div>
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
              Quello che dicono i nostri clienti
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
              Piani semplici e trasparenti
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
            Pronto a iniziare la tua crescita?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Unisciti a centinaia di creator e brand che stanno già crescendo con Newsletter Italiane
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold text-lg"
            >
              Iscriviti Oggi
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/contatti"
              className="inline-flex items-center justify-center px-8 py-4 border border-border bg-card text-foreground rounded-lg hover:bg-accent transition-colors font-semibold text-lg"
            >
              Parla con un esperto
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
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Risorse</h3>
              <ul className="space-y-2">
                <li><Link href="/dashboard/help" className="text-muted-foreground hover:text-foreground">Centro assistenza</Link></li>
                <li><Link href="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Azienda</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-muted-foreground hover:text-foreground">Chi siamo</Link></li>
                <li><Link href="/contatti" className="text-muted-foreground hover:text-foreground">Contatti</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Legale</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link></li>
                <li><Link href="/terms" className="text-muted-foreground hover:text-foreground">Termini</Link></li>
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