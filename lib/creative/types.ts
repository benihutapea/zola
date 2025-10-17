/**
 * Creative API Types
 * Types shared across creative generation services
 */

export interface BaseCreativeOptions {
  apiKey?: string;
  provider: 'openai' | 'anthropic' | 'stability' | 'midjourney' | 'google' | 'meta' | 'local';
  modelId: string;
  prompt: string;
}

// Image generation options
export interface ImageGenerationOptions extends BaseCreativeOptions {
  size: string; // e.g. "1024x1024"
  quality: number; // 0-100
  style?: string;
  negativePrompt?: string;
  preserveFacialFeatures?: boolean;
  referenceImages?: string[]; // base64 encoded images
}

export interface ImageGenerationResult {
  url: string;
  base64?: string;
  mimeType: string;
  width: number;
  height: number;
  prompt: string;
  seed?: number;
  modelId: string;
  provider: string;
  generatedAt: Date;
}

// Video generation options
export interface VideoGenerationOptions extends BaseCreativeOptions {
  duration: number; // in seconds
  fps: number;
  resolution: string; // e.g. "1280x720"
  style?: string;
  audioPrompt?: string; // For generating audio along with video
}

export interface VideoGenerationResult {
  url: string;
  mimeType: string;
  width: number;
  height: number;
  duration: number;
  fps: number;
  prompt: string;
  modelId: string;
  provider: string;
  generatedAt: Date;
}

// Audio generation options
export interface AudioGenerationOptions extends BaseCreativeOptions {
  duration: number; // in seconds
  sampleRate?: number;
  format?: 'mp3' | 'wav' | 'ogg';
  style?: string; // Music, voice, ambience, sound effects
}

export interface AudioGenerationResult {
  url: string;
  mimeType: string;
  duration: number;
  prompt: string;
  modelId: string;
  provider: string;
  generatedAt: Date;
}

// Error handling
export interface CreativeApiError {
  code: string;
  message: string;
  provider?: string;
  statusCode?: number;
}