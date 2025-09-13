'use client'

import { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Mail, 
  Eye, 
  MousePointer,
  Calendar,
  Download,
  Filter,
  ChevronDown,
  Menu,
  X
} from 'lucide-react'
import { useAuth } from '../../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Sidebar from '../../components/Sidebar'

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/sign-in')
    }
  }, [authLoading, user, router])
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [selectedNewsletter, setSelectedNewsletter] = useState('all')

  const periods = [
    { value: '7d', label: 'Ultimi 7 giorni' },
    { value: '30d', label: 'Ultimi 30 giorni' },
    { value: '90d', label: 'Ultimi 3 mesi' },
    { value: '1y', label: 'Ultimo anno' }
  ]

  const newsletters = [
    { value: 'all', label: 'Tutte le newsletter' },
    { value: 'tech-weekly', label: 'Tech Weekly' },
    { value: 'startup-italia', label: 'Startup Italia' },
    { value: 'marketing-news', label: 'Marketing News' }
  ]

  const stats = [
    {
      name: 'Iscritti totali',
      value: '12,847',
      change: '+12.5%',
      changeType: 'positive',
      icon: Users,
      description: 'vs mese precedente'
    },
    {
      name: 'Newsletter inviate',
      value: '24',
      change: '+4',
      changeType: 'positive',
      icon: Mail,
      description: 'questo mese'
    },
    {
      name: 'Tasso di apertura',
      value: '68.3%',
      change: '+2.1%',
      changeType: 'positive',
      icon: Eye,
      description: 'media del periodo'
    },
    {
      name: 'Click-through rate',
      value: '4.2%',
      change: '-0.3%',
      changeType: 'negative',
      icon: MousePointer,
      description: 'media del periodo'
    }
  ]

  const chartData = {
    subscribers: [
      { date: '2024-01-01', value: 10200 },
      { date: '2024-01-08', value: 10450 },
      { date: '2024-01-15', value: 10800 },
      { date: '2024-01-22', value: 11200 },
      { date: '2024-01-29', value: 11650 },
      { date: '2024-02-05', value: 12100 },
      { date: '2024-02-12', value: 12400 },
      { date: '2024-02-19', value: 12847 }
    ],
    engagement: [
      { date: '2024-01-01', opens: 65.2, clicks: 4.8 },
      { date: '2024-01-08', opens: 67.1, clicks: 4.5 },
      { date: '2024-01-15', opens: 69.3, clicks: 4.2 },
      { date: '2024-01-22', opens: 66.8, clicks: 4.1 },
      { date: '2024-01-29', opens: 68.5, clicks: 4.3 },
      { date: '2024-02-05', opens: 70.2, clicks: 4.0 },
      { date: '2024-02-12', opens: 67.9, clicks: 4.4 },
      { date: '2024-02-19', opens: 68.3, clicks: 4.2 }
    ]
  }

  if (authLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar 
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
              <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto px-6 py-6">
          <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <p className="text-slate-600 mt-1">
                  Monitora le performance delle tue newsletter
                </p>
              </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Period Selector */}
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Newsletter Selector */}
          <div className="relative">
            <select
              value={selectedNewsletter}
              onChange={(e) => setSelectedNewsletter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {newsletters.map(newsletter => (
                <option key={newsletter.value} value={newsletter.value}>
                  {newsletter.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-sm font-medium">
            <Download className="w-4 h-4" />
            Esporta
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-slate-100 rounded-xl">
                <stat.icon className="w-5 h-5 text-slate-600" />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                stat.changeType === 'positive' 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                <TrendingUp className={`w-3 h-3 ${
                  stat.changeType === 'negative' ? 'rotate-180' : ''
                }`} />
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-sm text-slate-500 mt-1">{stat.name}</div>
              <div className="text-xs text-slate-400 mt-1">{stat.description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscribers Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Crescita Iscritti</h3>
              <p className="text-sm text-slate-500 mt-1">Andamento nel tempo</p>
            </div>
            <div className="p-2 bg-slate-100 rounded-xl">
              <Users className="w-5 h-5 text-slate-500" />
            </div>
          </div>
          
          {/* Simple chart representation */}
          <div className="relative h-64 bg-slate-50 rounded-xl p-4 flex items-end justify-between">
            {chartData.subscribers.map((point, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div 
                  className="w-8 bg-slate-500 rounded-t-sm"
                  style={{ 
                    height: `${(point.value / 13000) * 200}px`,
                    minHeight: '20px'
                  }}
                />
                <span className="text-xs text-slate-400 transform -rotate-45">
                  {new Date(point.date).toLocaleDateString('it-IT', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Engagement Rate</h3>
              <p className="text-sm text-slate-500 mt-1">Aperture e click nel tempo</p>
            </div>
            <div className="p-2 bg-slate-100 rounded-xl">
              <BarChart3 className="w-5 h-5 text-slate-500" />
            </div>
          </div>

          <div className="space-y-4">
            {/* Legend */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-sm text-slate-600">Tasso apertura</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                <span className="text-sm text-slate-600">Click-through rate</span>
              </div>
            </div>

            {/* Chart bars */}
            <div className="space-y-3">
              {chartData.engagement.slice(-5).map((point, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{new Date(point.date).toLocaleDateString('it-IT', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}</span>
                    <span>{point.opens}% / {point.clicks}%</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${point.opens}%` }}
                      />
                    </div>
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{ width: `${point.clicks * 10}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Content */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Top Newsletter</h3>
            <p className="text-sm text-slate-500 mt-1">Le più performanti del periodo</p>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
            <Filter className="w-4 h-4" />
            Filtri
          </button>
        </div>

        <div className="space-y-4">
          {[
            {
              title: 'AI Revolution: 10 Tool che Cambieranno il Tuo Business',
              date: '15 Feb 2024',
              opens: '89.2%',
              clicks: '12.4%',
              subscribers: '8,234'
            },
            {
              title: 'Startup Italiana Raccoglie 50M: La Storia di TechFlow',
              date: '12 Feb 2024',
              opens: '76.8%',
              clicks: '8.9%',
              subscribers: '7,891'
            },
            {
              title: 'Marketing Automation: Guida Completa 2024',
              date: '08 Feb 2024',
              opens: '71.5%',
              clicks: '6.7%',
              subscribers: '7,456'
            }
          ].map((newsletter, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="flex-1">
                <h4 className="font-medium text-slate-900">{newsletter.title}</h4>
                <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {newsletter.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {newsletter.subscribers} destinatari
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className="font-medium text-slate-900">{newsletter.opens}</div>
                  <div className="text-slate-500">Aperture</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-slate-900">{newsletter.clicks}</div>
                  <div className="text-slate-500">Click</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
          </div>
        </main>
      </div>
    </div>
  )
}