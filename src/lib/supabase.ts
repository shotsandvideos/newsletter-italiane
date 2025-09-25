import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

// Validate environment variables
const validateEnv = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
  }
}

// Common Supabase configuration
const getSupabaseConfig = () => {
  validateEnv()
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  }
}

// Optimized auth configuration for client-side
const CLIENT_AUTH_CONFIG = {
  flowType: 'pkce' as const,
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
  storage: typeof window !== 'undefined' ? window.localStorage : undefined
}

/**
 * Client-side Supabase client with optimized configuration
 * Use this in React components and client-side code
 */
export const createSupabaseClient = () => {
  const { url, anonKey } = getSupabaseConfig()
  return createBrowserClient(url, anonKey, {
    auth: CLIENT_AUTH_CONFIG
  })
}

/**
 * Legacy client for backward compatibility
 * @deprecated Use createSupabaseClient() instead
 */
export const supabase = createSupabaseClient()

/**
 * Simple client for basic operations (without SSR support)
 * Use only when you need basic Supabase functionality without auth state management
 */
export const createSimpleSupabaseClient = () => {
  const { url, anonKey } = getSupabaseConfig()
  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          username: string | null
          avatar_url: string | null
          role: 'creator' | 'admin'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          username?: string | null
          avatar_url?: string | null
          role?: 'creator' | 'admin'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          username?: string | null
          avatar_url?: string | null
          role?: 'creator' | 'admin'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      newsletters: {
        Row: {
          id: string
          user_id: string
          // Legacy fields (keeping for backward compatibility)
          name?: string | null
          website?: string | null
          frequency?: string | null
          price?: number | null
          subscribers?: number | null
          status?: 'pending' | 'approved' | 'rejected' | null
          // New standardized fields
          title: string
          description: string
          category: string
          language: string
          signup_url: string
          cadence: string | null
          audience_size: number
          monetization: string | null
          contact_email: string
          linkedin_profile: string | null
          open_rate: number
          ctr_rate: number
          sponsorship_price: number
          author_first_name: string | null
          author_last_name: string | null
          author_email: string
          review_status: 'in_review' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          // Legacy fields (optional for backward compatibility)
          name?: string | null
          website?: string | null
          frequency?: string | null
          price?: number | null
          subscribers?: number | null
          status?: 'pending' | 'approved' | 'rejected' | null
          // New standardized fields
          title: string
          description: string
          category: string
          language?: string
          signup_url: string
          cadence?: string | null
          audience_size?: number
          monetization?: string | null
          contact_email: string
          linkedin_profile?: string | null
          open_rate?: number
          ctr_rate?: number
          sponsorship_price?: number
          author_first_name?: string | null
          author_last_name?: string | null
          author_email: string
          review_status?: 'in_review' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          // Legacy fields
          name?: string | null
          website?: string | null
          frequency?: string | null
          price?: number | null
          subscribers?: number | null
          status?: 'pending' | 'approved' | 'rejected' | null
          // New standardized fields
          title?: string
          description?: string
          category?: string
          language?: string
          signup_url?: string
          cadence?: string | null
          audience_size?: number
          monetization?: string | null
          contact_email?: string
          linkedin_profile?: string | null
          open_rate?: number
          ctr_rate?: number
          sponsorship_price?: number
          author_first_name?: string | null
          author_last_name?: string | null
          author_email?: string
          review_status?: 'in_review' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}