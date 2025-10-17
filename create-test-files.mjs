// Simple test script for creative API
// Usage:
// 1. Run this script: node create-test-files.mjs
// 2. Use the generated JSON files with curl commands printed in console output
// Note: This is an ES module

const imageTest = {
  "provider": "openai",
  "modelId": "dall-e-3",
  "prompt": "A beautiful sunset over mountains with a lake reflection",
  "size": "1024x1024",
  "quality": 90
};

const videoTest = {
  "provider": "stability",
  "modelId": "gen-2",
  "prompt": "A drone shot flying over a forest in autumn",
  "duration": 5,
  "fps": 24,
  "resolution": "1280x720"
};

const audioTest = {
  "provider": "openai",
  "modelId": "audio-gen",
  "prompt": "A peaceful ambient track with piano and light strings",
  "duration": 15,
  "style": "music",
  "format": "mp3"
};

// Import dependencies at the top
import fs from 'fs';

try {
  // Write image test data to file
  fs.writeFileSync('image-test.json', JSON.stringify(imageTest, null, 2));
  fs.writeFileSync('video-test.json', JSON.stringify(videoTest, null, 2));
  fs.writeFileSync('audio-test.json', JSON.stringify(audioTest, null, 2));
  
  console.log('✅ Test files created successfully!');
} catch (error) {
  console.error('❌ Error creating test files:', error.message);
  process.exit(1);
}

// Default port or use environment variable if available
const port = process.env.PORT || 3000;

console.log('✨ Test files created. Run tests with curl:');
console.log(`curl -X POST -H "Content-Type: application/json" -d @image-test.json http://localhost:${port}/api/creative/image`);
console.log(`curl -X POST -H "Content-Type: application/json" -d @video-test.json http://localhost:${port}/api/creative/video`);
console.log(`curl -X POST -H "Content-Type: application/json" -d @audio-test.json http://localhost:${port}/api/creative/audio`);

console.log('\n⚠️ Note: Make sure your environment has the appropriate API keys set, or you are logged in');
console.log('  Dev mode will use mock API keys if real ones are unavailable.');