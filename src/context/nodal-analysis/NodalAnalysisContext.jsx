import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import * as api from '@/services/production/nodalAnalysisService';
import { useToast } from '@/components/ui/use-toast';

const NodalAnalysisContext = createContext();

const initialState = {
  sessions: [],
  currentSession: null,
  activeTab: 'wells', // Default tab
  
  // Data states
  wells: [], 
  equipment: null,
  fluidProperties: null,
  calculationParams: null,
  results: [],
  
  // UI states
  isSidebarOpen: true, // Default open for desktop
  isSidebarCollapsed: false,
  userSettings: {
    theme: 'dark',
    units: 'field', 
    autoSave: true
  },
  
  isLoading: false,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_SESSIONS':
      return { ...state, sessions: action.payload, isLoading: false };
    case 'SET_CURRENT_SESSION':
      return { 
          ...state, 
          currentSession: action.payload,
          wells: action.payload?.nodal_well_data || [], 
          equipment: action.payload?.nodal_equipment_data?.[0] || null,
          fluidProperties: action.payload?.nodal_fluid_properties?.[0] || null,
          calculationParams: action.payload?.nodal_calculation_params?.[0] || null,
          isLoading: false 
      };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_SIDEBAR_OPEN':
      return { ...state, isSidebarOpen: action.payload };
    case 'SET_SIDEBAR_COLLAPSED':
      return { ...state, isSidebarCollapsed: action.payload };
    case 'UPDATE_WELLS':
        return { ...state, wells: action.payload };
    case 'UPDATE_EQUIPMENT':
        return { ...state, equipment: action.payload };
    case 'UPDATE_FLUID_PROPERTIES':
        return { ...state, fluidProperties: action.payload };
    case 'UPDATE_CALC_PARAMS':
        return { ...state, calculationParams: action.payload };
    case 'SET_RESULTS':
        return { ...state, results: action.payload };
    case 'UPDATE_USER_SETTINGS':
        return { ...state, userSettings: { ...state.userSettings, ...action.payload } };
    case 'RESET_SESSION':
        return { 
          ...state, 
          currentSession: null, 
          wells: [], 
          equipment: null, 
          fluidProperties: null, 
          calculationParams: null, 
          results: [],
          activeTab: 'wells'
        };
    default:
      return state;
  }
};

export const NodalAnalysisProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load sidebar state from local storage on mount
  useEffect(() => {
    const savedSidebarState = localStorage.getItem('nodal_sidebar_collapsed');
    if (savedSidebarState !== null) {
      dispatch({ 
        type: 'SET_SIDEBAR_COLLAPSED', 
        payload: JSON.parse(savedSidebarState) 
      });
    }
  }, []);

  const setActiveTab = (tab) => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
  
  const toggleSidebar = () => {
    const newState = !state.isSidebarCollapsed;
    dispatch({ type: 'SET_SIDEBAR_COLLAPSED', payload: newState });
    localStorage.setItem('nodal_sidebar_collapsed', JSON.stringify(newState));
  };

  const setSidebarOpen = (isOpen) => dispatch({ type: 'SET_SIDEBAR_OPEN', payload: isOpen });
  
  const setUserSettings = (settings) => dispatch({ type: 'UPDATE_USER_SETTINGS', payload: settings });

  const setWells = (wells) => dispatch({ type: 'UPDATE_WELLS', payload: wells });
  const setEquipment = (data) => dispatch({ type: 'UPDATE_EQUIPMENT', payload: data });
  const setFluidProperties = (data) => dispatch({ type: 'UPDATE_FLUID_PROPERTIES', payload: data });
  const setCalculationResults = (results) => dispatch({ type: 'SET_RESULTS', payload: results });

  const loadSessions = async () => {
    if (!user) return;
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const sessions = await api.getNodalSessions(user.id);
      dispatch({ type: 'SET_SESSIONS', payload: sessions });
    } catch (error) {
      console.error(error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast({ title: "Error", description: "Failed to load sessions", variant: "destructive" });
    }
  };

  const loadSession = async (sessionId) => {
    if (!sessionId) {
        dispatch({ type: 'RESET_SESSION' });
        return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const session = await api.getNodalSessionById(sessionId);
      if (session) {
        dispatch({ type: 'SET_CURRENT_SESSION', payload: session });
      } else {
         dispatch({ type: 'SET_ERROR', payload: 'Session not found' });
      }
    } catch (error) {
       console.error(error);
       dispatch({ type: 'SET_ERROR', payload: error.message });
       toast({ title: "Error", description: "Failed to load session details", variant: "destructive" });
    }
  };

  const createSession = async (name, description, projectId = null) => {
      if(!user) return;
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
          const newSession = await api.createNodalSession({
              user_id: user.id,
              name,
              description,
              project_id: projectId
          });
          
          dispatch({ type: 'SET_CURRENT_SESSION', payload: newSession });
          loadSessions(); 
          return newSession;
      } catch (error) {
          console.error(error);
          dispatch({ type: 'SET_ERROR', payload: error.message });
          throw error;
      }
  };

  const saveWellData = async (data) => {
      if(!state.currentSession) return;
      try {
          const saved = await api.upsertWellData({ ...data, session_id: state.currentSession.id });
          dispatch({ type: 'UPDATE_WELLS', payload: [saved] }); 
          toast({ title: "Success", description: "Well data saved" });
      } catch (error) {
          toast({ title: "Error", description: "Failed to save well data", variant: "destructive" });
          throw error;
      }
  };

  const saveEquipmentData = async (data) => {
      if(!state.currentSession) return;
      try {
          const saved = await api.upsertEquipmentData({ ...data, session_id: state.currentSession.id });
          dispatch({ type: 'UPDATE_EQUIPMENT', payload: saved });
          toast({ title: "Success", description: "Equipment data saved" });
      } catch (error) {
          toast({ title: "Error", description: "Failed to save equipment data", variant: "destructive" });
          throw error;
      }
  };

  const saveFluidProperties = async (data) => {
      if(!state.currentSession) return;
      try {
          const saved = await api.upsertFluidProperties({ ...data, session_id: state.currentSession.id });
          dispatch({ type: 'UPDATE_FLUID_PROPERTIES', payload: saved });
          toast({ title: "Success", description: "Fluid properties saved" });
      } catch (error) {
          toast({ title: "Error", description: "Failed to save fluid properties", variant: "destructive" });
          throw error;
      }
  };

  const saveCalculationParams = async (data) => {
      if(!state.currentSession) return;
      try {
          const saved = await api.upsertCalculationParams({ ...data, session_id: state.currentSession.id });
          dispatch({ type: 'UPDATE_CALC_PARAMS', payload: saved });
          toast({ title: "Success", description: "Parameters saved" });
      } catch (error) {
          toast({ title: "Error", description: "Failed to save parameters", variant: "destructive" });
          throw error;
      }
  };

  return (
    <NodalAnalysisContext.Provider value={{ 
        ...state, 
        setActiveTab,
        toggleSidebar,
        setSidebarOpen,
        setUserSettings,
        setWells,
        setEquipment,
        setFluidProperties,
        setCalculationResults,
        loadSessions, 
        loadSession, 
        createSession,
        saveWellData,
        saveEquipmentData,
        saveFluidProperties,
        saveCalculationParams
    }}>
      {children}
    </NodalAnalysisContext.Provider>
  );
};

export const useNodalAnalysis = () => {
  const context = useContext(NodalAnalysisContext);
  if (!context) {
    throw new Error('useNodalAnalysis must be used within a NodalAnalysisProvider');
  }
  return context;
};