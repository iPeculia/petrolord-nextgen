import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

/**
 * Hook to manage student attempts for a course.
 * 
 * @param {string} courseId - The ID of the course
 * @returns {Object} Attempt data and logic
 */
export const useCourseAttempts = (courseId) => {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [bestScore, setBestScore] = useState(0);
  const [isPassed, setIsPassed] = useState(false);
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [remainingAttempts, setRemainingAttempts] = useState(3);
  const [loading, setLoading] = useState(true);

  const fetchAttempts = async () => {
    if (!user || !courseId) return;

    try {
      setLoading(true);

      // 1. Fetch Attempts
      const { data: attemptsData, error: attemptsError } = await supabase
        .from('student_course_attempts')
        .select('*')
        .eq('student_id', user.id)
        .eq('course_id', courseId)
        .order('attempt_number', { ascending: false });

      if (attemptsError) throw attemptsError;

      // 2. Fetch Requirements
      const { data: reqData, error: reqError } = await supabase
        .from('course_passing_requirements')
        .select('max_attempts, min_score')
        .eq('course_id', courseId)
        .single();

      // Defaults if no reqs set
      const maxAllowed = reqData?.max_attempts || 3;
      const minScore = reqData?.min_score || 70;

      setAttempts(attemptsData || []);
      setMaxAttempts(maxAllowed);
      setRemainingAttempts(Math.max(0, maxAllowed - (attemptsData?.length || 0)));

      // Calculate status
      const hasPassed = attemptsData?.some(a => a.passed || a.score >= minScore);
      setIsPassed(hasPassed);

      const best = attemptsData?.reduce((max, curr) => (curr.score > max ? curr.score : max), 0);
      setBestScore(best || 0);

    } catch (err) {
      console.error('Error fetching course attempts:', err);
    } finally {
      setLoading(false);
    }
  };

  const startRetake = async () => {
    // This logic might usually be handled by a dedicated "start quiz" flow,
    // but we can expose a helper to check eligibility here.
    if (remainingAttempts <= 0 && !isPassed) {
      return { allowed: false, reason: 'No attempts remaining' };
    }
    if (isPassed) {
      return { allowed: false, reason: 'Course already passed' };
    }
    return { allowed: true };
  };

  useEffect(() => {
    fetchAttempts();
  }, [user, courseId]);

  return {
    attempts,
    bestScore,
    isPassed,
    maxAttempts,
    remainingAttempts,
    loading,
    refresh: fetchAttempts,
    canRetake: remainingAttempts > 0 && !isPassed,
    startRetake
  };
};

export default useCourseAttempts;