import React, { createContext, useContext, useReducer, useMemo } from 'react';

const VisualizationContext = createContext();

const initialState = {
  mode: '3D', // '2D' or '3D'
  camera: {
    position: [1000, 1000, 1000],
    target: [0, 0, 0],
    zoom: 1
  },
  settings: {
    showWells: true,
    showSurfaces: true,
    showGrid: true,
    verticalExaggeration: 5, // 5x Z-scale for visibility
    colorMap: 'rainbow' // rainbow, spectral, viridis
  },
  selection: {
    selectedObject: null,
    hoveredObject: null
  }
};

const visualizationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'UPDATE_CAMERA':
      return { ...state, camera: { ...state.camera, ...action.payload } };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'SET_SELECTION':
      return { ...state, selection: { ...state.selection, ...action.payload } };
    default:
      return state;
  }
};

export const VisualizationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(visualizationReducer, initialState);

  const actions = useMemo(() => ({
    setMode: (mode) => dispatch({ type: 'SET_MODE', payload: mode }),
    updateSettings: (settings) => dispatch({ type: 'UPDATE_SETTINGS', payload: settings }),
    setSelection: (selection) => dispatch({ type: 'SET_SELECTION', payload: selection }),
    updateCamera: (camera) => dispatch({ type: 'UPDATE_CAMERA', payload: camera })
  }), []);

  return (
    <VisualizationContext.Provider value={{ state, actions }}>
      {children}
    </VisualizationContext.Provider>
  );
};

export const useVisualization = () => {
  const context = useContext(VisualizationContext);
  if (!context) throw new Error('useVisualization must be used within VisualizationProvider');
  return context;
};