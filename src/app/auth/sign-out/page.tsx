'use client'

import { useEffect } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import { LoadingSpinner } from '../../components/ui/design-system'

export default function SignOutPage() {
  const { signOut } = useAuth()

  useEffect(() => {
    signOut()
  }, [signOut])

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