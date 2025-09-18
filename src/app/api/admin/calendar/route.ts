import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

export async function GET(request: Request) {
  try {
    // Check for admin panel authentication
    const adminAuth = request.headers.get('x-admin-auth')
    if (adminAuth !== 'admin-panel') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')
    const year = searchParams.get('year')

    const supabase = createSupabaseServiceClient()
    
    let query = supabase
      .from('calendar_events')
      .select('*')
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
        .select('id, brand_name, sponsorship_type, product_type, campaign_start_date, campaign_end_date')
        .in('id', proposalIds)

      // Fetch newsletters  
      const { data: newsletters } = await supabase
        .from('newsletters')
        .select('id, title, author_first_name, author_last_name, author_email')
        .in('id', newsletterIds)

      // Transform the data to include additional information
      transformedEvents = events.map(event => {
        const proposal = proposals?.find(p => p.id === event.proposal_id)
        const newsletter = newsletters?.find(n => n.id === event.newsletter_id)
        
        return {
          id: event.id,
          proposal_id: event.proposal_id,
          newsletter_id: event.newsletter_id,
          user_id: event.user_id,
          event_date: event.event_date,
          title: event.title,
          description: event.description,
          status: event.status,
          brand_name: proposal?.brand_name,
          sponsorship_type: proposal?.sponsorship_type,
          product_type: proposal?.product_type,
          campaign_start_date: proposal?.campaign_start_date,
          campaign_end_date: proposal?.campaign_end_date,
          newsletter_title: newsletter?.title,
          newsletter_author: newsletter ? `${newsletter.author_first_name} ${newsletter.author_last_name}` : '',
          newsletter_email: newsletter?.author_email,
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
    console.error('Error in admin calendar API:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}