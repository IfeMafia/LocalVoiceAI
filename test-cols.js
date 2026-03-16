require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function addCol() {
  try {
    await pool.query(`
      ALTER TABLE conversations 
      ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES users(id) ON DELETE SET NULL;
    `);
    console.log("customer_id column added successfully.");
  } catch (err) {
    console.error("Test Error:", err);
  } finally {
    pool.end();
  }
}

addCol();
