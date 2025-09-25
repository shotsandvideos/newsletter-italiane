import { createClient } from '@supabase/supabase-js'
import { ensureServerSide, validateEnvVars, validateServiceRoleKey, logSecurityEvent } from '../../lib/security-checks'

// Ensure this module only runs server-side
ensureServerSide('supabase-admin.ts')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate all required environment variables
validateEnvVars({
  NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
  SUPABASE_SERVICE_ROLE_KEY: supabaseServiceKey
})

// Additional validation for service role key
if (!validateServiceRoleKey(supabaseServiceKey!)) {
  logSecurityEvent('invalid_service_role_key', {
    keyLength: supabaseServiceKey?.length,
    containsAnon: supabaseServiceKey?.includes('anon')
  })
  
  throw new Error(
    'Invalid SUPABASE_SERVICE_ROLE_KEY: Key appears to be malformed or is an anon key. ' +
    'Ensure you are using the correct service_role key from your Supabase dashboard.'
  )
}

/**
 * Server-side Supabase client with service role privileges
 * 
 * ⚠️  CRITICAL SECURITY NOTE:
 * - This client bypasses Row Level Security (RLS)
 * - Only use in API routes and server-side code
 * - Never import this in client components
 * - Always validate user permissions before using
 */
function createSupabaseAdminClient() {
  return createClient(supabaseUrl!, supabaseServiceKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Export factory function instead of instance to prevent misuse
export const getSupabaseAdmin = createSupabaseAdminClient

// Deprecated: Keep for backward compatibility but warn about usage
export const supabaseAdmin = (() => {
  console.warn(
    'Deprecated: Direct supabaseAdmin export. Use getSupabaseAdmin() function instead.'
  )
  return createSupabaseAdminClient()
})()
