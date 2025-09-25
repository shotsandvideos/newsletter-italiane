/**
 * Client-side security utilities
 * Safe to use in browser environments
 */

/**
 * Logs security events on the client side
 * This is safe to use in browser environments
 */
export function logClientSecurityEvent(event: string, details: Record<string, any> = {}): void {
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    event,
    ...details,
    source: 'newsletter-italiane-client',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    url: typeof window !== 'undefined' ? window.location.href : 'unknown'
  }
  
  // Log to console for development
  console.log('CLIENT_SECURITY_EVENT:', JSON.stringify(logEntry))
  
  // In production, send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to error monitoring service
    // fetch('/api/log-security-event', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(logEntry)
    // }).catch(console.error)
  }
}

/**
 * Basic validation that can be used client-side
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Sanitize user input for display
 */
export function sanitizeForDisplay(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Check if current environment is development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

/**
 * Safe error message formatting for client display
 */
export function formatErrorForUser(error: unknown): string {
  if (typeof error === 'string') {
    return error
  }
  
  if (error instanceof Error) {
    // In development, show full error. In production, show generic message
    if (isDevelopment()) {
      return error.message
    } else {
      return 'Si è verificato un errore. Riprova tra poco.'
    }
  }
  
  return 'Si è verificato un errore imprevisto.'
}