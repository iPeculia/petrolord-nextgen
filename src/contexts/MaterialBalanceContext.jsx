import React, { createContext, useReducer, useMemo, useEffect } from 'react';

export const initialState = {
  currentProjectId: null,
  currentTankId: null,
  isDirty: false,
  activeTab: 'dashboard',
  
  ui: {
    leftSidebarOpen: true,
    rightSidebarOpen: true,
    bottomPanelOpen: true,
    theme: 'dark'
  },

  projects: [],
  tanks: [],
  groups: [],
  
  // Data Maps (Keyed by TankID)
  productionHistory: [], 
  productionData: {}, 
  pressureData: {}, 
  pvtData: {}, 
  rockData: {}, 
  wellData: {}, 

  // New Pressure Specific Maps
  pressureHistoryData: {},
  pressurePropsData: {},
  pressureSaturationData: {},
  
  // Current Active Tank State
  pvtTables: { Bo: [], Bg: [], Rs: [], Rv: [], muO: [], muG: [], Bw: [] },
  tankParameters: {
    reservoirType: 'Oil', 
    driveType: 'Volumetric', 
    area: 0,
    thickness: 0,
    porosity: 0.2,
    swi: 0.25,
    temperature: 150,
    initialPressure: 3000,
    currentPressure: 3000,
    bubblePointPressure: 2000,
    cf: 4e-6,
    cw: 3e-6
  },
  
  // Analysis State
  diagnosticPlots: {},
  diagnosticStats: {},
  driveAssessment: null,
  modelFitting: {
      currentModel: null,
      results: null
  },
  waterInflux: {
      modelType: 'fetkovich',
      params: {},
      results: null
  },
  forecasting: {
      settings: {},
      results: [],
      scenarios: []
  },

  calculationLog: [],
  calculationStatus: 'idle'
};

const materialBalanceReducer = (state, action) => {
  const currentState = { ...state, ui: state.ui || initialState.ui };

  switch (action.type) {
    case 'SET_UI_STATE': return { ...currentState, ui: { ...currentState.ui, ...action.payload } };
    case 'TOGGLE_LEFT_SIDEBAR': return { ...currentState, ui: { ...currentState.ui, leftSidebarOpen: !currentState.ui.leftSidebarOpen } };
    case 'TOGGLE_RIGHT_SIDEBAR': return { ...currentState, ui: { ...currentState.ui, rightSidebarOpen: !currentState.ui.rightSidebarOpen } };
    case 'TOGGLE_BOTTOM_PANEL': return { ...currentState, ui: { ...currentState.ui, bottomPanelOpen: !currentState.ui.bottomPanelOpen } };
    
    case 'SET_PROJECT': return { ...currentState, currentProjectId: action.payload };
    case 'SET_ACTIVE_TAB': return { ...currentState, activeTab: action.payload };

    // Bulk Load
    case 'LOAD_SAMPLE_PROJECT':
        return {
            ...currentState,
            projects: [action.payload.project],
            currentProjectId: action.payload.project.id,
            tanks: action.payload.tanks,
            groups: action.payload.groups,
            productionData: action.payload.productionData,
            pvtData: action.payload.pvtData,
            rockData: action.payload.rockData,
            wellData: action.payload.wellData,
            
            // Load new pressure datasets
            pressureHistoryData: action.payload.pressureHistory || {},
            pressurePropsData: action.payload.pressureProps || {},
            pressureSaturationData: action.payload.pressureSaturation || {},

            // Set first tank active
            currentTankId: action.payload.tanks[0]?.id,
            productionHistory: action.payload.productionData[action.payload.tanks[0]?.id] || [],
            tankParameters: action.payload.tanks[0]?.parameters || initialState.tankParameters
        };

    case 'SET_CURRENT_TANK':
        const tank = currentState.tanks.find(t => t.id === action.payload);
        return { 
            ...currentState, 
            currentTankId: action.payload,
            tankParameters: tank ? tank.parameters : initialState.tankParameters,
            productionHistory: currentState.productionData[action.payload] || [],
            // Reset analysis when switching tank
            diagnosticPlots: {},
            modelFitting: initialState.modelFitting
        };
        
    case 'UPDATE_TANK':
        return {
             ...currentState,
             tanks: currentState.tanks.map(t => t.id === action.payload.id ? { ...t, ...action.payload.updates } : t)
        };

    case 'RESET': return initialState;
    
    // Logging
    case 'ADD_LOG': return { ...currentState, calculationLog: [action.payload, ...currentState.calculationLog] };
    case 'CLEAR_LOG': return { ...currentState, calculationLog: [] };

    default: return currentState;
  }
};

const MaterialBalanceContext = createContext(null);

export const MaterialBalanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(materialBalanceReducer, initialState);

  // Restore layout
  useEffect(() => {
    const savedLayout = localStorage.getItem('mb_layout_settings');
    if (savedLayout) {
        try { dispatch({ type: 'SET_UI_STATE', payload: JSON.parse(savedLayout) }); } catch (e) {}
    }
  }, []);

  useEffect(() => {
      if (state.ui) localStorage.setItem('mb_layout_settings', JSON.stringify(state.ui));
  }, [state.ui]);

  const contextValue = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <MaterialBalanceContext.Provider value={contextValue}>
      {children}
    </MaterialBalanceContext.Provider>
  );
};

export default MaterialBalanceContext;