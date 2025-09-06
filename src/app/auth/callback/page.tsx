'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '../../../lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const supabase = createSupabaseClient()
        
        // Gestisce il callback OAuth
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error during OAuth callback:', error)
          router.push('/auth/sign-in?error=' + encodeURIComponent(error.message))
          return
        }

        if (data.session) {
          // L'utente è stato autenticato con successo
          router.push('/dashboard')
        } else {
          // Nessuna sessione trovata
          router.push('/auth/sign-in')
        }
      } catch (error: any) {
        console.error('Unexpected error during OAuth callback:', error)
        router.push('/auth/sign-in?error=' + encodeURIComponent('Si è verificato un errore durante l\'autenticazione'))
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
        <h2 className="mt-6 text-center text-xl font-semibold text-gray-900">
          Completando l'autenticazione...
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ti stiamo reindirizzando alla dashboard
        </p>
      </div>
    </div>
  )
}