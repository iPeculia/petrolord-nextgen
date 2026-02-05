import { useState, useEffect } from 'react';
import { useNodalAnalysis } from '@/context/nodal-analysis/NodalAnalysisContext';
import { useToast } from '@/components/ui/use-toast';

export const useFluidProperties = () => {
  const { currentSession, fluidProperties, saveFluidProperties, isLoading } = useNodalAnalysis();
  const [properties, setProperties] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setProperties(fluidProperties);
  }, [fluidProperties]);

  const updateFluidProperties = async (data) => {
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
      await saveFluidProperties(data);
    } catch (error) {
      console.error("Failed to update fluid properties:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    fluidProperties: properties,
    updateFluidProperties,
    loading: loading || isLoading
  };
};