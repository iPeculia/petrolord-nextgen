import { useContext } from 'react';
import MaterialBalanceContext, { initialState } from '@/contexts/MaterialBalanceContext';

export const useMaterialBalance = () => {
  const context = useContext(MaterialBalanceContext);
  if (!context) throw new Error('useMaterialBalance must be used within a MaterialBalanceProvider');
  const { state, dispatch } = context;
  
  const safeState = state || initialState;

  // Actions
  const loadSampleProject = (data) => {
      dispatch({ type: 'LOAD_SAMPLE_PROJECT', payload: data });
      logMessage("Sample project loaded successfully", "success");
  };

  const setCurrentTank = (tankId) => {
      dispatch({ type: 'SET_CURRENT_TANK', payload: tankId });
  };
  
  const clearProject = () => {
      dispatch({ type: 'RESET' });
  };
  
  const logMessage = (message, type='info') => {
      dispatch({ type: 'ADD_LOG', payload: { message, type, timestamp: new Date() }});
  };
  
  // Navigation
  const setActiveTab = (tab) => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
  const toggleLeftSidebar = () => dispatch({ type: 'TOGGLE_LEFT_SIDEBAR' });
  const toggleRightSidebar = () => dispatch({ type: 'TOGGLE_RIGHT_SIDEBAR' });
  const toggleBottomPanel = () => dispatch({ type: 'TOGGLE_BOTTOM_PANEL' });

  // Computed
  const currentTank = safeState.tanks.find(t => t.id === safeState.currentTankId);
  const tankRockData = currentTank ? safeState.rockData[currentTank.id] : null;
  const tankWellData = currentTank ? safeState.wellData[currentTank.id] : [];
  const tankPvtData = currentTank ? safeState.pvtData[currentTank.id] : [];
  
  // New Computed Pressure Data
  const tankPressureHistory = currentTank ? (safeState.pressureHistoryData[currentTank.id] || []) : [];
  const tankPressureProps = currentTank ? (safeState.pressurePropsData[currentTank.id] || []) : [];
  const tankPressureSaturation = currentTank ? (safeState.pressureSaturationData[currentTank.id] || []) : [];

  return {
    state: safeState,
    dispatch,
    
    // UI State
    ui: safeState.ui,
    activeTab: safeState.activeTab,
    
    // Data Accessors
    currentProjectId: safeState.currentProjectId,
    currentTankId: safeState.currentTankId,
    currentProject: safeState.projects[0], // Simplified for single project mode
    currentTank,
    tanks: safeState.tanks,
    groups: safeState.groups,
    
    // Active Tank Data
    productionHistory: safeState.productionHistory,
    tankParameters: safeState.tankParameters,
    rockData: tankRockData,
    wellData: tankWellData,
    pvtData: tankPvtData,
    
    // Active Tank Pressure Data
    pressureHistory: tankPressureHistory,
    pressureProps: tankPressureProps,
    pressureSaturation: tankPressureSaturation,
    
    // Analysis
    diagnosticPlots: safeState.diagnosticPlots,
    diagnosticStats: safeState.diagnosticStats,
    modelFitting: safeState.modelFitting,
    
    // Logs
    calculationLog: safeState.calculationLog,

    // Methods
    loadSampleProject,
    setCurrentTank,
    setActiveTab,
    clearProject,
    logMessage,
    toggleLeftSidebar,
    toggleRightSidebar,
    toggleBottomPanel,
    updateTank: (id, updates) => dispatch({ type: 'UPDATE_TANK', payload: { id, updates } })
  };
};

export default useMaterialBalance;