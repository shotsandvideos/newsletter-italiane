'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AdminLoginRedirectPage() {
  return (
    <Suspense fallback={<RedirectFallback />}> 
      <RedirectHandler />
    </Suspense>
  )
}

function RedirectHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirectTo') ?? '/admin'

  useEffect(() => {
    const target = `/auth/sign-in?redirectTo=${encodeURIComponent(redirectPath)}`
    router.replace(target)
  }, [router, redirectPath])

  return <RedirectFallback />
}

function RedirectFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-lg font-semibold">Reindirizzamento alla pagina di accesso...</p>
        <p className="text-sm text-neutral-500">
          Se non vieni reindirizzato automaticamente,{' '}
          <a href="/auth/sign-in" className="text-primary underline">clicca qui</a>.
        </p>
      </div>
    </div>
  )
}
