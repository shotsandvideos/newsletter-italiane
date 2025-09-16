'use client'

import { useState } from 'react'
import { 
  ShoppingBag,
  Clock,
  Users,
  Filter,
  Search,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Building,
  CreditCard
} from 'lucide-react'
import { useAuth } from '../../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Sidebar from '../../components/Sidebar'

// Real campaigns data - will be fetched from API
const campaigns: any[] = []

const categories = [
  { value: 'all', label: 'Tutte le categorie' },
  { value: 'tech', label: 'Tecnologia' },
  { value: 'fintech', label: 'Fintech' },
  { value: 'startup', label: 'Startup' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'lifestyle', label: 'Lifestyle' }
]

export default function MarketplacePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const itemsPerPage = 12

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/sign-in')
    }
  }, [authLoading, user, router])

  // Filter and pagination
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesCategory = selectedCategory === 'all' || campaign.category.toLowerCase() === selectedCategory
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.brand.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleShowDetails = (campaign) => {
    setSelectedCampaign(campaign)
    setShowDetailsModal(true)
  }

  const handleCloseDetails = () => {
    setSelectedCampaign(null)
    setShowDetailsModal(false)
  }

  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCampaigns = filteredCampaigns.slice(startIndex, startIndex + itemsPerPage)

  if (authLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar 
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar 
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-slate-900">Marketplace</h1>
              <ShoppingBag className="w-5 h-5 text-slate-500" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto px-6 py-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cerca campagne..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Results count */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-slate-600">
              {filteredCampaigns.length} campagn{filteredCampaigns.length === 1 ? 'a' : 'e'} trovat{filteredCampaigns.length === 1 ? 'a' : 'e'}
            </p>
            <p className="text-sm text-slate-500">
              Pagina {currentPage} di {totalPages}
            </p>
          </div>

          {/* Campaigns Table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            {paginatedCampaigns.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Campagna</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Brand</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Categoria</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Payment Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Scadenza</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Azione</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedCampaigns.map((campaign) => (
                      <tr key={campaign.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900 text-sm">{campaign.title}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Building className="w-3 h-3 text-slate-400" />
                            <span className="text-sm text-slate-600">{campaign.brand}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                            {campaign.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <CreditCard className="w-3 h-3 text-slate-400" />
                            <span className="text-xs text-slate-600">{campaign.paymentType}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <Clock className="w-3 h-3" />
                            {new Date(campaign.deadline).toLocaleDateString('it-IT')}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button 
                            onClick={() => handleShowDetails(campaign)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-slate-600 text-white text-xs rounded-md hover:bg-slate-700 transition-colors"
                          >
                            Dettagli
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Nessuna campagna disponibile</h3>
                <p className="text-slate-500 text-sm">Le campagne pubblicitarie appariranno qui quando saranno disponibili.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Precedente
              </button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-slate-600 text-white'
                          : 'bg-white border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Successiva
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Campaign Details Modal */}
      {showDetailsModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Dettagli Campagna</h3>
              <button 
                onClick={handleCloseDetails}
                className="p-1 hover:bg-slate-100 rounded-md transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6">
              <div className="space-y-6">
                {/* Campaign Title */}
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">{selectedCampaign.title}</h4>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Building className="w-4 h-4" />
                    <span>{selectedCampaign.brand}</span>
                  </div>
                </div>

                {/* Campaign Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-xs text-slate-500 uppercase font-medium mb-1">Categoria</div>
                    <div className="text-sm font-medium text-slate-900">{selectedCampaign.category}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-xs text-slate-500 uppercase font-medium mb-1">Payment Type</div>
                    <div className="text-sm font-medium text-slate-900">{selectedCampaign.paymentType}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-xs text-slate-500 uppercase font-medium mb-1">Budget</div>
                    <div className="text-sm font-medium text-slate-900">{selectedCampaign.budget}</div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h5 className="text-sm font-medium text-slate-900 mb-2">Descrizione</h5>
                  <p className="text-sm text-slate-600 leading-relaxed">{selectedCampaign.description}</p>
                </div>

                {/* Requirements */}
                <div>
                  <h5 className="text-sm font-medium text-slate-900 mb-2">Requisiti</h5>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Newsletter attiva nel settore {selectedCampaign.category.toLowerCase()}</li>
                    <li>• Minimo 1,000 iscritti attivi</li>
                    <li>• Open rate superiore al 20%</li>
                    <li>• Archivio newsletter pubblico</li>
                  </ul>
                </div>

                {/* Timeline */}
                <div>
                  <h5 className="text-sm font-medium text-slate-900 mb-2">Timeline</h5>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span>Scadenza candidature: {new Date(selectedCampaign.deadline).toLocaleDateString('it-IT', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="text-sm font-medium text-slate-900 mb-2 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Dettagli Pagamento
                  </h5>
                  <div className="space-y-1 text-sm text-slate-700">
                    <div>Tipologia: <span className="font-medium">{selectedCampaign.paymentType}</span></div>
                    <div>Budget: <span className="font-medium">{selectedCampaign.budget}</span></div>
                    {selectedCampaign.paymentType === 'PPC' && (
                      <div className="text-xs text-slate-600 mt-2">Pagamento basato su click effettivi generati</div>
                    )}
                    {selectedCampaign.paymentType === 'Pay per Lead' && (
                      <div className="text-xs text-slate-600 mt-2">Pagamento per ogni lead qualificato generato</div>
                    )}
                    {selectedCampaign.paymentType === 'Pay per Action' && (
                      <div className="text-xs text-slate-600 mt-2">Pagamento per azione completata (registrazione, acquisto, etc.)</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button 
                onClick={handleCloseDetails}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
              >
                Chiudi
              </button>
              <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors">
                Applica alla Campagna
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}