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
            className="touch-target p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg smooth-interaction"
          >
            <X className="icon-inline" />
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-4 px-6 py-6 border-b border-slate-100">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-sm">
              <Shield className="icon-inline text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
              <Crown className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="sidebar-text font-semibold text-slate-900 truncate">
                Admin
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <p className="text-micro text-red-600 font-medium">Super Administrator</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="touch-target p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg smooth-interaction"
            title="Esci"
            aria-label="Esci dall'account"
          >
            <LogOut className="icon-inline" />
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
                    "touch-target group flex items-center gap-3 px-3 py-2 sidebar-text font-medium rounded-lg smooth-interaction",
                    "hover:bg-slate-50 focus:ring-2 focus:ring-slate-200 focus:outline-none",
                    isActive
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  <item.icon className="icon-inline text-slate-500" />
                  <div className="flex-1">
                    <div className="sidebar-text font-medium">{item.name}</div>
                  </div>
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
                      "touch-target group flex items-center gap-3 px-3 py-2 sidebar-text font-medium rounded-lg smooth-interaction",
                      "hover:bg-slate-50 focus:ring-2 focus:ring-slate-200 focus:outline-none",
                      isActive
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-600 hover:text-slate-900'
                    )}
                  >
                    <item.icon className="icon-inline text-slate-500" />
                    <div className="flex-1">
                      <div className="sidebar-text font-medium">{item.name}</div>
                    </div>
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
                    "touch-target group flex items-center gap-3 px-3 py-2 sidebar-text font-medium rounded-lg smooth-interaction",
                    isCreatorSwitch
                      ? "text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                      : "hover:bg-slate-50 focus:ring-2 focus:ring-slate-200 focus:outline-none",
                    isActive && !isCreatorSwitch
                      ? 'bg-slate-100 text-slate-900'
                      : !isCreatorSwitch && 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  <item.icon className={cn(
                    "icon-inline",
                    isCreatorSwitch
                      ? 'text-emerald-600'
                      : 'text-slate-500'
                  )} />
                  <div className="flex-1">
                    <div className="sidebar-text font-medium">{item.name}</div>
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