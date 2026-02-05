import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/wellLogCorrelationApi';
import { useToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';

export const useWellSelection = (projectId, panelId) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: projectData, isLoading: isLoadingWells } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => api.getProject(projectId),
    enabled: !!projectId,
  });

  const { data: panelData, isLoading: isLoadingPanel } = useQuery({
    queryKey: ['correlationPanel', panelId],
    queryFn: () => api.getCorrelationPanel(panelId),
    enabled: !!panelId,
  });

  const reorderWellsMutation = useMutation({
    mutationFn: (wellboreIds) => api.savePanelWellOrder(panelId, wellboreIds),
    onSuccess: () => {
      toast({ title: 'Well order saved successfully!' });
      queryClient.invalidateQueries({ queryKey: ['correlationPanel', panelId] });
    },
    onError: (error) => {
      toast({ title: 'Error saving well order', description: error.message, variant: 'destructive' });
    },
  });

  const reorderWells = (wellboreIds) => {
    reorderWellsMutation.mutate(wellboreIds);
  };
  
  // These functions are kept for potential direct use but reorderWells is preferred for batch updates.
  const addWellToPanel = (wellboreId) => {
    const currentIds = panelData?.correlation_panel_wells.map(w => w.wellbore_id) || [];
    const newIds = [...currentIds, wellboreId];
    reorderWells(newIds);
  };

  const removeWellFromPanel = (wellboreId) => {
    const currentIds = panelData?.correlation_panel_wells.map(w => w.wellbore_id) || [];
    const newIds = currentIds.filter(id => id !== wellboreId);
    reorderWells(newIds);
  };

  const availableWells = projectData?.wells || [];
  const wellsInPanel = panelData?.correlation_panel_wells || [];

  return {
    availableWells,
    wellsInPanel,
    isLoading: isLoadingWells || isLoadingPanel,
    addWellToPanel,
    removeWellFromPanel,
    reorderWells,
    isUpdating: reorderWellsMutation.isLoading,
  };
};