'use client'

import Link from 'next/link'
import { Home, ArrowLeft, Mail } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo */}
        <div className="mb-8">
          <Link href="/" className="text-3xl font-bold text-emerald-600">
            Frames
          </Link>
        </div>
        
        {/* 404 Illustration */}
        <div className="mb-12">
          <div className="relative mx-auto w-80 h-80 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl font-bold text-emerald-200 mb-4">404</div>
              <Mail className="w-16 h-16 text-emerald-400 mx-auto opacity-60" />
            </div>
            
            {/* Floating elements */}
            <div className="absolute top-12 left-16 w-4 h-4 bg-emerald-300 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="absolute top-20 right-20 w-3 h-3 bg-teal-300 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-16 left-20 w-5 h-5 bg-emerald-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-24 right-16 w-2 h-2 bg-teal-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '1.5s' }}></div>
          </div>
        </div>
        
        {/* Error Message */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Oops! Pagina Non Trovata
          </h1>
          <p className="text-lg text-slate-600 mb-6">
            La pagina che stai cercando non esiste o è stata spostata. 
            Ma non preoccuparti, abbiamo tante altre cose interessanti da mostrarti!
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold"
          >
            <Home className="mr-2 w-5 h-5" />
            Torna alla Homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-semibold"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Pagina Precedente
          </button>
        </div>
        
        {/* Quick Links */}
        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">
            Pagine Popolari
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/features"
              className="p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow text-center"
            >
              <div className="text-slate-700 font-medium">Funzionalità</div>
            </Link>
            <Link
              href="/pricing"
              className="p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow text-center"
            >
              <div className="text-slate-700 font-medium">Prezzi</div>
            </Link>
            <Link
              href="/blog"
              className="p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow text-center"
            >
              <div className="text-slate-700 font-medium">Blog</div>
            </Link>
            <Link
              href="/contatti"
              className="p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow text-center"
            >
              <div className="text-slate-700 font-medium">Contatti</div>
            </Link>
          </div>
        </div>
        
        {/* Help Text */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 mb-4">
            Hai bisogno di aiuto? Il nostro team è sempre pronto ad assisterti.
          </p>
          <Link
            href="/contatti"
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            <Mail className="mr-2 w-4 h-4" />
            Contatta il Supporto
          </Link>
        </div>
      </div>
    </div>
  )
}
