import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '../../../../../lib/supabase-server'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check for admin panel authentication
    const adminAuth = request.headers.get('x-admin-auth')
    if (adminAuth !== 'admin-panel') {
      return NextResponse.json({ success: false, error: 'Unauthorized - Admin access required' }, { status: 401 })
    }

    const body = await request.json()
    const supabase = await createSupabaseServerClient()
    const newsletterId = params.id

    // Validate required fields
    if (!newsletterId) {
      return NextResponse.json({ success: false, error: 'Newsletter ID is required' }, { status: 400 })
    }

    // First check if newsletter exists and is in review status
    const { data: existingNewsletter, error: fetchError } = await supabase
      .from('newsletters')
      .select('id, review_status')
      .eq('id', newsletterId)
      .single()

    if (fetchError || !existingNewsletter) {
      return NextResponse.json({ success: false, error: 'Newsletter not found' }, { status: 404 })
    }

    // Allow editing newsletters in any status (in_review, approved, rejected)
    const allowedStatuses = ['in_review', 'approved', 'rejected']
    if (!allowedStatuses.includes(existingNewsletter.review_status)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid newsletter status for editing' 
      }, { status: 400 })
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    // Add fields that can be updated
    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.category !== undefined) updateData.category = body.category
    if (body.language !== undefined) updateData.language = body.language
    if (body.cadence !== undefined) updateData.cadence = body.cadence
    if (body.signup_url !== undefined) updateData.signup_url = body.signup_url
    if (body.open_rate !== undefined) updateData.open_rate = parseFloat(body.open_rate)
    if (body.ctr_rate !== undefined) updateData.ctr_rate = parseFloat(body.ctr_rate)
    if (body.audience_size !== undefined) updateData.audience_size = parseInt(body.audience_size)

    // Update newsletter
    const { data: newsletter, error } = await supabase
      .from('newsletters')
      .update(updateData)
      .eq('id', newsletterId)
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
      .single()

    if (error) {
      console.error('Error updating newsletter:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }

    console.log(`Admin updated newsletter ${newsletterId}`)

    return NextResponse.json({ 
      success: true, 
      data: newsletter 
    })
  } catch (error) {
    console.error('Error in admin newsletter PUT API:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}