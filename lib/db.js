import { neon, neonConfig } from '@neondatabase/serverless';

// Setting fetchConnectionCache to true is recommended for serverless environments
// for caching database connections across function invocations.
neonConfig.fetchConnectionCache = true;

const sql = neon(process.env.DATABASE_URL);

/**
 * Execute a database query using the Neon Serverless driver
 * Matches the 'pg' query interface for compatibility
 * 
 * @param {string} text - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise<{rows: Array, rowCount: number}>}
 */
export const query = async (text, params = []) => {
  // Convert $1, $2 to ? if using neon syntax or just use the sql tagged template
  // However, for compatibility with the existing route.js files which use $1, $2
  // We can use the simple query function provided by 'neon'
  
  // The neon client handles parameterized queries automatically
  const rows = await sql(text, params);
  
  return {
    rows,
    rowCount: rows.length
  };
};

export default sql;
