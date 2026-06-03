// scripts/setup-cron.js
// Test script to verify cron endpoint works locally
// Run with: node scripts/setup-cron.js

const cronSecret = '9GyRFL7aiigpjJ6X78p/atfMlyfLyG9g9u+8Xo=';

async function testCronEndpoint() {
  console.log('🧪 Testing cron endpoint...\n');

  try {
    const response = await fetch('http://localhost:3000/api/cron', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Cron endpoint responded successfully');
      console.log('📊 Results:', data);
    } else {
      console.log('❌ Cron endpoint failed:', data);
    }
  } catch (error) {
    console.error('❌ Could not reach cron endpoint. Make sure your dev server is running on port 3000');
    console.error('Error:', error);
  }
}

testCronEndpoint();