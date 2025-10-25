-- Add fee plan tracking to user_courses table
-- This stores the fee type and installment info

-- Add columns to user_courses
ALTER TABLE user_courses ADD COLUMN IF NOT EXISTS fee_type VARCHAR(20) DEFAULT 'complete';
ALTER TABLE user_courses ADD COLUMN IF NOT EXISTS monthly_amount DECIMAL DEFAULT 0;
ALTER TABLE user_courses ADD COLUMN IF NOT EXISTS installments_count INTEGER DEFAULT 1;

-- Create installments table to track each installment
CREATE TABLE IF NOT EXISTS course_installments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_course_id UUID NOT NULL REFERENCES user_courses(id) ON DELETE CASCADE,
  installment_number INTEGER NOT NULL,
  amount DECIMAL NOT NULL,
  due_date DATE,
  status VARCHAR(20) DEFAULT 'pending', -- pending, paid, overdue
  paid_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_course_id, installment_number)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_course_installments_user_course 
ON course_installments(user_course_id);

CREATE INDEX IF NOT EXISTS idx_course_installments_status 
ON course_installments(status);
