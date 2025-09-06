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

    // Create newsletter
    const { data: newsletter, error } = await supabase
      .from('newsletters')
      .insert({
        ...body,
        user_id: currentUserData.user.id
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating newsletter:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: newsletter })
  } catch (error) {
    console.error('Error in newsletters POST API:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}