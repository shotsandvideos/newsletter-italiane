'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import { 
  Clock,
  Send,
  MessageSquare,
  User,
  Building
} from 'lucide-react'

export default function ContattiPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    azienda: '',
    messaggio: '',
    tipo: 'generale'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // TODO: Implement form submission logic
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Contattaci
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Siamo qui per aiutarti. Che tu sia un creator di newsletter o un brand, 
            il nostro team è pronto a supportarti nel tuo percorso di crescita.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Form - LEFT SIDE */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">
                Invia un Messaggio
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-slate-700 mb-2">
                      Nome *
                    </label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      required
                      value={formData.nome}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Il tuo nome"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="la-tua-email@esempio.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="azienda" className="block text-sm font-medium text-slate-700 mb-2">
                    Azienda/Newsletter
                  </label>
                  <input
                    type="text"
                    id="azienda"
                    name="azienda"
                    value={formData.azienda}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Nome della tua azienda o newsletter"
                  />
                </div>
                
                <div>
                  <label htmlFor="tipo" className="block text-sm font-medium text-slate-700 mb-2">
                    Tipo di Richiesta
                  </label>
                  <select
                    id="tipo"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="generale">Informazioni Generali</option>
                    <option value="creator">Supporto Creator</option>
                    <option value="brand">Partnership Brand</option>
                    <option value="tecnico">Supporto Tecnico</option>
                    <option value="partnership">Proposta di Partnership</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="messaggio" className="block text-sm font-medium text-slate-700 mb-2">
                    Messaggio *
                  </label>
                  <textarea
                    id="messaggio"
                    name="messaggio"
                    required
                    rows={5}
                    value={formData.messaggio}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    placeholder="Descrivici come possiamo aiutarti..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center px-8 py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Invia Messaggio
                </button>
              </form>
            </div>

            {/* Contact Information - RIGHT SIDE - SIMPLIFIED */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-8">
                  Informazioni di Contatto
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Orari di Supporto</h3>
                      <p className="text-slate-600">
                        Lunedì - Venerdì: 9:00 - 18:00<br />
                        Sabato: 10:00 - 14:00<br />
                        Domenica: Chiuso
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Types */}
              <div className="bg-slate-50 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-slate-900 mb-6">
                  Come possiamo aiutarti?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="w-5 h-5 text-emerald-600" />
                      <h4 className="font-semibold text-slate-900">Creator</h4>
                    </div>
                    <p className="text-sm text-slate-600">
                      Supporto per registrazione, monetizzazione e ottimizzazione della newsletter
                    </p>
                  </div>
                  
                  <div className="p-4 bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Building className="w-5 h-5 text-emerald-600" />
                      <h4 className="font-semibold text-slate-900">Brand</h4>
                    </div>
                    <p className="text-sm text-slate-600">
                      Consulenza per campagne pubblicitarie e partnership strategiche
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
              Le risposte alle domande più comuni sui nostri servizi
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Come posso registrare la mia newsletter?
              </h3>
              <p className="text-slate-600">
                Registrati gratuitamente sulla nostra piattaforma, aggiungi i dettagli della tua newsletter 
                e attendi l'approvazione del nostro team. Il processo richiede solitamente 24-48 ore.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Quali sono le commissioni per i creator?
              </h3>
              <p className="text-slate-600">
                Applichiamo una commissione del 15% sui guadagni. Non ci sono costi di registrazione 
                o canoni mensili - paghi solo quando guadagni.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Come funzionano le campagne per i brand?
              </h3>
              <p className="text-slate-600">
                I brand possono creare campagne mirate, selezionare newsletter specifiche e monitorare 
                le performance in tempo reale. Offriamo anche servizio di consulenza dedicato.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Quando ricevo i pagamenti?
              </h3>
              <p className="text-slate-600">
                I pagamenti vengono elaborati entro 7 giorni lavorativi dalla conclusione della campagna, 
                direttamente sul tuo conto bancario o PayPal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="text-2xl font-bold text-emerald-400">Frames</div>
              <div className="text-slate-400">© 2025 Tutti i diritti riservati</div>
            </div>
            <div className="flex items-center gap-6">
              <a href="/privacy" className="text-slate-400 hover:text-white transition-colors">
                Privacy
              </a>
              <a href="/terms" className="text-slate-400 hover:text-white transition-colors">
                Termini
              </a>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-slate-400">Tutti i servizi operativi</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}