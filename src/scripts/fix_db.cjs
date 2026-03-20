const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Basic env parser since we don't have dotenv installed in a scratch script context necessarily
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const databaseUrl = envContent.split('\n').find(line => line.startsWith('DATABASE_URL=')).split('=')[1].replace(/"/g, '').trim();

const pool = new Pool({
  connectionString: databaseUrl,
});

async function main() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS system_config (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table system_config created successfully');
    
    // Seed initial settings if empty
    const check = await pool.query('SELECT count(*) FROM system_config WHERE key = $1', ['global_settings']);
    if (parseInt(check.rows[0].count) === 0) {
      await pool.query(
        'INSERT INTO system_config (key, value) VALUES ($1, $2)',
        ['global_settings', JSON.stringify({
          maintenanceMode: false,
          registrationEnabled: true,
          aiModel: 'gemini-2.0-flash',
          apiKeyRotation: 'monthly',
          platformNotification: 'Voxy system update scheduled for midnight.',
        })]
      );
      console.log('Initial settings seeded');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

main();
