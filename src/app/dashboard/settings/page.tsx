'use client'

import { useAuth } from '../../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Settings, User, Bell, Shield, CreditCard, Trash2, Save, Mail, Globe, Eye, EyeOff, Menu, Building, MapPin, Edit3, MoreHorizontal, Key, X } from 'lucide-react'
import Sidebar from '../../components/Sidebar'

interface UserSettings {
  email_notifications: boolean
  marketing_emails: boolean
  collaboration_alerts: boolean
  payment_notifications: boolean
  profile_visibility: 'public' | 'private'
  two_factor_enabled: boolean
  language: string
  timezone: string
}

export default function SettingsPage() {
  const { user, profile, loading: authLoading, updatePassword } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'payments' | 'account'>('profile')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [settings, setSettings] = useState<UserSettings>({
    email_notifications: true,
    marketing_emails: false,
    collaboration_alerts: true,
    payment_notifications: true,
    profile_visibility: 'public',
    two_factor_enabled: false,
    language: 'it',
    timezone: 'Europe/Rome'
  })
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/sign-in')
    }
  }, [authLoading, user, router])

  const handleSettingChange = (key: keyof UserSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const saveSettings = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    setPasswordError('')
    setPasswordLoading(true)

    // Validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('Tutti i campi sono obbligatori')
      setPasswordLoading(false)
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Le nuove password non coincidono')
      setPasswordLoading(false)
      return
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('La nuova password deve contenere almeno 8 caratteri')
      setPasswordLoading(false)
      return
    }

    try {
      // Use Supabase's password update method
      const { error } = await updatePassword(passwordForm.newPassword)
      
      if (error) {
        setPasswordError(error.message)
        setPasswordLoading(false)
        return
      }

      // Reset form and close modal
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowPasswordModal(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error: any) {
      console.error('Error changing password:', error)
      setPasswordError(error.errors?.[0]?.longMessage || 'Errore durante il cambio password')
    } finally {
      setPasswordLoading(false)
    }
  }

  const tabs = [
    { id: 'profile' as const, name: 'Profilo', icon: User },
    { id: 'notifications' as const, name: 'Notifiche', icon: Bell },
    { id: 'privacy' as const, name: 'Privacy', icon: Shield },
    { id: 'payments' as const, name: 'Pagamenti', icon: CreditCard },
    { id: 'account' as const, name: 'Account', icon: Settings },
  ]

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-md p-4 z-50">
          <div className="flex">
            <div className="flex-shrink-0">
              <Save className="h-5 w-5" style={{color: '#72e3ad'}} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Impostazioni salvate con successo!
              </p>
            </div>
          </div>
        </div>
      )}

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
              <Settings className="w-5 h-5 text-gray-500" />
              <h1 className="text-xl font-semibold text-gray-900">Impostazioni</h1>
            </div>
            <button
              onClick={saveSettings}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Salvataggio...' : 'Salva Modifiche'}
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-6 py-6">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Informazioni Profilo</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.firstName || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nome"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cognome
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.lastName || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Cognome"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={user?.email || ''}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        L'email non può essere modificata da qui
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fuso Orario
                      </label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => handleSettingChange('timezone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Europe/Rome">Europa/Roma (UTC+1)</option>
                        <option value="Europe/London">Europa/Londra (UTC+0)</option>
                        <option value="America/New_York">America/New York (UTC-5)</option>
                        <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Visibilità Profilo</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Profilo Pubblico</h3>
                        <p className="text-sm text-gray-500">Il tuo profilo può essere visto da brand e altri creator</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('profile_visibility', 
                          settings.profile_visibility === 'public' ? 'private' : 'public'
                        )}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.profile_visibility === 'public' ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.profile_visibility === 'public' ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferenze Notifiche</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Notifiche Email</h3>
                          <p className="text-sm text-gray-500">Ricevi notifiche via email per eventi importanti</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSettingChange('email_notifications', !settings.email_notifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.email_notifications ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.email_notifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-gray-400" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Avvisi Collaborazioni</h3>
                          <p className="text-sm text-gray-500">Notifiche per nuove opportunità di collaborazione</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSettingChange('collaboration_alerts', !settings.collaboration_alerts)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.collaboration_alerts ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.collaboration_alerts ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-gray-400" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Notifiche Pagamenti</h3>
                          <p className="text-sm text-gray-500">Aggiornamenti su pagamenti e fatture</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSettingChange('payment_notifications', !settings.payment_notifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.payment_notifications ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.payment_notifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-gray-400" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Email Marketing</h3>
                          <p className="text-sm text-gray-500">Newsletter e aggiornamenti sulla piattaforma</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSettingChange('marketing_emails', !settings.marketing_emails)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.marketing_emails ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.marketing_emails ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Privacy e Sicurezza</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-gray-400" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Autenticazione a Due Fattori</h3>
                          <p className="text-sm text-gray-500">Aggiungi un livello extra di sicurezza al tuo account</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSettingChange('two_factor_enabled', !settings.two_factor_enabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.two_factor_enabled ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.two_factor_enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Dati e Privacy</h3>
                      <div className="space-y-3">
                        <button className="text-sm text-blue-600 hover:text-blue-700">
                          Scarica i tuoi dati
                        </button>
                        <br />
                        <button className="text-sm text-blue-600 hover:text-blue-700">
                          Visualizza informativa sulla privacy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                {/* Payment Methods */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Gestisci metodi di pagamento</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Aggiungi o gestisci i tuoi dettagli di pagamento per garantire pagamenti fluidi. <a href="#" className="text-blue-600 hover:text-blue-700">Scopri di più sulle tue opzioni</a>.
                  </p>
                  
                  <div className="space-y-4">
                    {/* Stripe */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">S</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">Stripe</h3>
                          <p className="text-sm text-gray-500">Copertura mondiale delle carte.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50">
                          Gestisci
                        </button>
                        <Settings className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Bank Transfer */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                          <Building className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">Bonifico bancario</h3>
                          <p className="text-sm text-gray-500">Preferito dai grandi brand.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50">
                          Modifica
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoices */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Fatture</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Personalizza le informazioni che appaiono sulle tue fatture e note di credito.
                  </p>

                  {/* Default Billing Address */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-medium text-gray-900">Indirizzo di fatturazione predefinito</h3>
                      <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50">
                        Modifica
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Aggiorna il nome della tua organizzazione e l'indirizzo per assicurarti che le fatture siano emesse correttamente.
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">Nome organizzazione</span>
                        <span className="text-gray-500">Non fornito</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">Paese</span>
                        <span className="text-gray-500">Non fornito</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">Indirizzo</span>
                        <span className="text-gray-500">Non fornito</span>
                      </div>
                    </div>
                  </div>

                  {/* VAT/GST */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">IVA / Imposta sui beni e servizi</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Aggiungi un numero di identificazione IVA per apparire sulle fatture Partner che generi o note di credito che ricevi.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50">
                          Modifica
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">Codice fiscale</span>
                      <span className="text-gray-500">Non fornito</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Gestione Account</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Cambia Password</h3>
                      <p className="text-sm text-gray-500 mb-3">Aggiorna la password per mantenere il tuo account sicuro</p>
                      <button 
                        onClick={() => setShowPasswordModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Key className="w-4 h-4" />
                        Cambia Password
                      </button>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Lingua</h3>
                      <select
                        value={settings.language}
                        onChange={(e) => handleSettingChange('language', e.target.value)}
                        className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="it">Italiano</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-red-200 p-6">
                  <h2 className="text-lg font-semibold text-red-900 mb-4">Zona Pericolosa</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Elimina Account</h3>
                      <p className="text-sm text-gray-500 mb-3">
                        Una volta eliminato il tuo account, tutti i tuoi dati verranno rimossi permanentemente. 
                        Questa azione non può essere annullata.
                      </p>
                      <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        <Trash2 className="w-4 h-4" />
                        Elimina Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Cambia Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password Attuale
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Inserisci la password attuale"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nuova Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Inserisci la nuova password (min. 8 caratteri)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conferma Nuova Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Conferma la nuova password"
                />
              </div>

              {passwordError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                  {passwordError}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annulla
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={passwordLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {passwordLoading ? 'Aggiornamento...' : 'Cambia Password'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
