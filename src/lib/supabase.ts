import { createBrowserClient } from '@supabase/ssr'

// Client-side Supabase client
export const createSupabaseClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Browser client for client components
export const supabase = createSupabaseClient()

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
          creator_id: string
          name: string
          description: string
          category: string
          website: string | null
          frequency: string
          price: number | null
          subscribers: number
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          name: string
          description: string
          category: string
          website?: string | null
          frequency: string
          price?: number | null
          subscribers?: number
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          name?: string
          description?: string
          category?: string
          website?: string | null
          frequency?: string
          price?: number | null
          subscribers?: number
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}