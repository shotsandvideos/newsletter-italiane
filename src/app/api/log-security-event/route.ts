import { NextResponse } from 'next/server'
import { logSecurityEvent } from '../../../lib/security-checks'

export async function POST(request: Request) {
  try {
    const eventData = await request.json()
    
    // Validate the event data
    if (!eventData.event || typeof eventData.event !== 'string') {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid event data' 
      }, { status: 400 })
    }

    // Extract client information
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Log the security event from client
    logSecurityEvent('client_security_event', {
      originalEvent: eventData.event,
      clientIP,
      userAgent,
      timestamp: eventData.timestamp || new Date().toISOString(),
      details: eventData.details || {},
      source: 'client',
      url: eventData.url || 'unknown'
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error logging client security event:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}