import db from './src/lib/db.js';

async function migrate() {
  console.log('🚀 Starting Database Migration...');
  
  try {
    // 1. Add credit_balance to businesses
    console.log('--- Updating businesses table...');
    await db.query(`
      ALTER TABLE businesses 
      ADD COLUMN IF NOT EXISTS credit_balance INTEGER DEFAULT 0;
    `);
    
    // 2. Create transactions table
    console.log('--- Creating transactions table...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        amount INTEGER NOT NULL,
        reference TEXT UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Create index for transactions
    console.log('--- Creating indexes...');
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_transactions_business_id ON transactions(business_id);
    `);

    console.log('✅ Migration successful!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

migrate();
