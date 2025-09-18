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

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check for admin panel authentication
    const adminAuth = request.headers.get('x-admin-auth')
    if (adminAuth !== 'admin-panel') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const proposalId = params.id
    const supabase = createSupabaseServiceClient()
    
    // Get chat messages for this proposal
    const { data: messages, error } = await supabase
      .from('proposal_chat')
      .select(`
        *,
        profiles (
          first_name,
          last_name
        )
      `)
      .eq('proposal_id', proposalId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching chat messages:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }

    // Format messages with sender names
    const formattedMessages = messages?.map(message => ({
      ...message,
      sender_name: message.profiles ? `${message.profiles.first_name} ${message.profiles.last_name}` : null
    })) || []

    return NextResponse.json({ 
      success: true, 
      data: formattedMessages 
    })
  } catch (error) {
    console.error('Error in chat GET API:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check for admin panel authentication
    const adminAuth = request.headers.get('x-admin-auth')
    if (adminAuth !== 'admin-panel') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const proposalId = params.id
    const body = await request.json()
    
    if (!body.message || !body.sender_type) {
      return NextResponse.json({ 
        success: false, 
        error: 'Message and sender_type are required' 
      }, { status: 400 })
    }

    const supabase = createSupabaseServiceClient()

    // Create chat message
    const messageData = {
      proposal_id: proposalId,
      message: body.message.trim(),
      sender_type: body.sender_type, // 'admin' or 'author'
      sender_id: body.sender_type === 'admin' ? null : body.sender_id, // null for admin, user_id for authors
      created_at: new Date().toISOString()
    }

    const { data: message, error } = await supabase
      .from('proposal_chat')
      .insert(messageData)
      .select(`
        *,
        profiles (
          first_name,
          last_name
        )
      `)
      .single()

    if (error) {
      console.error('Error creating chat message:', error)
      return NextResponse.json({ success: false, error: `Database error: ${error.message}` }, { status: 500 })
    }

    // Format message with sender name
    const formattedMessage = {
      ...message,
      sender_name: message.profiles ? `${message.profiles.first_name} ${message.profiles.last_name}` : null
    }

    return NextResponse.json({ success: true, data: formattedMessage })
  } catch (error) {
    console.error('Error in chat POST API:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}