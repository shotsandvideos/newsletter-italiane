import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { CheckCircle, ArrowRight } from 'lucide-react'

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

const faqData = [
  {
    question: 'Come funziona la commissione del 15%?',
    answer: 'La commissione viene applicata solo sui guadagni effettivi. Non ci sono costi di registrazione, canoni mensili o costi nascosti. Paghi solo quando generi ricavi.'
  },
  {
    question: 'Quando ricevo i pagamenti?',
    answer: 'I pagamenti vengono elaborati automaticamente entro 7 giorni lavorativi dalla conclusione di ogni campagna, direttamente sul tuo conto bancario o PayPal.'
  },
  {
    question: 'Posso cambiare piano in qualsiasi momento?',
    answer: 'Sì, puoi modificare le tue preferenze in qualsiasi momento. Per i brand, il nostro team ti aiuterà a trovare la soluzione più adatta alle tue esigenze.'
  },
  {
    question: 'Che tipo di analytics sono disponibili?',
    answer: 'Dashboard completa con metriche in tempo reale: impression, click, conversioni, engagement rate, performance per segmento demografico e molto altro.'
  },
  {
    question: 'È richiesto un contratto a lungo termine?',
    answer: 'No, non richiediamo contratti a lungo termine. Puoi iniziare e interrompere il servizio in qualsiasi momento senza penali.'
  },
  {
    question: 'Come vengono selezionate le newsletter?',
    answer: 'Il nostro team verifica ogni newsletter per qualità del contenuto, engagement rate, autenticità dell\'audience e aderenza alle nostre linee guida.'
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Piani semplici e trasparenti
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Nessun costo nascosto, nessun impegno a lungo termine. Paga solo quando guadagni.
          </p>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`p-8 rounded-2xl border-2 ${plan.popular 
                  ? 'border-emerald-500 bg-emerald-50 relative' 
                  : 'border-slate-200 bg-white'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Più Popolare
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.title}</h3>
                  <p className="text-slate-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    {plan.type === 'Creator' && (
                      <span className="text-slate-600 ml-2">+ 15% commissioni</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`w-full inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-slate-100 border border-slate-200 text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Domande Frequenti
            </h2>
            <p className="text-lg text-slate-600">
              Tutto quello che devi sapere sui nostri piani e servizi
            </p>
          </div>
          
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-slate-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-500 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto a iniziare?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Unisciti a centinaia di creator e brand che stanno già crescendo con Frames
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
              Contatta il team vendite
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
              <div className="text-2xl font-bold text-emerald-400">Frames</div>
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