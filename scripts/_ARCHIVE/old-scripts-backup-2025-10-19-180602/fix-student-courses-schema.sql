-- Rename fee column to total_fee and add missing columns
ALTER TABLE student_courses RENAME COLUMN fee TO total_fee;

-- Add missing columns with default values
ALTER TABLE student_courses 
  ADD COLUMN IF NOT EXISTS paid_amount DECIMAL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS due_date DATE,
  ADD COLUMN IF NOT EXISTS fee_type VARCHAR(50),
  ADD COLUMN IF NOT EXISTS monthly_amount DECIMAL,
  ADD COLUMN IF NOT EXISTS installments_count INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS payment_instructions TEXT,
  ADD COLUMN IF NOT EXISTS enrollment_date TIMESTAMP DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS completion_date TIMESTAMP;

-- Drop unnecessary columns that are not in the schema
ALTER TABLE student_courses
  DROP COLUMN IF EXISTS notes,
  DROP COLUMN IF EXISTS start_date,
  DROP COLUMN IF EXISTS end_date,
  DROP COLUMN IF EXISTS discount;