import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Schema validation for request body
const templateSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  content: z.string().min(10),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  isPublic: z.boolean().default(false)
})

export async function POST(request: NextRequest) {
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
    const body = await request.json()
    
    // Validate request body
    const validatedData = templateSchema.parse(body)
    
    // Insert template
    const { data, error } = await supabase
      .from('templates')
      .insert({
        user_id: userId,
        title: validatedData.title,
        description: validatedData.description,
        content: validatedData.content,
        tags: validatedData.tags,
        category: validatedData.category,
        is_public: validatedData.isPublic,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('id')
      .single()
    
    if (error) {
      console.error('Error creating template:', error)
      return NextResponse.json(
        { error: 'Failed to create template' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ id: data.id, success: true })
  } catch (error) {
    console.error('Error in template creation API:', error)
    
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