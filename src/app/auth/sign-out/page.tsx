'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../hooks/useAuth'
import { LoadingSpinner } from '../../components/ui/design-system'

export default function SignOutPage() {
  const { signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Call signOut immediately
    const performSignOut = async () => {
      await signOut()
    }
    
    performSignOut()
    
    // Fallback redirect after 2 seconds if signOut doesn't redirect
    const timeout = setTimeout(() => {
      router.push('/')
    }, 2000)
    
    return () => clearTimeout(timeout)
  }, [router, signOut])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <div className="text-center">
        <LoadingSpinner className="mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Disconnessione in corso...
        </h2>
        <p className="text-slate-600">
          Verrai reindirizzato alla homepage
        </p>
      </div>
    </div>
  )
}
