/**
 * Creative API Services Tests
 * 
 * This is a simple test script to verify that the Creative API services
 * are working correctly. You can run this directly with Node.js:
 * 
 * node tests/creative-api.test.js
 * 
 * Note: These are not automated tests but rather manual verification
 * tools to help during development.
 */

import fetch from 'node-fetch';

// Base URL for API requests
const API_BASE_URL = 'http://localhost:3001/api/creative';

// Test data for image generation
const imageTestData = {
  provider: 'openai',
  modelId: 'dall-e-3',
  prompt: 'A beautiful sunset over mountains with a lake reflection',
  size: '1024x1024',
  quality: 90
};

// Test data for video generation
const videoTestData = {
  provider: 'stability',
  modelId: 'gen-2',
  prompt: 'A drone shot flying over a forest in autumn',
  duration: 5,
  fps: 24,
  resolution: '1280x720'
};

// Test data for audio generation
const audioTestData = {
  provider: 'openai',
  modelId: 'audio-gen',
  prompt: 'A peaceful ambient track with piano and light strings',
  duration: 15,
  style: 'music',
  format: 'mp3'
};

// Function to test image generation API
async function testImageGeneration() {
  console.log('Testing Image Generation API...');
  try {
    const response = await fetch(`${API_BASE_URL}/image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(imageTestData),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Image Generation API Test Passed!');
      console.log('Response:', data);
      return data;
    } else {
      console.log('❌ Image Generation API Test Failed!');
      console.log('Error:', data);
      return null;
    }
  } catch (error) {
    console.log('❌ Image Generation API Test Failed with exception!');
    console.error(error);
    return null;
  }
}

// Function to test video generation API
async function testVideoGeneration() {
  console.log('\nTesting Video Generation API...');
  try {
    const response = await fetch(`${API_BASE_URL}/video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(videoTestData),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Video Generation API Test Passed!');
      console.log('Response:', data);
      return data;
    } else {
      console.log('❌ Video Generation API Test Failed!');
      console.log('Error:', data);
      return null;
    }
  } catch (error) {
    console.log('❌ Video Generation API Test Failed with exception!');
    console.error(error);
    return null;
  }
}

// Function to test audio generation API
async function testAudioGeneration() {
  console.log('\nTesting Audio Generation API...');
  try {
    const response = await fetch(`${API_BASE_URL}/audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(audioTestData),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Audio Generation API Test Passed!');
      console.log('Response:', data);
      return data;
    } else {
      console.log('❌ Audio Generation API Test Failed!');
      console.log('Error:', data);
      return null;
    }
  } catch (error) {
    console.log('❌ Audio Generation API Test Failed with exception!');
    console.error(error);
    return null;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🧪 Running Creative API Tests...');
  
  await testImageGeneration();
  await testVideoGeneration();
  await testAudioGeneration();
  
  console.log('\n🏁 All tests completed!');
}

// Run tests
runAllTests();