import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { ArrowLeft, Check, Clock, Activity, Server, Database, Shield } from 'lucide-react'

const systemServices = [
  { name: 'API Services', status: 'operational', uptime: '99.9%', icon: <Server className="w-5 h-5" /> },
  { name: 'Database', status: 'operational', uptime: '99.8%', icon: <Database className="w-5 h-5" /> },
  { name: 'Email Delivery', status: 'operational', uptime: '99.7%', icon: <Shield className="w-5 h-5" /> },
  { name: 'Dashboard', status: 'operational', uptime: '99.9%', icon: <Activity className="w-5 h-5" /> }
]

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mb-6">
              <Activity className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Stato dei Servizi
            </h1>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
              <p className="text-xl text-slate-600">
                Tutti i servizi operativi
              </p>
            </div>
            <p className="text-lg text-slate-500">
              Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </section>

      {/* System Status */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Servizi di Sistema
              </h2>
              <div className="space-y-4">
                {systemServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="text-slate-600">
                        {service.icon}
                      </div>
                      <span className="font-medium text-slate-900">{service.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-slate-500">Uptime: {service.uptime}</span>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span className="text-emerald-600 font-medium">Operativo</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Updates */}
          <div className="mt-12 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Aggiornamenti Recenti
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full mt-2"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-slate-500">Oggi, 14:30</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">Tutti i servizi operativi</h3>
                    <p className="text-slate-600">La piattaforma sta funzionando correttamente. Tutti i sistemi sono online e performanti.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-3 h-3 bg-blue-400 rounded-full mt-2"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-slate-500">8 Gen, 16:00</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">Miglioramenti performance</h3>
                    <p className="text-slate-600">Implementati miglioramenti per ridurre i tempi di caricamento del dashboard del 40%.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 text-center">
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
                Segnala Problema
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