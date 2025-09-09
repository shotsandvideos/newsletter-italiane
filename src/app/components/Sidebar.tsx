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
  Inbox,
  Shield,
  CheckCircle,
  BarChart3,
  ShoppingBag,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../lib/utils'

interface SidebarProps {
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Inbox', href: '/dashboard/inbox', icon: Inbox },
  { name: 'Newsletter', href: '/dashboard/newsletters', icon: Mail },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Marketplace', href: '/dashboard/marketplace', icon: ShoppingBag },
  { name: 'Collaborazioni', href: '/dashboard/collaborations', icon: Users },
  { name: 'Pagamenti', href: '/dashboard/payments', icon: CreditCard },
  { name: 'Calendario', href: '/dashboard/calendar', icon: Calendar },
]

const settingsNavigation = [
  { name: 'Impostazioni', href: '/dashboard/settings', icon: Settings },
]

const bottomNavigation = [
  { name: 'Aiuto', href: '/dashboard/help', icon: HelpCircle },
]

export default function Sidebar({ isMobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname()
  const { user, profile } = useAuth()
  
  // Check if user is admin
  const isAdmin = profile?.role === 'admin'

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
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-semibold">
                {profile?.first_name?.charAt(0) || user?.email?.charAt(0) || 'C'}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
              <CheckCircle className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-900 truncate">
                {profile?.first_name && profile?.last_name 
                  ? `${profile.first_name} ${profile.last_name}` 
                  : profile?.first_name 
                    || user?.email?.split('@')[0] 
                    || 'Creator'}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <p className="text-xs text-emerald-600 font-medium">Creator Attivo</p>
            </div>
          </div>
          <Link
            href="/auth/sign-out"
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Esci"
          >
            <LogOut className="w-4 h-4" />
          </Link>
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
                    "group flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200",
                    "hover:bg-slate-50",
                    isActive
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  <item.icon className="w-4 h-4 text-slate-500" />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
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
                      "group flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200",
                      "hover:bg-slate-50",
                      isActive
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-600 hover:text-slate-900'
                    )}
                  >
                    <item.icon className="w-4 h-4 text-slate-500" />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-100">
          {/* Admin Access */}
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2 mb-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Shield className="w-4 h-4 text-slate-500" />
              <div className="flex-1">
                <div className="font-medium">Admin Panel</div>
              </div>
            </Link>
          )}

          {/* Help Section */}
          <div className="space-y-2">
            {bottomNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200",
                    "hover:bg-slate-50",
                    isActive
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  <item.icon className="w-4 h-4 text-slate-500" />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
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
