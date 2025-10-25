const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting database migration to add missing columns...');
    
    
    const columnsToAdd = [
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS country VARCHAR(50)",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS education TEXT",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(255) UNIQUE",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS user_type VARCHAR(50) DEFAULT 'simple'",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS account_status VARCHAR(50) DEFAULT 'active'",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS member_type VARCHAR(50) DEFAULT 'common'"
    ];
    
    
    for (const sql of columnsToAdd) {
      try {
        await prisma.$executeRawUnsafe(sql);
        console.log(`Successfully executed: ${sql}`);
      } catch (error) {
        if (error.meta?.message?.includes("already exists")) {
          console.log(`Column already exists: ${sql}`);
        } else {
          console.error(`Error executing: ${sql}`);
          console.error(error);
        }
      }
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
