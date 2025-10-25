-- Add meeting fields to student_courses table
ALTER TABLE student_courses 
  ADD COLUMN IF NOT EXISTS meeting_link TEXT,
  ADD COLUMN IF NOT EXISTS meeting_date DATE,
  ADD COLUMN IF NOT EXISTS meeting_time TEXT;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_student_courses_student_status ON student_courses(student_id, status);
