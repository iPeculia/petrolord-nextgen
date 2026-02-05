import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { SAMPLE_MODELS_DATA } from '@/data/reservoirSimulation/sampleModelsData';
import { EXERCISES } from '@/data/reservoirSimulation/exercises';

const ReservoirSimulationContext = createContext();

const initialState = {
  models: SAMPLE_MODELS_DATA,
  exercises: EXERCISES,
  activeTab: 'overview',
  activeSidebarTab: 'models',
  selectedModel: null,
  selectedExercise: null,
  simulationState: {
    isPlaying: false,
    isLooping: false,
    currentTimeStep: 0,
    totalTimeSteps: 50,
    speed: 1,
    viewMode: 'map',
    viewVariable: 'pressure',
    parameters: {
      permeabilityMultiplier: 1.0,
      porosityMultiplier: 1.0,
      productionRateMultiplier: 1.0,
    }
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_TAB': return { ...state, activeTab: action.payload };
    case 'SET_SIDEBAR_TAB': return { ...state, activeSidebarTab: action.payload };
    case 'LOAD_SAMPLE_MODEL':
      return { 
        ...state, 
        selectedModel: action.payload,
        selectedExercise: null,
        simulationState: { 
            ...state.simulationState, 
            currentTimeStep: 0, 
            isPlaying: false,
            totalTimeSteps: (action.payload.timeSteps?.length || 1) - 1
        }
      };
    case 'SET_TIME_STEP':
      return {
        ...state,
        simulationState: {
          ...state.simulationState,
          currentTimeStep: Math.min(Math.max(0, action.payload), state.simulationState.totalTimeSteps)
        }
      };
    case 'STEP_FORWARD':
      const nextStep = state.simulationState.currentTimeStep + 1;
      if (nextStep > state.simulationState.totalTimeSteps) return state; 
      return { ...state, simulationState: { ...state.simulationState, currentTimeStep: nextStep } };
    case 'TOGGLE_PLAY_PAUSE':
      return { ...state, simulationState: { ...state.simulationState, isPlaying: !state.simulationState.isPlaying } };
    case 'SET_PLAYING':
        return { ...state, simulationState: { ...state.simulationState, isPlaying: action.payload } };
    case 'TOGGLE_LOOP':
        return { ...state, simulationState: { ...state.simulationState, isLooping: !state.simulationState.isLooping } };
    case 'SET_SPEED':
        return { ...state, simulationState: { ...state.simulationState, speed: action.payload } };
    case 'SET_VIEW_MODE':
      return { ...state, simulationState: { ...state.simulationState, viewMode: action.payload } };
    case 'SET_VIEW_VARIABLE':
        return { ...state, simulationState: { ...state.simulationState, viewVariable: action.payload } };
    case 'SELECT_EXERCISE':
      return { ...state, selectedExercise: action.payload };
    default:
      return state;
  }
};

function useInterval(callback, delay) {
  const savedCallback = useRef();
  useEffect(() => { savedCallback.current = callback; }, [callback]);
  useEffect(() => {
    function tick() { savedCallback.current(); }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export const ReservoirSimulationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!state.selectedModel && state.models.length > 0) {
      dispatch({ type: 'LOAD_SAMPLE_MODEL', payload: state.models[0] });
    }
  }, []);

  useInterval(() => {
    if (state.simulationState.isPlaying) {
        if (state.simulationState.currentTimeStep < state.simulationState.totalTimeSteps) {
            dispatch({ type: 'STEP_FORWARD' });
        } else {
            if (state.simulationState.isLooping) {
                dispatch({ type: 'SET_TIME_STEP', payload: 0 });
            } else {
                dispatch({ type: 'SET_PLAYING', payload: false });
            }
        }
    }
  }, state.simulationState.isPlaying ? 800 : null);

  return (
    <ReservoirSimulationContext.Provider value={{ state, dispatch }}>
      {children}
    </ReservoirSimulationContext.Provider>
  );
};

export const useReservoirSimulation = () => {
  const context = useContext(ReservoirSimulationContext);
  if (!context) throw new Error('useReservoirSimulation must be used within a ReservoirSimulationProvider');
  return context;
};