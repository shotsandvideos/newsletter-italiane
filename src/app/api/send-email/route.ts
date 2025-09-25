import { NextResponse } from 'next/server'
import { getCurrentUser } from '../../../lib/supabase-server'
import { logger, devLog } from '../../../lib/logger'

export async function POST(request: Request) {
  try {
    // Check if user is authenticated and is admin
    const currentUserData = await getCurrentUser()

    if (!currentUserData?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    if (currentUserData.profile?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      logger.error('RESEND_API_KEY not configured')
      return NextResponse.json({ success: false, error: 'Email service not configured' }, { status: 500 })
    }

    const body = await request.json()
    const { to, subject, text, from } = body

    // Validate required fields
    if (!to || !subject || !text) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: to, subject, text' 
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid email format' 
      }, { status: 400 })
    }

    try {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: from || 'Frames <support@meetframes.com>',
          to: [to],
          subject: subject,
          text: text,
          headers: {
            'X-Entity-Ref-ID': `admin-communication-${Date.now()}`,
            'X-Priority': '3'
          }
        }),
      })

      if (emailResponse.ok) {
        const result = await emailResponse.json()
        devLog(`Email sent successfully to ${to}:`, result.id)
        
        return NextResponse.json({ 
          success: true, 
          message: 'Email sent successfully',
          emailId: result.id 
        })
      } else {
        const errorText = await emailResponse.text()
        logger.error(`Failed to send email to ${to}:`, errorText)
        
        return NextResponse.json({ 
          success: false, 
          error: `Failed to send email: ${errorText}` 
        }, { status: 500 })
      }
    } catch (emailError) {
      logger.error(`Error calling Resend API:`, emailError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to send email via Resend service' 
      }, { status: 500 })
    }

  } catch (error) {
    logger.error('Error in send-email API:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}