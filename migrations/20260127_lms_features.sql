/*
  # LMS Features Migration Script - Phase 6 Corrected
  # Description: Schema for Notes, Materials, Flashcards, Quizzes.
  # Corrections: Explicitly removed 'created_by' from all tables and policies.
*/

-- ==============================================================================
-- 1. Lesson Notes
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.lesson_notes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    lesson_id uuid NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
    content text,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE, -- Restored user_id for student notes
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

DO $$ 
BEGIN 
    -- Ensure user_id exists (it's essential for notes ownership)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lesson_notes' AND column_name = 'user_id') THEN
        ALTER TABLE public.lesson_notes ADD COLUMN user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
    -- Ensure NO created_by
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lesson_notes' AND column_name = 'created_by') THEN
        ALTER TABLE public.lesson_notes DROP COLUMN created_by;
    END IF;
END $$;

ALTER TABLE public.lesson_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own notes" ON public.lesson_notes;
CREATE POLICY "Users manage own notes" ON public.lesson_notes
    FOR ALL USING (user_id = auth.uid());

-- ==============================================================================
-- 2. Study Materials (Instructor uploaded)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.study_materials (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    lesson_id uuid NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
    title text NOT NULL,
    file_url text NOT NULL,
    file_type text,
    description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'study_materials' AND column_name = 'created_by') THEN
        ALTER TABLE public.study_materials DROP COLUMN created_by;
    END IF;
END $$;

ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated read materials" ON public.study_materials;
CREATE POLICY "Authenticated read materials" ON public.study_materials
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins manage materials" ON public.study_materials;
CREATE POLICY "Admins manage materials" ON public.study_materials
    FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin'));

-- ==============================================================================
-- 3. Flashcards
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.flashcards (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    lesson_id uuid NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
    front text NOT NULL,
    back text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'flashcards' AND column_name = 'created_by') THEN
        ALTER TABLE public.flashcards DROP COLUMN created_by;
    END IF;
END $$;

ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Read flashcards" ON public.flashcards;
CREATE POLICY "Read flashcards" ON public.flashcards
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins manage flashcards" ON public.flashcards;
CREATE POLICY "Admins manage flashcards" ON public.flashcards
    FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin'));

-- ==============================================================================
-- 4. Quizzes
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    lesson_id uuid REFERENCES public.course_lessons(id) ON DELETE CASCADE,
    question_text text NOT NULL,
    question_type text DEFAULT 'single_choice',
    points integer DEFAULT 1,
    order_index integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_questions' AND column_name = 'created_by') THEN
        ALTER TABLE public.quiz_questions DROP COLUMN created_by;
    END IF;
END $$;

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Read questions" ON public.quiz_questions;
CREATE POLICY "Read questions" ON public.quiz_questions
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Manage questions" ON public.quiz_questions;
CREATE POLICY "Manage questions" ON public.quiz_questions
    FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin'));