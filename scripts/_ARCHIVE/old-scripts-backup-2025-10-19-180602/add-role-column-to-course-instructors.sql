-- Add role column to course_instructors table
ALTER TABLE course_instructors 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'instructor';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_course_instructors_role ON course_instructors(role);