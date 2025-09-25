/**
 * Security utility functions and runtime checks
 */

/**
 * Ensures a function/module only runs on the server side
 * Throws an error if called on the client side
 */
export function ensureServerSide(moduleName: string): void {
  if (typeof window !== 'undefined') {
    throw new Error(
      `Security Error: ${moduleName} can only be used server-side. ` +
      `This module contains sensitive operations that must not run in the browser.`
    )
  }
}

/**
 * Validates that required environment variables are present
 * Throws an error with specific missing variables
 */
export function validateEnvVars(requiredVars: Record<string, string | undefined>): void {
  const missing = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key, _]) => key)

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
      `Please check your .env file and ensure all required variables are set.`
    )
  }
}

/**
 * Checks if a string looks like a Supabase service role key
 * Service role keys should not contain 'anon' and should be longer
 */
export function validateServiceRoleKey(key: string): boolean {
  if (!key || key.length < 100) {
    return false
  }
  
  // Service role keys should not contain 'anon'
  if (key.includes('anon')) {
    return false
  }
  
  return true
}

/**
 * Logs security events for monitoring
 */
export function logSecurityEvent(event: string, details: Record<string, any> = {}): void {
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    event,
    ...details,
    source: 'newsletter-italiane-security'
  }
  
  // In production, this should go to a proper logging service
  console.log('SECURITY_EVENT:', JSON.stringify(logEntry))
}