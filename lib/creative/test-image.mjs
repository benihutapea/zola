import { ImageGenerationService } from './image-service';

// Test image generation
async function testImageGeneration() {
  try {
    const result = await ImageGenerationService.generateImage({
      provider: 'openai',
      modelId: 'dall-e-3',
      prompt: 'A beautiful sunset over mountains with a lake reflection',
      size: '1024x1024',
      quality: 90
    });
    
    console.log('✅ Image generation successful:', result);
    return result;
  } catch (error) {
    console.error('❌ Image generation failed:', error);
    throw error;
  }
}

// Run the test
testImageGeneration()
  .then(() => console.log('Image test completed'))
  .catch(err => console.error('Test failed with error:', err));