import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Correctly importing validations from their respective model files
import { validateProject } from '@/services/torqueDrag/models/Project';
import { validateWell } from '@/services/torqueDrag/models/Well';
import { validateTrajectoryStation } from '@/services/torqueDrag/models/TrajectoryStation';
import { validateTubularComponent } from '@/services/torqueDrag/models/TubularComponent';
import { validateDrillString } from '@/services/torqueDrag/models/DrillString';
import { validateDrillingFluid } from '@/services/torqueDrag/models/DrillingFluid';
import { validateFrictionCoefficient } from '@/services/torqueDrag/models/FrictionCoefficient';
import { validateTDScenario } from '@/services/torqueDrag/models/TDScenario';
import { validateTDAnalysisResult } from '@/services/torqueDrag/models/TDAnalysisResult';
import { validateDepthResult } from '@/services/torqueDrag/models/DepthResult';
import { validateBucklingAnalysis } from '@/services/torqueDrag/models/BucklingAnalysis';
import { validateOperationalLimit } from '@/services/torqueDrag/models/OperationalLimit';

import * as DemoData from '@/services/torqueDrag/data/demoData';

const TorqueDragContext = createContext();

export const useTorqueDrag = () => {
  const context = useContext(TorqueDragContext);
  if (!context) {
    throw new Error('useTorqueDrag must be used within a TorqueDragProvider');
  }
  return context;
};

export const TorqueDragProvider = ({ children }) => {
  // Data State
  const [projects, setProjects] = useState([]);
  const [current_project, setCurrentProjectState] = useState(null);
  
  const [wells, setWells] = useState([]);
  const [current_well, setCurrentWellState] = useState(null);
  
  const [trajectory_stations, setTrajectoryStations] = useState([]);
  const [tubular_components, setTubularComponents] = useState([]);
  const [drill_strings, setDrillStrings] = useState([]);
  const [drilling_fluids, setDrillingFluids] = useState([]);
  const [friction_coefficients, setFrictionCoefficients] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [analysis_results, setAnalysisResults] = useState([]);
  const [buckling_analysis, setBucklingAnalysis] = useState([]);
  const [operational_limits, setOperationalLimits] = useState([]);
  
  // UI State
  const [current_tab, setCurrentTab] = useState('Setup');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Persistence Key
  const STORAGE_KEY = 'torque_drag_data_v1';

  // Load from LocalStorage
  useEffect(() => {
    const loadData = () => {
      try {
        setLoading(true);
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          setProjects(parsed.projects || []);
          setWells(parsed.wells || []);
          setTrajectoryStations(parsed.trajectory_stations || []);
          setTubularComponents(parsed.tubular_components || []);
          setDrillStrings(parsed.drill_strings || []);
          setDrillingFluids(parsed.drilling_fluids || []);
          setFrictionCoefficients(parsed.friction_coefficients || []);
          setScenarios(parsed.scenarios || []);
          setAnalysisResults(parsed.analysis_results || []);
          setBucklingAnalysis(parsed.buckling_analysis || []);
          setOperationalLimits(parsed.operational_limits || []);
          
          // Restore selections if possible
          if (parsed.projects && parsed.projects.length > 0) {
              setCurrentProjectState(parsed.projects[0]);
              if (parsed.wells && parsed.wells.length > 0) {
                  setCurrentWellState(parsed.wells.find(w => w.project_id === parsed.projects[0].project_id) || null);
              }
          }
        } else {
          initializeDemoData();
        }
      } catch (err) {
        console.error('Failed to load Torque & Drag data:', err);
        setError('Failed to load saved data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Auto-save
  useEffect(() => {
    const saveData = setTimeout(() => {
      const dataToSave = {
        projects,
        wells,
        trajectory_stations,
        tubular_components,
        drill_strings,
        drilling_fluids,
        friction_coefficients,
        scenarios,
        analysis_results,
        buckling_analysis,
        operational_limits
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }, 500);

    return () => clearTimeout(saveData);
  }, [
    projects, wells, trajectory_stations, tubular_components, 
    drill_strings, drilling_fluids, friction_coefficients, 
    scenarios, analysis_results, buckling_analysis, operational_limits
  ]);

  const initializeDemoData = () => {
    setProjects([DemoData.DEMO_PROJECT]);
    setWells([DemoData.DEMO_WELL]);
    setTrajectoryStations(DemoData.DEMO_STATIONS);
    setTubularComponents(DemoData.DEMO_COMPONENTS);
    setDrillStrings([DemoData.DEMO_DRILL_STRING]);
    setDrillingFluids([DemoData.DEMO_DRILLING_FLUID]);
    setFrictionCoefficients([DemoData.DEMO_FRICTION]);
    setScenarios(DemoData.DEMO_SCENARIOS);
    setAnalysisResults([DemoData.DEMO_ANALYSIS_RESULT]);
    setOperationalLimits([DemoData.DEMO_OPERATIONAL_LIMIT]);
    
    setCurrentProjectState(DemoData.DEMO_PROJECT);
    setCurrentWellState(DemoData.DEMO_WELL);
  };

  const setCurrentProject = (project) => {
      setCurrentProjectState(project);
      // Auto-select first well of project if available
      const projectWells = wells.filter(w => w.project_id === project.project_id);
      if (projectWells.length > 0) {
          setCurrentWellState(projectWells[0]);
      } else {
          setCurrentWellState(null);
      }
  };

  const setCurrentWell = (well) => setCurrentWellState(well);
  const toggleSidebar = () => setSidebarCollapsed(prev => !prev);
  const toggleRightPanel = () => setRightPanelCollapsed(prev => !prev);

  // CRUD Operations
  const addProject = (project) => setProjects(prev => [...prev, project]);
  const addWell = (well) => setWells(prev => [...prev, well]);

  const contextValue = {
    projects, current_project,
    wells, current_well,
    trajectory_stations,
    tubular_components,
    drill_strings,
    drilling_fluids,
    friction_coefficients,
    scenarios,
    analysis_results,
    buckling_analysis,
    operational_limits,
    
    // UI State
    current_tab, setCurrentTab,
    sidebarCollapsed, toggleSidebar,
    rightPanelCollapsed, toggleRightPanel,
    loading, setLoading,
    error, setError,

    // Actions
    setCurrentProject,
    addProject,
    setCurrentWell,
    addWell,
    addTrajectoryStation: (data) => setTrajectoryStations(prev => [...prev, data]),
    addTubularComponent: (data) => setTubularComponents(prev => [...prev, data]),
    addDrillString: (data) => setDrillStrings(prev => [...prev, data]),
    addDrillingFluid: (data) => setDrillingFluids(prev => [...prev, data]),
    setFrictionCoefficients: (data) => setFrictionCoefficients(prev => [...prev, data]),
    addScenario: (data) => setScenarios(prev => [...prev, data]),
    
    resetToDemoData: initializeDemoData,
  };

  return (
    <TorqueDragContext.Provider value={contextValue}>
      {children}
    </TorqueDragContext.Provider>
  );
};