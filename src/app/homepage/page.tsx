'use client'

import Link from 'next/link'
import Navigation from '@/components/Navigation'
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
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen">
        {/* Section fade out at bottom */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-20"></div>
        
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
              <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Dove i</span>{' '}
              <span className="inline-block animate-fade-in-up" style={{
                background: 'linear-gradient(135deg, #32c2db 0%, #67e294 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animationDelay: '0.4s'
              }}>brand</span>{' '}
              <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.6s' }}>incontrano le</span>{' '}
              <span className="inline-block animate-fade-in-up" style={{
                background: 'linear-gradient(135deg, #32c2db 0%, #67e294 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animationDelay: '0.8s'
              }}>Newsletter</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '1s' }}>
              La piattaforma che connette brand italiani con creator di newsletter per sponsorizzazioni 
              trasparenti, misurabili e ad alto ROI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
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

            {/* Client Logos Marquee */}
            <div className="mt-8 overflow-hidden max-w-4xl mx-auto">
              <div 
                className="relative"
                style={{
                  maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
                }}
              >
                <div 
                  className="flex items-center space-x-12 py-6"
                  style={{
                    animation: 'marqueeRTL 80s linear infinite',
                    width: 'max-content'
                  }}
                >
                  {/* Logos for seamless continuous scroll - no gaps */}
                  {[...clientLogos, ...clientLogos, ...clientLogos, ...clientLogos].map((client, index) => (
                    <div key={index} className="flex-shrink-0">
                      <div className="relative w-20 h-20 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300">
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
      <section id="newsletter" className="py-20 bg-white relative overflow-hidden">
        {/* Section fade in/out */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none z-20"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-20"></div>
        {/* Dot Pattern Background */}
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        ></div>
        
        {/* Gradient Blobs around cards */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute w-96 h-96 rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
              top: '20%',
              left: '10%',
              animation: 'subtleFloat 20s ease-in-out infinite'
            }}
          />
          <div 
            className="absolute w-80 h-80 rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(6,214,160,0.08) 0%, transparent 70%)',
              bottom: '20%',
              right: '15%',
              animation: 'subtleFloat 25s ease-in-out infinite reverse',
              animationDelay: '10s'
            }}
          />
        </div>
        
        {/* Fade in/out effects */}
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-slate-50 to-transparent pointer-events-none z-10"></div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none z-10"></div>
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
                    <div className="p-6 bg-white/90 backdrop-blur-sm border border-border rounded-lg shadow-sm hover:shadow-lg active:shadow-lg transition-all duration-300 hover:-translate-y-1 active:-translate-y-1">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-900">{newsletter.name}</h3>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                          {newsletter.category}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">Iscritti</span>
                          <div className="font-semibold text-slate-900">{newsletter.subscribers}</div>
                        </div>
                        <div>
                          <span className="text-slate-600">Engagement</span>
                          <div className="font-semibold text-emerald-600">{newsletter.engagement}</div>
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
                    <div className="p-6 bg-white/90 backdrop-blur-sm border border-border rounded-lg shadow-sm hover:shadow-lg active:shadow-lg transition-all duration-300 hover:-translate-y-1 active:-translate-y-1">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-900">{newsletter.name}</h3>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                          {newsletter.category}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">Iscritti</span>
                          <div className="font-semibold text-slate-900">{newsletter.subscribers}</div>
                        </div>
                        <div>
                          <span className="text-slate-600">Engagement</span>
                          <div className="font-semibold text-emerald-600">{newsletter.engagement}</div>
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
      <section id="come-funziona" className="py-20 bg-white relative overflow-hidden">
        {/* Section fade in/out */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none z-20"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-20"></div>
        {/* Animated Dot Pattern Background with Parallax */}
        <div 
          className="absolute inset-0 opacity-30 parallax-dots"
          style={{
            backgroundImage: 'radial-gradient(circle, #000 0.5px, transparent 0.5px)',
            backgroundSize: '25px 25px',
            transform: 'translateZ(0)',
            animation: 'parallaxDots 60s linear infinite'
          }}
        ></div>
        
        {/* Fade effects */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent pointer-events-none z-10"></div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
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
                
                {/* Feature Card with Blob Background */}
                <div className="flex-1 max-w-md relative">
                  {/* Colored Blob Background */}
                  <div 
                    className="absolute inset-0 rounded-3xl blur-2xl opacity-60 -z-10 transform scale-110"
                    style={{
                      background: `linear-gradient(135deg, ${[
                        'rgba(16,185,129,0.4), rgba(6,214,160,0.2)',
                        'rgba(59,130,246,0.4), rgba(147,51,234,0.2)',
                        'rgba(245,158,11,0.4), rgba(251,191,36,0.2)',
                        'rgba(239,68,68,0.4), rgba(251,113,133,0.2)'
                      ][index % 4]})`
                    }}
                  ></div>
                  <div 
                    className="relative h-80 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg overflow-hidden group cursor-pointer card-tilt"
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
      <section className="py-20 bg-slate-50 relative overflow-hidden">
        {/* Section fade in/out */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-50 via-slate-50/80 to-transparent pointer-events-none z-20"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent pointer-events-none z-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Quello che dicono i nostri clienti
            </h2>
            <p className="text-xl text-muted-foreground">
              Brand e creator che hanno trasformato il loro business con Newsletter Italiane
            </p>
          </div>

          {/* Scrolling Testimonials */}
          <div className="overflow-hidden">
            <div 
              className="relative"
              style={{
                maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)'
              }}
            >
              <div 
                className="flex items-center space-x-8 py-4"
                style={{
                  animation: 'marqueeTestimonials 70s linear infinite',
                  width: 'max-content'
                }}
              >
                {/* Testimonials for continuous scroll */}
                {[...testimonials, ...testimonials].map((testimonial, index) => (
                  <div key={index} className="flex-shrink-0 w-96">
                    <div className="p-6 bg-card border border-border rounded-lg">
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
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Static grid as fallback for reduced motion */}
          <div className="hidden motion-reduce:grid grid-cols-1 md:grid-cols-3 gap-8">
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
      <section id="pricing" className="py-20 bg-white relative overflow-hidden">
        {/* Section fade in/out */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none z-20"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-20"></div>
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

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50 relative overflow-hidden">
        {/* Section fade in/out */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-50 via-slate-50/80 to-transparent pointer-events-none z-20"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent pointer-events-none z-20"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Domande Frequenti
            </h2>
            <p className="text-xl text-muted-foreground">
              Le risposte alle domande più comuni sui nostri servizi
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Come funziona la commissione del 15%?
              </h3>
              <p className="text-muted-foreground">
                La commissione viene applicata solo sui guadagni effettivi. Non ci sono costi di registrazione, 
                canoni mensili o costi nascosti. Paghi solo quando generi ricavi.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Quando ricevo i pagamenti?
              </h3>
              <p className="text-muted-foreground">
                I pagamenti vengono elaborati automaticamente entro 7 giorni lavorativi dalla conclusione 
                di ogni campagna, direttamente sul tuo conto bancario o PayPal.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Come vengono selezionate le newsletter?
              </h3>
              <p className="text-muted-foreground">
                Il nostro team verifica ogni newsletter per qualità del contenuto, engagement rate, 
                autenticità dell'audience e aderenza alle nostre linee guida.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Che tipo di analytics sono disponibili?
              </h3>
              <p className="text-muted-foreground">
                Dashboard completa con metriche in tempo reale: impression, click, conversioni, 
                engagement rate, performance per segmento demografico e molto altro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-chart-2/10 to-primary/10 relative overflow-hidden">
        {/* Section fade in/out */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/10 via-primary/8 to-transparent pointer-events-none z-20"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-primary/10 via-primary/8 to-transparent pointer-events-none z-20"></div>
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
              Iscriviti
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
      <footer className="bg-slate-100 py-16 relative overflow-hidden">
        {/* Section fade in at top */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-100 via-slate-100/80 to-transparent pointer-events-none z-20"></div>
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