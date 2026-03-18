import db from './src/lib/db.js';

async function check() {
  try {
    const res = await db.query(
      "SELECT sender_type, COUNT(*) FROM messages WHERE conversation_id = '264312e8-3aaf-42df-b1f2-f9789011b2e9' GROUP BY sender_type"
    );
    console.log(JSON.stringify(res.rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
