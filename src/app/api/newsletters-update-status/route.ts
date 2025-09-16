import { NextResponse } from 'next/server'
import { getCurrentUser } from '../../../lib/supabase-server'
import { createSupabaseServerClient } from '../../../lib/supabase-server'

export async function PATCH(request: Request) {
  try {
    // Check for admin panel authentication
    const adminAuth = request.headers.get('x-admin-auth')
    if (adminAuth === 'admin-panel') {
      // Admin panel access - skip Supabase user check
      console.log('Admin panel access granted for status update')
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

    const { id, review_status, rejection_reason } = await request.json()

    if (!id || !review_status) {
      return NextResponse.json({ success: false, error: 'Missing id or review_status' }, { status: 400 })
    }

    if (!['in_review', 'approved', 'rejected'].includes(review_status)) {
      return NextResponse.json({ success: false, error: 'Invalid review status' }, { status: 400 })
    }

    // Update newsletter review status
    const updateData: any = { 
      review_status, 
      updated_at: new Date().toISOString() 
    }
    
    // Add rejection reason if status is rejected
    if (review_status === 'rejected' && rejection_reason) {
      updateData.rejection_reason = rejection_reason
    }

    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('newsletters')
      .update(updateData)
      .eq('id', id)
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

    if (error) {
      console.error('Error updating newsletter status:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }

    console.log(`Newsletter ${id} review_status updated to ${review_status}`)

    return NextResponse.json({ 
      success: true, 
      data: data[0] 
    })
  } catch (error) {
    console.error('Error in newsletters-update-status API:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}