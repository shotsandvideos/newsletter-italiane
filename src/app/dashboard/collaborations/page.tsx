'use client'

import React, { useState, useEffect } from 'react'
import {
  Users,
  CheckCircle,
  XCircle,
  Calendar,
  Search,
  ChevronRight,
  ChevronLeft,
  Menu,
  AlertCircle,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Link,
} from 'lucide-react'
import { useAuth } from '../../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/Sidebar'

interface Collaboration {
  id: string
  proposal_id: string
  newsletter_id: string
  brand: string
  newsletter: string
  status: string
  sponsorship_type: string
  product_type: string
  campaign_start_date: string
  campaign_end_date: string
  selected_run_date: string
  ideal_target_audience: string
  admin_assets_images?: string[]
  admin_copy_text?: string
  admin_brief_text?: string
  admin_tracking_links?: string[]
  calendar_event?: any
}

const statusFilters = [
  { value: 'all', label: 'Tutti gli stati' },
  { value: 'active', label: 'Attive' },
  { value: 'scheduled', label: 'Programmate' },
  { value: 'completed', label: 'Completate' }
]

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'active':
      return { label: 'Attiva', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle }
    case 'scheduled':
      return { label: 'Programmata', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: Calendar }
    case 'completed':
      return { label: 'Completata', color: 'text-slate-600', bgColor: 'bg-slate-100', icon: CheckCircle }
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
  const [collaborations, setCollaborations] = useState<Collaboration[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCollaboration, setSelectedCollaboration] = useState<Collaboration | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const itemsPerPage = 12

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/sign-in')
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (user) {
      fetchCollaborations()
    }
  }, [user])

  const fetchCollaborations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/collaborations')
      const result = await response.json()
      
      if (result.success) {
        setCollaborations(result.data)
      } else {
        console.error('Error fetching collaborations:', result.error)
      }
    } catch (error) {
      console.error('Error fetching collaborations:', error)
    } finally {
      setLoading(false)
    }
  }

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

  if (authLoading || loading) {
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Tipo</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Data Pubblicazione</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Assets</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Azione</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedCollaborations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                        Nessuna collaborazione trovata
                      </td>
                    </tr>
                  ) : (
                    paginatedCollaborations.map((collaboration) => {
                      const statusInfo = getStatusInfo(collaboration.status)
                      const StatusIcon = statusInfo.icon
                      
                      // Check if assets are available
                      const hasAssets = collaboration.admin_copy_text || 
                                      (collaboration.admin_assets_images && collaboration.admin_assets_images.length > 0) || 
                                      (collaboration.admin_tracking_links && collaboration.admin_tracking_links.length > 0)
                      
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
                            <div className="text-sm text-slate-600">
                              {collaboration.sponsorship_type}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <Calendar className="w-3 h-3" />
                              {new Date(collaboration.selected_run_date).toLocaleDateString('it-IT')}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {hasAssets ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : null}
                          </td>
                          <td className="px-4 py-3">
                            <button 
                              onClick={() => {
                                setSelectedCollaboration(collaboration)
                                setShowDetailModal(true)
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-slate-600 text-white text-xs rounded-md hover:bg-slate-700 transition-colors"
                            >
                              Dettagli
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}
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

      {/* Detail Modal */}
      {showDetailModal && selectedCollaboration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">
                    Collaborazione con {selectedCollaboration.brand}
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(selectedCollaboration.status).bgColor} ${getStatusInfo(selectedCollaboration.status).color}`}>
                      {React.createElement(getStatusInfo(selectedCollaboration.status).icon, { className: 'w-3 h-3' })}
                      {getStatusInfo(selectedCollaboration.status).label}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Campaign Details */}
                <div className="space-y-4">
                  <h3 className="font-medium text-slate-900 border-b pb-2">Dettagli Campagna</h3>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-600">Newsletter</label>
                    <p className="text-sm text-slate-900">{selectedCollaboration.newsletter}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-600">Tipo Sponsorizzazione</label>
                    <p className="text-sm text-slate-900">{selectedCollaboration.sponsorship_type}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-600">Tipo Prodotto</label>
                    <p className="text-sm text-slate-900">{selectedCollaboration.product_type}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-600">Data Pubblicazione Scelta</label>
                    <p className="text-sm text-slate-900">
                      {new Date(selectedCollaboration.selected_run_date).toLocaleDateString('it-IT')}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-600">Periodo Campagna</label>
                    <p className="text-sm text-slate-900">
                      {new Date(selectedCollaboration.campaign_start_date).toLocaleDateString('it-IT')} - {new Date(selectedCollaboration.campaign_end_date).toLocaleDateString('it-IT')}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-600">Target Audience</label>
                    <p className="text-sm text-slate-900">{selectedCollaboration.ideal_target_audience}</p>
                  </div>
                </div>

                {/* Admin Materials */}
                <div className="space-y-4">
                  <h3 className="font-medium text-slate-900 border-b pb-2">Materiali Admin</h3>
                  
                  {selectedCollaboration.admin_copy_text && (
                    <div>
                      <label className="text-sm font-medium text-slate-600 flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        Testo Copy
                      </label>
                      <div className="mt-1 p-3 bg-slate-50 rounded-lg text-sm text-slate-900 whitespace-pre-wrap">
                        {selectedCollaboration.admin_copy_text}
                      </div>
                    </div>
                  )}

                  {selectedCollaboration.admin_brief_text && (
                    <div>
                      <label className="text-sm font-medium text-slate-600 flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        Brief
                      </label>
                      <div className="mt-1 p-3 bg-slate-50 rounded-lg text-sm text-slate-900 whitespace-pre-wrap">
                        {selectedCollaboration.admin_brief_text}
                      </div>
                    </div>
                  )}

                  {selectedCollaboration.admin_assets_images && selectedCollaboration.admin_assets_images.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-slate-600 flex items-center gap-1">
                        <ImageIcon className="w-4 h-4" />
                        Immagini ({selectedCollaboration.admin_assets_images.length})
                      </label>
                      <div className="mt-1 grid grid-cols-2 gap-2">
                        {selectedCollaboration.admin_assets_images.map((image, index) => (
                          <div key={index} className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center">
                            <a href={image} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1">
                              <ExternalLink className="w-3 h-3" />
                              Immagine {index + 1}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedCollaboration.admin_tracking_links && selectedCollaboration.admin_tracking_links.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-slate-600 flex items-center gap-1">
                        <Link className="w-4 h-4" />
                        Link di Tracking
                      </label>
                      <div className="mt-1 space-y-1">
                        {selectedCollaboration.admin_tracking_links.map((link, index) => (
                          <a
                            key={index}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-blue-600 hover:text-blue-800 break-all"
                          >
                            {link}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
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
