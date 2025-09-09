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
} from 'lucide-react'
import { useAuth } from '../../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Sidebar from '../../components/Sidebar'

// Simplified campaign data structure
const campaigns = [
  { id: 1, title: 'Lancia la Nuova App Fintech', brand: 'FinanceFlow', budget: '€2,500 - €5,000', category: 'fintech', deadline: '2024-03-15', applicants: 12 },
  { id: 2, title: 'Promozione Corso Marketing Digitale', brand: 'MarketingPro Academy', budget: '€800 - €1,500', category: 'marketing', deadline: '2024-03-20', applicants: 8 },
  { id: 3, title: 'Startup Week Milano 2024', brand: 'Startup Events', budget: '€1,200 - €2,000', category: 'startup', deadline: '2024-03-10', applicants: 15 },
  { id: 4, title: 'E-commerce Platform Launch', brand: 'ShopTech', budget: '€3,000 - €6,000', category: 'tech', deadline: '2024-03-25', applicants: 6 },
  { id: 5, title: 'Sustainable Fashion Week', brand: 'EcoStyle', budget: '€1,500 - €2,500', category: 'lifestyle', deadline: '2024-03-18', applicants: 18 },
  { id: 6, title: 'Crypto Trading Course', brand: 'CryptoLearn', budget: '€2,000 - €4,000', category: 'fintech', deadline: '2024-03-22', applicants: 22 },
  { id: 7, title: 'Remote Work Tools', brand: 'WorkFlow', budget: '€1,800 - €3,000', category: 'tech', deadline: '2024-03-28', applicants: 9 },
  { id: 8, title: 'Health Tech Innovation', brand: 'MedTech Solutions', budget: '€4,000 - €8,000', category: 'tech', deadline: '2024-03-30', applicants: 11 },
  { id: 9, title: 'Digital Marketing Summit', brand: 'MarketCon', budget: '€1,200 - €2,200', category: 'marketing', deadline: '2024-03-16', applicants: 25 },
  { id: 10, title: 'Green Energy Startup', brand: 'EcoEnergy', budget: '€2,500 - €4,500', category: 'startup', deadline: '2024-04-02', applicants: 14 },
  { id: 11, title: 'Food Delivery Innovation', brand: 'QuickEats', budget: '€3,500 - €5,500', category: 'startup', deadline: '2024-03-26', applicants: 31 },
  { id: 12, title: 'EdTech Platform Beta', brand: 'LearnSmart', budget: '€1,600 - €2,800', category: 'tech', deadline: '2024-03-24', applicants: 8 },
  { id: 13, title: 'Fitness App Launch', brand: 'FitTracker Pro', budget: '€2,200 - €3,800', category: 'lifestyle', deadline: '2024-04-01', applicants: 19 },
  { id: 14, title: 'B2B SaaS Analytics', brand: 'DataInsight', budget: '€3,800 - €6,200', category: 'tech', deadline: '2024-04-05', applicants: 16 },
  { id: 15, title: 'Travel Tech Startup', brand: 'WanderTech', budget: '€2,000 - €3,500', category: 'startup', deadline: '2024-03-27', applicants: 23 },
  { id: 16, title: 'Cybersecurity Training', brand: 'SecureLearn', budget: '€3,200 - €5,000', category: 'tech', deadline: '2024-04-08', applicants: 12 },
  { id: 17, title: 'Smart Home Solutions', brand: 'HomeAI', budget: '€2,800 - €4,200', category: 'tech', deadline: '2024-04-10', applicants: 7 },
  { id: 18, title: 'Sustainable Finance Summit', brand: 'GreenFinance', budget: '€1,800 - €2,900', category: 'fintech', deadline: '2024-03-29', applicants: 20 }
]

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
  const itemsPerPage = 12

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/sign-in')
    }
  }, [authLoading, user, router])

  // Filter and pagination
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesCategory = selectedCategory === 'all' || campaign.category === selectedCategory
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.brand.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

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
    <div className="flex h-screen">
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Campagna</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Budget</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Scadenza</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Candidati</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Azione</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-slate-900 text-sm">{campaign.title}</div>
                          <div className="text-xs text-slate-500">{campaign.brand}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{campaign.budget}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Clock className="w-3 h-3" />
                          {new Date(campaign.deadline).toLocaleDateString('it-IT')}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Users className="w-3 h-3" />
                          {campaign.applicants}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button className="inline-flex items-center gap-1 px-3 py-1 bg-slate-600 text-white text-xs rounded-md hover:bg-slate-700 transition-colors">
                          Applica
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
    </div>
  )
}