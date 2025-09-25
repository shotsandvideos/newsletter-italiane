import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// Validate environment variables for server-side
const validateServerEnv = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
  }
}

// Common server configuration
const getServerSupabaseConfig = () => {
  validateServerEnv()
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  }
}

// Optimized cookie management
const createCookieHandler = (cookieStore: any) => ({
  get(name: string) {
    return cookieStore.get(name)?.value
  },
  set(name: string, value: string, options: any) {
    try {
      cookieStore.set({ name, value, ...options })
    } catch {
      // Ignore errors in Server Components - middleware handles refresh
    }
  },
  remove(name: string, options: any) {
    try {
      cookieStore.set({ name, value: '', ...options })
    } catch {
      // Ignore errors in Server Components - middleware handles refresh
    }
  },
})

/**
 * Server-side Supabase client with cookie-based auth
 * Use this in Server Components and API routes for user-specific operations
 */
export const createSupabaseServerClient = async () => {
  const cookieStore = await cookies()
  const { url, anonKey } = getServerSupabaseConfig()
  
  return createServerClient(url, anonKey, {
    cookies: createCookieHandler(cookieStore)
  })
}

/**
 * Server-side service role client (bypasses RLS)
 * Use this only for admin operations that need elevated permissions
 * ⚠️ SECURITY: Always validate user permissions before using
 */
export const createSupabaseServiceClient = () => {
  const { url, serviceKey } = getServerSupabaseConfig()
  
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for service client operations')
  }
  
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Helper function to get the current user from Supabase
export const getCurrentUser = async () => {
  const supabase = await createSupabaseServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }

  // Get the profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return { user, profile }
}
