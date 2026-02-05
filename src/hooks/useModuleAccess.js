import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

/**
 * Hook to determine if a specific module is locked for the current user.
 * 
 * @param {string} moduleId - The ID of the module to check
 * @returns {Object} { isLocked, lockReason, unlockDate, loading, canAccess, checkAccess }
 */
export const useModuleAccess = (moduleId) => {
  const { user, role } = useAuth();
  const [isLocked, setIsLocked] = useState(false);
  const [lockReason, setLockReason] = useState(null);
  const [unlockDate, setUnlockDate] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lecturers and Admins always bypass locks
  const canAccess = role === 'admin' || role === 'super_admin' || role === 'lecturer' || !isLocked;

  const checkAccess = async () => {
    if (!user || !moduleId) {
      setLoading(false);
      return;
    }

    // Bypass check for privileged roles immediately
    if (role === 'admin' || role === 'super_admin' || role === 'lecturer') {
      setIsLocked(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('module_access_locks')
        .select('is_locked, lock_reason, unlock_date')
        .eq('student_id', user.id)
        .eq('module_id', moduleId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // Ignore "no rows" error
        console.error('Error fetching module access:', error);
      }

      if (data) {
        setIsLocked(data.is_locked);
        setLockReason(data.lock_reason);
        setUnlockDate(data.unlock_date);
      } else {
        // Default to unlocked if no lock record exists
        setIsLocked(false);
        setLockReason(null);
        setUnlockDate(null);
      }
    } catch (err) {
      console.error('Unexpected error in useModuleAccess:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAccess();
  }, [user, moduleId, role]);

  return {
    isLocked,
    lockReason,
    unlockDate,
    loading,
    canAccess,
    checkAccess
  };
};

export default useModuleAccess;