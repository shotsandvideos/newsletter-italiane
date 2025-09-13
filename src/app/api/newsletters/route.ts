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
    
    // Get newsletters for the current user
    const { data: newsletters, error } = await supabase
      .from('newsletters')
      .select('*')
      .eq('user_id', currentUserData.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching newsletters:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }

    // Map English database field names back to Italian field names for frontend
    const mappedNewsletters = newsletters?.map(newsletter => ({
      ...newsletter,
      nome_newsletter: newsletter.name,
      descrizione: newsletter.description,
      categoria: newsletter.category,
      url_archivio: newsletter.website,
      frequenza_invio: newsletter.frequency,
      prezzo_sponsorizzazione: newsletter.price,
      numero_iscritti: newsletter.subscribers
    })) || []

    return NextResponse.json({ success: true, data: mappedNewsletters })
  } catch (error) {
    console.error('Error in newsletters API:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const currentUserData = await getCurrentUser()
    
    if (!currentUserData?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const supabase = await createSupabaseServerClient()

    // Map Italian field names to English database field names
    const newsletterData = {
      user_id: currentUserData.user.id,
      name: body.nome_newsletter,
      description: body.descrizione,
      category: body.categoria,
      website: body.url_archivio,
      frequency: body.frequenza_invio,
      price: body.prezzo_sponsorizzazione,
      subscribers: body.numero_iscritti,
      // Store additional data as JSON or in separate fields if needed
      open_rate: body.open_rate,
      ctr: body.ctr,
      email_contatto: body.email_contatto,
      linkedin_profile: body.linkedin_profile
    }

    // Create newsletter
    const { data: newsletter, error } = await supabase
      .from('newsletters')
      .insert(newsletterData)
      .select()
      .single()

    if (error) {
      console.error('Error creating newsletter:', error)
      console.error('Newsletter data being inserted:', newsletterData)
      return NextResponse.json({ success: false, error: `Database error: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: newsletter })
  } catch (error) {
    console.error('Error in newsletters POST API:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}