import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set. Please check your .env file.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function addPhoneField() {
  try {
    console.log("Adding phone column to contact_messages table...");
    await sql`ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS phone TEXT`;
    console.log("Successfully added phone column to contact_messages table");
    

    await sql`ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS read BOOLEAN DEFAULT false`;
    console.log("Successfully added read column to contact_messages table");
    
    const tableInfo = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'contact_messages'
    `;
    console.log("Contact messages table structure:", tableInfo);
  } catch (error) {
    console.error("Error modifying table:", error);
  }
}

addPhoneField().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
