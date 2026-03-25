import { Cencori } from 'cencori';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = new Cencori({
  apiKey: process.env.CENCORI_SECRET_KEY || process.env.CENCORI_API_KEY,
});

async function test() {
  try {
    console.log('--- Testing Gemini 2.5 on Cencori ---');
    const response = await client.ai.chat({
      messages: [{ role: 'user', content: 'Say hello' }],
      model: 'gemini-2.5'
    });
    console.log('SUCCESS:', response.model);
  } catch (err) {
    console.error('FAILED:', err.message);
  }
}

test();
