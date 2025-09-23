'use client'

import { useState, useEffect } from 'react'
import { Target, Plus, X } from 'lucide-react'

export default function AdminTestPage() {
  const [approvedNewsletters, setApprovedNewsletters] = useState<any[]>([])
  const [selectedNewsletters, setSelectedNewsletters] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)

  const fetchApprovedNewsletters = async () => {
    try {
      const response = await fetch('/api/newsletters-all')
      if (response.ok) {
        const data = await response.json()
        // Filter only approved newsletters
        const approved = data.data?.filter(newsletter => newsletter.review_status === 'approved') || []
        setApprovedNewsletters(approved)
      }
    } catch (error) {
      console.error('Error fetching approved newsletters:', error)
    }
  }

  useEffect(() => {
    fetchApprovedNewsletters()
  }, [])

  const handleNewsletterSelection = (newsletterId: string) => {
    setSelectedNewsletters(prev => 
      prev.includes(newsletterId)
        ? prev.filter(id => id !== newsletterId)
        : [...prev, newsletterId]
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">
            🔴 TEST: Funzionalità Modifica Newsletter
          </h1>
          
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">
              Questa è una pagina di test per verificare la funzionalità di modifica newsletter 
              senza dover configurare l'autenticazione admin.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors mb-6"
          >
            <Plus className="w-4 h-4" />
            Apri Modal Test
          </button>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Newsletter Approvate Trovate: {approvedNewsletters.length}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {approvedNewsletters.map((newsletter) => (
                <div key={newsletter.id} className="p-4 bg-slate-50 rounded-lg border">
                  <h3 className="font-medium text-slate-900">{newsletter.title}</h3>
                  <p className="text-sm text-slate-600">
                    {newsletter.author_first_name} {newsletter.author_last_name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {newsletter.audience_size} iscritti
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Test Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-slate-900">
                Test Modal - Modifica Newsletter
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Newsletter Modification Section */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Modifica Newsletter Incluse ({selectedNewsletters.length} selezionate)
                </h4>
                
                {/* Debug Info */}
                <div className="mb-3 p-2 bg-gray-100 rounded text-xs">
                  <strong>Debug:</strong> Newsletter approvate trovate: {approvedNewsletters.length}
                  {approvedNewsletters.length > 0 && (
                    <span> - Selezionate: {selectedNewsletters.length}</span>
                  )}
                </div>
                
                {approvedNewsletters.length === 0 ? (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Nessuna newsletter approvata disponibile. Controlla che ci siano newsletter con status 'approved'.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-48 overflow-y-auto border border-slate-300 rounded-lg bg-white">
                    {approvedNewsletters.map((newsletter) => (
                      <label
                        key={newsletter.id}
                        className="flex items-center p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                      >
                        <input
                          type="checkbox"
                          checked={selectedNewsletters.includes(newsletter.id)}
                          onChange={() => handleNewsletterSelection(newsletter.id)}
                          className="mr-3 h-4 w-4 text-red-600 focus:ring-red-500 border-slate-300 rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-900 truncate">
                            {newsletter.title}
                          </div>
                          <div className="text-xs text-slate-600">
                            {newsletter.author_first_name} {newsletter.author_last_name} • {newsletter.audience_size} iscritti
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
                <p className="text-xs text-slate-600 mt-2">
                  Modifica la selezione delle newsletter per questa proposta. 
                  Questa è la stessa interfaccia che sarà disponibile nel modal dei dettagli delle proposte.
                </p>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => alert(`Newsletter selezionate: ${selectedNewsletters.length}`)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Test Salvataggio
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Chiudi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}