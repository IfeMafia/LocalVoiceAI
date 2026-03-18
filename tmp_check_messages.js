import db from './src/lib/db.js';

async function check() {
  try {
    const res = await db.query(
      "SELECT sender_type, content, created_at FROM messages WHERE conversation_id = '264312e8-3aaf-42df-b1f2-f9789011b2e9' ORDER BY created_at DESC LIMIT 10"
    );
    console.log(JSON.stringify(res.rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
