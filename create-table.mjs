

import 'dotenv/config';
import pg from 'pg';

async function createSubscribersTable() {
  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database successfully');

    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS subscribers (
        id TEXT PRIMARY KEY,
        value TEXT UNIQUE NOT NULL,
        type TEXT NOT NULL,
        country_code TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        active BOOLEAN DEFAULT TRUE
      );
    `;

    await client.query(createTableSQL);
    console.log('✅ Subscribers table created successfully!');

    
    const checkTable = await client.query(`
      SELECT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'subscribers'
      );
    `);

    if (checkTable.rows[0].exists) {
      console.log('✅ Table existence confirmed');
    } else {
      console.error('❌ Table creation failed - table not found');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

createSubscribersTable();
