import { generateAI } from './src/lib/ai/aiProvider.js';

/**
 * Cencori Unified Provider Smoke Test
 */
async function testCencoriUnified() {
  console.log('🧪 Starting Unified Provider Smoke Test...');
  try {
    const res = await generateAI({
      userId: 'test-user',
      businessId: 'test-business',
      prompt: 'Verify system integrity and respond "Cencori Unified Active!"',
      type: 'system'
    });
    console.log('✅ Result Status:', res.providerUsed);
    console.log('✅ Response:', res.text);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testCencoriUnified();
