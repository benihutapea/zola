import { AudioGenerationService, AudioGenerationOptions } from '@/lib/creative';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface ErrorWithDetails extends Error {
  code?: string;
  provider?: string;
  statusCode?: number;
}

export const dynamic = 'force-dynamic'; // Make sure route is not cached

export async function POST(request: NextRequest) {
  try {
    // Get session to identify the user (optional for testing)
    let userId: string | undefined;
    
    try {
      const supabase = await createClient();
      if (supabase) {
        const { data } = await supabase.auth.getSession();
        userId = data.session?.user?.id;
      }
    } catch (sessionError) {
      console.log('No active session, continuing as anonymous:', sessionError instanceof Error ? sessionError.message : 'unknown error');
    }
    
    // Parse request body
    const body = await request.json();
    const { provider, modelId, prompt, duration, sampleRate, format, style } = body;
    
    // Validate required fields
    if (!provider || !modelId || !prompt) {
      return NextResponse.json(
        { error: 'Missing required fields: provider, modelId, and prompt are required' },
        { status: 400 }
      );
    }
    
    // Create options object
    const options: AudioGenerationOptions = {
      provider,
      modelId,
      prompt,
      duration: duration || 30, // Default to 30 seconds
      sampleRate,
      format,
      style
    };
    
    // Generate the audio
    const result = await AudioGenerationService.generateAudio(options, userId);
    
    // Return the result
    return NextResponse.json(result);
  } catch (error) {
    console.error('Audio generation error:', error);
    
    // Cast error to ErrorWithDetails to access additional properties
    const err = error as ErrorWithDetails;
    
    // Format and return the error
    return NextResponse.json(
      { 
        error: err.message || 'Unknown error occurred',
        code: err.code || 'unknown_error',
        provider: err.provider || 'unknown'
      },
      { status: err.statusCode || 500 }
    );
  }
}