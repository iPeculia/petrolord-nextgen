import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { usePetrolordContext } from '@/utils/integration/deepLinkingUtils';
import { useToast } from '@/components/ui/use-toast';

const DesignContext = createContext(null);

export const DesignContextProvider = ({ children }) => {
  const { projectId: urlProjectId, wellId: urlWellId } = usePetrolordContext();
  const [activeProject, setActiveProject] = useState(null);
  const [activeWell, setActiveWell] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadContext = async () => {
      if (!urlProjectId && !urlWellId) return;
      
      setLoading(true);
      try {
        // 1. Load Well if ID present
        if (urlWellId) {
          const { data: well, error: wellError } = await supabase
            .from('wells')
            .select('*, projects(*)')
            .eq('id', urlWellId)
            .single();
          
          if (wellError) throw wellError;
          setActiveWell(well);
          
          // Auto-set project from well if not explicitly set
          if (well.projects) {
            setActiveProject(well.projects);
          }
        } 
        // 2. Load Project if only Project ID present
        else if (urlProjectId) {
          const { data: project, error: projError } = await supabase
            .from('projects')
            .select('*')
            .eq('id', urlProjectId)
            .single();
            
          if (projError) throw projError;
          setActiveProject(project);
        }
      } catch (error) {
        console.error("Context Load Error:", error);
        toast({
          title: "Context Loading Failed",
          description: "Could not load the requested project or well context.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadContext();
  }, [urlProjectId, urlWellId, toast]);

  const clearContext = () => {
    setActiveProject(null);
    setActiveWell(null);
  };

  return (
    <DesignContext.Provider value={{ 
      activeProject, 
      activeWell, 
      loading, 
      clearContext,
      hasActiveContext: !!(activeProject || activeWell)
    }}>
      {children}
    </DesignContext.Provider>
  );
};

export const useDesignContext = () => {
  const context = useContext(DesignContext);
  if (!context) {
    throw new Error('useDesignContext must be used within a DesignContextProvider');
  }
  return context;
};