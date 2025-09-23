import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getCurrentUser } from '../../../../lib/supabase-server'

// Create a service role client for admin operations
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

export async function GET() {
  try {
    const currentUserData = await getCurrentUser()

    if (!currentUserData?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    if (currentUserData.profile?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const supabase = createSupabaseServiceClient()
    
    // Get all proposals with their newsletter relationships and author profiles
    const { data: proposals, error } = await supabase
      .from('proposals')
      .select(`
        *,
        proposal_newsletters (
          id,
          newsletter_id,
          user_id,
          status,
          selected_run_date,
          decline_reason,
          newsletters (
            id,
            title,
            description,
            category,
            cadence,
            language,
            author_first_name,
            author_last_name,
            author_email,
            audience_size,
            monetization,
            open_rate,
            ctr_rate,
            sponsorship_price
          )
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching proposals:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      data: proposals || [] 
    })
  } catch (error) {
    console.error('Error in proposals API:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const currentUserData = await getCurrentUser()

    if (!currentUserData?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    if (currentUserData.profile?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    console.log('Received proposal data:', body)

    // Validate required fields
    const missingFields = []
    if (!body.brand_name) missingFields.push('brand_name')
    if (!body.sponsorship_type) missingFields.push('sponsorship_type')
    if (!body.campaign_start_date) missingFields.push('campaign_start_date')
    if (!body.campaign_end_date) missingFields.push('campaign_end_date')
    if (!body.product_type) missingFields.push('product_type')
    if (!body.ideal_target_audience) missingFields.push('ideal_target_audience')
    if (!body.target_newsletter_ids || !Array.isArray(body.target_newsletter_ids) || body.target_newsletter_ids.length === 0) {
      missingFields.push('target_newsletter_ids')
    }

    if (missingFields.length > 0) {
      return NextResponse.json({ 
        success: false, 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 })
    }

    const supabase = createSupabaseServiceClient()

    // Create proposal (without status since it's now handled per newsletter)
    const proposalData = {
      brand_name: body.brand_name.trim(),
      sponsorship_type: body.sponsorship_type.trim(),
      campaign_start_date: body.campaign_start_date,
      campaign_end_date: body.campaign_end_date,
      product_type: body.product_type.trim(),
      ideal_target_audience: body.ideal_target_audience.trim(),
      admin_copy_text: body.admin_copy_text?.trim() || null,
      admin_brief_text: body.admin_brief_text?.trim() || null,
      admin_assets_images: body.admin_assets_images || null,
      admin_tracking_links: body.admin_tracking_links || null
    }

    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .insert(proposalData)
      .select()
      .single()

    if (proposalError) {
      console.error('Error creating proposal:', proposalError)
      return NextResponse.json({ success: false, error: `Database error: ${proposalError.message}` }, { status: 500 })
    }

    // Create proposal-newsletter relationships
    const proposalNewsletters = []
    for (const newsletterId of body.target_newsletter_ids) {
      // Get newsletter owner
      const { data: newsletter } = await supabase
        .from('newsletters')
        .select('user_id')
        .eq('id', newsletterId)
        .single()

      if (newsletter) {
        proposalNewsletters.push({
          proposal_id: proposal.id,
          newsletter_id: newsletterId,
          user_id: newsletter.user_id,
          status: 'pending'
        })
      }
    }

    if (proposalNewsletters.length > 0) {
      const { error: linkError } = await supabase
        .from('proposal_newsletters')
        .insert(proposalNewsletters)

      if (linkError) {
        console.error('Error creating proposal-newsletter links:', linkError)
        // Clean up the proposal if linking failed
        await supabase.from('proposals').delete().eq('id', proposal.id)
        return NextResponse.json({ success: false, error: `Database error: ${linkError.message}` }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, data: { ...proposal, target_newsletters: proposalNewsletters.length } })
  } catch (error) {
    console.error('Error in proposals POST API:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
