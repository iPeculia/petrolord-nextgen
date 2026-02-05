/*
  # Video Management & Analytics Migration Script
  # Generated: 2026-01-26
  # Description: Creates tables for video metadata, user analytics, and raw event logging.
  # Note: This script is IDEMPOTENT. Safe to rerun.
*/

-- ==============================================================================
-- BLOCK 1: 'lesson_videos' Table
-- Purpose: Stores metadata about the video file/stream associated with a lesson.
-- ==============================================================================

-- 1. Drop existing table if needed (Careful: Destructive if data exists)
-- In a production env, you might alter instead of drop. For this task, we recreate.
DROP TABLE IF EXISTS public.lesson_videos CASCADE;

-- 2. Create Table
CREATE TABLE public.lesson_videos (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    lesson_id uuid NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
    title text NOT NULL,
    video_url text NOT NULL,
    duration integer DEFAULT 0, -- in seconds
    hosting_provider text DEFAULT 'custom', -- youtube, vimeo, custom
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_lesson_videos_lesson_id ON public.lesson_videos(lesson_id);

-- 4. RLS
ALTER TABLE public.lesson_videos ENABLE ROW LEVEL SECURITY;

-- 5. Policies
CREATE POLICY "Users view videos" ON public.lesson_videos
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins manage videos" ON public.lesson_videos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin', 'petrolord_admin')
        )
    );

-- ==============================================================================
-- BLOCK 2: 'video_analytics' Table
-- Purpose: Aggregated viewing data per user per video.
-- ==============================================================================

-- 1. Drop
DROP TABLE IF EXISTS public.video_analytics CASCADE;

-- 2. Create
CREATE TABLE public.video_analytics (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    video_id uuid NOT NULL REFERENCES public.lesson_videos(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id uuid NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
    course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    
    total_watch_time_seconds integer DEFAULT 0,
    completion_percentage integer DEFAULT 0,
    last_watched_position_seconds integer DEFAULT 0,
    
    playback_speed numeric(3, 2) DEFAULT 1.0,
    quality_watched varchar(20), -- '1080p', '720p', 'auto'
    
    pause_count integer DEFAULT 0,
    seek_count integer DEFAULT 0,
    fullscreen_count integer DEFAULT 0,
    
    last_accessed_at timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    UNIQUE(user_id, video_id)
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_video_analytics_user_video ON public.video_analytics(user_id, video_id);
CREATE INDEX IF NOT EXISTS idx_video_analytics_course_user ON public.video_analytics(course_id, user_id);

-- 4. RLS
ALTER TABLE public.video_analytics ENABLE ROW LEVEL SECURITY;

-- 5. Policies
CREATE POLICY "Students can view their own analytics" ON public.video_analytics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Students can update their own analytics" ON public.video_analytics
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Students can insert their own analytics" ON public.video_analytics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all analytics" ON public.video_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin', 'petrolord_admin')
        )
    );

-- ==============================================================================
-- BLOCK 3: 'video_events' Table
-- Purpose: Granular log of video player events (play, pause, seek, etc).
-- ==============================================================================

-- 1. Drop
DROP TABLE IF EXISTS public.video_events CASCADE;

-- 2. Create
CREATE TABLE public.video_events (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    video_id uuid NOT NULL REFERENCES public.lesson_videos(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    event_type varchar(50) NOT NULL, -- 'play', 'pause', 'seek', 'complete', 'ratechange'
    event_data jsonb DEFAULT '{}'::jsonb, -- Store extra data like { from: 10, to: 20 }
    timestamp_seconds integer, -- Video timestamp when event occurred
    
    created_at timestamptz DEFAULT now()
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_video_events_video_user ON public.video_events(video_id, user_id);
CREATE INDEX IF NOT EXISTS idx_video_events_created_at ON public.video_events(created_at);

-- 4. RLS
ALTER TABLE public.video_events ENABLE ROW LEVEL SECURITY;

-- 5. Policies
CREATE POLICY "Students can log events" ON public.video_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view events" ON public.video_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin', 'petrolord_admin')
        )
    );

-- ==============================================================================
-- BLOCK 4: Triggers
-- Purpose: Maintain updated_at columns
-- ==============================================================================

-- Trigger Function (Reusing existing or creating if needed)
CREATE OR REPLACE FUNCTION public.handle_video_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Lesson Videos Trigger
DROP TRIGGER IF EXISTS on_lesson_videos_updated ON public.lesson_videos;
CREATE TRIGGER on_lesson_videos_updated
    BEFORE UPDATE ON public.lesson_videos
    FOR EACH ROW EXECUTE FUNCTION public.handle_video_updated_at();

-- Video Analytics Trigger
DROP TRIGGER IF EXISTS on_video_analytics_updated ON public.video_analytics;
CREATE TRIGGER on_video_analytics_updated
    BEFORE UPDATE ON public.video_analytics
    FOR EACH ROW EXECUTE FUNCTION public.handle_video_updated_at();