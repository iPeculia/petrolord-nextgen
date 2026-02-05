import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { sampleWells } from '@/data/wellCorrelation/sampleWells';
import { sampleMarkers } from '@/data/wellCorrelation/sampleMarkers';
import { sampleHorizons } from '@/data/wellCorrelation/sampleHorizons';
import { WellDataService } from '@/services/wellCorrelation/WellDataService';
import { UndoRedoService } from '@/services/wellCorrelation/UndoRedoService';
import { AutoSuggestionEngine } from '@/services/wellCorrelation/AutoSuggestionEngine';

const WellCorrelationContext = createContext(null);

// Safe initial state ensuring all arrays are initialized
const initialState = {
    project: null,
    wells: [], 
    selectedWellIds: [],
    activeWellId: null,
    
    correlationPanels: [{ id: 'default-panel', name: 'Main View', wellIds: [], zoom: 1, scroll: 0 }],
    activePanelId: 'default-panel',
    markers: [],
    horizons: [],
    suggestions: [],
    comments: [],
    qcResults: [],
    
    settings: {
        trackWidth: 200,
        verticalScale: 5,
        theme: 'dark',
        showGrid: true,
        depthUnit: 'M',
        autoSuggest: true
    },
    
    isLoading: true,
    error: null,
    importHistory: []
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };
            
        case 'INITIALIZE_SUCCESS':
            const initializedState = { 
                ...state, 
                project: action.payload.project || {}, 
                wells: Array.isArray(action.payload.wells) ? action.payload.wells : [],
                markers: Array.isArray(action.payload.markers) ? action.payload.markers : [],
                horizons: Array.isArray(action.payload.horizons) ? action.payload.horizons : [],
                isLoading: false, 
                error: null
            };
            // Only init service if it exists
            if (UndoRedoService && typeof UndoRedoService.init === 'function') {
                UndoRedoService.init(initializedState);
            }
            return initializedState;
            
        case 'ADD_WELL': {
            if (!action.payload) return state;
            const newState = { 
                ...state, 
                wells: [...(state.wells || []), action.payload],
                importHistory: [...(state.importHistory || []), { 
                    id: Date.now(), 
                    wellName: action.payload.name || 'Imported Well', 
                    date: new Date().toISOString(), 
                    status: 'Success' 
                }]
            };
            if (UndoRedoService?.pushState) UndoRedoService.pushState(newState);
            return newState;
        }
            
        case 'REMOVE_WELL': {
            if (!action.payload) return state;
            const newState = {
                ...state,
                wells: (state.wells || []).filter(w => w.id !== action.payload),
                selectedWellIds: (state.selectedWellIds || []).filter(id => id !== action.payload)
            };
            if (UndoRedoService?.pushState) UndoRedoService.pushState(newState);
            return newState;
        }

        case 'TOGGLE_WELL_SELECTION': {
            const id = action.payload;
            if (!id) return state;
            
            const currentSelection = state.selectedWellIds || [];
            const isSelected = currentSelection.includes(id);
            
            const newSelection = isSelected 
                ? currentSelection.filter(wid => wid !== id)
                : [...currentSelection, id];
            
            const updatedPanels = (state.correlationPanels || []).map(p => 
                p.id === state.activePanelId ? { ...p, wellIds: newSelection } : p
            );

            return {
                ...state,
                selectedWellIds: newSelection,
                correlationPanels: updatedPanels
            };
        }

        case 'ADD_MARKER': {
            const newState = { ...state, markers: [...(state.markers || []), action.payload] };
            if (UndoRedoService?.pushState) UndoRedoService.pushState(newState);
            return newState;
        }
            
        case 'UPDATE_MARKER': {
             const newState = { 
                 ...state, 
                 markers: (state.markers || []).map(m => m.id === action.payload.id ? action.payload : m)
             };
             if (UndoRedoService?.pushState) UndoRedoService.pushState(newState);
             return newState;
        }

        case 'DELETE_MARKER': {
             const newState = { ...state, markers: (state.markers || []).filter(m => m.id !== action.payload) };
             if (UndoRedoService?.pushState) UndoRedoService.pushState(newState);
             return newState;
        }

        case 'ADD_HORIZON': {
             const newState = { ...state, horizons: [...(state.horizons || []), action.payload] };
             if (UndoRedoService?.pushState) UndoRedoService.pushState(newState);
             return newState;
        }

        case 'UPDATE_SETTINGS':
            return { ...state, settings: { ...(state.settings || {}), ...action.payload } };

        case 'ADD_COMMENT':
            return { ...state, comments: [...(state.comments || []), action.payload] };

        case 'SET_QC_RESULTS':
            return { ...state, qcResults: action.payload || [] };

        case 'SET_SUGGESTIONS':
            return { ...state, suggestions: action.payload || [] };

        case 'RESTORE_STATE':
            return { ...action.payload };

        default:
            return state;
    }
}

export const WellCorrelationProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const initializeProject = useCallback(async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Robust checks for sample data
            const safeWells = Array.isArray(sampleWells) ? sampleWells : [];
            const safeMarkers = Array.isArray(sampleMarkers) ? sampleMarkers : [];
            const safeHorizons = Array.isArray(sampleHorizons) ? sampleHorizons : [];

            dispatch({ 
                type: 'INITIALIZE_SUCCESS', 
                payload: {
                    project: { id: 'proj-1', name: 'North Sea Exploration' },
                    wells: safeWells,
                    markers: safeMarkers,
                    horizons: safeHorizons
                } 
            });
        } catch (err) {
            console.error("Init Error:", err);
            dispatch({ type: 'SET_ERROR', payload: "Failed to initialize project." });
        }
    }, []);

    useEffect(() => {
        initializeProject();
    }, [initializeProject]);

    // Effect to run auto-suggestions when wells or markers change
    useEffect(() => {
        if (state.settings?.autoSuggest && state.wells && state.wells.length > 0) {
            try {
                if (AutoSuggestionEngine && typeof AutoSuggestionEngine.analyzeCorrelations === 'function') {
                    const suggestions = AutoSuggestionEngine.analyzeCorrelations(state.wells, state.markers || []);
                    dispatch({ type: 'SET_SUGGESTIONS', payload: suggestions });
                }
            } catch (e) {
                console.error("Auto suggestion error", e);
            }
        }
    }, [state.wells, state.markers, state.settings]);

    const actions = {
        addWell: (well) => dispatch({ type: 'ADD_WELL', payload: well }),
        removeWell: (id) => dispatch({ type: 'REMOVE_WELL', payload: id }),
        toggleWellSelection: (id) => dispatch({ type: 'TOGGLE_WELL_SELECTION', payload: id }),
        updateSettings: (settings) => dispatch({ type: 'UPDATE_SETTINGS', payload: settings }),
        
        addMarker: (marker) => dispatch({ type: 'ADD_MARKER', payload: marker }),
        updateMarker: (marker) => dispatch({ type: 'UPDATE_MARKER', payload: marker }),
        deleteMarker: (id) => dispatch({ type: 'DELETE_MARKER', payload: id }),
        addHorizon: (horizon) => dispatch({ type: 'ADD_HORIZON', payload: horizon }),
        
        addComment: (comment) => dispatch({ type: 'ADD_COMMENT', payload: comment }),
        setQCResults: (results) => dispatch({ type: 'SET_QC_RESULTS', payload: results }),
        
        undo: () => {
            if (UndoRedoService?.undo) {
                const prevState = UndoRedoService.undo();
                if (prevState) dispatch({ type: 'RESTORE_STATE', payload: prevState });
            }
        },
        redo: () => {
            if (UndoRedoService?.redo) {
                const nextState = UndoRedoService.redo();
                if (nextState) dispatch({ type: 'RESTORE_STATE', payload: nextState });
            }
        },

        importWellFromLas: async (file) => {
            try {
                if (WellDataService?.importLasFile) {
                    const wellData = await WellDataService.importLasFile(file);
                    dispatch({ type: 'ADD_WELL', payload: wellData });
                    return wellData;
                }
                throw new Error("WellDataService not available");
            } catch (error) {
                console.error("Import error:", error);
                throw error;
            }
        },
        retry: initializeProject
    };

    return (
        <WellCorrelationContext.Provider value={{ state, actions }}>
            {children}
        </WellCorrelationContext.Provider>
    );
};

export const useWellCorrelation = () => {
    const context = useContext(WellCorrelationContext);
    if (!context) {
        throw new Error("useWellCorrelation must be used within a WellCorrelationProvider");
    }
    return context;
};