-- Create subscribers table directly in the database
CREATE TABLE IF NOT EXISTS subscribers (
  id TEXT PRIMARY KEY,
  value TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  country_code TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  active BOOLEAN DEFAULT TRUE
);
