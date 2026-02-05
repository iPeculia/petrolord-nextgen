import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  loadAnalysis, 
  saveAnalysis,
  createAnalysis as createApi,
  deleteAnalysis as deleteApi,
  listAnalyses as listApi,
} from '@/modules/geoscience/petrophysical-analysis/api/petrophysicalApi.js';
import { usePetrophysicalStore } from '@/modules/geoscience/petrophysical-analysis/store/petrophysicalStore.js';

export const usePetrophysicalAnalysis = (analysisId) => {
  const { updateActiveAnalysis } = usePetrophysicalStore();

  return useQuery({
    queryKey: ['petrophysicalAnalysis', analysisId],
    queryFn: () => loadAnalysis(analysisId),
    enabled: !!analysisId,
    onSuccess: (data) => {
      if (data) {
        // Hydrate store with fetched data
        const analysisData = data.analysis_data[0];
        const analysisResults = data.analysis_results[0];
        
        if (analysisData) {
          updateActiveAnalysis({
            depthRange: analysisData.depth_range,
            selectedLogs: analysisData.log_data,
            parameters: analysisData.parameters
          });
        }
        if (analysisResults) {
          updateActiveAnalysis({ calculations: analysisResults.calculations });
        }
      }
    },
    refetchInterval: 5 * 60 * 1000, // Auto-refetch every 5 minutes
  });
};

export const useSavePetrophysicalAnalysis = () => {
    const queryClient = useQueryClient();
    const { analyses } = usePetrophysicalStore.getState();

    return useMutation({
        mutationFn: ({ analysisId }) => {
            const analysisState = analyses[analysisId] || {};
            return saveAnalysis(analysisId, {
                depth_range: analysisState.depthRange,
                log_data: analysisState.selectedLogs,
                parameters: analysisState.parameters,
            }, {
                calculations: analysisState.calculations
            })
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['petrophysicalAnalysis', variables.analysisId]);
            queryClient.invalidateQueries(['analysisList']);
            usePetrophysicalStore.getState().setUnsavedChanges(false);
        },
    });
};

export const useCreatePetrophysicalAnalysis = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ wellId, name }) => createApi(wellId, name),
    onSuccess: () => {
      queryClient.invalidateQueries(['analysisList']);
    },
  });
};

export const useDeletePetrophysicalAnalysis = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (analysisId) => deleteApi(analysisId),
    onSuccess: () => {
      queryClient.invalidateQueries(['analysisList']);
    },
  });
};

export const useAnalysisList = () => {
  return useQuery({
    queryKey: ['analysisList'],
    queryFn: () => listApi(),
  });
};