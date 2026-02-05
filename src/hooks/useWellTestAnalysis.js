import { useWellTestAnalysisContext } from '@/contexts/WellTestAnalysisContext';

export const useWellTestAnalysis = () => {
  const { state, dispatch, log } = useWellTestAnalysisContext();

  const setProject = (project) => dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
  const setWell = (well) => dispatch({ type: 'SET_CURRENT_WELL', payload: well });
  const setTest = (test) => dispatch({ type: 'SET_CURRENT_TEST', payload: test });
  
  const updateParameter = (key, value) => {
    dispatch({ type: 'UPDATE_PARAMETERS', payload: { [key]: value } });
  };

  const setActiveTab = (tabId) => dispatch({ type: 'SET_ACTIVE_TAB', payload: tabId });

  const loadSampleData = () => {
    // Mock loading sample data - Updated to match new standardization format
    const sampleData = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      time: i * 0.5,
      pressure: 4000 - 500 * (1 - Math.exp(-i * 0.05)),
      rate: i < 50 ? 1000 : 0
    }));
    dispatch({ type: 'SET_RAW_DATA', payload: sampleData });
    log('Sample data loaded successfully', 'success');
  };

  return {
    state, // Expose full state object
    ...state, // Spread state for direct access (legacy support)
    dispatch,
    setProject,
    setWell,
    setTest,
    updateParameter,
    setActiveTab,
    loadSampleData,
    log
  };
};