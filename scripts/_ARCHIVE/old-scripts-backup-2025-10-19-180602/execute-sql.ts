import { sql } from "@/lib/db";
import fs from 'fs';
import path from 'path';


async function executeSqlScript(scriptPath: string) {
  try {
    console.log(`Reading SQL script from: ${scriptPath}`);
    
    
    const sqlContent = fs.readFileSync(scriptPath, 'utf-8');
    
    
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    console.log(`Found ${statements.length} SQL statements to execute.`);
    
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}`);
      
      
      await sql.unsafe(statement);
      
      console.log(`Statement ${i + 1} executed successfully.`);
    }
    
    console.log('All SQL statements executed successfully.');
    return { success: true };
  } catch (error) {
    console.error('Error executing SQL script:', error);
    return { success: false, error };
  }
}

export async function addCurrencyColumn() {
  const scriptPath = path.join(process.cwd(), 'scripts', 'add-currency-column.sql');
  return executeSqlScript(scriptPath);
}
