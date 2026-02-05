import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export const useStudentModules = () => {
  const { user } = useAuth();
  const [assignedModule, setAssignedModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Fetch the user's assigned module from profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
            module_id, 
            modules (
                id,
                name,
                description,
                icon,
                category
            )
        `)
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // If module is present, set it
      if (profile?.modules) {
        setAssignedModule(profile.modules);
      } else {
        setAssignedModule(null);
      }

    } catch (err) {
      console.error('Error in useStudentModules:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    assignedModule,
    loading,
    error,
    refetch: fetchData
  };
};