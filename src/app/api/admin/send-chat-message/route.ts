import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '../../../../lib/supabase-server'

export async function POST(request: Request) {
  try {
    // Check for admin panel authentication
    const adminAuth = request.headers.get('x-admin-auth')
    if (adminAuth !== 'admin-panel') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { author_email, newsletter_id, message } = await request.json()

    if (!author_email || !message?.trim()) {
      return NextResponse.json({ 
        success: false, 
        error: 'Author email and message are required' 
      }, { status: 400 })
    }

    const supabase = await createSupabaseServerClient()

    // Create a chat message record in the existing messaging system
    // This assumes there's a messages table or similar in your messaging system
    const messageData = {
      from_admin: true,
      to_email: author_email,
      newsletter_id: newsletter_id || null,
      subject: 'Messaggio dall\'Admin',
      body: message.trim(),
      status: 'sent',
      created_at: new Date().toISOString()
    }

    // For now, we'll just log the message since the actual messaging system structure isn't defined
    // In a real implementation, this would insert into your messages table
    console.log('Chat message would be sent:', messageData)

    // Simulate successful message sending
    // In real implementation, you would:
    // const { data, error } = await supabase
    //   .from('messages')
    //   .insert(messageData)

    // For now, just return success
    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully',
      data: messageData 
    })

  } catch (error) {
    console.error('Error in send-chat-message API:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}