import { neon } from "@neondatabase/serverless"

// Lazy initialization to avoid build-time errors
let sqlInstance: ReturnType<typeof neon> | null = null

function getSQL() {
  if (!sqlInstance) {
    const DATABASE_URL = process.env.DATABASE_URL
    if (!DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set")
    }
    sqlInstance = neon(DATABASE_URL)
  }
  return sqlInstance
}

// Export sql as a tagged template function with unsafe method
export function sql(strings: TemplateStringsArray, ...values: any[]) {
  const instance = getSQL()
  return instance(strings, ...values)
}

// Add unsafe method for raw SQL execution
sql.unsafe = (query: string) => {
  const instance = getSQL()
  return instance.unsafe(query)
}
