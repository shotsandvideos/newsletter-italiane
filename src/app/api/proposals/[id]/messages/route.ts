import { NextResponse } from 'next/server'
import { getCurrentUser } from '../../../../../lib/supabase-server'
import { createSupabaseServerClient } from '../../../../../lib/supabase-server'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const currentUserData = await getCurrentUser()
    
    if (!currentUserData?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { message } = body
    const proposalId = params.id

    if (!proposalId || !message?.trim()) {
      return NextResponse.json({ 
        success: false, 
        error: 'Proposal ID and message are required' 
      }, { status: 400 })
    }

    const supabase = await createSupabaseServerClient()

    // Check if proposal exists
    const { data: proposal } = await supabase
      .from('proposals')
      .select('id')
      .eq('id', proposalId)
      .single()

    if (!proposal) {
      return NextResponse.json({ success: false, error: 'Proposal not found' }, { status: 404 })
    }

    // Create message
    const messageData = {
      proposal_id: proposalId,
      user_id: currentUserData.user.id,
      from_admin: false,
      subject: 'Messaggio per Proposta',
      body: message.trim(),
      status: 'sent'
    }

    const { data: newMessage, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single()

    if (error) {
      console.error('Error creating message:', error)
      return NextResponse.json({ success: false, error: `Database error: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: newMessage })
  } catch (error) {
    console.error('Error in proposal messages API:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}