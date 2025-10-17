import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Schema validation for request body
const updateTemplateSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().max(500).optional(),
  content: z.string().min(10).optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  isPublic: z.boolean().optional()
})

export async function GET(
  request: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    const { templateId } = params
    const supabase = await createClient()
    
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to initialize database' }, { status: 500 })
    }
    
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Get template
    const { data: template, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', templateId)
      .single()

    if (error) {
      console.error('Error fetching template:', error)
      if (error.code === 'PGRST116') {
        // Record not found
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to fetch template' },
        { status: 500 }
      )
    }

    // Check if user has permission to view the template
    if (template.user_id !== userId && !template.is_public) {
      return NextResponse.json(
        { error: 'You do not have permission to view this template' },
        { status: 403 }
      )
    }

    // Format response
    const response = {
      id: template.id,
      title: template.title,
      description: template.description,
      content: template.content,
      tags: template.tags,
      userId: template.user_id,
      createdAt: template.created_at,
      updatedAt: template.updated_at,
      isPublic: template.is_public,
      category: template.category,
      usageCount: template.usage_count || 0
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in GET template API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    const { templateId } = params
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
    const validatedData = updateTemplateSchema.parse(body)
    
    // Check if template exists and belongs to the user
    const { data: existingTemplate, error: fetchError } = await supabase
      .from('templates')
      .select('user_id')
      .eq('id', templateId)
      .single()
    
    if (fetchError || !existingTemplate) {
      console.error('Error fetching template:', fetchError)
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }
    
    if (existingTemplate.user_id !== userId) {
      return NextResponse.json(
        { error: 'You do not have permission to update this template' },
        { status: 403 }
      )
    }
    
    // Update template
    const { error: updateError } = await supabase
      .from('templates')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', templateId)
    
    if (updateError) {
      console.error('Error updating template:', updateError)
      return NextResponse.json(
        { error: 'Failed to update template' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in PATCH template API:', error)
    
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    const { templateId } = params
    const supabase = await createClient()
    
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to initialize database' }, { status: 500 })
    }
    
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    
    // Check if template exists and belongs to the user
    const { data: existingTemplate, error: fetchError } = await supabase
      .from('templates')
      .select('user_id')
      .eq('id', templateId)
      .single()
    
    if (fetchError || !existingTemplate) {
      console.error('Error fetching template:', fetchError)
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }
    
    if (existingTemplate.user_id !== userId) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this template' },
        { status: 403 }
      )
    }
    
    // Delete template
    const { error: deleteError } = await supabase
      .from('templates')
      .delete()
      .eq('id', templateId)
    
    if (deleteError) {
      console.error('Error deleting template:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete template' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE template API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}