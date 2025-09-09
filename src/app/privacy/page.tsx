import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { ArrowLeft, Clock, Shield } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mb-6">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Informativa sulla Privacy
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              La tua privacy è importante per noi. Stiamo preparando una informativa dettagliata sui nostri servizi.
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-lg">
            <Clock className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Prossimamente Disponibile
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Stiamo lavorando per fornire un'informativa sulla privacy completa e trasparente. 
              Nel frattempo, puoi contattarci per qualsiasi domanda riguardante la gestione dei tuoi dati.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold"
              >
                <ArrowLeft className="mr-2 w-5 h-5" />
                Torna alla Homepage
              </Link>
              <Link
                href="/contatti"
                className="inline-flex items-center justify-center px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-semibold"
              >
                Contattaci
              </Link>
            </div>
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