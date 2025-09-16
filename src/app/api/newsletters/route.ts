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
    
    // Get newsletters for the current user with new field names
    const { data: newsletters, error } = await supabase
      .from('newsletters')
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
        created_at,
        updated_at
      `)
      .eq('user_id', currentUserData.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching newsletters:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: newsletters || [] })
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

    // Validate required fields
    if (!body.title || !body.description || !body.category || !body.signup_url || !body.contact_email || 
        body.audience_size === undefined || body.open_rate === undefined || body.ctr_rate === undefined || 
        body.sponsorship_price === undefined) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    // Create newsletter with new field structure
    const newsletterData = {
      user_id: currentUserData.user.id,
      name: body.title, // For backward compatibility with existing schema
      title: body.title,
      description: body.description,
      category: body.category,
      language: body.language || 'it',
      signup_url: body.signup_url,
      cadence: body.cadence || null,
      audience_size: parseInt(body.audience_size) || 0,
      monetization: body.monetization || null,
      contact_email: body.contact_email,
      linkedin_profile: body.linkedin_profile || null,
      open_rate: parseFloat(body.open_rate) || 0,
      ctr_rate: parseFloat(body.ctr_rate) || 0,
      sponsorship_price: parseInt(body.sponsorship_price) || 0,
      review_status: 'in_review' // Always starts in review
    }

    // Create newsletter
    const { data: newsletter, error } = await supabase
      .from('newsletters')
      .insert(newsletterData)
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
        review_status,
        created_at,
        updated_at
      `)
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