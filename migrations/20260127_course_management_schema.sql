/*
  # Course Management System Migration Script - Phase 6 Corrected
  # Description: Defines schema for courses, modules, lessons, and progress.
  # Corrections: Removes any 'created_by' references. Uses 'instructor_id' for courses.
  #              Adds RPC functions for LMS operations.
*/

-- ==============================================================================
-- BLOCK 1: Courses Table
-- ==============================================================================
DO $$ 
BEGIN 
    -- Ensure columns exist and match requirements
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'instructor_id') THEN
        ALTER TABLE public.courses ADD COLUMN instructor_id uuid REFERENCES public.profiles(id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'course_thumbnail_url') THEN
        ALTER TABLE public.courses ADD COLUMN course_thumbnail_url text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'is_published') THEN
        ALTER TABLE public.courses ADD COLUMN is_published boolean DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'total_modules') THEN
        ALTER TABLE public.courses ADD COLUMN total_modules integer DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'total_lessons') THEN
        ALTER TABLE public.courses ADD COLUMN total_lessons integer DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'total_duration_hours') THEN
        ALTER TABLE public.courses ADD COLUMN total_duration_hours numeric(10, 2) DEFAULT 0;
    END IF;

    -- Clean up if created_by exists (it shouldn't based on requirements)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'created_by') THEN
        ALTER TABLE public.courses DROP COLUMN created_by;
    END IF;
END $$;

-- ==============================================================================
-- BLOCK 2: Course Modules Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.course_modules (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    module_order integer DEFAULT 0,
    is_published boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Remove created_by if it slipped in
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'course_modules' AND column_name = 'created_by') THEN
        ALTER TABLE public.course_modules DROP COLUMN created_by;
    END IF;
END $$;

ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- BLOCK 3: Course Lessons Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.course_lessons (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id uuid NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    content text,
    video_url text,
    lesson_order integer DEFAULT 0,
    duration_minutes integer DEFAULT 0,
    lesson_type text DEFAULT 'video',
    is_published boolean DEFAULT false,
    is_preview boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Remove created_by if it slipped in
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'course_lessons' AND column_name = 'created_by') THEN
        ALTER TABLE public.course_lessons DROP COLUMN created_by;
    END IF;
END $$;

ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- BLOCK 4: Student Lesson Progress
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.student_lesson_progress (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id uuid NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
    status text DEFAULT 'not_started',
    last_watched_position integer DEFAULT 0,
    is_completed boolean DEFAULT false,
    completion_percentage integer DEFAULT 0,
    course_id uuid REFERENCES public.courses(id),
    completed_at timestamptz,
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id, lesson_id)
);

-- Remove created_by if it slipped in
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'student_lesson_progress' AND column_name = 'created_by') THEN
        ALTER TABLE public.student_lesson_progress DROP COLUMN created_by;
    END IF;
END $$;

ALTER TABLE public.student_lesson_progress ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- BLOCK 5: Course Enrollments (Reconciling with existing schema)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.course_enrollments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    status text DEFAULT 'in_progress',
    progress_percentage integer DEFAULT 0,
    final_grade numeric,
    enrolled_at timestamptz DEFAULT now(),
    completed_at timestamptz,
    last_accessed_at timestamptz,
    UNIQUE(student_id, course_id)
);

-- Remove created_by if it slipped in
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'course_enrollments' AND column_name = 'created_by') THEN
        ALTER TABLE public.course_enrollments DROP COLUMN created_by;
    END IF;
END $$;

ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- BLOCK 6: Policies (Strict No-Created-By)
-- ==============================================================================

-- Courses Policies
DROP POLICY IF EXISTS "Public read courses" ON public.courses;
CREATE POLICY "Public read courses" ON public.courses
    FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Instructors manage own courses" ON public.courses;
CREATE POLICY "Instructors manage own courses" ON public.courses
    FOR ALL USING (instructor_id = auth.uid() OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin'));

-- Modules Policies
DROP POLICY IF EXISTS "Read published modules" ON public.course_modules;
CREATE POLICY "Read published modules" ON public.course_modules
    FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Manage modules" ON public.course_modules;
CREATE POLICY "Manage modules" ON public.course_modules
    FOR ALL USING (
        EXISTS (SELECT 1 FROM courses c WHERE c.id = course_modules.course_id AND (c.instructor_id = auth.uid() OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')))
    );

-- Lessons Policies
DROP POLICY IF EXISTS "Read published lessons" ON public.course_lessons;
CREATE POLICY "Read published lessons" ON public.course_lessons
    FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Manage lessons" ON public.course_lessons;
CREATE POLICY "Manage lessons" ON public.course_lessons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM course_modules cm 
            JOIN courses c ON cm.course_id = c.id 
            WHERE cm.id = course_lessons.module_id 
            AND (c.instructor_id = auth.uid() OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin'))
        )
    );

-- Enrollment Policies
DROP POLICY IF EXISTS "Students view own enrollments" ON public.course_enrollments;
CREATE POLICY "Students view own enrollments" ON public.course_enrollments
    FOR SELECT USING (student_id = auth.uid());

DROP POLICY IF EXISTS "System manage enrollments" ON public.course_enrollments;
CREATE POLICY "System manage enrollments" ON public.course_enrollments
    FOR ALL USING (student_id = auth.uid() OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin'));

-- Progress Policies
DROP POLICY IF EXISTS "Students manage own progress" ON public.student_lesson_progress;
CREATE POLICY "Students manage own progress" ON public.student_lesson_progress
    FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins view progress" ON public.student_lesson_progress;
CREATE POLICY "Admins view progress" ON public.student_lesson_progress
    FOR SELECT USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin'));


-- ==============================================================================
-- BLOCK 7: RPC Functions
-- ==============================================================================

-- 7.1 get_courses_by_module
CREATE OR REPLACE FUNCTION get_courses_by_module(p_module_id uuid)
RETURNS SETOF courses
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT * FROM courses 
  WHERE module_id = p_module_id 
  AND is_published = true
  ORDER BY title ASC;
$$;

-- 7.2 get_course_details (Safe join)
CREATE OR REPLACE FUNCTION get_course_details(p_course_id uuid)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  instructor_name text,
  total_modules integer,
  total_lessons integer,
  duration_hours numeric,
  thumbnail_url text
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.title,
    c.description,
    COALESCE(p.display_name, 'Instructor'),
    c.total_modules,
    c.total_lessons,
    c.total_duration_hours,
    c.course_thumbnail_url
  FROM courses c
  LEFT JOIN profiles p ON c.instructor_id = p.id
  WHERE c.id = p_course_id;
END;
$$;

-- 7.3 enroll_student_in_course
CREATE OR REPLACE FUNCTION enroll_student_in_course(p_student_id uuid, p_course_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO course_enrollments (student_id, course_id, status, enrolled_at, progress_percentage)
  VALUES (p_student_id, p_course_id, 'in_progress', now(), 0)
  ON CONFLICT (student_id, course_id) DO NOTHING;
END;
$$;

-- 7.4 mark_lesson_complete
CREATE OR REPLACE FUNCTION mark_lesson_complete(p_user_id uuid, p_lesson_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_course_id uuid;
BEGIN
    -- Derive course_id from lesson relationship
    SELECT c.id INTO v_course_id
    FROM course_lessons cl
    JOIN course_modules cm ON cl.module_id = cm.id
    JOIN courses c ON cm.course_id = c.id
    WHERE cl.id = p_lesson_id;

    INSERT INTO student_lesson_progress (
        user_id, 
        lesson_id, 
        course_id, 
        status, 
        is_completed, 
        completed_at, 
        updated_at
    )
    VALUES (
        p_user_id, 
        p_lesson_id, 
        v_course_id,
        'completed', 
        true, 
        now(), 
        now()
    )
    ON CONFLICT (user_id, lesson_id) 
    DO UPDATE SET 
        status = 'completed',
        is_completed = true,
        completed_at = now(),
        updated_at = now();
        
    RETURN true;
END;
$$;