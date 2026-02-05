import { useEffect } from 'react';
import { usePetrophysicalStore } from '@/modules/geoscience/petrophysical-analysis/store/petrophysicalStore.js';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { saveAnalysis } from '@/modules/geoscience/petrophysical-analysis/api/petrophysicalApi.js';
import { useToast } from '@/components/ui/use-toast.js';

// This hook manages the synchronization between local state (Zustand) and the backend (Supabase)
export const useAnalysisState = (analysisId) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { analysisData, calculations, unsavedChanges, markAsSaved } = usePetrophysicalStore();

  const saveMutation = useMutation({
    mutationFn: () => saveAnalysis(analysisId, {
      depth_range: analysisData.depthRange,
      log_data: analysisData.selectedLogs,
      parameters: analysisData.parameters
    }, {
      calculations: calculations
    }),
    onSuccess: () => {
      markAsSaved();
      queryClient.invalidateQueries(['petrophysicalAnalysis', analysisId]);
      toast({ title: "Success", description: "Analysis saved successfully." });
    },
    onError: (error) => {
      console.error("Failed to save analysis:", error);
      toast({ title: "Error", description: "Failed to save analysis.", variant: "destructive" });
    },
  });

  // Effect for auto-saving to Supabase
  useEffect(() => {
    if (!analysisId) return;

    const interval = setInterval(() => {
      if (unsavedChanges) {
        console.log('Auto-saving to Supabase...');
        saveMutation.mutate();
      }
    }, 30000); // Sync with Supabase every 30 seconds

    return () => clearInterval(interval);
  }, [analysisId, unsavedChanges, saveMutation]);
  
  // Effect to sync on tab focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && unsavedChanges) {
        console.log('Syncing on tab focus...');
        saveMutation.mutate();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [unsavedChanges, saveMutation]);


  return {
    save: saveMutation.mutate,
    isSaving: saveMutation.isLoading,
  };
};