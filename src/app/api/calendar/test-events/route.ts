import { NextResponse } from 'next/server'
import { getCurrentUser } from '../../../../lib/supabase-server'
import { createSupabaseServerClient } from '../../../../lib/supabase-server'

export async function POST() {
  try {
    const currentUserData = await getCurrentUser()
    
    if (!currentUserData?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createSupabaseServerClient()

    // Get first newsletter for this user
    const { data: newsletter } = await supabase
      .from('newsletters')
      .select('id')
      .eq('author_email', currentUserData.user.email)
      .limit(1)
      .single()

    if (!newsletter) {
      return NextResponse.json({ 
        success: false, 
        error: 'No newsletter found for user. Please create a newsletter first.' 
      }, { status: 400 })
    }

    const testEvents = [
      {
        newsletter_id: newsletter.id,
        user_id: currentUserData.user.id,
        event_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
        title: 'Newsletter Tech Weekly - Sponsorizzazione Apple',
        description: 'Campagna sponsorizzazione per il nuovo iPhone',
        status: 'scheduled'
      },
      {
        newsletter_id: newsletter.id,
        user_id: currentUserData.user.id,
        event_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now
        title: 'Marketing Campaign - Google Partnership',
        description: 'Promozione prodotti Google Workspace',
        status: 'scheduled'
      },
      {
        newsletter_id: newsletter.id,
        user_id: currentUserData.user.id,
        event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
        title: 'Startup Event - Microsoft Partnership',
        description: 'Partnership strategica con Microsoft Azure',
        status: 'scheduled'
      }
    ]

    const { data: createdEvents, error } = await supabase
      .from('calendar_events')
      .insert(testEvents)
      .select('*')

    if (error) {
      console.error('Error creating test events:', error)
      return NextResponse.json({ 
        success: false, 
        error: `Database error: ${error.message}` 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Test calendar events created successfully',
      data: createdEvents 
    })
  } catch (error) {
    console.error('Error in test events API:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}