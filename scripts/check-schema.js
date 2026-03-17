import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkAllSchema() {
  try {
    const res = await pool.query(`
      SELECT id, name, email, role
      FROM users
      ORDER BY name, email
    `);
    console.log('--- Current Users ---');
    res.rows.forEach(row => {
      const slugVal = (row.name || row.email).toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-');
      console.log(`${row.id.substring(0, 8)} | ${row.name || 'N/A'} | ${row.email} | Predicted Slug: ${slugVal}`);
    });
    process.exit(0);
  } catch (err) {
    console.error('Error checking schema:', err);
    process.exit(1);
  }
}

checkAllSchema();
