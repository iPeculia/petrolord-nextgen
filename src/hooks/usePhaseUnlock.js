import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export const canAccessPhase = (userPhase, coursePhase) => {
    if (!userPhase || !coursePhase) return false;
    return userPhase >= coursePhase;
};

export const getPhaseUnlockRequirements = () => ({
    1: { required_completions: 0, required_phase: 0 }, // No requirements for Phase 1
    2: { required_completions: 1, required_phase: 1 }, // Must complete at least 1 Phase 1 course
    3: { required_completions: 1, required_phase: 2 }, // Must complete at least 1 Phase 2 course
});

export const usePhaseUnlock = () => {
    const { user, profile } = useAuth();
    const [unlockedPhases, setUnlockedPhases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const checkPhaseUnlock = useCallback(async () => {
        if (!user?.id || !profile?.phase) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const { data: completions, error: completionsError } = await supabase
                .from('course_completions')
                .select('course_id');

            if (completionsError) throw completionsError;

            const completedCourseIds = completions.map(c => c.course_id);

            const { data: completedCourses, error: coursesError } = await supabase
                .from('courses')
                .select('id, phase_requirement')
                .in('id', completedCourseIds);

            if (coursesError) throw coursesError;

            const userCurrentPhase = profile.phase;
            const requirements = getPhaseUnlockRequirements();
            const newUnlockedPhases = [1]; // Everyone can access Phase 1

            // Check for Phase 2 unlock
            if (userCurrentPhase < 2) {
                const phase1Completions = completedCourses.filter(c => c.phase_requirement === 1).length;
                if (phase1Completions >= requirements[2].required_completions) {
                    newUnlockedPhases.push(2);
                }
            } else {
                newUnlockedPhases.push(2); // If user is already phase 2 or 3, they can access phase 2
            }

            // Check for Phase 3 unlock
            if (userCurrentPhase < 3) {
                const phase2Completions = completedCourses.filter(c => c.phase_requirement === 2).length;
                if (phase2Completions >= requirements[3].required_completions) {
                    newUnlockedPhases.push(3);
                }
            } else {
                newUnlockedPhases.push(3); // If user is already phase 3, they can access phase 3
            }
            
            setUnlockedPhases([...new Set(newUnlockedPhases)].sort((a, b) => a - b)); // Ensure unique and sorted
        } catch (err) {
            console.error('Error checking phase unlock:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user?.id, profile?.phase]);

    useEffect(() => {
        checkPhaseUnlock();
    }, [checkPhaseUnlock]);

    return { unlockedPhases, loading, error, checkPhaseUnlock };
};