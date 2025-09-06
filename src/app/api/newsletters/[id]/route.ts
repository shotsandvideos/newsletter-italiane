import { NextResponse } from 'next/server'
import { getCurrentUser } from '../../../../lib/supabase-server'
import { createSupabaseServerClient } from '../../../../lib/supabase-server'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const currentUserData = await getCurrentUser()
    
    if (!currentUserData?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const supabase = await createSupabaseServerClient()
    const newsletterId = params.id

    // Update newsletter - only if user owns it
    const { data: newsletter, error } = await supabase
      .from('newsletters')
      .update(body)
      .eq('id', newsletterId)
      .eq('user_id', currentUserData.user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating newsletter:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }

    if (!newsletter) {
      return NextResponse.json({ success: false, error: 'Newsletter not found or not owned by user' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: newsletter })
  } catch (error) {
    console.error('Error in newsletter PUT API:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const currentUserData = await getCurrentUser()
    
    if (!currentUserData?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createSupabaseServerClient()
    const newsletterId = params.id

    // Delete newsletter - only if user owns it
    const { data: newsletter, error } = await supabase
      .from('newsletters')
      .delete()
      .eq('id', newsletterId)
      .eq('user_id', currentUserData.user.id)
      .select()
      .single()

    if (error) {
      console.error('Error deleting newsletter:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }

    if (!newsletter) {
      return NextResponse.json({ success: false, error: 'Newsletter not found or not owned by user' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: newsletter })
  } catch (error) {
    console.error('Error in newsletter DELETE API:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const currentUserData = await getCurrentUser()
    
    if (!currentUserData?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createSupabaseServerClient()
    const newsletterId = params.id

    // Get single newsletter - only if user owns it
    const { data: newsletter, error } = await supabase
      .from('newsletters')
      .select('*')
      .eq('id', newsletterId)
      .eq('user_id', currentUserData.user.id)
      .single()

    if (error) {
      console.error('Error fetching newsletter:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }

    if (!newsletter) {
      return NextResponse.json({ success: false, error: 'Newsletter not found or not owned by user' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: newsletter })
  } catch (error) {
    console.error('Error in newsletter GET API:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}