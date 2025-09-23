import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const createSupabaseServiceClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    const supabase = createSupabaseServiceClient()

    // Find the user by email
    const { data: allUsers, error: listError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000
    })
    
    if (listError) {
      return NextResponse.json({ 
        success: false, 
        error: listError.message 
      }, { status: 500 })
    }
    
    const user = allUsers.users.find(u => u.email === email)
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 })
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
      console.error('Error generating session:', sessionError)
      return NextResponse.json({ 
        success: false, 
        error: sessionError.message 
      }, { status: 500 })
    }

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