/*
  # Access Control Phase 2 Migration
  # Generated: 2026-01-27
  # Description: Implements triggers and functions for course passing requirements,
  #              attempts tracking, module unlocking logic, and automated assignments.
*/

-- ==============================================================================
-- 1. Auto-Create Course Passing Requirements (Trigger)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.auto_create_course_passing_requirements()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.course_passing_requirements (
        course_id,
        min_score,
        max_attempts,
        requires_quiz_completion,
        minimum_quiz_score,
        requires_lesson_completion
    )
    VALUES (
        NEW.id,
        70,   -- Default passing score
        3,    -- Default max attempts
        true,
        70,
        true
    )
    ON CONFLICT (course_id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_auto_create_course_reqs ON public.courses;
CREATE TRIGGER trigger_auto_create_course_reqs
    AFTER INSERT ON public.courses
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_create_course_passing_requirements();


-- ==============================================================================
-- 2. Auto-Create Student Course Attempts (Trigger on Enrollment)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.auto_init_attempts_on_enroll()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if an attempt already exists (e.g. re-enrollment)
    IF NOT EXISTS (
        SELECT 1 FROM public.student_course_attempts 
        WHERE student_id = NEW.student_id AND course_id = NEW.course_id
    ) THEN
        INSERT INTO public.student_course_attempts (
            student_id,
            course_id,
            attempt_number,
            score,
            passed,
            status,
            attempt_date
        )
        VALUES (
            NEW.student_id,
            NEW.course_id,
            1,            -- First attempt
            0,            -- Initial score
            false,
            'in_progress',
            now()
        );
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_auto_init_attempts ON public.course_enrollments;
CREATE TRIGGER trigger_auto_init_attempts
    AFTER INSERT ON public.course_enrollments
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_init_attempts_on_enroll();


-- ==============================================================================
-- 3. Check Student Retake Eligibility
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.can_student_retake_course(p_user_id uuid, p_course_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_max_attempts integer;
    v_current_attempts integer;
    v_has_passed boolean;
BEGIN
    -- Get requirements
    SELECT max_attempts INTO v_max_attempts
    FROM public.course_passing_requirements
    WHERE course_id = p_course_id;
    
    -- Default to 3 if not set
    v_max_attempts := COALESCE(v_max_attempts, 3);

    -- Get current status
    SELECT count(*), bool_or(passed)
    INTO v_current_attempts, v_has_passed
    FROM public.student_course_attempts
    WHERE student_id = p_user_id AND course_id = p_course_id;

    -- Logic: Can retake if not passed AND attempts < max
    IF v_has_passed THEN
        RETURN false; -- Already passed
    END IF;

    IF v_current_attempts < v_max_attempts THEN
        RETURN true;
    ELSE
        RETURN false;
    END IF;
END;
$$;


-- ==============================================================================
-- 4. Update Module Access Lock
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.update_module_access_lock(p_user_id uuid, p_module_id uuid, p_course_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_lock_record RECORD;
BEGIN
    -- Find lock record for this user/module that depends on this course
    SELECT * INTO v_lock_record
    FROM public.module_access_locks
    WHERE student_id = p_user_id 
      AND module_id = p_module_id
      AND required_course_id = p_course_id;

    IF FOUND THEN
        -- Unlock it
        UPDATE public.module_access_locks
        SET is_locked = false,
            unlock_date = now(),
            lock_reason = NULL
        WHERE id = v_lock_record.id;
    END IF;
END;
$$;


-- ==============================================================================
-- 5. Mark Course Completion
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.mark_course_completion(p_user_id uuid, p_course_id uuid, p_final_grade numeric, p_module_id uuid DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_min_score integer;
    v_passed boolean;
    v_attempt_num integer;
BEGIN
    -- Get passing requirements
    SELECT min_score INTO v_min_score
    FROM public.course_passing_requirements
    WHERE course_id = p_course_id;
    
    v_min_score := COALESCE(v_min_score, 70);
    
    v_passed := (p_final_grade >= v_min_score);

    -- Get next attempt number
    SELECT COALESCE(MAX(attempt_number), 0) + 1 INTO v_attempt_num
    FROM public.student_course_attempts
    WHERE student_id = p_user_id AND course_id = p_course_id;

    -- Insert attempt record
    INSERT INTO public.student_course_attempts (
        student_id,
        course_id,
        attempt_number,
        score,
        passed,
        status,
        completion_date,
        final_grade
    )
    VALUES (
        p_user_id,
        p_course_id,
        v_attempt_num,
        p_final_grade,
        v_passed,
        CASE WHEN v_passed THEN 'completed' ELSE 'failed' END,
        now(),
        p_final_grade
    );

    -- Update enrollment status
    UPDATE public.course_enrollments
    SET status = CASE WHEN v_passed THEN 'completed' ELSE 'failed' END,
        final_grade = p_final_grade,
        completed_at = CASE WHEN v_passed THEN now() ELSE NULL END,
        progress_percentage = 100 -- Assuming completion implies 100% progress tracked
    WHERE student_id = p_user_id AND course_id = p_course_id;

    -- If passed, check for any modules that require this course to unlock
    IF v_passed THEN
        -- Find any locks dependent on this course for this user
        UPDATE public.module_access_locks
        SET is_locked = false,
            unlock_date = now(),
            lock_reason = NULL
        WHERE student_id = p_user_id AND required_course_id = p_course_id;
    END IF;
END;
$$;


-- ==============================================================================
-- 6. Assign Modules to Student
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.assign_modules_to_student(p_user_id uuid, p_department_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_module RECORD;
BEGIN
    FOR v_module IN 
        SELECT module_id 
        FROM public.department_module_mapping 
        WHERE department_id = p_department_id
    LOOP
        INSERT INTO public.student_module_assignments (
            student_id,
            core_module_id,
            status,
            assigned_date
        )
        VALUES (
            p_user_id,
            v_module.module_id,
            'active',
            now()
        )
        ON CONFLICT DO NOTHING; -- Avoid dupes
    END LOOP;
END;
$$;


-- ==============================================================================
-- 7. Assign Modules to Lecturer
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.assign_modules_to_lecturer(p_user_id uuid, p_department_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_module RECORD;
BEGIN
    FOR v_module IN 
        SELECT module_id 
        FROM public.department_module_mapping 
        WHERE department_id = p_department_id
    LOOP
        INSERT INTO public.lecturer_module_assignments (
            lecturer_id,
            module_id,
            status,
            assigned_at
        )
        VALUES (
            p_user_id,
            v_module.module_id,
            'active',
            now()
        )
        ON CONFLICT (lecturer_id, module_id) DO NOTHING;
    END LOOP;
END;
$$;