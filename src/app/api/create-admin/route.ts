import { NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '../../../lib/supabase-server'

export async function POST(request: Request) {
  try {
    const { email, password, first_name, last_name } = await request.json()

    if (!email || !password || !first_name || !last_name) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    const supabase = createSupabaseServiceClient()

    // Try to create user, if exists we'll update it
    let userData = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Mark email as confirmed
      user_metadata: {
        first_name,
        last_name,
        role: 'admin'
      }
    })

    // If user already exists, get their info and update them
    if (userData.error && userData.error.message.includes('already been registered')) {
      console.log('User exists, trying to find and update...')
      
      // List users and find the admin user
      const { data: allUsers, error: listError } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1000
      })
      
      if (listError) {
        console.error('Error listing users:', listError)
        return NextResponse.json({ 
          success: false, 
          error: listError.message 
        }, { status: 500 })
      }
      
      const existingUser = allUsers.users.find(u => u.email === email)
      
      if (existingUser) {
        // Update existing user to confirm email and set metadata
        userData = await supabase.auth.admin.updateUserById(existingUser.id, {
          email_confirm: true,
          user_metadata: {
            first_name,
            last_name,
            role: 'admin'
          }
        })
        console.log('Updated existing user:', existingUser.id)
      } else {
        return NextResponse.json({ 
          success: false, 
          error: 'User exists but could not be found for update' 
        }, { status: 500 })
      }
    } else {
      console.log('Created new user')
    }

    if (userData.error) {
      console.error('Error with admin user:', userData.error)
      return NextResponse.json({ 
        success: false, 
        error: userData.error.message 
      }, { status: 500 })
    }

    // Create admin profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userData.data.user.id,
        email: userData.data.user.email,
        first_name,
        last_name,
        role: 'admin',
        is_active: true
      })

    if (profileError) {
      console.error('Error creating admin profile:', profileError)
      return NextResponse.json({ 
        success: false, 
        error: profileError.message 
      }, { status: 500 })
    }

    // Generate session for the user
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3006'}/admin`
      }
    })

    if (sessionError) {
      console.error('Error generating session:', sessionError)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Admin user created successfully',
      user_id: userData.data.user.id,
      magic_link: sessionData?.properties?.action_link
    })

  } catch (error) {
    console.error('Error in create-admin API:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}