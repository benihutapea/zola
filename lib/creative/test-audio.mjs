import { AudioGenerationService } from './audio-service';

// Test audio generation
async function testAudioGeneration() {
  try {
    const result = await AudioGenerationService.generateAudio({
      provider: 'openai',
      modelId: 'audio-gen',
      prompt: 'A peaceful ambient track with piano and light strings',
      duration: 15,
      style: 'music',
      format: 'mp3'
    });
    
    console.log('✅ Audio generation successful:', result);
    return result;
  } catch (error) {
    console.error('❌ Audio generation failed:', error);
    throw error;
  }
}

// Run the test
testAudioGeneration()
  .then(() => console.log('Audio test completed'))
  .catch(err => console.error('Test failed with error:', err));