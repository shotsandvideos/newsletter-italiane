'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  CreditCard,
  Euro,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Menu,
  Download,
  Eye,
  User,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Mail,
  Users
} from 'lucide-react'
import AdminSidebar from '../../components/AdminSidebar'

export default function AdminPagamentiPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession')
    if (adminSession) {
      try {
        const session = JSON.parse(adminSession)
        if (session.username === 'admin' && session.role === 'admin') {
          setIsAuthenticated(true)
        } else {
          router.push('/admin/login')
        }
      } catch {
        router.push('/admin/login')
      }
    } else {
      router.push('/admin/login')
    }
    setLoading(false)
  }, [router])

  const payments = [
    {
      id: 'PAY-2024-001',
      type: 'newsletter_revenue',
      author: {
        name: 'Marco Rossi',
        email: 'marco.rossi@email.com',
        newsletter: 'Tech Weekly'
      },
      amount: 850.00,
      currency: 'EUR',
      status: 'completed',
      method: 'bank_transfer',
      createdAt: '2024-02-20T14:30:00Z',
      processedAt: '2024-02-20T16:45:00Z',
      description: 'Pagamento per newsletter "AI Revolution: 10 Tool che Cambieranno il Tuo Business"',
      escrowDetails: {
        held: false,
        releaseDate: null,
        holdReason: null
      },
      bankDetails: {
        iban: 'IT60 X054 2811 1010 0000 0123 456',
        beneficiary: 'Marco Rossi'
      }
    },
    {
      id: 'PAY-2024-002',
      type: 'collaboration_payment',
      author: {
        name: 'Anna Bianchi',
        email: 'anna.bianchi@email.com',
        newsletter: 'Startup Italia'
      },
      amount: 1200.00,
      currency: 'EUR',
      status: 'pending',
      method: 'bank_transfer',
      createdAt: '2024-02-20T10:15:00Z',
      processedAt: null,
      description: 'Pagamento collaborazione con FinanceFlow',
      escrowDetails: {
        held: true,
        releaseDate: '2024-02-25T00:00:00Z',
        holdReason: 'In attesa di completamento deliverable'
      },
      bankDetails: {
        iban: 'IT12 Y012 3456 7890 1234 5678 901',
        beneficiary: 'Anna Bianchi'
      }
    },
    {
      id: 'PAY-2024-003',
      type: 'refund',
      author: {
        name: 'Luigi Verdi',
        email: 'luigi.verdi@email.com',
        newsletter: 'Crypto Italia'
      },
      amount: -300.00,
      currency: 'EUR',
      status: 'processing',
      method: 'bank_transfer',
      createdAt: '2024-02-19T16:20:00Z',
      processedAt: null,
      description: 'Rimborso per collaborazione cancellata con CryptoTech',
      escrowDetails: {
        held: false,
        releaseDate: null,
        holdReason: null
      },
      bankDetails: {
        iban: 'IT89 Z098 7654 3210 9876 5432 109',
        beneficiary: 'Luigi Verdi'
      }
    },
    {
      id: 'PAY-2024-004',
      type: 'newsletter_revenue',
      author: {
        name: 'Giulia Neri',
        email: 'giulia.neri@email.com',
        newsletter: 'Marketing Pro'
      },
      amount: 680.50,
      currency: 'EUR',
      status: 'failed',
      method: 'bank_transfer',
      createdAt: '2024-02-19T12:00:00Z',
      processedAt: null,
      description: 'Pagamento per newsletter "Marketing Automation: Le Migliori Strategie"',
      escrowDetails: {
        held: false,
        releaseDate: null,
        holdReason: null
      },
      bankDetails: {
        iban: 'IT45 W876 5432 1098 7654 3210 987',
        beneficiary: 'Giulia Neri'
      },
      failureReason: 'IBAN non valido'
    },
    {
      id: 'PAY-2024-005',
      type: 'platform_fee',
      author: {
        name: 'Sistema',
        email: 'system@newsletteritaliane.com',
        newsletter: 'Platform'
      },
      amount: 125.75,
      currency: 'EUR',
      status: 'completed',
      method: 'internal',
      createdAt: '2024-02-18T23:59:00Z',
      processedAt: '2024-02-18T23:59:30Z',
      description: 'Commissione piattaforma (15% su €838.33)',
      escrowDetails: {
        held: false,
        releaseDate: null,
        holdReason: null
      }
    }
  ]

  const filters = [
    { value: 'all', label: 'Tutti', count: payments.length },
    { value: 'completed', label: 'Completati', count: payments.filter(p => p.status === 'completed').length },
    { value: 'pending', label: 'In attesa', count: payments.filter(p => p.status === 'pending').length },
    { value: 'processing', label: 'In elaborazione', count: payments.filter(p => p.status === 'processing').length },
    { value: 'failed', label: 'Falliti', count: payments.filter(p => p.status === 'failed').length }
  ]

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: 'Completato', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle }
      case 'pending':
        return { label: 'In attesa', color: 'bg-yellow-100 text-yellow-700', icon: Clock }
      case 'processing':
        return { label: 'In elaborazione', color: 'bg-blue-100 text-blue-700', icon: AlertCircle }
      case 'failed':
        return { label: 'Fallito', color: 'bg-red-100 text-red-700', icon: XCircle }
      default:
        return { label: status, color: 'bg-slate-100 text-slate-700', icon: Clock }
    }
  }

  const getPaymentTypeInfo = (type: string) => {
    switch (type) {
      case 'newsletter_revenue':
        return { label: 'Revenue Newsletter', icon: Mail, color: 'text-red-600' }
      case 'collaboration_payment':
        return { label: 'Pagamento Collaborazione', icon: Users, color: 'text-red-600' }
      case 'refund':
        return { label: 'Rimborso', icon: ArrowDownRight, color: 'text-red-600' }
      case 'platform_fee':
        return { label: 'Commissione Piattaforma', icon: Shield, color: 'text-red-600' }
      default:
        return { label: type, icon: CreditCard, color: 'text-red-600' }
    }
  }

  const filteredPayments = payments.filter(payment => {
    const matchesFilter = selectedFilter === 'all' || payment.status === selectedFilter
    const matchesSearch = payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const totalStats = {
    totalAmount: payments.filter(p => p.status === 'completed' && p.amount > 0).reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + Math.abs(p.amount), 0),
    escrowAmount: payments.filter(p => p.escrowDetails.held).reduce((sum, p) => sum + p.amount, 0),
    failedAmount: payments.filter(p => p.status === 'failed').reduce((sum, p) => sum + Math.abs(p.amount), 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar 
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-red-600" />
                <h1 className="text-xl font-semibold text-slate-900">Gestione Pagamenti</h1>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
              <Download className="w-4 h-4" />
              Esporta Report
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto px-6 py-6">
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      €{totalStats.totalAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-600">Pagamenti completati</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-xl">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      €{totalStats.pendingAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-600">In attesa</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-xl">
                    <Shield className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      €{totalStats.escrowAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-600">In escrow</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-xl">
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      €{totalStats.failedAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-600">Pagamenti falliti</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cerca per ID, autore o descrizione..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                {filters.map(filter => (
                  <button
                    key={filter.value}
                    onClick={() => setSelectedFilter(filter.value)}
                    className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                      selectedFilter === filter.value
                        ? 'bg-red-600 text-white'
                        : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    {filter.label} ({filter.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Payments List */}
            <div className="bg-white rounded-2xl border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">
                  Transazioni ({filteredPayments.length})
                </h3>
              </div>

              <div className="divide-y divide-slate-200">
                {filteredPayments.map((payment) => {
                  const statusInfo = getStatusInfo(payment.status)
                  const StatusIcon = statusInfo.icon
                  const typeInfo = getPaymentTypeInfo(payment.type)
                  const isNegative = payment.amount < 0

                  return (
                    <div key={payment.id} className="p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                {(() => {
                                  const IconComponent = typeInfo.icon
                                  return <IconComponent className="w-6 h-6 text-red-600" />
                                })()}
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-lg font-semibold text-slate-900">
                                  {payment.id}
                                </h4>
                                <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                  <StatusIcon className="w-3 h-3" />
                                  {statusInfo.label}
                                </span>
                                {payment.escrowDetails.held && (
                                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium flex items-center gap-1">
                                    <Shield className="w-3 h-3" />
                                    Escrow
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                                <span className={`font-medium ${typeInfo.color}`}>
                                  {typeInfo.label}
                                </span>
                                {payment.author.name !== 'Sistema' && (
                                  <div className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    <span>{payment.author.name}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{new Date(payment.createdAt).toLocaleDateString('it-IT')}</span>
                                </div>
                              </div>

                              <p className="text-sm text-slate-600 mb-4">
                                {payment.description}
                              </p>

                              {payment.status === 'failed' && payment.failureReason && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                                  <XCircle className="w-4 h-4 text-red-600" />
                                  <p className="text-sm text-red-700">
                                    <strong>Errore:</strong> {payment.failureReason}
                                  </p>
                                </div>
                              )}

                              {payment.escrowDetails.held && payment.escrowDetails.holdReason && (
                                <div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg mb-4">
                                  <Shield className="w-4 h-4 text-purple-600" />
                                  <div>
                                    <p className="text-sm font-medium text-purple-800">Fondi in escrow</p>
                                    <p className="text-sm text-purple-700">{payment.escrowDetails.holdReason}</p>
                                    {payment.escrowDetails.releaseDate && (
                                      <p className="text-xs text-purple-600 mt-1">
                                        Rilascio previsto: {new Date(payment.escrowDetails.releaseDate).toLocaleDateString('it-IT')}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                                    <Eye className="w-4 h-4" />
                                    Dettagli
                                  </button>
                                  
                                  {payment.status === 'failed' && (
                                    <button className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                                      <CheckCircle className="w-4 h-4" />
                                      Riprova
                                    </button>
                                  )}

                                  {payment.escrowDetails.held && (
                                    <button className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors">
                                      <Shield className="w-4 h-4" />
                                      Rilascia
                                    </button>
                                  )}
                                </div>

                                <div className="text-right">
                                  <div className={`text-xl font-bold flex items-center gap-1 ${
                                    isNegative ? 'text-red-600' : 'text-emerald-600'
                                  }`}>
                                    {isNegative ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                    {isNegative ? '-' : ''}€{Math.abs(payment.amount).toLocaleString()}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    {payment.processedAt ? 
                                      `Elaborato ${new Date(payment.processedAt).toLocaleString('it-IT')}` :
                                      'In elaborazione'
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}