'use client'

import { useState } from 'react'
import {
  Settings,
  Shield,
  Bell,
  CreditCard,
  Database,
  Save,
  RotateCcw,
  Menu,
  Eye,
  EyeOff
} from 'lucide-react'
import AdminSidebar from '../../components/AdminSidebar'
import { useRequireAdmin } from '../../../hooks/useRequireAdmin'

export default function AdminSettingsPage() {
  const { isAdmin, loading: authLoading } = useRequireAdmin()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [showApiKey, setShowApiKey] = useState(false)

  const [settings, setSettings] = useState({
    general: {
      siteName: 'Frames',
      siteDescription: 'La piattaforma italiana per creator di newsletter',
      contactEmail: 'admin@newsletteritaliane.com',
      supportEmail: 'support@newsletteritaliane.com',
      maxFileSize: '10',
      defaultLanguage: 'it'
    },
    security: {
      requireEmailVerification: true,
      requirePhoneVerification: false,
      enableTwoFactorAuth: true,
      passwordMinLength: '8',
      sessionTimeout: '24',
      maxLoginAttempts: '5'
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      marketingEmails: true,
      systemAlerts: true,
      weeklyReports: true
    },
    payments: {
      platformFeePercentage: '15',
      minimumPayout: '50',
      payoutFrequency: 'weekly',
      escrowHoldDays: '7',
      refundPeriodDays: '30',
      enableCrypto: false
    },
    integrations: {
      stripeApiKey: 'sk_test_••••••••••••••••••••••••',
      paypalClientId: '••••••••••••••••••••••••',
      sendgridApiKey: 'SG.••••••••••••••••••••••••',
      analyticsId: 'GA-XXXXXXXXXX',
      facebookPixelId: 'xxxxxxxxxxxxxxxxx'
    }
  })

  const tabs = [
    { id: 'general', label: 'Generale', icon: Settings },
    { id: 'security', label: 'Sicurezza', icon: Shield },
    { id: 'notifications', label: 'Notifiche', icon: Bell },
    { id: 'payments', label: 'Pagamenti', icon: CreditCard },
    { id: 'integrations', label: 'Integrazioni', icon: Database }
  ]

  const handleSave = () => {
    // In a real app, this would make an API call to save settings
    console.log('Saving settings:', settings)
    // Show success message
  }

  const handleReset = () => {
    // Reset to default values
    console.log('Resetting to defaults')
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="flex h-screen bg-slate-50 admin-panel">
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
                <Settings className="w-6 h-6 text-red-600" />
                <h1 className="text-xl font-semibold text-slate-900">Impostazioni Sistema</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Salva Modifiche
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="flex h-full">
            {/* Settings Navigation */}
            <div className="w-64 bg-white border-r border-slate-200 p-6">
              <div className="space-y-2">
                {tabs.map(tab => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${
                        activeTab === tab.id ? 'text-red-600' : 'text-slate-400'
                      }`} />
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Settings Content */}
            <div className="flex-1 p-6">
              <div className="max-w-2xl">
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 mb-4">Impostazioni Generali</h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Nome del Sito
                          </label>
                          <input
                            type="text"
                            value={settings.general.siteName}
                            onChange={(e) => setSettings({
                              ...settings,
                              general: { ...settings.general, siteName: e.target.value }
                            })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Descrizione del Sito
                          </label>
                          <textarea
                            rows={3}
                            value={settings.general.siteDescription}
                            onChange={(e) => setSettings({
                              ...settings,
                              general: { ...settings.general, siteDescription: e.target.value }
                            })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Email di Contatto
                            </label>
                            <input
                              type="email"
                              value={settings.general.contactEmail}
                              onChange={(e) => setSettings({
                                ...settings,
                                general: { ...settings.general, contactEmail: e.target.value }
                              })}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Email di Supporto
                            </label>
                            <input
                              type="email"
                              value={settings.general.supportEmail}
                              onChange={(e) => setSettings({
                                ...settings,
                                general: { ...settings.general, supportEmail: e.target.value }
                              })}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 mb-4">Impostazioni di Sicurezza</h2>
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div>
                              <h3 className="font-medium text-slate-900">Verifica Email Obbligatoria</h3>
                              <p className="text-sm text-slate-600">Richiedi la verifica email per tutti i nuovi utenti</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.security.requireEmailVerification}
                                onChange={(e) => setSettings({
                                  ...settings,
                                  security: { ...settings.security, requireEmailVerification: e.target.checked }
                                })}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            </label>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div>
                              <h3 className="font-medium text-slate-900">Autenticazione a Due Fattori</h3>
                              <p className="text-sm text-slate-600">Abilita 2FA per account admin</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.security.enableTwoFactorAuth}
                                onChange={(e) => setSettings({
                                  ...settings,
                                  security: { ...settings.security, enableTwoFactorAuth: e.target.checked }
                                })}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            </label>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Lunghezza Minima Password
                            </label>
                            <input
                              type="number"
                              value={settings.security.passwordMinLength}
                              onChange={(e) => setSettings({
                                ...settings,
                                security: { ...settings.security, passwordMinLength: e.target.value }
                              })}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Timeout Sessione (ore)
                            </label>
                            <input
                              type="number"
                              value={settings.security.sessionTimeout}
                              onChange={(e) => setSettings({
                                ...settings,
                                security: { ...settings.security, sessionTimeout: e.target.value }
                              })}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 mb-4">Impostazioni Notifiche</h2>
                      <div className="space-y-4">
                        {[
                          { key: 'emailNotifications', label: 'Notifiche Email', desc: 'Invia notifiche via email agli utenti' },
                          { key: 'pushNotifications', label: 'Notifiche Push', desc: 'Notifiche push sul dispositivo' },
                          { key: 'smsNotifications', label: 'Notifiche SMS', desc: 'Invia notifiche via SMS per eventi critici' },
                          { key: 'systemAlerts', label: 'Alert di Sistema', desc: 'Notifiche per errori e problemi del sistema' },
                          { key: 'weeklyReports', label: 'Report Settimanali', desc: 'Invia report automatici settimanali' }
                        ].map(item => (
                          <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div>
                              <h3 className="font-medium text-slate-900">{item.label}</h3>
                              <p className="text-sm text-slate-600">{item.desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                                onChange={(e) => setSettings({
                                  ...settings,
                                  notifications: { 
                                    ...settings.notifications, 
                                    [item.key]: e.target.checked 
                                  }
                                })}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'payments' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 mb-4">Impostazioni Pagamenti</h2>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Commissione Piattaforma (%)
                            </label>
                            <input
                              type="number"
                              value={settings.payments.platformFeePercentage}
                              onChange={(e) => setSettings({
                                ...settings,
                                payments: { ...settings.payments, platformFeePercentage: e.target.value }
                              })}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Pagamento Minimo (€)
                            </label>
                            <input
                              type="number"
                              value={settings.payments.minimumPayout}
                              onChange={(e) => setSettings({
                                ...settings,
                                payments: { ...settings.payments, minimumPayout: e.target.value }
                              })}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Frequenza Pagamenti
                          </label>
                          <select
                            value={settings.payments.payoutFrequency}
                            onChange={(e) => setSettings({
                              ...settings,
                              payments: { ...settings.payments, payoutFrequency: e.target.value }
                            })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            <option value="daily">Giornaliera</option>
                            <option value="weekly">Settimanale</option>
                            <option value="monthly">Mensile</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'integrations' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 mb-4">Integrazioni API</h2>
                      <div className="space-y-4">
                        {[
                          { key: 'stripeApiKey', label: 'Stripe API Key', placeholder: 'sk_test_...' },
                          { key: 'paypalClientId', label: 'PayPal Client ID', placeholder: 'AXxxx...' },
                          { key: 'sendgridApiKey', label: 'SendGrid API Key', placeholder: 'SG.xxx...' },
                          { key: 'analyticsId', label: 'Google Analytics ID', placeholder: 'GA-XXXXXXXXXX' },
                          { key: 'facebookPixelId', label: 'Facebook Pixel ID', placeholder: 'xxxxxxxxxxxxxxxxx' }
                        ].map(item => (
                          <div key={item.key}>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              {item.label}
                            </label>
                            <div className="relative">
                              <input
                                type={item.key.includes('Key') && !showApiKey ? 'password' : 'text'}
                                value={settings.integrations[item.key as keyof typeof settings.integrations]}
                                onChange={(e) => setSettings({
                                  ...settings,
                                  integrations: { 
                                    ...settings.integrations, 
                                    [item.key]: e.target.value 
                                  }
                                })}
                                placeholder={item.placeholder}
                                className="w-full px-4 py-2 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                              />
                              {item.key.includes('Key') && (
                                <button
                                  type="button"
                                  onClick={() => setShowApiKey(!showApiKey)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
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
