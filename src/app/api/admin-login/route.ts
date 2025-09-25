import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../lib/supabase-admin'
import { logSecurityEvent } from '../../../lib/security-checks'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Valid email is required' 
      }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // Find the user by email
    const { data: allUsers, error: listError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000
    })
    
    if (listError) {
      console.error('Error listing users:', listError.message)
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication service error' 
      }, { status: 500 })
    }
    
    const user = allUsers.users.find(u => u.email === email)
    
    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid credentials or insufficient permissions' 
      }, { status: 403 })
    }

    // CRITICAL: Verify user has admin role before generating magic link
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching user profile:', profileError.message)
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication service error' 
      }, { status: 500 })
    }

    if (!profile || profile.role !== 'admin') {
      logSecurityEvent('unauthorized_admin_login_attempt', {
        email,
        userId: user.id,
        userRole: profile?.role || 'unknown',
        timestamp: new Date().toISOString()
      })
      
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid credentials or insufficient permissions' 
      }, { status: 403 })
    }

    // Generate a session for the user using service role
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3006'}/admin`
      }
    })

    if (sessionError) {
      console.error('Error generating magic link:', sessionError.message)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to generate authentication link' 
      }, { status: 500 })
    }

    // Log successful admin login for security monitoring
    logSecurityEvent('admin_magic_link_generated', {
      email,
      userId: user.id,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({ 
      success: true,
      magic_link: sessionData?.properties?.action_link,
      user_id: user.id
    })

  } catch (error) {
    console.error('Error in admin-login API:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}