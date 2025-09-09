'use client'

import { useState } from 'react'
import { 
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Euro,
  Filter,
  Search,
  ChevronRight,
  ChevronLeft,
  Menu,
  AlertCircle,
} from 'lucide-react'
import { useAuth } from '../../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Sidebar from '../../components/Sidebar'

// Simplified collaborations data
const collaborations = [
  { id: 1, brand: 'TechStartup Italia', newsletter: 'Marketing Espresso', status: 'active', value: 250, deadline: '2025-01-15', createdAt: '2025-01-10' },
  { id: 2, brand: 'EcoFashion Brand', newsletter: 'Sustainable Living', status: 'completed', value: 180, deadline: '2025-01-08', createdAt: '2024-12-28' },
  { id: 3, brand: 'FinTech Solutions', newsletter: 'Weekly Finance', status: 'pending', value: 320, deadline: '2025-01-20', createdAt: '2025-01-12' },
  { id: 4, brand: 'Health & Wellness Co', newsletter: 'Fitness Weekly', status: 'active', value: 150, deadline: '2025-01-18', createdAt: '2025-01-11' },
  { id: 5, brand: 'Food Delivery App', newsletter: 'Foodie Newsletter', status: 'cancelled', value: 280, deadline: '2025-01-14', createdAt: '2025-01-09' },
  { id: 6, brand: 'Travel Tech', newsletter: 'Travel Insider', status: 'completed', value: 400, deadline: '2025-01-12', createdAt: '2025-01-02' },
  { id: 7, brand: 'EdTech Platform', newsletter: 'Learning Hub', status: 'active', value: 200, deadline: '2025-01-22', createdAt: '2025-01-13' },
  { id: 8, brand: 'Crypto Exchange', newsletter: 'Crypto Weekly', status: 'pending', value: 500, deadline: '2025-01-25', createdAt: '2025-01-14' },
  { id: 9, brand: 'Gaming Studio', newsletter: 'Game Dev Digest', status: 'active', value: 350, deadline: '2025-01-19', createdAt: '2025-01-10' },
  { id: 10, brand: 'Real Estate Tech', newsletter: 'Property Insights', status: 'completed', value: 220, deadline: '2025-01-11', createdAt: '2025-01-01' },
  { id: 11, brand: 'AI Startup', newsletter: 'AI Weekly', status: 'active', value: 450, deadline: '2025-01-28', createdAt: '2025-01-15' },
  { id: 12, brand: 'Green Energy Co', newsletter: 'Sustainable Tech', status: 'pending', value: 380, deadline: '2025-01-26', createdAt: '2025-01-14' },
  { id: 13, brand: 'Fashion E-commerce', newsletter: 'Style Report', status: 'active', value: 160, deadline: '2025-01-21', createdAt: '2025-01-12' },
  { id: 14, brand: 'Productivity App', newsletter: 'Work Smart', status: 'completed', value: 190, deadline: '2025-01-13', createdAt: '2025-01-03' },
  { id: 15, brand: 'Music Platform', newsletter: 'Music Industry News', status: 'active', value: 270, deadline: '2025-01-23', createdAt: '2025-01-13' },
  { id: 16, brand: 'Sports Brand', newsletter: 'Athletic Performance', status: 'pending', value: 300, deadline: '2025-01-27', createdAt: '2025-01-15' },
  { id: 17, brand: 'Pet Care Startup', newsletter: 'Pet Owner Guide', status: 'active', value: 120, deadline: '2025-01-24', createdAt: '2025-01-14' },
  { id: 18, brand: 'Home Automation', newsletter: 'Smart Home Weekly', status: 'completed', value: 340, deadline: '2025-01-10', createdAt: '2024-12-30' }
]

const statusFilters = [
  { value: 'all', label: 'Tutti gli stati' },
  { value: 'active', label: 'Attive' },
  { value: 'pending', label: 'In attesa' },
  { value: 'completed', label: 'Completate' },
  { value: 'cancelled', label: 'Cancellate' }
]

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'active':
      return { label: 'Attiva', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle }
    case 'pending':
      return { label: 'In attesa', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Clock }
    case 'completed':
      return { label: 'Completata', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: CheckCircle }
    case 'cancelled':
      return { label: 'Cancellata', color: 'text-red-600', bgColor: 'bg-red-100', icon: XCircle }
    default:
      return { label: status, color: 'text-slate-600', bgColor: 'bg-slate-100', icon: AlertCircle }
  }
}

export default function CollaborationsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/sign-in')
    }
  }, [authLoading, user, router])

  // Filter and pagination
  const filteredCollaborations = collaborations.filter(collaboration => {
    const matchesStatus = statusFilter === 'all' || collaboration.status === statusFilter
    const matchesSearch = collaboration.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         collaboration.newsletter.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const totalPages = Math.ceil(filteredCollaborations.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCollaborations = filteredCollaborations.slice(startIndex, startIndex + itemsPerPage)

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
              <h1 className="text-xl font-semibold text-slate-900">Collaborazioni</h1>
              <Users className="w-5 h-5 text-slate-500" />
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
                placeholder="Cerca collaborazioni..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {statusFilters.map(filter => (
                <option key={filter.value} value={filter.value}>{filter.label}</option>
              ))}
            </select>
          </div>

          {/* Results count */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-slate-600">
              {filteredCollaborations.length} collaborazion{filteredCollaborations.length === 1 ? 'e' : 'i'} trovat{filteredCollaborations.length === 1 ? 'a' : 'e'}
            </p>
            <p className="text-sm text-slate-500">
              Pagina {currentPage} di {totalPages}
            </p>
          </div>

          {/* Collaborations Table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Brand</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Newsletter</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Stato</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Valore</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Scadenza</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Azione</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedCollaborations.map((collaboration) => {
                    const statusInfo = getStatusInfo(collaboration.status)
                    const StatusIcon = statusInfo.icon
                    
                    return (
                      <tr key={collaboration.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900 text-sm">{collaboration.brand}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{collaboration.newsletter}</td>
                        <td className="px-4 py-3">
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusInfo.label}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <Euro className="w-3 h-3" />
                            {collaboration.value}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <Clock className="w-3 h-3" />
                            {new Date(collaboration.deadline).toLocaleDateString('it-IT')}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button className="inline-flex items-center gap-1 px-3 py-1 bg-slate-600 text-white text-xs rounded-md hover:bg-slate-700 transition-colors">
                            Dettagli
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
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