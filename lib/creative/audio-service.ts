import { AudioGenerationOptions, AudioGenerationResult } from './types';
import { getProviderApiKey, validateProviderCapability, formatProviderError } from './utils';

/**
 * Audio Generation Service
 * Handles audio generation across different AI providers
 */
export class AudioGenerationService {
  /**
   * Generate audio using the specified provider and options
   */
  public static async generateAudio(
    options: AudioGenerationOptions,
    userId?: string
  ): Promise<AudioGenerationResult> {
    const { provider } = options;
    
    // Validate if the provider supports audio generation
    if (!validateProviderCapability(provider, 'audio')) {
      throw new Error(`Provider ${provider} does not support audio generation`);
    }
    
    // Get API key for the provider
    const apiKey = await getProviderApiKey(provider, userId);
    if (!apiKey) {
      throw new Error(`No API key available for provider: ${provider}`);
    }
    
    try {
      // Call the appropriate provider API based on the provider name
      switch (provider) {
        case 'openai':
          return await this.generateWithOpenAI(options, apiKey);
        case 'google':
          return await this.generateWithGoogle(options, apiKey);
        case 'local':
          return await this.generateWithLocal(options, apiKey);
        default:
          throw new Error(`Provider ${provider} is not supported for audio generation`);
      }
    } catch (error) {
      // Format the error to be consistent across providers
      const providerError = error as {
        message?: string;
        code?: string;
        response?: {
          data?: {
            error?: {
              message?: string;
              code?: string;
              type?: string;
            }
          }
        };
      };
      throw formatProviderError(providerError, provider);
    }
  }
  
  /**
   * Generate audio with OpenAI API
   */
  private static async generateWithOpenAI(
    options: AudioGenerationOptions,
    apiKey: string
  ): Promise<AudioGenerationResult> {
    console.log('Generating audio with OpenAI:', options, `(using API key: ${apiKey.substring(0, 3)}...)`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Use different sample audio URLs based on style
    let audioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
    
    if (options.style === 'voice') {
      audioUrl = 'https://samplelib.com/lib/preview/mp3/sample-3s.mp3';
    } else if (options.style === 'ambience') {
      audioUrl = 'https://samplelib.com/lib/preview/mp3/sample-12s.mp3';
    } else if (options.style === 'sound-effects') {
      audioUrl = 'https://samplelib.com/lib/preview/mp3/sample-9s.mp3';
    }
    
    // Return mock result
    return {
      url: audioUrl,
      mimeType: 'audio/mp3',
      duration: options.duration,
      prompt: options.prompt,
      modelId: options.modelId,
      provider: 'openai',
      generatedAt: new Date()
    };
  }
  
  /**
   * Generate audio with Google API
   */
  private static async generateWithGoogle(
    options: AudioGenerationOptions,
    apiKey: string
  ): Promise<AudioGenerationResult> {
    console.log('Generating audio with Google:', options, `(using API key: ${apiKey.substring(0, 3)}...)`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Use different sample audio URLs based on style
    let audioUrl = 'https://samplelib.com/lib/preview/mp3/sample-15s.mp3';
    
    if (options.style === 'voice') {
      audioUrl = 'https://samplelib.com/lib/preview/mp3/sample-6s.mp3';
    } else if (options.style === 'ambience') {
      audioUrl = 'https://samplelib.com/lib/preview/mp3/sample-9s.mp3';
    } else if (options.style === 'sound-effects') {
      audioUrl = 'https://samplelib.com/lib/preview/mp3/sample-3s.mp3';
    }
    
    // Return mock result
    return {
      url: audioUrl,
      mimeType: 'audio/mp3',
      duration: options.duration,
      prompt: options.prompt,
      modelId: options.modelId,
      provider: 'google',
      generatedAt: new Date()
    };
  }
  
  /**
   * Generate audio with local models (e.g. via Ollama)
   */
  private static async generateWithLocal(
    options: AudioGenerationOptions,
    apiKey: string
  ): Promise<AudioGenerationResult> {
    console.log('Generating audio with local model:', options, `(API key ${apiKey ? 'provided' : 'not provided'})`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Return mock result - use a single audio file for local generation
    return {
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      mimeType: 'audio/mp3',
      duration: options.duration,
      prompt: options.prompt,
      modelId: options.modelId,
      provider: 'local',
      generatedAt: new Date()
    };
  }
}