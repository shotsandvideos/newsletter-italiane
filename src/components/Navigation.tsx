'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import Image from 'next/image'

const navigationItems = [
  {
    title: 'Prodotto',
    items: [
      { title: 'Funzionalità', href: '/features' },
      { title: 'Prezzi', href: '/pricing' }
    ]
  },
  {
    title: 'Risorse',
    items: [
      { title: 'Centro assistenza', href: '/dashboard/help' },
      { title: 'Blog', href: '/blog' }
    ]
  },
  {
    title: 'Azienda',
    items: [
      { title: 'Chi siamo', href: '/about' },
      { title: 'Contatti', href: '/contatti' }
    ]
  }
]

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = (title: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    setActiveDropdown(title)
  }

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 200) // 200ms delay
  }

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/frameslogo.svg?v=20250912-2"
                alt="Frames"
                width={200}
                height={45}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigationItems.map((item) => (
              <div
                key={item.title}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item.title)}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex items-center gap-1 text-slate-700 hover:text-slate-900 transition-colors font-medium">
                  {item.title}
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {/* Dropdown */}
                {activeDropdown === item.title && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-2"
                    onMouseEnter={() => handleMouseEnter(item.title)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className="block px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/auth/sign-in" 
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Accedi
            </Link>
            <Link 
              href="/auth/sign-up"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              Iscriviti
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4">
            <div className="space-y-4">
              {navigationItems.map((item) => (
                <div key={item.title}>
                  <div className="font-medium text-slate-900 px-4 py-2 text-sm uppercase tracking-wide">
                    {item.title}
                  </div>
                  <div className="space-y-1">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className="block px-6 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Mobile Auth Buttons */}
              <div className="border-t border-slate-200 pt-4 px-4 space-y-2">
                <Link
                  href="/auth/sign-in"
                  className="block w-full text-center py-2 text-slate-600 hover:text-slate-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Accedi
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="block w-full text-center py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Iscriviti
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}