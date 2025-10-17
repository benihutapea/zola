import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to initialize database' }, { status: 500 })
    }
    
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Get recent conversations with their last message date
    const { data: conversations, error } = await supabase
      .from('chats')
      .select(`
        id, 
        title,
        model,
        updated_at,
        messages (count)
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(5)

    if (error) {
      console.error('Error fetching recent conversations:', error)
      return NextResponse.json(
        { error: 'Failed to fetch recent conversations' },
        { status: 500 }
      )
    }

    const formattedConversations = conversations.map(conversation => ({
      id: conversation.id,
      title: conversation.title || 'Untitled conversation',
      model: conversation.model,
      lastMessageAt: conversation.updated_at,
      // The messages count comes as an array with a single value
      messageCount: conversation.messages ? 
        (Array.isArray(conversation.messages) ? 
          (conversation.messages[0] ? Number(conversation.messages[0]) : 0) : 0
        ) : 0
    }))

    return NextResponse.json({ conversations: formattedConversations })
  } catch (error) {
    console.error('Error in recent conversations API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}