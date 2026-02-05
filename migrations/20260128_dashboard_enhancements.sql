/*
  # Dashboard Enhancements & Access Control Schema
  # Generated: 2026-01-28
  # Purpose: Supports certificates, course prerequisites, and dashboard analytics.
*/

-- ==============================================================================
-- 1. Course Prerequisites Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.course_prerequisites (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    prerequisite_course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    required_score integer DEFAULT 80,
    created_at timestamptz DEFAULT now(),
    UNIQUE(course_id, prerequisite_course_id)
);

ALTER TABLE public.course_prerequisites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read prerequisites" ON public.course_prerequisites;
DROP POLICY IF EXISTS "Admins manage prerequisites" ON public.course_prerequisites;

CREATE POLICY "Public read prerequisites" ON public.course_prerequisites 
    FOR SELECT USING (true);

CREATE POLICY "Admins manage prerequisites" ON public.course_prerequisites 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- ==============================================================================
-- 2. Ensure Certificates Table Fields
-- ==============================================================================
-- Ensure we have score/grade tracking in certificates if not already present
-- (Usually certificates are just issued, but linking score is useful for the dashboard request)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificates' AND column_name = 'final_grade') THEN
        ALTER TABLE public.certificates ADD COLUMN final_grade numeric DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certificates' AND column_name = 'module_name') THEN
        ALTER TABLE public.certificates ADD COLUMN module_name text;
    END IF;
END $$;

-- ==============================================================================
-- 3. Lecturer Module Assignments (Enhancement)
-- ==============================================================================
-- Ensure unique constraint to enforce "single module" rule if required, or at least optimized lookup
CREATE INDEX IF NOT EXISTS idx_lecturer_module_assignments_lecturer ON public.lecturer_module_assignments(lecturer_id);

-- ==============================================================================
-- 4. Helper View for Student Progress (Optional but recommended for dashboards)
-- ==============================================================================
-- Note: Views are often safer than complex JS joins for RLS
CREATE OR REPLACE VIEW public.student_progress_summary AS
SELECT 
    p.id as student_id,
    p.display_name,
    p.email,
    um.university_id,
    sma.core_module_id as module_id,
    m.name as module_name,
    la.courses_completed,
    la.total_xp,
    la.average_quiz_score
FROM profiles p
JOIN university_members um ON p.id = um.user_id
LEFT JOIN student_module_assignments sma ON p.id = sma.student_id
LEFT JOIN modules m ON sma.core_module_id = m.id
LEFT JOIN learning_analytics la ON p.id = la.user_id
WHERE p.role = 'student';

-- Grant access to view
GRANT SELECT ON public.student_progress_summary TO authenticated;