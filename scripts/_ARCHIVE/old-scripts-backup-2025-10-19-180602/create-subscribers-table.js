
import { sql } from './lib/db';
import fs from 'fs';
import path from 'path';

async function createSubscribersTable() {
  try {
    console.log('Creating subscribers table...');
    
    
    const sqlScript = fs.readFileSync(
      path.join(process.cwd(), 'create-subscribers-table.sql'),
      'utf8'
    );
    
    
    await sql.unsafe(sqlScript);
    
    console.log('✅ Subscribers table created successfully!');
  } catch (error) {
    console.error('❌ Failed to create subscribers table:', error);
  }
}


createSubscribersTable();
