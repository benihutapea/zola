import { VideoGenerationService } from './video-service';

// Test video generation
async function testVideoGeneration() {
  try {
    const result = await VideoGenerationService.generateVideo({
      provider: 'stability',
      modelId: 'gen-2',
      prompt: 'A drone shot flying over a forest in autumn',
      duration: 5,
      fps: 24,
      resolution: '1280x720'
    });
    
    console.log('✅ Video generation successful:', result);
    return result;
  } catch (error) {
    console.error('❌ Video generation failed:', error);
    throw error;
  }
}

// Run the test
testVideoGeneration()
  .then(() => console.log('Video test completed'))
  .catch(err => console.error('Test failed with error:', err));