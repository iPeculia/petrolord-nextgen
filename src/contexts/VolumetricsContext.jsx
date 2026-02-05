import React, { createContext, useContext, useReducer, useMemo } from 'react';
import { LoggingService } from "@/services/common/LoggingService";

const VolumetricsContext = createContext();

const initialState = {
  project: {
    id: null,
    name: 'Untitled Project',
    status: 'draft', // draft, calculating, complete, error
    lastModified: null,
    description: ''
  },
  inputMethod: 'simple', // simple, hybrid, surfaces
  data: {
    surface: null,
    well: null,
    logs: null,
    surfaces: [], 
    parameters: {
        // Default demo params
        area: 500,
        thickness: 85,
        porosity: 0.22,
        water_saturation: 0.35,
        formation_volume_factor: 1.25,
        recovery_factor: 0.30,
        unit_system: 'Imperial'
    },
    results: null
  },
  analysis: {
      scenarios: [],
      sensitivityData: null,
      monteCarloResults: null
  },
  calculation: {
    isCalculating: false,
    progress: 0,
    error: null
  },
  visualization: {
    mode: '2D', // 2D, 3D
    settings: {
      showGrid: true,
      showWells: true,
      showSurfaces: true,
      verticalExaggeration: 5
    }
  },
  ui: {
    leftPanelCollapsed: false,
    rightPanelCollapsed: false,
    bottomPanelCollapsed: false,
    activeTab: 'input'
  },
  logs: []
};

const volumetricsReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_FULL_PROJECT':
       // Replaces entire state with loaded project
       return { ...initialState, ...action.payload };
    case 'SET_PROJECT':
      return { ...state, project: { ...state.project, ...action.payload } };
    case 'SET_INPUT_METHOD':
      return { ...state, inputMethod: action.payload };
    case 'UPDATE_DATA':
      return { ...state, data: { ...state.data, ...action.payload } };
    case 'UPDATE_ANALYSIS':
      return { ...state, analysis: { ...state.analysis, ...action.payload } };
    case 'SET_CALCULATION_STATUS':
      return { ...state, calculation: { ...state.calculation, ...action.payload } };
    case 'SET_VISUALIZATION':
      return { ...state, visualization: { ...state.visualization, ...action.payload } };
    case 'TOGGLE_PANEL':
      return { ...state, ui: { ...state.ui, [action.payload]: !state.ui[action.payload] } };
    case 'SET_ACTIVE_TAB':
      return { ...state, ui: { ...state.ui, activeTab: action.payload } };
    case 'ADD_LOG':
      return { 
        ...state, 
        logs: [
          { id: Date.now(), timestamp: new Date(), ...action.payload },
          ...state.logs
        ].slice(0, 100) // Keep last 100 logs
      };
    case 'CLEAR_LOGS':
      return { ...state, logs: [] };
    default:
      return state;
  }
};

export const VolumetricsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(volumetricsReducer, initialState);

  const actions = useMemo(() => ({
    loadProjectState: (fullState) => {
        dispatch({ type: 'LOAD_FULL_PROJECT', payload: fullState });
        LoggingService.info("Project state loaded", { projectId: fullState.project.id });
    },
    setProject: (projectData) => dispatch({ type: 'SET_PROJECT', payload: projectData }),
    setInputMethod: (method) => {
      dispatch({ type: 'SET_INPUT_METHOD', payload: method });
      dispatch({ type: 'ADD_LOG', payload: { level: 'info', message: `Input method changed to ${method}` } });
    },
    updateData: (data) => dispatch({ type: 'UPDATE_DATA', payload: data }),
    updateAnalysis: (data) => dispatch({ type: 'UPDATE_ANALYSIS', payload: data }),
    setVisualizationState: (settings) => dispatch({ type: 'SET_VISUALIZATION', payload: settings }),
    togglePanel: (panelName) => dispatch({ type: 'TOGGLE_PANEL', payload: panelName }),
    setActiveTab: (tab) => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab }),
    addLog: (message, level = 'info') => {
        dispatch({ type: 'ADD_LOG', payload: { message, level } });
        
        // Safe logging execution
        if (typeof LoggingService[level] === 'function') {
            LoggingService[level](message);
        } else {
            // Fallback for custom levels like 'success' if not implemented in service
            LoggingService.info(`[${level.toUpperCase()}] ${message}`);
        }
    },
    clearLogs: () => dispatch({ type: 'CLEAR_LOGS' })
  }), []);

  return (
    <VolumetricsContext.Provider value={{ state, actions }}>
      {children}
    </VolumetricsContext.Provider>
  );
};

export const useVolumetrics = () => {
  const context = useContext(VolumetricsContext);
  if (!context) {
    throw new Error('useVolumetrics must be used within a VolumetricsProvider');
  }
  return context;
};