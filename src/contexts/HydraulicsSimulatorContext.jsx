import React, { createContext, useContext, useState, useEffect } from 'react';
import * as DemoData from '@/services/hydraulics/data/demoData';

const HydraulicsSimulatorContext = createContext();

export const useHydraulicsSimulator = () => {
  const context = useContext(HydraulicsSimulatorContext);
  if (!context) {
    throw new Error('useHydraulicsSimulator must be used within a HydraulicsSimulatorProvider');
  }
  return context;
};

export const HydraulicsSimulatorProvider = ({ children }) => {
  // Data State
  const [projects, setProjects] = useState([]);
  const [current_project, setCurrentProject] = useState(null);
  
  const [wells, setWells] = useState([]);
  const [current_well, setCurrentWell] = useState(null);
  
  const [hole_sections, setHoleSections] = useState([]);
  const [drilling_fluids, setDrillingFluids] = useState([]);
  const [tubular_components, setTubularComponents] = useState([]);
  const [bit_nozzles, setBitNozzles] = useState([]);
  const [pumps, setPumps] = useState([]);
  const [chokes, setChokes] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [simulation_results, setSimulationResults] = useState([]);
  const [optimizations, setOptimizations] = useState([]);
  const [surge_swab_analyses, setSurgeSwabAnalyses] = useState([]);
  
  // UI State
  const [current_scenario, setCurrentScenario] = useState(null);
  const [current_tab, setCurrentTab] = useState('Setup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);

  const STORAGE_KEY = 'hydraulics_sim_data_v1';

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        setLoading(true);
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          setProjects(parsed.projects || []);
          setWells(parsed.wells || []);
          setHoleSections(parsed.hole_sections || []);
          setDrillingFluids(parsed.drilling_fluids || []);
          setTubularComponents(parsed.tubular_components || []);
          setBitNozzles(parsed.bit_nozzles || []);
          setPumps(parsed.pumps || []);
          setChokes(parsed.chokes || []);
          setScenarios(parsed.scenarios || []);
          setSimulationResults(parsed.simulation_results || []);
          setOptimizations(parsed.optimizations || []);
          setSurgeSwabAnalyses(parsed.surge_swab_analyses || []);

          if (parsed.projects && parsed.projects.length > 0) {
            setCurrentProject(parsed.projects[0]);
            if (parsed.wells && parsed.wells.length > 0) {
              const projectWells = parsed.wells.filter(w => w.project_id === parsed.projects[0].project_id);
              if (projectWells.length > 0) {
                const well = projectWells[0];
                setCurrentWell(well);
                // Also set scenario if available
                if (parsed.scenarios) {
                    const wellScenarios = parsed.scenarios.filter(s => s.well_id === well.well_id);
                    if (wellScenarios.length > 0) setCurrentScenario(wellScenarios[0]);
                }
              }
            }
          }
        } else {
          initializeDemoData();
        }
      } catch (err) {
        console.error('Failed to load Hydraulics Simulator data:', err);
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
        hole_sections,
        drilling_fluids,
        tubular_components,
        bit_nozzles,
        pumps,
        chokes,
        scenarios,
        simulation_results,
        optimizations,
        surge_swab_analyses
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }, 500);

    return () => clearTimeout(saveData);
  }, [
    projects, wells, hole_sections, drilling_fluids, tubular_components,
    bit_nozzles, pumps, chokes, scenarios, simulation_results,
    optimizations, surge_swab_analyses
  ]);

  const initializeDemoData = () => {
    setProjects([DemoData.DEMO_PROJECT]);
    setWells([DemoData.DEMO_WELL]);
    setHoleSections(DemoData.DEMO_SECTIONS);
    setDrillingFluids([DemoData.DEMO_FLUID]);
    setTubularComponents(DemoData.DEMO_TUBULARS);
    setPumps([DemoData.DEMO_PUMP]);
    setChokes([DemoData.DEMO_CHOKE]);
    setScenarios([DemoData.DEMO_SCENARIO]);
    setSimulationResults([DemoData.DEMO_SIM_RESULT]);
    setOptimizations([DemoData.DEMO_OPTIMIZATION]);
    setSurgeSwabAnalyses([DemoData.DEMO_SURGE_SWAB]);
    
    setCurrentProject(DemoData.DEMO_PROJECT);
    setCurrentWell(DemoData.DEMO_WELL);
    setCurrentScenario(DemoData.DEMO_SCENARIO);
  };

  // Helper to add/update/delete
  const add = (setter, item) => setter(prev => [...prev, item]);
  const update = (setter, idKey, id, updates) => setter(prev => prev.map(item => item[idKey] === id ? { ...item, ...updates } : item));
  const remove = (setter, idKey, id) => setter(prev => prev.filter(item => item[idKey] !== id));

  const contextValue = {
    // State
    projects, current_project,
    wells, current_well,
    hole_sections,
    drilling_fluids,
    tubular_components,
    bit_nozzles,
    pumps,
    chokes,
    scenarios, current_scenario,
    simulation_results,
    optimizations,
    surge_swab_analyses,
    loading, error,
    current_tab,
    sidebarCollapsed,
    rightPanelCollapsed,

    // Actions
    setCurrentProject,
    addProject: (p) => add(setProjects, p),
    updateProject: (id, u) => update(setProjects, 'project_id', id, u),
    deleteProject: (id) => remove(setProjects, 'project_id', id),

    setCurrentWell,
    addWell: (w) => add(setWells, w),
    updateWell: (id, u) => update(setWells, 'well_id', id, u),
    deleteWell: (id) => remove(setWells, 'well_id', id),

    addHoleSection: (s) => add(setHoleSections, s),
    updateHoleSection: (id, u) => update(setHoleSections, 'section_id', id, u),
    deleteHoleSection: (id) => remove(setHoleSections, 'section_id', id),

    addDrillingFluid: (f) => add(setDrillingFluids, f),
    updateDrillingFluid: (id, u) => update(setDrillingFluids, 'fluid_id', id, u),
    deleteDrillingFluid: (id) => remove(setDrillingFluids, 'fluid_id', id),

    addTubularComponent: (c) => add(setTubularComponents, c),
    updateTubularComponent: (id, u) => update(setTubularComponents, 'component_id', id, u),
    deleteTubularComponent: (id) => remove(setTubularComponents, 'component_id', id),

    addBitNozzle: (n) => add(setBitNozzles, n),
    updateBitNozzle: (id, u) => update(setBitNozzles, 'nozzle_id', id, u),
    deleteBitNozzle: (id) => remove(setBitNozzles, 'nozzle_id', id),

    addPump: (p) => add(setPumps, p),
    updatePump: (id, u) => update(setPumps, 'pump_id', id, u),
    deletePump: (id) => remove(setPumps, 'pump_id', id),

    addChoke: (c) => add(setChokes, c),
    updateChoke: (id, u) => update(setChokes, 'choke_id', id, u),
    deleteChoke: (id) => remove(setChokes, 'choke_id', id),

    setCurrentScenario,
    addScenario: (s) => add(setScenarios, s),
    updateScenario: (id, u) => update(setScenarios, 'scenario_id', id, u),
    deleteScenario: (id) => remove(setScenarios, 'scenario_id', id),

    addSimulationResult: (r) => add(setSimulationResults, r),
    updateSimulationResult: (id, u) => update(setSimulationResults, 'result_id', id, u),

    addOptimization: (o) => add(setOptimizations, o),
    updateOptimization: (id, u) => update(setOptimizations, 'optimization_id', id, u),

    addSurgeSwabAnalysis: (a) => add(setSurgeSwabAnalyses, a),
    updateSurgeSwabAnalysis: (id, u) => update(setSurgeSwabAnalyses, 'analysis_id', id, u),

    setCurrentTab,
    toggleSidebar: () => setSidebarCollapsed(prev => !prev),
    toggleRightPanel: () => setRightPanelCollapsed(prev => !prev),
    setLoading,
    setError,
    initializeDemoData
  };

  return (
    <HydraulicsSimulatorContext.Provider value={contextValue}>
      {children}
    </HydraulicsSimulatorContext.Provider>
  );
};