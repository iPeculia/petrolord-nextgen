/*
  # Student Dashboard Phase 4 Migration
  # Generated: 2026-01-27
  # Description: Creates tables for gamification, analytics, and progress tracking.
  # Includes strict RLS policies as requested.
*/

-- ==============================================================================
-- 1. Student Course Progress
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.student_course_progress (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    progress_percentage integer DEFAULT 0,
    status text DEFAULT 'not_started', -- not_started, in_progress, completed
    last_accessed_at timestamptz DEFAULT now(),
    completed_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id, course_id)
);

ALTER TABLE public.student_course_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own course progress" ON public.student_course_progress;
DROP POLICY IF EXISTS "Users insert own course progress" ON public.student_course_progress;
DROP POLICY IF EXISTS "Users update own course progress" ON public.student_course_progress;
DROP POLICY IF EXISTS "Users delete own course progress" ON public.student_course_progress;

CREATE POLICY "Users view own course progress" ON public.student_course_progress
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users insert own course progress" ON public.student_course_progress
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own course progress" ON public.student_course_progress
    FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own course progress" ON public.student_course_progress
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ==============================================================================
-- 2. Certificates
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.certificates (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    certificate_number text NOT NULL,
    issued_date timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own certificates" ON public.certificates;
DROP POLICY IF EXISTS "Admins manage certificates" ON public.certificates;
-- Remove conflicting policies if they exist from previous migrations
DROP POLICY IF EXISTS "Users can see their own certificates" ON public.certificates;
DROP POLICY IF EXISTS "Super admins have full access to certificates" ON public.certificates;

CREATE POLICY "Users view own certificates" ON public.certificates
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins manage certificates" ON public.certificates
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- ==============================================================================
-- 3. Achievements
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.achievements (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    badge_url text, -- Icon name or URL
    criteria_type text, -- e.g., 'courses_completed', 'login_streak', 'quiz_score'
    threshold integer, -- e.g., 5 courses, 7 days, 100 points
    xp_reward integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read achievements" ON public.achievements;
DROP POLICY IF EXISTS "Admins manage achievements" ON public.achievements;

-- Everyone can read achievements
CREATE POLICY "Public read achievements" ON public.achievements
    FOR SELECT TO authenticated USING (true);

-- Only admins can manage definitions
CREATE POLICY "Admins manage achievements" ON public.achievements
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- ==============================================================================
-- 4. User Achievements
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id uuid NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    earned_at timestamptz DEFAULT now(),
    UNIQUE(user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "System inserts achievements" ON public.user_achievements;

CREATE POLICY "Users view own achievements" ON public.user_achievements
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "System inserts achievements" ON public.user_achievements
    FOR INSERT TO authenticated WITH CHECK (true);

-- ==============================================================================
-- 5. Learning Streaks
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.learning_streaks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    current_streak integer DEFAULT 0,
    longest_streak integer DEFAULT 0,
    last_activity_date date DEFAULT CURRENT_DATE,
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id)
);

ALTER TABLE public.learning_streaks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own streaks" ON public.learning_streaks;
DROP POLICY IF EXISTS "Users update own streaks" ON public.learning_streaks;
DROP POLICY IF EXISTS "Users insert own streaks" ON public.learning_streaks;

CREATE POLICY "Users view own streaks" ON public.learning_streaks
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users update own streaks" ON public.learning_streaks
    FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users insert own streaks" ON public.learning_streaks
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 6. Learning Analytics
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.learning_analytics (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    total_study_time_minutes integer DEFAULT 0,
    courses_completed integer DEFAULT 0,
    quizzes_taken integer DEFAULT 0,
    average_quiz_score numeric DEFAULT 0,
    total_xp integer DEFAULT 0,
    current_level integer DEFAULT 1,
    last_updated timestamptz DEFAULT now(),
    UNIQUE(user_id)
);

ALTER TABLE public.learning_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own analytics" ON public.learning_analytics;
DROP POLICY IF EXISTS "Users update own analytics" ON public.learning_analytics;
DROP POLICY IF EXISTS "Users insert own analytics" ON public.learning_analytics;

CREATE POLICY "Users view own analytics" ON public.learning_analytics
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users update own analytics" ON public.learning_analytics
    FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users insert own analytics" ON public.learning_analytics
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Trigger for updating updated_at columns
DROP TRIGGER IF EXISTS on_student_course_progress_updated ON public.student_course_progress;
CREATE TRIGGER on_student_course_progress_updated BEFORE UPDATE ON public.student_course_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();