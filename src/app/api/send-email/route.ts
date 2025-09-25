import { NextResponse } from 'next/server'
import { getCurrentUser } from '../../../lib/supabase-server'
import { logger, devLog } from '../../../lib/logger'

export async function POST(request: Request) {
  try {
    console.log('🔧 Send-email API called')
    
    // Check if user is authenticated and is admin
    const currentUserData = await getCurrentUser()
    console.log('🔒 User authentication check:', {
      hasUser: !!currentUserData?.user,
      role: currentUserData?.profile?.role
    })

    if (!currentUserData?.user) {
      console.error('❌ Unauthorized: No user found')
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    if (currentUserData.profile?.role !== 'admin') {
      console.error('❌ Forbidden: User is not admin, role:', currentUserData.profile?.role)
      return NextResponse.json({ success: false, error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not configured')
      logger.error('RESEND_API_KEY not configured')
      return NextResponse.json({ success: false, error: 'Email service not configured' }, { status: 500 })
    }
    console.log('✅ RESEND_API_KEY is configured')

    const body = await request.json()
    const { to, subject, text, from } = body
    console.log('📝 Email request data:', { to, subject: subject?.substring(0, 50) + '...', from, textLength: text?.length })

    // Validate required fields
    if (!to || !subject || !text) {
      console.error('❌ Missing required fields:', { hasTo: !!to, hasSubject: !!subject, hasText: !!text })
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: to, subject, text' 
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      console.error('❌ Invalid email format:', to)
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid email format' 
      }, { status: 400 })
    }
    console.log('✅ Email validation passed')

    console.log('📨 Preparing to call Resend API')
    
    const resendPayload = {
      from: from || 'Newsletter Italiane <support@meetframes.com>',
      to: [to],
      subject: subject,
      text: text,
      headers: {
        'X-Entity-Ref-ID': `admin-communication-${Date.now()}`,
        'X-Priority': '3'
      }
    }
    
    console.log('📨 Resend API payload:', {
      ...resendPayload,
      text: text.substring(0, 100) + '...'
    })
    
    try {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resendPayload),
      })

      console.log('📨 Resend API response status:', emailResponse.status)
      console.log('📨 Resend API response headers:', Object.fromEntries(emailResponse.headers.entries()))

      if (emailResponse.ok) {
        const result = await emailResponse.json()
        console.log('✅ Resend API success:', result)
        devLog(`Email sent successfully to ${to}:`, result.id)
        
        return NextResponse.json({ 
          success: true, 
          message: 'Email sent successfully',
          emailId: result.id 
        })
      } else {
        const errorText = await emailResponse.text()
        console.error('❌ Resend API error - Status:', emailResponse.status, '- Body:', errorText)
        logger.error(`Failed to send email to ${to}:`, errorText)
        
        return NextResponse.json({ 
          success: false, 
          error: `Failed to send email: ${errorText}` 
        }, { status: 500 })
      }
    } catch (emailError) {
      console.error('❌ Resend API exception:', emailError)
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