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
    
    // Get accepted proposals 
    const { data: collaborations, error } = await supabase
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
      .eq('status', 'accepted')
      .order('selected_run_date', { ascending: false })

    if (error) {
      console.error('Error fetching collaborations:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }

    // Get calendar events for these collaborations
    let calendarEvents = []
    if (collaborations && collaborations.length > 0) {
      const { data: events } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', currentUserData.user.id)
      
      calendarEvents = events || []
    }

    // Transform the data to match the expected format
    const transformedCollaborations = collaborations?.map(collab => {
      const now = new Date()
      const runDate = new Date(collab.selected_run_date)
      const endDate = new Date(collab.proposals.campaign_end_date)
      
      // Determine status based on dates
      let status = 'scheduled'
      if (runDate <= now && endDate >= now) {
        status = 'active'
      } else if (endDate < now) {
        status = 'completed'
      }

      // Find related calendar event
      const calendarEvent = calendarEvents.find(event => 
        event.proposal_id === collab.proposal_id && 
        event.newsletter_id === collab.newsletter_id
      )
      
      return {
        id: collab.id,
        proposal_id: collab.proposals.id,
        newsletter_id: collab.newsletter_id,
        brand: collab.proposals.brand_name,
        newsletter: collab.newsletters.title,
        status: status,
        sponsorship_type: collab.proposals.sponsorship_type,
        product_type: collab.proposals.product_type,
        campaign_start_date: collab.proposals.campaign_start_date,
        campaign_end_date: collab.proposals.campaign_end_date,
        selected_run_date: collab.selected_run_date,
        ideal_target_audience: collab.proposals.ideal_target_audience,
        admin_assets_images: collab.proposals.admin_assets_images,
        admin_copy_text: collab.proposals.admin_copy_text,
        admin_brief_text: collab.proposals.admin_brief_text,
        admin_tracking_links: collab.proposals.admin_tracking_links,
        calendar_event: calendarEvent || null
      }
    }) || []

    return NextResponse.json({ 
      success: true, 
      data: transformedCollaborations 
    })
  } catch (error) {
    console.error('Error in collaborations API:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}