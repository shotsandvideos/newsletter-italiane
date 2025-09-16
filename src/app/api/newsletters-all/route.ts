import { NextResponse } from 'next/server'
import { getCurrentUser } from '../../../lib/supabase-server'
import { createSupabaseServerClient } from '../../../lib/supabase-server'

export async function GET(request: Request) {
  try {
    // Check for admin panel authentication
    const adminAuth = request.headers.get('x-admin-auth')
    if (adminAuth === 'admin-panel') {
      // Admin panel access - skip Supabase user check
      console.log('Admin panel access granted')
    } else {
      // Regular Supabase user access
      const currentUserData = await getCurrentUser()
      
      if (!currentUserData?.user) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
      }

      // Check if user is admin
      const supabase = await createSupabaseServerClient()
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUserData.user.id)
        .single()

      if (profile?.role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Forbidden - Admin access required' }, { status: 403 })
      }
    }
    
    // Get all newsletters with new field structure
    const supabase = await createSupabaseServerClient()
    const { data: newsletters, error } = await supabase
      .from('newsletters')
      .select(`
        id,
        user_id,
        title,
        description,
        category,
        language,
        signup_url,
        cadence,
        audience_size,
        monetization,
        contact_email,
        linkedin_profile,
        open_rate,
        ctr_rate,
        sponsorship_price,
        review_status,
        rejection_reason,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching newsletters:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }

    // Get profile data for each newsletter
    const newslettersWithProfiles = await Promise.all(
      (newsletters || []).map(async (newsletter) => {
        const { data: authorProfile } = await supabase
          .from('profiles')
          .select('email, first_name, last_name')
          .eq('id', newsletter.user_id)
          .single()
        
        return {
          ...newsletter,
          author: authorProfile
        }
      })
    )

    console.log(`Found ${newslettersWithProfiles?.length || 0} total newsletters`)

    return NextResponse.json({ 
      success: true, 
      data: newslettersWithProfiles || [],
      count: newslettersWithProfiles?.length || 0 
    })
  } catch (error) {
    console.error('Error in newsletters-all API:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}