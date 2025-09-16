'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Mail, 
  Calendar, 
  CreditCard, 
  Users, 
  Settings,
  HelpCircle,
  X,
  LogOut,
  Shield,
  Inbox,
  HandHeart,
  FileText,
  Crown,
} from 'lucide-react'
// import { useAuth } from '../../hooks/useAuth' // Removed for localStorage admin
import { cn } from '../../lib/utils'

interface AdminSidebarProps {
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home, description: 'Panoramica generale' },
  { name: 'Inbox', href: '/admin/inbox', icon: Inbox, description: 'Comunicazioni autori' },
  { name: 'Newsletter', href: '/admin/newsletters', icon: Mail, description: 'Gestione contenuti' },
  { name: 'Proposte', href: '/admin/proposte', icon: HandHeart, description: 'Collaborazioni e partnership' },
  { name: 'Pagamenti', href: '/admin/pagamenti', icon: CreditCard, description: 'Escrow e transazioni' },
  { name: 'Calendario', href: '/admin/calendario', icon: Calendar, description: 'Scadenze e monitoring' },
  { name: 'Autori', href: '/admin/users', icon: Users, description: 'Gestione creator' },
]

const settingsNavigation = [
  { name: 'Impostazioni', href: '/admin/settings', icon: Settings, description: 'Configurazioni sistema' },
]

const bottomNavigation = [
  { name: 'Dashboard Creator', href: '/dashboard', icon: FileText, description: 'Vista creator' },
]

export default function AdminSidebar({ isMobileOpen = false, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname()
  
  const handleSignOut = async () => {
    // Remove localStorage admin session
    localStorage.removeItem('adminSession')
    window.location.href = '/admin/login'
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 transform bg-white border-r border-slate-200 transition-all duration-300 ease-out lg:relative lg:translate-x-0 lg:z-0",
        "shadow-xl lg:shadow-none",
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Mobile Close Button */}
        <div className="flex justify-end p-4 lg:hidden">
          <button
            onClick={onMobileClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-4 px-6 py-6 border-b border-slate-100">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-sm">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
              <Crown className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-900 truncate">
                Admin
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <p className="text-xs text-red-600 font-medium">Super Administrator</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Esci"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    "hover:bg-slate-50",
                    isActive
                      ? 'bg-red-50 text-red-700 shadow-sm border border-red-100'
                      : 'text-slate-700 hover:text-slate-900'
                  )}
                >
                  <item.icon className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? 'text-red-600' : 'text-slate-500 group-hover:text-slate-700'
                  )} />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.name}</div>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-6 bg-red-500 rounded-full"></div>
                  )}
                </Link>
              )
            })}
          </div>
          
          {/* Settings Section */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="space-y-2">
              {settingsNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                      "hover:bg-slate-50",
                      isActive
                        ? 'bg-red-50 text-red-700 shadow-sm border border-red-100'
                        : 'text-slate-700 hover:text-slate-900'
                    )}
                  >
                    <item.icon className={cn(
                      "w-4 h-4 transition-colors",
                      isActive ? 'text-red-600' : 'text-slate-500 group-hover:text-slate-700'
                    )} />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{item.name}</div>
                    </div>
                    {isActive && (
                      <div className="w-1.5 h-6 bg-red-500 rounded-full"></div>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-100">
          {/* Help & Creator Switch */}
          <div className="space-y-2">
            {bottomNavigation.map((item) => {
              const isActive = pathname === item.href
              const isCreatorSwitch = item.name === 'Dashboard Creator'
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    isCreatorSwitch
                      ? "text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100"
                      : "hover:bg-slate-50",
                    isActive && !isCreatorSwitch
                      ? 'bg-slate-100 text-slate-900'
                      : !isCreatorSwitch && 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  <item.icon className={cn(
                    "w-4 h-4 transition-colors",
                    isCreatorSwitch
                      ? 'text-emerald-600'
                      : isActive 
                      ? 'text-slate-700' 
                      : 'text-slate-500 group-hover:text-slate-700'
                  )} />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.name}</div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}