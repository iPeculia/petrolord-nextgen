import React, { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/wellLogCorrelationApi';
import { useGlobalDataStore } from '@/store/globalDataStore';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: api.getProjects,
  });
};

export const useProject = (projectId) => {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => api.getProject(projectId),
    enabled: !!projectId,
  });
};

export const useWellLogSamples = (wellId, logType) => {
  const wellLogs = useGlobalDataStore(state => state.wellLogs);
  const loadLogsForWell = useGlobalDataStore(state => state.loadLogsForWell);
  const isLoading = useGlobalDataStore(state => state.isLoading);

  const logData = wellLogs[wellId]?.[logType];

  React.useEffect(() => {
    if (wellId && !wellLogs[wellId]) {
      loadLogsForWell(wellId);
    }
  }, [wellId, wellLogs, loadLogsForWell]);

  return {
    data: logData,
    isLoading: isLoading && !logData,
  };
};

export const useLogCurveSamples = (wellId, curveName) => {
    const { wellLogs, loadLogsForWell, isLoading: isStoreLoading } = useGlobalDataStore(state => ({
        wellLogs: state.wellLogs,
        loadLogsForWell: state.loadLogsForWell,
        isLoading: state.isLoading
    }));

    const samples = useMemo(() => wellLogs[wellId]?.[curveName], [wellLogs, wellId, curveName]);

    React.useEffect(() => {
        if (wellId && !wellLogs[wellId]) {
            loadLogsForWell(wellId);
        }
    }, [wellId, wellLogs, loadLogsForWell]);

    return {
        samples: samples,
        isLoading: isStoreLoading && !samples,
    };
};

export const useWellLogCurves = (wellId, options = {}) => {
  const { wellLogs, loadLogsForWell, isLoading } = useGlobalDataStore(state => ({
    wellLogs: state.wellLogs,
    loadLogsForWell: state.loadLogsForWell,
    isLoading: state.isLoading
  }));

  React.useEffect(() => {
    if (wellId && !wellLogs[wellId] && options.enabled !== false) {
        loadLogsForWell(wellId);
    }
  },[wellId, wellLogs, loadLogsForWell, options.enabled]);

  const curveNames = useMemo(() => {
    return wellLogs[wellId] ? Object.keys(wellLogs[wellId]) : [];
  }, [wellLogs, wellId]);
  
  return {
    curveNames: curveNames,
    isLoading: isLoading && !wellLogs[wellId],
  };
};

export const useStratUnits = (projectId) => {
    return useQuery({
        queryKey: ['stratUnits', projectId],
        queryFn: () => api.getStratUnits(projectId),
        enabled: !!projectId,
    });
};

export const useCorrelationPanel = (panelId) => {
    return useQuery({
        queryKey: ['correlationPanel', panelId],
        queryFn: () => api.getCorrelationPanel(panelId),
        enabled: !!panelId,
    });
};

const useOptimisticMutation = (mutationFn, queryKeyToInvalidate) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: mutationFn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
        },
    });
};

export const useMutationCreateCorrelationLine = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.createCorrelationLine,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['project'] });
            queryClient.invalidateQueries(['correlationPanel', variables.panel_id]);
        },
    });
};

export const useMutationDeleteCorrelationLine = () => {
    return useOptimisticMutation(api.deleteCorrelationLine, ['project']);
};