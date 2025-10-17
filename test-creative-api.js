/**
 * Creative API Test Script
 * 
 * This script can be used to test the creative API endpoints directly.
 * Run with: node test-creative-api.js
 */

async function testCreativeApi() {
  console.log('🧪 Testing Creative APIs');
  console.log('=======================\n');

  // Test endpoints
  await testImageGeneration();
  await testVideoGeneration();
  await testAudioGeneration();

  console.log('\n✅ All tests complete');
}

async function testImageGeneration() {
  console.log('Testing Image Generation API...');
  
  try {
    const response = await fetch('http://localhost:3000/api/creative/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'openai',
        modelId: 'dall-e-3',
        prompt: 'A beautiful mountain landscape with a lake',
        size: '1024x1024',
        quality: 90
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Image generation successful');
      console.log('Image URL:', data.url);
      console.log('Provider:', data.provider);
      console.log('Model:', data.modelId);
    } else {
      console.error('❌ Image generation failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Error testing image generation:', error);
  }
}

async function testVideoGeneration() {
  console.log('\nTesting Video Generation API...');
  
  try {
    const response = await fetch('http://localhost:3000/api/creative/video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'stability',
        modelId: 'gen-2',
        prompt: 'A cinematic video of mountains and lakes',
        duration: 5,
        fps: 24,
        resolution: '1280x720'
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Video generation successful');
      console.log('Video URL:', data.url);
      console.log('Provider:', data.provider);
      console.log('Model:', data.modelId);
      console.log('Duration:', data.duration);
    } else {
      console.error('❌ Video generation failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Error testing video generation:', error);
  }
}

async function testAudioGeneration() {
  console.log('\nTesting Audio Generation API...');
  
  try {
    const response = await fetch('http://localhost:3000/api/creative/audio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'openai',
        modelId: 'audio-gen',
        prompt: 'A relaxing piano melody with soft strings',
        duration: 30,
        style: 'music'
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Audio generation successful');
      console.log('Audio URL:', data.url);
      console.log('Provider:', data.provider);
      console.log('Model:', data.modelId);
      console.log('Duration:', data.duration);
    } else {
      console.error('❌ Audio generation failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Error testing audio generation:', error);
  }
}

// Execute tests
testCreativeApi().catch(console.error);