import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(_request: NextRequest) {
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
    
    // Fetch all tags for the user's chats
    const { data, error } = await supabase
      .from('chats')
      .select('tags')
      .eq('user_id', userId)
      .not('tags', 'is', null)
    
    if (error) {
      console.error('Error fetching user tags:', error)
      return NextResponse.json(
        { error: 'Failed to fetch tags' },
        { status: 500 }
      )
    }
    
    // Extract unique tags from all chats
    const allTags = data
      .flatMap(chat => chat.tags || [])
      .filter(Boolean)
    
    // Remove duplicates
    const uniqueTags = [...new Set(allTags)]
    
    return NextResponse.json({ tags: uniqueTags })
  } catch (error) {
    console.error('Error in GET all tags API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}