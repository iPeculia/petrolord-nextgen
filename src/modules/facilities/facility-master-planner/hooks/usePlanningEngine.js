import { useState, useCallback } from 'react';
import usePlanningWorker from './usePlanningWorker';
import FacilityPlanningEngine from '../utils/facilityPlanningEngine';

/**
 * Hook exposing high-level planning engine functions to components.
 * Abstracts away the worker vs main thread logic.
 */
const usePlanningEngine = () => {
  const { runTask, getTask, tasks, isProcessing } = usePlanningWorker();
  
  // Track last run IDs for convenience
  const [lastAnalysisId, setLastAnalysisId] = useState(null);

  /**
   * Run full master plan analysis in background worker.
   */
  const runFullAnalysis = useCallback((projectData) => {
      const id = runTask('RUN_FULL_ANALYSIS', projectData);
      setLastAnalysisId(id);
      return id;
  }, [runTask]);

  /**
   * Generate expansion plan (lightweight, can run directly or via worker).
   * Using worker for consistency.
   */
  const generateExpansionPlan = useCallback((profile, facility) => {
      return runTask('GENERATE_EXPANSION_PLAN', { productionProfile: profile, facilityDesign: facility });
  }, [runTask]);

  /**
   * Synchronous helper for quick CAPEX estimates (UI feedback).
   */
  const estimateQuickCapex = useCallback((type, capacity) => {
      try {
          return FacilityPlanningEngine.calculateCAPEX(type, capacity);
      } catch (e) {
          console.error("Quick CAPEX failed", e);
          return 0;
      }
  }, []);

  return {
    // Actions
    runFullAnalysis,
    generateExpansionPlan,
    estimateQuickCapex,
    
    // State
    isProcessing,
    activeTasks: tasks,
    lastAnalysisResult: lastAnalysisId ? tasks[lastAnalysisId] : null,
    
    // Utilities
    getTaskStatus: (id) => getTask(id)
  };
};

export default usePlanningEngine;