import { useEffect } from 'react';
import useProjectStore from '@/store/projectStore';
import { useAuth } from '@/contexts/SupabaseAuthContext.jsx';

export const useProjects = () => {
  const { user } = useAuth();
  const { projects, currentProject, loading, error, fetchProjects, setCurrentProject } = useProjectStore();

  useEffect(() => {
    // Fetch projects only if a user is logged in and projects haven't been fetched yet.
    if (user && projects.length === 0) {
      fetchProjects();
    }
  }, [user, projects.length, fetchProjects]);

  return {
    projects,
    currentProject,
    loading,
    error,
    fetchProjects,
    setCurrentProject,
  };
};