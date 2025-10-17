import { getEffectiveApiKey, ProviderWithoutOllama } from '@/lib/user-keys';

/**
 * Creative API utility functions
 */

/**
 * Get the appropriate API key for a provider
 * Tries user's saved key first, then falls back to environment variables
 */
export async function getProviderApiKey(provider: string, userId?: string): Promise<string | null> {
  // Map provider to appropriate key type
  const keyMapping: Record<string, ProviderWithoutOllama> = {
    'openai': 'openai',
    'anthropic': 'anthropic',
    'stability': 'openai', // Map to OpenAI for now
    'midjourney': 'openrouter', // Map to OpenRouter for now
    'google': 'google',
    'meta': 'openai', // Map to OpenAI for now
    'local': 'openai', // For local/Ollama, use OpenAI key for testing
  };

  // Get the mapped key type or default to 'openai' for testing
  const keyType = (keyMapping[provider] || 'openai') as ProviderWithoutOllama;
  
  try {
    // Use existing getEffectiveApiKey from user-keys.ts
    const apiKey = await getEffectiveApiKey(userId || null, keyType);
    
    // For testing purposes, if no API key is found, return a dummy one
    if (!apiKey && process.env.NODE_ENV === 'development') {
      console.warn(`Using a dummy API key for provider ${provider} in development`);
      return 'sk-dummy-api-key-for-testing-purposes-only';
    }
    
    return apiKey;
  } catch (error) {
    console.error(`Error fetching API key for provider ${provider}:`, error);
    
    // For testing purposes, return a dummy key in development
    if (process.env.NODE_ENV === 'development') {
      return 'sk-dummy-api-key-for-testing-purposes-only';
    }
    
    return null;
  }
}

/**
 * Validate if a provider supports a specific creative feature
 */
export function validateProviderCapability(
  provider: string, 
  feature: 'image' | 'video' | 'audio' | 'editing'
): boolean {
  // Define provider capabilities
  const capabilities: Record<string, string[]> = {
    'openai': ['image', 'audio', 'editing'],
    'anthropic': ['image'],
    'stability': ['image', 'video', 'editing'],
    'midjourney': ['image'],
    'google': ['image', 'video', 'audio'],
    'meta': ['image'],
    'local': ['image', 'video', 'audio', 'editing'], // Assumed local models can do everything
  };

  // For testing: allow all features in development
  if (process.env.NODE_ENV === 'development' && !capabilities[provider]) {
    console.warn(`Provider ${provider} not found in capability map. Allowing all features in development mode.`);
    return true;
  }

  return capabilities[provider]?.includes(feature) || false;
}

// Define a common error structure for provider APIs
interface ProviderErrorDetails {
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
}

/**
 * Format error from provider API responses
 */
export function formatProviderError(error: ProviderErrorDetails, provider: string): Error {
  let message = 'Unknown error occurred';
  let code = 'unknown_error';
  
  // Extract relevant error information based on provider
  if (provider === 'openai') {
    message = error.response?.data?.error?.message || error.message || 'Unknown error occurred';
    code = error.response?.data?.error?.code || error.code || 'api_error';
  } else if (provider === 'anthropic') {
    message = error.response?.data?.error?.message || error.message || 'Unknown error occurred';
    code = error.response?.data?.error?.type || error.code || 'api_error';
  } else {
    message = error.message || 'Unknown error occurred';
    code = error.code || 'api_error';
  }
  
  // Create a custom error with additional properties
  const formattedError = new Error(`${provider}: ${message}`);
  
  // Define the extended error type
  type ExtendedError = Error & {
    code: string;
    provider: string;
  };
  
  (formattedError as ExtendedError).code = code;
  (formattedError as ExtendedError).provider = provider;
  
  return formattedError;
}