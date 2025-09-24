import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getCurrentUser } from '../../../../../lib/supabase-server'

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

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUserData = await getCurrentUser()

    if (!currentUserData?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    if (currentUserData.profile?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const { id: proposalId } = await params
    const body = await request.json()
    console.log('Updating proposal:', proposalId, body)

    // Validate required fields
    const missingFields = []
    if (!body.brand_name) missingFields.push('brand_name')
    if (!body.sponsorship_type) missingFields.push('sponsorship_type')
    if (!body.campaign_start_date) missingFields.push('campaign_start_date')
    if (!body.campaign_end_date) missingFields.push('campaign_end_date')
    if (!body.product_type) missingFields.push('product_type')
    if (!body.ideal_target_audience) missingFields.push('ideal_target_audience')

    if (missingFields.length > 0) {
      return NextResponse.json({ 
        success: false, 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 })
    }

    const supabase = createSupabaseServiceClient()

    // Update proposal data (excluding target_newsletter_ids as that's handled separately)
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
      admin_tracking_links: body.admin_tracking_links || null,
      updated_at: new Date().toISOString()
    }

    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .update(proposalData)
      .eq('id', proposalId)
      .select()
      .single()

    if (proposalError) {
      console.error('Error updating proposal:', proposalError)
      return NextResponse.json({ success: false, error: `Database error: ${proposalError.message}` }, { status: 500 })
    }

    // Handle newsletter targets update if provided
    if (body.target_newsletter_ids && Array.isArray(body.target_newsletter_ids)) {
      // Get current proposal-newsletter relationships
      const { data: currentRelations } = await supabase
        .from('proposal_newsletters')
        .select('newsletter_id')
        .eq('proposal_id', proposalId)

      const currentNewsletterIds = currentRelations?.map(r => r.newsletter_id) || []
      const newNewsletterIds = body.target_newsletter_ids

      // Find newsletters to add and remove
      const toAdd = newNewsletterIds.filter(id => !currentNewsletterIds.includes(id))
      const toRemove = currentNewsletterIds.filter(id => !newNewsletterIds.includes(id))

      // Remove old relationships
      if (toRemove.length > 0) {
        await supabase
          .from('proposal_newsletters')
          .delete()
          .eq('proposal_id', proposalId)
          .in('newsletter_id', toRemove)
      }

      // Add new relationships
      if (toAdd.length > 0) {
        const newRelations = []
        for (const newsletterId of toAdd) {
          // Check if relationship already exists to avoid duplicates
          const { data: existingRelation } = await supabase
            .from('proposal_newsletters')
            .select('id')
            .eq('proposal_id', proposalId)
            .eq('newsletter_id', newsletterId)
            .single()

          if (!existingRelation) {
            // Get newsletter owner
            const { data: newsletter } = await supabase
              .from('newsletters')
              .select('user_id')
              .eq('id', newsletterId)
              .single()

            if (newsletter) {
              newRelations.push({
                proposal_id: proposalId,
                newsletter_id: newsletterId,
                user_id: newsletter.user_id,
                status: 'pending'
              })
            }
          }
        }

        if (newRelations.length > 0) {
          const { error: linkError } = await supabase
            .from('proposal_newsletters')
            .insert(newRelations)

          if (linkError) {
            console.error('Error updating proposal-newsletter links:', linkError)
            return NextResponse.json({ success: false, error: `Database error: ${linkError.message}` }, { status: 500 })
          }
        }
      }
    }

    return NextResponse.json({ success: true, data: proposal })
  } catch (error) {
    console.error('Error in proposals PATCH API:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
