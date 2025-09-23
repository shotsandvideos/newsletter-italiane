import { NextResponse } from 'next/server'
import { getCurrentUser } from '../../../lib/supabase-server'
import { createSupabaseServerClient } from '../../../lib/supabase-server'

export async function GET() {
  try {
    const currentUserData = await getCurrentUser()
    
    if (!currentUserData?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createSupabaseServerClient()
    
    // Get proposals targeted to this user's newsletters
    const { data: proposalNewsletters, error } = await supabase
      .from('proposal_newsletters')
      .select(`
        *,
        proposals (
          id,
          brand_name,
          sponsorship_type,
          campaign_start_date,
          campaign_end_date,
          product_type,
          ideal_target_audience,
          admin_assets_images,
          admin_copy_text,
          admin_brief_text,
          admin_tracking_links,
          created_at
        ),
        newsletters (
          id,
          title,
          author_first_name,
          author_last_name,
          author_email
        )
      `)
      .eq('user_id', currentUserData.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching proposals:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }

    // Transform the data to match the expected format
    const proposals = proposalNewsletters?.map(pn => ({
      id: pn.proposals.id,
      proposal_newsletter_id: pn.id,
      newsletter_id: pn.newsletter_id,
      newsletter_title: pn.newsletters?.title ?? '',
      link_status: pn.status,
      link_selected_run_date: pn.selected_run_date,
      link_decline_reason: pn.decline_reason,
      ...pn.proposals
    })) || []

    return NextResponse.json({ 
      success: true, 
      data: proposals 
    })
  } catch (error) {
    console.error('Error in proposals API:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const currentUserData = await getCurrentUser()
    
    if (!currentUserData?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { proposal_newsletter_id, action, selected_run_date, decline_reason } = body

    if (!proposal_newsletter_id || !action) {
      return NextResponse.json({ 
        success: false, 
        error: 'Proposal Newsletter ID and action are required' 
      }, { status: 400 })
    }

    if (action === 'accept' && !selected_run_date) {
      return NextResponse.json({ 
        success: false, 
        error: 'Selected run date is required for acceptance' 
      }, { status: 400 })
    }

    if (action === 'reject' && !decline_reason) {
      return NextResponse.json({ 
        success: false, 
        error: 'Decline reason is required for rejection' 
      }, { status: 400 })
    }

    const supabase = await createSupabaseServerClient()

    // Check if proposal-newsletter relationship exists and is pending
    const { data: existingProposalNewsletter } = await supabase
      .from('proposal_newsletters')
      .select('status, user_id, proposal_id, newsletter_id')
      .eq('id', proposal_newsletter_id)
      .single()

    if (!existingProposalNewsletter || existingProposalNewsletter.status !== 'pending') {
      return NextResponse.json({ success: false, error: 'Proposal not found or not available' }, { status: 404 })
    }

    // Verify user owns this newsletter
    if (existingProposalNewsletter.user_id !== currentUserData.user.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    // Build update data
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (action === 'accept') {
      updateData.status = 'accepted'
      updateData.selected_run_date = selected_run_date
    } else if (action === 'reject') {
      updateData.status = 'rejected'
      updateData.decline_reason = decline_reason.trim()
    }

    // Update proposal-newsletter relationship
    const { data: updatedProposalNewsletter, error } = await supabase
      .from('proposal_newsletters')
      .update(updateData)
      .eq('id', proposal_newsletter_id)
      .select(`
        *,
        proposals (*),
        newsletters (*)
      `)
      .single()

    if (error) {
      console.error('Error updating proposal:', error)
      return NextResponse.json({ success: false, error: `Database error: ${error.message}` }, { status: 500 })
    }

    // If accepted, create calendar event
    if (action === 'accept') {
      const calendarEvent = {
        proposal_id: existingProposalNewsletter.proposal_id,
        newsletter_id: existingProposalNewsletter.newsletter_id,
        user_id: currentUserData.user.id,
        event_date: selected_run_date,
        title: `Campagna ${updatedProposalNewsletter.proposals.brand_name}`,
        description: `${updatedProposalNewsletter.proposals.sponsorship_type} - ${updatedProposalNewsletter.proposals.product_type}`,
        status: 'scheduled'
      }

      const { error: calendarError } = await supabase
        .from('calendar_events')
        .insert(calendarEvent)

      if (calendarError) {
        console.error('Error creating calendar event:', calendarError)
        // Don't fail the whole operation for calendar error
      }
    }

    return NextResponse.json({ success: true, data: updatedProposalNewsletter })
  } catch (error) {
    console.error('Error in proposals PATCH API:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
