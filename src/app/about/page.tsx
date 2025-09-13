import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { 
  Users, 
  Target, 
  Heart, 
  Lightbulb, 
  TrendingUp, 
  Shield,
  ArrowRight,
  Mail,
  MapPin,
  Calendar
} from 'lucide-react'

const team = [
  {
    name: 'Marco Rossi',
    role: 'CEO & Founder',
    bio: '10+ anni nell\'advertising digitale. Ex-Google, appassionato di newsletter marketing e crescita sostenibile.',
    avatar: 'MR'
  },
  {
    name: 'Sofia Bianchi',
    role: 'Head of Creator Relations',
    bio: 'Esperta in content marketing, aiuta i creator a massimizzare il potenziale delle loro newsletter.',
    avatar: 'SB'
  },
  {
    name: 'Andrea Conti',
    role: 'Head of Brand Partnerships',
    bio: 'Specialista in partnership strategiche, connette brand con le audience più rilevanti.',
    avatar: 'AC'
  },
  {
    name: 'Giulia Verdi',
    role: 'Product Manager',
    bio: 'Background in UX/UI design, si assicura che la piattaforma sia sempre user-friendly e intuitiva.',
    avatar: 'GV'
  }
]

const values = [
  {
    icon: <Heart className="w-8 h-8" />,
    title: 'Trasparenza',
    description: 'Crediamo in rapporti chiari e onesti. Nessun costo nascosto, nessuna pratica ambigua.'
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Community First',
    description: 'La nostra community di creator e brand è al centro di tutto quello che facciamo.'
  },
  {
    icon: <Lightbulb className="w-8 h-8" />,
    title: 'Innovazione',
    description: 'Sviluppiamo costantemente nuovi strumenti e funzionalità per migliorare l\'esperienza.'
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Qualità',
    description: 'Manteniamo standard elevati per garantire risultati eccellenti per tutti i partecipanti.'
  }
]

const milestones = [
  {
    year: '2023',
    title: 'Fondazione',
    description: 'Frames nasce dall\'idea di democratizzare il newsletter advertising in Italia'
  },
  {
    year: '2024',
    title: 'Primi 100 Creator',
    description: 'Raggiungiamo il traguardo dei primi 100 creator attivi sulla piattaforma'
  },
  {
    year: '2024',
    title: '€100k Pagati',
    description: 'Superiamo i €100,000 pagati ai creator, dimostrando la validità del modello'
  },
  {
    year: '2025',
    title: 'Espansione',
    description: 'Lancio di nuove funzionalità e espansione verso nuovi mercati verticali'
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Chi Siamo
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            La prima piattaforma italiana dedicata al newsletter advertising. 
            Connettere creator di qualità con brand ambiziosi per crescere insieme.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                La Nostra Missione
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Frames nasce dalla convinzione che le newsletter rappresentino 
                il futuro dell'advertising digitale. In un mondo sempre più saturo di contenuti, 
                le newsletter offrono un canale diretto, personale e ad alto engagement.
              </p>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                La nostra missione è creare un ecosistema trasparente dove creator di qualità 
                possano monetizzare il loro lavoro e brand innovativi possano raggiungere 
                audience altamente qualificate.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/sign-up"
                  className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold"
                >
                  Unisciti a Noi
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <Link
                  href="/contatti"
                  className="inline-flex items-center justify-center px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-semibold"
                >
                  Contattaci
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl p-8 border border-emerald-200">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">150+ Newsletter</h3>
                      <p className="text-slate-600">Creator attivi sulla piattaforma</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">500k+ Lettori</h3>
                      <p className="text-slate-600">Raggiunti ogni mese</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">€180k+</h3>
                      <p className="text-slate-600">Pagati ai creator</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              I Nostri Valori
            </h2>
            <p className="text-xl text-slate-600">
              I principi che guidano ogni decisione e azione della nostra azienda
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{value.title}</h3>
                <p className="text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              La Nostra Storia
            </h2>
            <p className="text-xl text-slate-600">
              Il percorso che ci ha portato a diventare la piattaforma di riferimento
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-px h-full w-0.5 bg-emerald-200"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}>
                  {/* Timeline Dot */}
                  <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full shadow-lg z-10"></div>
                  
                  {/* Content */}
                  <div className={`w-full md:w-5/12 ml-12 md:ml-0 ${
                    index % 2 === 0 ? '' : 'md:text-right'
                  }`}>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">{milestone.year}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">{milestone.title}</h3>
                      <p className="text-slate-600">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Il Nostro Team
            </h2>
            <p className="text-xl text-slate-600">
              Le persone che rendono possibile Frames ogni giorno
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-semibold">
                  {member.avatar}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-1">{member.name}</h3>
                <p className="text-emerald-600 font-medium mb-3">{member.role}</p>
                <p className="text-sm text-slate-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-emerald-500 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Vuoi Saperne di Più?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Siamo sempre felici di parlare con creator e brand interessati alla nostra piattaforma
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contatti"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-600 rounded-xl hover:bg-slate-50 transition-colors font-semibold text-lg"
            >
              <Mail className="mr-2 w-5 h-5" />
              Contattaci
            </Link>
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white hover:text-emerald-600 transition-colors font-semibold text-lg"
            >
              Inizia Subito
              <ArrowRight className="ml-2 w-5 h-5" />
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
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400">Milano, Italia</span>
              </div>
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