import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { 
  Target,
  BarChart3,
  Shield,
  MessageSquare,
  CheckCircle,
  Users,
  Mail,
  TrendingUp,
  Euro,
  Clock,
  Globe,
  ArrowRight
} from 'lucide-react'

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

const stats = [
  { value: '150+', label: 'Newsletter Attive', icon: <Mail className="w-6 h-6" /> },
  { value: '500k+', label: 'Lettori Raggiunti', icon: <Users className="w-6 h-6" /> },
  { value: '€180k+', label: 'Pagati ai Creator', icon: <Euro className="w-6 h-6" /> },
  { value: '4.2x', label: 'ROI Medio Brand', icon: <TrendingUp className="w-6 h-6" /> }
]

const additionalFeatures = [
  {
    title: 'Marketplace Integrato',
    description: 'Piattaforma unificata dove creator e brand si incontrano in modo semplice e trasparente.',
    icon: <Globe className="w-6 h-6" />
  },
  {
    title: 'Moderazione Qualità',
    description: 'Processo di verifica rigoroso per garantire contenuti di alta qualità e audience autentiche.',
    icon: <Shield className="w-6 h-6" />
  },
  {
    title: 'Dashboard Unificata',
    description: 'Gestisci tutte le tue campagne, analytics e pagamenti da un\'unica interfaccia intuitiva.',
    icon: <BarChart3 className="w-6 h-6" />
  },
  {
    title: 'Supporto Real-time',
    description: 'Chat assistenza disponibile durante gli orari lavorativi per risolvere ogni problematica.',
    icon: <MessageSquare className="w-6 h-6" />
  },
  {
    title: 'Automazione Completa',
    description: 'Processi automatizzati per pagamenti, report e comunicazioni tra brand e creator.',
    icon: <Clock className="w-6 h-6" />
  },
  {
    title: 'Crescita Scalabile',
    description: 'Piattaforma progettata per crescere con te, dalle prime campagne ai grandi volumi.',
    icon: <TrendingUp className="w-6 h-6" />
  }
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Funzionalità Complete per il Newsletter Advertising
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Tutti gli strumenti di cui hai bisogno per far crescere la tua newsletter o raggiungere 
            nuovi clienti attraverso advertising mirato e di qualità.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Perché scegliere Newsletter Italiane
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              La soluzione completa per il newsletter advertising in Italia, con strumenti professionali 
              e supporto dedicato
            </p>
          </div>

          <div className="space-y-16">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`flex flex-col lg:flex-row items-center gap-12 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Content */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">{feature.title}</h3>
                  </div>
                  <p className="text-lg text-slate-600 leading-relaxed">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, bIndex) => (
                      <li key={bIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-slate-700 font-medium">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Visual */}
                <div className="flex-1 max-w-md">
                  <div className="relative h-80 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl border border-emerald-200 shadow-lg overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-3">
                        <div className="mx-auto w-16 h-16 text-emerald-600">{feature.icon}</div>
                        <p className="text-lg text-slate-700 font-semibold">{feature.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Caratteristiche Avanzate
            </h2>
            <p className="text-xl text-slate-600">
              Funzionalità aggiuntive che rendono la nostra piattaforma unica nel mercato italiano
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-500 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto a provare tutte le funzionalità?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Inizia subito e scopri come Newsletter Italiane può trasformare il tuo business
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-600 rounded-xl hover:bg-slate-50 transition-colors font-semibold text-lg"
            >
              Iscriviti
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/contatti"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white hover:text-emerald-600 transition-colors font-semibold text-lg"
            >
              Richiedi Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-semibold text-white mb-4">Prodotto</h3>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-slate-400 hover:text-white">Funzionalità</Link></li>
                <li><Link href="/pricing" className="text-slate-400 hover:text-white">Prezzi</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Risorse</h3>
              <ul className="space-y-2">
                <li><Link href="/dashboard/help" className="text-slate-400 hover:text-white">Centro assistenza</Link></li>
                <li><Link href="/blog" className="text-slate-400 hover:text-white">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Azienda</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-slate-400 hover:text-white">Chi siamo</Link></li>
                <li><Link href="/contatti" className="text-slate-400 hover:text-white">Contatti</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Legale</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-slate-400 hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="text-slate-400 hover:text-white">Termini</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-800">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="text-2xl font-bold text-emerald-400">Newsletter Italiane</div>
              <div className="text-slate-400">© 2025 Tutti i diritti riservati</div>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/status" className="flex items-center gap-2 text-slate-400 hover:text-white">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                Tutti i servizi operativi
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}