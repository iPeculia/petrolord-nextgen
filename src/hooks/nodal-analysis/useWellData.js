import { useState, useEffect } from 'react';
import { useNodalAnalysis } from '@/context/nodal-analysis/NodalAnalysisContext';
import { useToast } from '@/components/ui/use-toast';

export const useWellData = () => {
  const { currentSession, wells, saveWellData, isLoading } = useNodalAnalysis();
  const [wellData, setWellData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (wells && wells.length > 0) {
      setWellData(wells[0]); // Assuming single well per session for now
    } else {
      setWellData(null);
    }
  }, [wells]);

  const updateWellData = async (data) => {
    if (!currentSession) {
      toast({
        title: "No Active Session",
        description: "Please select or create a session first.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await saveWellData(data);
      // State update is handled via context reloading/dispatching
    } catch (error) {
      console.error("Failed to update well data:", error);
      // Toast is handled in context
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    wellData,
    updateWellData,
    loading: loading || isLoading
  };
};