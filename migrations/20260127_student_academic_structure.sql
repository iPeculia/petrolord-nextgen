/*
  # Student Academic Structure Migration
  # Generated: 2026-01-27
  # Description: Creates tables for student academic levels, department mappings, 
  # assignments, attempts, and access locks.
*/

-- ==============================================================================
-- 1. Student Academic Level
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.student_academic_level (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    academic_level text NOT NULL, -- e.g., '100', '200', '300', '400', 'PG'
    academic_year text NOT NULL, -- e.g., '2025/2026'
    semester integer DEFAULT 1,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(student_id, academic_year, semester)
);

ALTER TABLE public.student_academic_level ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students view own academic level" ON public.student_academic_level;
DROP POLICY IF EXISTS "Admins manage academic levels" ON public.student_academic_level;

CREATE POLICY "Students view own academic level" ON public.student_academic_level
    FOR SELECT TO authenticated USING (auth.uid() = student_id);

CREATE POLICY "Admins manage academic levels" ON public.student_academic_level
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin', 'university_admin')
        )
    );

-- ==============================================================================
-- 2. Department Module Mapping
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.department_module_mapping (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    department_id uuid NOT NULL REFERENCES public.university_departments(id) ON DELETE CASCADE,
    module_id uuid NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    level_required text NOT NULL, -- '100', '200' etc matching academic_level
    is_core boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    UNIQUE(department_id, module_id)
);

ALTER TABLE public.department_module_mapping ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "View department mappings" ON public.department_module_mapping;
DROP POLICY IF EXISTS "Admins manage department mappings" ON public.department_module_mapping;

CREATE POLICY "View department mappings" ON public.department_module_mapping
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins manage department mappings" ON public.department_module_mapping
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin', 'university_admin')
        )
    );

-- ==============================================================================
-- 3. Student Module Assignments
-- Note: Table might exist. Using IF NOT EXISTS.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.student_module_assignments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    core_module_id uuid REFERENCES public.modules(id) ON DELETE CASCADE, -- Keeping core_module_id for backward compatibility if it exists
    assigned_date timestamptz DEFAULT now(),
    status text DEFAULT 'active'
);

-- Ensure RLS is enabled if it wasn't
ALTER TABLE public.student_module_assignments ENABLE ROW LEVEL SECURITY;

-- Re-applying policies to ensure they are correct for the requested spec
DROP POLICY IF EXISTS "Students view own assignments" ON public.student_module_assignments;
DROP POLICY IF EXISTS "Admins manage student assignments" ON public.student_module_assignments;
DROP POLICY IF EXISTS "Students view own module assignments" ON public.student_module_assignments; -- Drop potential existing policy name

CREATE POLICY "Students view own assignments" ON public.student_module_assignments
    FOR SELECT TO authenticated USING (auth.uid() = student_id);

CREATE POLICY "Admins manage student assignments" ON public.student_module_assignments
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin', 'university_admin')
        )
    );

-- ==============================================================================
-- 4. Lecturer Module Assignments
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.lecturer_module_assignments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    lecturer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    module_id uuid NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    assigned_at timestamptz DEFAULT now(),
    status text DEFAULT 'active',
    created_at timestamptz DEFAULT now(),
    UNIQUE(lecturer_id, module_id)
);

ALTER TABLE public.lecturer_module_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lecturers view own assignments" ON public.lecturer_module_assignments;
DROP POLICY IF EXISTS "Admins manage lecturer assignments" ON public.lecturer_module_assignments;

CREATE POLICY "Lecturers view own assignments" ON public.lecturer_module_assignments
    FOR SELECT TO authenticated USING (auth.uid() = lecturer_id);

CREATE POLICY "Admins manage lecturer assignments" ON public.lecturer_module_assignments
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin', 'university_admin')
        )
    );

-- ==============================================================================
-- 5. Student Course Attempts
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.student_course_attempts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    attempt_number integer DEFAULT 1,
    score numeric DEFAULT 0,
    passed boolean DEFAULT false,
    attempt_date timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_student_course_attempts_student_id ON public.student_course_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_student_course_attempts_course_id ON public.student_course_attempts(course_id);

ALTER TABLE public.student_course_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students view own attempts" ON public.student_course_attempts;
DROP POLICY IF EXISTS "Admins manage attempts" ON public.student_course_attempts;

CREATE POLICY "Students view own attempts" ON public.student_course_attempts
    FOR SELECT TO authenticated USING (auth.uid() = student_id);

CREATE POLICY "Admins manage attempts" ON public.student_course_attempts
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin', 'university_admin')
        )
    );

-- ==============================================================================
-- 6. Course Passing Requirements
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.course_passing_requirements (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    min_score integer DEFAULT 70,
    max_attempts integer DEFAULT 3,
    prerequisite_course_id uuid REFERENCES public.courses(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(course_id)
);

ALTER TABLE public.course_passing_requirements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Read passing requirements" ON public.course_passing_requirements;
DROP POLICY IF EXISTS "Admins manage requirements" ON public.course_passing_requirements;

CREATE POLICY "Read passing requirements" ON public.course_passing_requirements
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins manage requirements" ON public.course_passing_requirements
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- ==============================================================================
-- 7. Module Access Locks
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.module_access_locks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    module_id uuid NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    is_locked boolean DEFAULT true,
    lock_reason text, -- 'prerequisites_not_met', 'admin_lock', 'payment_pending'
    unlock_date timestamptz,
    created_at timestamptz DEFAULT now(),
    UNIQUE(student_id, module_id)
);

ALTER TABLE public.module_access_locks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students view locks" ON public.module_access_locks;
DROP POLICY IF EXISTS "Admins manage locks" ON public.module_access_locks;

CREATE POLICY "Students view locks" ON public.module_access_locks
    FOR SELECT TO authenticated USING (auth.uid() = student_id);

CREATE POLICY "Admins manage locks" ON public.module_access_locks
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin', 'university_admin')
        )
    );

/*
  Verification Query:
  -------------------
  SELECT table_name 
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name IN (
    'student_academic_level', 
    'department_module_mapping', 
    'student_module_assignments',
    'lecturer_module_assignments',
    'student_course_attempts',
    'course_passing_requirements',
    'module_access_locks'
  );
*/