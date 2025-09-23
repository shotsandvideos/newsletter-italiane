'use client'

import { useEffect, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from './useAuth'

export function useRequireAdmin() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const isAdmin = useMemo(() => {
    return Boolean(user && profile?.role === 'admin')
  }, [user, profile?.role])

  useEffect(() => {
    if (loading) return

    console.log('useRequireAdmin - user:', !!user, 'profile:', profile, 'role:', profile?.role)

    if (!user) {
      const redirect = pathname ? encodeURIComponent(pathname) : encodeURIComponent('/admin')
      router.replace(`/auth/sign-in?redirectTo=${redirect}`)
      return
    }

    // Wait for profile to be loaded before checking role
    if (!profile) {
      console.log('Profile not yet loaded, waiting...')
      return
    }

    if (profile.role !== 'admin') {
      console.log('Profile role is not admin, redirecting to dashboard. Role:', profile.role)
      router.replace('/dashboard')
    } else {
      console.log('User is admin, access granted')
    }
  }, [loading, user, profile, pathname, router])

  return { isAdmin, loading }
}
