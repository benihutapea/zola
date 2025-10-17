import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Schema validation for request body
const tagsSchema = z.object({
  tags: z.array(z.string().min(1).max(30)).max(10)
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const { chatId } = params
    const supabase = await createClient()
    
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to initialize database' }, { status: 500 })
    }
    
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    
    // Validate request body
    const validatedData = tagsSchema.parse(body)
    
    // Check if chat exists and belongs to user
    const { data: chat, error: fetchError } = await supabase
      .from('chats')
      .select('id')
      .eq('id', chatId)
      .eq('user_id', userId)
      .single()
    
    if (fetchError || !chat) {
      console.error('Error fetching chat:', fetchError)
      return NextResponse.json(
        { error: 'Chat not found or you do not have permission to update it' },
        { status: 404 }
      )
    }
    
    // Update chat tags
    const { error: updateError } = await supabase
      .from('chats')
      .update({ tags: validatedData.tags })
      .eq('id', chatId)
    
    if (updateError) {
      console.error('Error updating chat tags:', updateError)
      return NextResponse.json(
        { error: 'Failed to update tags' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true, tags: validatedData.tags })
  } catch (error) {
    console.error('Error in PUT chat tags API:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get tags for a specific chat
export async function GET(
  _request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const { chatId } = params
    const supabase = await createClient()
    
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to initialize database' }, { status: 500 })
    }
    
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    
    // Fetch chat tags
    const { data: chat, error } = await supabase
      .from('chats')
      .select('tags')
      .eq('id', chatId)
      .eq('user_id', userId)
      .single()
    
    if (error || !chat) {
      console.error('Error fetching chat tags:', error)
      return NextResponse.json(
        { error: 'Chat not found or you do not have permission to access it' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ tags: chat.tags || [] })
  } catch (error) {
    console.error('Error in GET chat tags API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}