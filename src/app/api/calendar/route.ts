import { NextResponse } from 'next/server'
import { getCurrentUser } from '../../../lib/supabase-server'
import { createSupabaseServerClient } from '../../../lib/supabase-server'

export async function GET(request: Request) {
  try {
    const currentUserData = await getCurrentUser()
    
    if (!currentUserData?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')
    const year = searchParams.get('year')

    const supabase = await createSupabaseServerClient()
    
    let query = supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', currentUserData.user.id)
      .order('event_date', { ascending: true })

    // Filter by month/year if provided
    if (month && year) {
      const startDate = `${year}-${month.padStart(2, '0')}-01`
      // Get the last day of the month
      const lastDayOfMonth = new Date(parseInt(year), parseInt(month), 0).getDate()
      const endDate = `${year}-${month.padStart(2, '0')}-${lastDayOfMonth.toString().padStart(2, '0')}`
      query = query.gte('event_date', startDate).lte('event_date', endDate)
    }

    const { data: events, error } = await query

    if (error) {
      console.error('Error fetching calendar events:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }

    // Get proposal and newsletter data separately
    let transformedEvents = []
    if (events && events.length > 0) {
      const proposalIds = [...new Set(events.map(e => e.proposal_id))]
      const newsletterIds = [...new Set(events.map(e => e.newsletter_id))]

      // Fetch proposals
      const { data: proposals } = await supabase
        .from('proposals')
        .select('id, brand_name, sponsorship_type, product_type')
        .in('id', proposalIds)

      // Fetch newsletters  
      const { data: newsletters } = await supabase
        .from('newsletters')
        .select('id, title')
        .in('id', newsletterIds)

      // Transform the data to include additional information
      transformedEvents = events.map(event => {
        const proposal = proposals?.find(p => p.id === event.proposal_id)
        const newsletter = newsletters?.find(n => n.id === event.newsletter_id)
        
        return {
          id: event.id,
          proposal_id: event.proposal_id,
          newsletter_id: event.newsletter_id,
          event_date: event.event_date,
          title: event.title,
          description: event.description,
          status: event.status,
          brand_name: proposal?.brand_name,
          sponsorship_type: proposal?.sponsorship_type,
          product_type: proposal?.product_type,
          newsletter_title: newsletter?.title,
          created_at: event.created_at,
          updated_at: event.updated_at
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      data: transformedEvents 
    })
  } catch (error) {
    console.error('Error in calendar API:', error)
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
    const { event_id, status } = body

    if (!event_id || !status) {
      return NextResponse.json({ 
        success: false, 
        error: 'Event ID and status are required' 
      }, { status: 400 })
    }

    if (!['scheduled', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid status' 
      }, { status: 400 })
    }

    const supabase = await createSupabaseServerClient()

    // Check if event exists and user owns it
    const { data: existingEvent } = await supabase
      .from('calendar_events')
      .select('user_id')
      .eq('id', event_id)
      .single()

    if (!existingEvent || existingEvent.user_id !== currentUserData.user.id) {
      return NextResponse.json({ success: false, error: 'Event not found or unauthorized' }, { status: 404 })
    }

    // Update event status
    const { data: updatedEvent, error } = await supabase
      .from('calendar_events')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', event_id)
      .select('*')
      .single()

    if (error) {
      console.error('Error updating calendar event:', error)
      return NextResponse.json({ success: false, error: `Database error: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: updatedEvent })
  } catch (error) {
    console.error('Error in calendar PATCH API:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}