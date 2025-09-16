'use client'

import { useAuth } from '../../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  CreditCard, 
  Euro, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Download,
  Building,
  Receipt,
  Search,
  Filter,
  MoreHorizontal,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  Wallet,
  Menu
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import Sidebar from '../../components/Sidebar'

// Real payments data - will be fetched from API
const mockPayments: any[] = []

type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'cancelled'
type PaymentType = 'earning' | 'commission' | 'refund'

// Real earnings data - will be fetched from API
const mockEarningsData: any[] = []

export default function PaymentsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [payments] = useState(mockPayments)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | PaymentStatus>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | PaymentType>('all')
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'paid'>('all')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/sign-in')
    }
  }, [authLoading, user, router])

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'paid': return 'text-slate-700 bg-slate-100 ring-slate-600/20'
      case 'pending': return 'text-slate-700 bg-slate-100 ring-slate-600/20'
      case 'overdue': return 'text-slate-700 bg-slate-100 ring-slate-600/20'
      case 'cancelled': return 'text-slate-700 bg-slate-100 ring-slate-600/20'
      default: return 'text-slate-700 bg-slate-100 ring-slate-600/20'
    }
  }

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'overdue': return <AlertCircle className="w-4 h-4" />
      case 'cancelled': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getStatusText = (status: PaymentStatus) => {
    switch (status) {
      case 'paid': return 'Pagato'
      case 'pending': return 'In attesa'
      case 'overdue': return 'Scaduto'
      case 'cancelled': return 'Cancellato'
      default: return 'Sconosciuto'
    }
  }

  const getTypeIcon = (type: PaymentType) => {
    switch (type) {
      case 'earning': return <ArrowUpRight className="w-4 h-4 text-slate-500" />
      case 'commission': return <ArrowDownRight className="w-4 h-4 text-slate-500" />
      case 'refund': return <ArrowUpRight className="w-4 h-4 text-slate-500" />
      default: return <Euro className="w-4 h-4" />
    }
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    const matchesType = typeFilter === 'all' || payment.type === typeFilter
    const matchesTab = selectedTab === 'all' || 
                      (selectedTab === 'pending' && ['pending', 'overdue'].includes(payment.status)) ||
                      (selectedTab === 'paid' && payment.status === 'paid')
    return matchesSearch && matchesStatus && matchesType && matchesTab
  })

  const stats = {
    totalEarnings: payments
      .filter(p => p.type === 'earning' && p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0),
    pendingPayments: payments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + Math.abs(p.amount), 0),
    overduePayments: payments
      .filter(p => p.status === 'overdue')
      .reduce((sum, p) => sum + Math.abs(p.amount), 0),
    thisMonth: payments
      .filter(p => p.paymentDate && new Date(p.paymentDate).getMonth() === new Date().getMonth())
      .reduce((sum, p) => sum + (p.type === 'earning' ? p.amount : 0), 0),
    commissionsTotal: Math.abs(payments
      .filter(p => p.type === 'commission' && p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0))
  }

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
      {/* Sidebar */}
      <Sidebar 
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Pagamenti</h1>
              <CreditCard className="w-5 h-5 text-slate-500" />
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4" />
                Esporta
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-600 text-white text-sm font-medium rounded-lg hover:bg-slate-700">
                <Receipt className="w-4 h-4" />
                Nuova fattura
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto px-6 py-6">
          {/* Stats Overview */}
          <div className="mb-8">
            <h2 className="text-base font-medium text-gray-900 mb-4">Panoramica finanziaria</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Wallet className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-semibold text-gray-900">€{stats.totalEarnings}</p>
                    <p className="text-sm text-gray-600">Guadagni totali</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Banknote className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-semibold text-gray-900">€{stats.thisMonth}</p>
                    <p className="text-sm text-gray-600">Questo mese</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Clock className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-semibold text-gray-900">€{stats.pendingPayments}</p>
                    <p className="text-sm text-gray-600">In attesa</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-semibold text-gray-900">€{stats.overduePayments}</p>
                    <p className="text-sm text-gray-600">Scaduti</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Left Column - Analytics */}
            <div className="space-y-6">
              {/* Earnings Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Andamento Introiti</h3>
                  <div className="flex items-center gap-2">
                    <select className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-slate-500">
                      <option>Ultimo anno</option>
                      <option>Ultimi 6 mesi</option>
                      <option>Ultimi 3 mesi</option>
                    </select>
                  </div>
                </div>
                
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockEarningsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        tickFormatter={(value) => `€${value}`}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                        formatter={(value: any, name: string) => [
                          name === 'earnings' ? `€${value}` : value,
                          name === 'earnings' ? 'Guadagni' : 'Transazioni'
                        ]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="earnings" 
                        stroke="#64748b" 
                        strokeWidth={3}
                        dot={{ fill: '#64748b', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#64748b', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Transaction Volume Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Volume Transazioni</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockEarningsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                        formatter={(value: any) => [value, 'Transazioni']}
                      />
                      <Bar 
                        dataKey="transactions" 
                        fill="#94a3b8"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Right Column - Transactions */}
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="relative flex-1 min-w-0">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cerca transazioni..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    />
                  </div>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="all">Tutti</option>
                    <option value="paid">Pagati</option>
                    <option value="pending">In attesa</option>
                    <option value="overdue">Scaduti</option>
                  </select>
                </div>
              </div>

              {/* Transactions List */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Transazioni recenti ({filteredPayments.length})
                  </h3>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {filteredPayments.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                      <CreditCard className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      <h4 className="text-base font-medium text-gray-900 mb-2">
                        Nessuna transazione trovata
                      </h4>
                      <p className="text-sm text-gray-500">
                        I tuoi pagamenti appariranno qui quando disponibili
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {filteredPayments.slice(0, 8).map((payment) => (
                        <div key={payment.id} className="px-6 py-4 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                              <div>
                                <h4 className="text-sm font-medium text-gray-900">
                                  {payment.brand}
                                </h4>
                                <p className="text-xs text-gray-500">
                                  {payment.paymentDate 
                                    ? new Date(payment.paymentDate).toLocaleDateString('it-IT')
                                    : `Scad: ${new Date(payment.dueDate).toLocaleDateString('it-IT')}`
                                  }
                                </p>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <p className={`text-sm font-semibold ${
                                payment.amount > 0 ? 'text-slate-600' : 'text-slate-500'
                              }`}>
                                {payment.amount > 0 ? '+' : ''}€{Math.abs(payment.amount)}
                              </p>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${getStatusColor(payment.status)}`}>
                                {getStatusIcon(payment.status)}
                                {getStatusText(payment.status)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {filteredPayments.length > 8 && (
                  <div className="px-6 py-4 border-t border-gray-200 text-center">
                    <button className="text-sm text-slate-600 hover:text-slate-700 font-medium">
                      Visualizza tutte le transazioni ({filteredPayments.length})
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
