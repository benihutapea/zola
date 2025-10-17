import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
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
        model_id,
        updated_at,
        messages:chat_messages (count)
      `)
      .eq('user_id', userId)
      .eq('archived', false)
      .order('updated_at', { ascending: false })
      .limit(5)

    if (error) {
      console.error('Error fetching recent conversations:', error)
      return NextResponse.json(
        { error: 'Failed to fetch recent conversations' },
        { status: 500 }
      )
    }

    // Get the model names
    const { data: models } = await supabase
      .from('models_view')
      .select('id, name')

    // Map model IDs to model names
    const modelMap = models?.reduce((acc, model) => {
      acc[model.id] = model.name
      return acc
    }, {} as Record<string, string>) || {}

    const formattedConversations = conversations.map(conversation => ({
      id: conversation.id,
      title: conversation.title || 'Untitled conversation',
      modelId: conversation.model_id,
      modelName: modelMap[conversation.model_id] || 'Unknown model',
      lastMessageAt: conversation.updated_at,
      messageCount: conversation.messages[0]?.count || 0
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