import { useState, useEffect } from 'react';
import { useNodalAnalysis } from '@/context/nodal-analysis/NodalAnalysisContext';
import { useToast } from '@/components/ui/use-toast';

export const useEquipmentData = () => {
  const { currentSession, equipment, saveEquipmentData, isLoading } = useNodalAnalysis();
  const [equipmentData, setEquipmentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setEquipmentData(equipment);
  }, [equipment]);

  const updateEquipmentData = async (data) => {
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
      await saveEquipmentData(data);
    } catch (error) {
      console.error("Failed to update equipment data:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    equipmentData,
    updateEquipmentData,
    loading: loading || isLoading
  };
};