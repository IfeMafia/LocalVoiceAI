import { Cencori } from 'cencori';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = new Cencori({
  apiKey: process.env.CENCORI_SECRET_KEY || process.env.CENCORI_API_KEY,
});

async function test() {
  try {
    console.log('--- Calling Cencori ---');
    console.log('API Key present:', !!process.env.CENCORI_API_KEY);
    console.log('Secret Key present:', !!process.env.CENCORI_SECRET_KEY);

    const response = await client.ai.chat({
      messages: [{ role: 'user', content: 'Hello' }],
      model: 'gpt-4o-mini'
    });
    console.log('--- Success ---');
    console.log(response);
  } catch (err) {
    console.error('--- Failed ---');
    console.error(err);
  }
}

test();
