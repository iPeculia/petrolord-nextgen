import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { defaultParameters } from '@/data/wellTestAnalysis/defaultModels';
import { validateData } from '@/utils/wellTestAnalysis/dataValidation';
import { calculateBourdetDerivative } from '@/utils/wellTestAnalysis/bourdetDerivative';
import { addDiagnosticTimes } from '@/utils/wellTestAnalysis/superpositionCalculator';
import { detectFlowRegimes } from '@/utils/wellTestAnalysis/flowRegimeDetector';
import { calculateFlowCapacity } from '@/utils/wellTestAnalysis/flowCapacity';

const WellTestAnalysisContext = createContext(null);

const initialState = {
  // Phase 1 State
  projects: [],
  currentProject: null,
  activeTab: 'data-setup',
  
  // Phase 2 State
  rawImportData: [],
  importColumns: [],
  columnMapping: {},
  standardizedData: [],
  validationResult: null,
  importStep: 'upload', // upload -> map -> setup -> complete
  
  // Phase 3 State
  diagnosticData: [],   
  flowRegimes: [],
  
  // Phase 4 State
  matchingResults: {
    parameters: { ...defaultParameters },
    quality: { rmse: 0, rSquared: 0, rating: 'Not Matched' },
    flowCapacity: null,
  },
  forecastScenarios: [],

  // Configuration
  testConfig: {
    type: 'buildup',
    fluidType: 'oil',
    producingTime: 24, // hrs
    porosity: 0.15,
    compressibility: 3e-6,
    rw: 0.3,
    h: 50,
    viscosity: 1.2,
    fvf: 1.1,
    initialPressure: 3000
  },
  
  // Processing Options
  processingConfig: {
      derivativeL: 0.3, 
      smoothingWindow: 3
  },

  plotSettings: {
    showDerivative: true,
    logScale: true,
    showRate: true,
    showRegimes: true,
    showTypeCurve: true,
    showForecast: true,
    primaryPlot: 'loglog' 
  },

  // Phase 5 State
  appSettings: {
    theme: 'dark',
    unitSystem: 'field',
    showTooltips: true,
    autoSave: true
  },
  helpState: {
    isOpen: false,
    activeTopic: null
  },
  
  // Undo/Redo
  history: {
    past: [],
    future: []
  },
  
  selectedModel: 'Infinite Acting Radial Flow',
  logs: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    // --- Data & Setup ---
    case 'SET_RAW_IMPORT': 
        return { 
            ...state, 
            rawImportData: action.payload.data, 
            importColumns: action.payload.columns,
            importStep: 'map'
        };
    case 'SET_COLUMN_MAPPING':
        return { ...state, columnMapping: action.payload };
    case 'SET_STANDARDIZED_DATA': {
        const raw = action.payload;
        const validation = validateData(raw);
        return { 
            ...state, 
            standardizedData: raw,
            validationResult: validation,
            importStep: 'setup',
            diagnosticData: [],
            flowRegimes: []
        };
    }
    case 'UPDATE_TEST_CONFIG':
        return { ...state, testConfig: { ...state.testConfig, ...action.payload } };
    case 'COMPLETE_IMPORT':
        return { ...state, importStep: 'complete', activeTab: 'diagnostics' };

    // --- Diagnostics ---
    case 'RUN_DIAGNOSTICS': {
        const { standardizedData, testConfig, processingConfig } = state;
        if (!standardizedData.length) return state;

        let processed = calculateBourdetDerivative(standardizedData, processingConfig.derivativeL);
        processed = addDiagnosticTimes(processed, testConfig);
        const regimes = detectFlowRegimes(processed);

        return {
            ...state,
            diagnosticData: processed,
            flowRegimes: regimes,
            activeTab: 'diagnostics' 
        };
    }

    // --- Matching ---
    case 'UPDATE_MATCH_PARAMETERS': {
        const newParams = { ...state.matchingResults.parameters, ...action.payload };
        
        // Push current params to history before updating (simple limiting to last 20)
        const newPast = [...state.history.past, state.matchingResults.parameters];
        if (newPast.length > 20) newPast.shift();

        const capacity = calculateFlowCapacity(
            newParams, 
            state.testConfig.h, 
            state.testConfig.viscosity, 
            state.testConfig.fvf
        );

        return {
            ...state,
            matchingResults: {
                ...state.matchingResults,
                parameters: newParams,
                flowCapacity: capacity
            },
            history: {
                past: newPast,
                future: [] // clear future on new action
            }
        };
    }

    // --- App Utils ---
    case 'SET_ACTIVE_TAB': return { ...state, activeTab: action.payload };
    case 'UPDATE_PLOT_SETTINGS': return { ...state, plotSettings: { ...state.plotSettings, ...action.payload } };
    case 'UPDATE_APP_SETTINGS': return { ...state, appSettings: { ...state.appSettings, ...action.payload } };
    case 'ADD_LOG': return { ...state, logs: [...state.logs, action.payload] };
    
    // --- Undo/Redo ---
    case 'UNDO': {
        if (state.history.past.length === 0) return state;
        
        const previous = state.history.past[state.history.past.length - 1];
        const newPast = state.history.past.slice(0, -1);
        const newFuture = [state.matchingResults.parameters, ...state.history.future];
        
        return {
            ...state,
            matchingResults: { ...state.matchingResults, parameters: previous },
            history: { past: newPast, future: newFuture }
        };
    }
    case 'REDO': {
        if (state.history.future.length === 0) return state;
        
        const next = state.history.future[0];
        const newFuture = state.history.future.slice(1);
        const newPast = [...state.history.past, state.matchingResults.parameters];

        return {
            ...state,
            matchingResults: { ...state.matchingResults, parameters: next },
            history: { past: newPast, future: newFuture }
        };
    }

    default: return state;
  }
};

export const WellTestAnalysisProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Auto-save effect
  useEffect(() => {
    if (state.appSettings.autoSave) {
        localStorage.setItem('wta_state_backup', JSON.stringify({
            testConfig: state.testConfig,
            appSettings: state.appSettings
        }));
    }
  }, [state.testConfig, state.appSettings]);

  const log = useCallback((message, type = 'info') => {
    dispatch({ type: 'ADD_LOG', payload: { message, type, timestamp: new Date() } });
  }, []);

  return (
    <WellTestAnalysisContext.Provider value={{ state, dispatch, log }}>
      {children}
    </WellTestAnalysisContext.Provider>
  );
};

export const useWellTestAnalysisContext = () => {
  const context = useContext(WellTestAnalysisContext);
  if (!context) throw new Error('useWellTestAnalysisContext must be used within a WellTestAnalysisProvider');
  return context;
};