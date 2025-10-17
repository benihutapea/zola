import { VideoGenerationOptions, VideoGenerationResult } from './types';
import { getProviderApiKey, validateProviderCapability, formatProviderError } from './utils';

/**
 * Video Generation Service
 * Handles video generation across different AI providers
 */
export class VideoGenerationService {
  /**
   * Generate a video using the specified provider and options
   */
  public static async generateVideo(
    options: VideoGenerationOptions,
    userId?: string
  ): Promise<VideoGenerationResult> {
    const { provider } = options;
    
    // Validate if the provider supports video generation
    if (!validateProviderCapability(provider, 'video')) {
      throw new Error(`Provider ${provider} does not support video generation`);
    }
    
    // Get API key for the provider
    const apiKey = await getProviderApiKey(provider, userId);
    if (!apiKey) {
      throw new Error(`No API key available for provider: ${provider}`);
    }
    
    try {
      // Call the appropriate provider API based on the provider name
      switch (provider) {
        case 'stability':
          return await this.generateWithStability(options, apiKey);
        case 'google':
          return await this.generateWithGoogle(options, apiKey);
        case 'local':
          return await this.generateWithLocal(options, apiKey);
        default:
          throw new Error(`Provider ${provider} is not supported for video generation`);
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
   * Generate video with Stability AI API
   */
  private static async generateWithStability(
    options: VideoGenerationOptions,
    apiKey: string
  ): Promise<VideoGenerationResult> {
    // Parse resolution into width and height
    const [width, height] = options.resolution.split('x').map(Number);
    
    console.log('Generating video with Stability AI:', options, `(using API key: ${apiKey.substring(0, 3)}...)`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return mock result
    return {
      url: 'https://placehold.co/600x400.mp4?text=Stability+Generated+Video',
      mimeType: 'video/mp4',
      width: width || 1280,
      height: height || 720,
      duration: options.duration,
      fps: options.fps,
      prompt: options.prompt,
      modelId: options.modelId,
      provider: 'stability',
      generatedAt: new Date()
    };
  }
  
  /**
   * Generate video with Google API
   */
  private static async generateWithGoogle(
    options: VideoGenerationOptions,
    apiKey: string
  ): Promise<VideoGenerationResult> {
    // Parse resolution into width and height
    const [width, height] = options.resolution.split('x').map(Number);
    
    console.log('Generating video with Google:', options, `(using API key: ${apiKey.substring(0, 3)}...)`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return mock result
    return {
      url: 'https://placehold.co/600x400.mp4?text=Google+Generated+Video',
      mimeType: 'video/mp4',
      width: width || 1280,
      height: height || 720,
      duration: options.duration,
      fps: options.fps,
      prompt: options.prompt,
      modelId: options.modelId,
      provider: 'google',
      generatedAt: new Date()
    };
  }
  
  /**
   * Generate video with local models (e.g. via Ollama)
   */
  private static async generateWithLocal(
    options: VideoGenerationOptions,
    apiKey: string
  ): Promise<VideoGenerationResult> {
    // Parse resolution into width and height
    const [width, height] = options.resolution.split('x').map(Number);
    
    console.log('Generating video with local model:', options, `(using API key: ${apiKey.substring(0, 3)}...)`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Return mock result
    return {
      url: 'https://placehold.co/600x400.mp4?text=Locally+Generated+Video',
      mimeType: 'video/mp4',
      width: width || 1280,
      height: height || 720,
      duration: options.duration,
      fps: options.fps,
      prompt: options.prompt,
      modelId: options.modelId,
      provider: 'local',
      generatedAt: new Date()
    };
  }
}