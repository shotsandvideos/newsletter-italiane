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

    const supabase = createSupabaseServiceClient()
    
    // Get accepted proposal-newsletter relationships with selected_run_date
    const { data: acceptedProposals, error } = await supabase
      .from('proposal_newsletters')
      .select('*')
      .eq('status', 'accepted')
      .not('selected_run_date', 'is', null)
      .gte('selected_run_date', new Date().toISOString().split('T')[0])
      .order('selected_run_date', { ascending: true })

    if (error) {
      console.error('Error fetching upcoming activities:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }

    // Get proposal and newsletter data separately
    let transformedActivities = []
    if (acceptedProposals && acceptedProposals.length > 0) {
      const proposalIds = [...new Set(acceptedProposals.map(p => p.proposal_id))]
      const newsletterIds = [...new Set(acceptedProposals.map(p => p.newsletter_id))]

      // Fetch proposals
      const { data: proposals } = await supabase
        .from('proposals')
        .select('id, brand_name, sponsorship_type')
        .in('id', proposalIds)

      // Fetch newsletters  
      const { data: newsletters } = await supabase
        .from('newsletters')
        .select('id, title, author_first_name, author_last_name')
        .in('id', newsletterIds)

      // Transform the data
      transformedActivities = acceptedProposals.map(activity => {
        const proposal = proposals?.find(p => p.id === activity.proposal_id)
        const newsletter = newsletters?.find(n => n.id === activity.newsletter_id)
        
        return {
          id: activity.id,
          proposal_id: activity.proposal_id,
          newsletter_id: activity.newsletter_id,
          selected_run_date: activity.selected_run_date,
          brand_name: proposal?.brand_name,
          sponsorship_type: proposal?.sponsorship_type,
          newsletter_title: newsletter?.title,
          newsletter_author: newsletter ? `${newsletter.author_first_name} ${newsletter.author_last_name}` : '',
          created_at: activity.created_at
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      data: transformedActivities 
    })
  } catch (error) {
    console.error('Error in upcoming activities API:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}