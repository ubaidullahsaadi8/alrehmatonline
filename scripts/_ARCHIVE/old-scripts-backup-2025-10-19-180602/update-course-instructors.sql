-- Remove instructor column from courses table and create course_instructors table
ALTER TABLE courses DROP COLUMN IF EXISTS instructor;

-- Create course_instructors table for many-to-many relationship
CREATE TABLE IF NOT EXISTS course_instructors (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    course_id TEXT NOT NULL,
    instructor_id TEXT NOT NULL,
    role TEXT DEFAULT 'primary', -- primary, secondary, assistant
    status TEXT DEFAULT 'active', -- active, inactive
    assigned_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_course_instructors_course
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT fk_course_instructors_instructor
        FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Allow same instructor-course pair with different roles
    UNIQUE(course_id, instructor_id, role)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_course_instructors_course ON course_instructors(course_id);
CREATE INDEX IF NOT EXISTS idx_course_instructors_instructor ON course_instructors(instructor_id);
CREATE INDEX IF NOT EXISTS idx_course_instructors_status ON course_instructors(status);

-- Create view for easier querying
CREATE OR REPLACE VIEW course_instructor_details AS
SELECT 
    ci.id as assignment_id,
    c.id as course_id,
    c.title as course_title,
    c.description as course_description,
    c.image as course_image,
    c.level as course_level,
    c.duration as course_duration,
    c.category as course_category,
    c.price as course_price,
    u.id as instructor_id,
    u.name as instructor_name,
    u.email as instructor_email,
    u.avatar as instructor_avatar,
    ci.role as instructor_role,
    ci.status as assignment_status,
    ci.assigned_at,
    ci.updated_at,
    (
        SELECT COUNT(*) 
        FROM student_courses sc 
        WHERE sc.course_id = c.id 
        AND sc.status = 'active'
    ) as student_count
FROM course_instructors ci
JOIN courses c ON ci.course_id = c.id
JOIN users u ON ci.instructor_id = u.id
WHERE ci.status = 'active';