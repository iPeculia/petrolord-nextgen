import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { validateProject } from '../models/Project';
import { validateScenario } from '../models/Scenario';
import { validateEconomicAssumptions } from '../models/EconomicAssumptions';
import { validateCashFlow } from '../models/CashFlow';
import { validateNPVResult } from '../models/NPVResult';
import { validateSensitivityAnalysis } from '../models/SensitivityAnalysis';
import { validateMonteCarloSimulation } from '../models/MonteCarloSimulation';
import { validateMonteCarloResult } from '../models/MonteCarloResult';
import { validateBreakEvenAnalysis } from '../models/BreakEvenAnalysis';
import { generateDemoData } from '../data/demoData';

const NPVCalculatorContext = createContext(null);

export const NPVCalculatorProvider = ({ children }) => {
  // State
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [economicAssumptions, setEconomicAssumptions] = useState([]);
  const [cashFlows, setCashFlows] = useState([]);
  const [npvResults, setNpvResults] = useState([]);
  const [sensitivityAnalysis, setSensitivityAnalysis] = useState([]);
  const [monteCarloSimulations, setMonteCarloSimulations] = useState([]);
  const [monteCarloResults, setMonteCarloResults] = useState([]);
  const [breakEvenAnalysis, setBreakEvenAnalysis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Persistence Keys
  const STORAGE_KEY_PREFIX = 'npv_calc_';

  // Load from LocalStorage
  useEffect(() => {
    const loadData = () => {
      try {
        setLoading(true);
        const storedProjects = JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}projects`) || '[]');
        
        if (storedProjects.length === 0) {
          // Load Demo Data if no projects exist
          const demo = generateDemoData();
          setProjects(demo.projects);
          setScenarios(demo.scenarios);
          setEconomicAssumptions(demo.economic_assumptions);
          setCashFlows(demo.cash_flows);
          setNpvResults(demo.npv_results);
          // Set initial current project
          if (demo.projects.length > 0) setCurrentProject(demo.projects[0]);
        } else {
          setProjects(storedProjects);
          setScenarios(JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}scenarios`) || '[]'));
          setEconomicAssumptions(JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}economic_assumptions`) || '[]'));
          setCashFlows(JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}cash_flows`) || '[]'));
          setNpvResults(JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}npv_results`) || '[]'));
          setSensitivityAnalysis(JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}sensitivity_analysis`) || '[]'));
          setMonteCarloSimulations(JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}monte_carlo_simulations`) || '[]'));
          setMonteCarloResults(JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}monte_carlo_results`) || '[]'));
          setBreakEvenAnalysis(JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}breakeven_analysis`) || '[]'));
          
          // Restore last session if possible
          const lastProjectId = localStorage.getItem(`${STORAGE_KEY_PREFIX}last_project_id`);
          if (lastProjectId) {
            const found = storedProjects.find(p => p.project_id === lastProjectId);
            if (found) setCurrentProject(found);
          }
        }
      } catch (err) {
        console.error("Failed to load NPV data", err);
        setError("Failed to load data from storage");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Auto-save to LocalStorage
  useEffect(() => {
    const saveData = () => {
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}projects`, JSON.stringify(projects));
        localStorage.setItem(`${STORAGE_KEY_PREFIX}scenarios`, JSON.stringify(scenarios));
        localStorage.setItem(`${STORAGE_KEY_PREFIX}economic_assumptions`, JSON.stringify(economicAssumptions));
        localStorage.setItem(`${STORAGE_KEY_PREFIX}cash_flows`, JSON.stringify(cashFlows));
        localStorage.setItem(`${STORAGE_KEY_PREFIX}npv_results`, JSON.stringify(npvResults));
        localStorage.setItem(`${STORAGE_KEY_PREFIX}sensitivity_analysis`, JSON.stringify(sensitivityAnalysis));
        localStorage.setItem(`${STORAGE_KEY_PREFIX}monte_carlo_simulations`, JSON.stringify(monteCarloSimulations));
        localStorage.setItem(`${STORAGE_KEY_PREFIX}monte_carlo_results`, JSON.stringify(monteCarloResults));
        localStorage.setItem(`${STORAGE_KEY_PREFIX}breakeven_analysis`, JSON.stringify(breakEvenAnalysis));
        
        if (currentProject) {
          localStorage.setItem(`${STORAGE_KEY_PREFIX}last_project_id`, currentProject.project_id);
        }
      } catch (err) {
        console.error("Auto-save failed", err);
      }
    };

    const timeoutId = setTimeout(saveData, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [
    projects, scenarios, economicAssumptions, cashFlows, npvResults, 
    sensitivityAnalysis, monteCarloSimulations, monteCarloResults, breakEvenAnalysis,
    currentProject
  ]);

  // --- Actions ---

  const addProject = (projectData) => {
    const validation = validateProject(projectData);
    if (!validation.success) {
      setError(validation.errors[0].message);
      return false;
    }
    setProjects(prev => [...prev, projectData]);
    setCurrentProject(projectData);
    return true;
  };

  const updateProject = (projectId, updates) => {
    setProjects(prev => prev.map(p => p.project_id === projectId ? { ...p, ...updates } : p));
    if (currentProject?.project_id === projectId) {
      setCurrentProject(prev => ({ ...prev, ...updates }));
    }
  };

  const deleteProject = (projectId) => {
    setProjects(prev => prev.filter(p => p.project_id !== projectId));
    if (currentProject?.project_id === projectId) {
      setCurrentProject(null);
    }
    // Cleanup related data
    const relatedScenarioIds = scenarios.filter(s => s.project_id === projectId).map(s => s.scenario_id);
    setScenarios(prev => prev.filter(s => s.project_id !== projectId));
    // Further cleanup for deeper relations would go here
  };

  const addScenario = (scenarioData) => {
    const validation = validateScenario(scenarioData);
    if (!validation.success) {
      setError(validation.errors[0].message);
      return false;
    }
    setScenarios(prev => [...prev, scenarioData]);
    setCurrentScenario(scenarioData);
    return true;
  };

  const updateScenario = (scenarioId, updates) => {
    setScenarios(prev => prev.map(s => s.scenario_id === scenarioId ? { ...s, ...updates } : s));
  };

  const deleteScenario = (scenarioId) => {
    setScenarios(prev => prev.filter(s => s.scenario_id !== scenarioId));
    if (currentScenario?.scenario_id === scenarioId) setCurrentScenario(null);
  };

  const setAssumptions = (data) => {
    // Check if updating or adding
    const validation = validateEconomicAssumptions(data);
    if (!validation.success) {
        setError(validation.errors[0].message);
        return false;
    }
    setEconomicAssumptions(prev => {
        const existing = prev.findIndex(a => a.assumption_id === data.assumption_id);
        if (existing >= 0) {
            const newArr = [...prev];
            newArr[existing] = data;
            return newArr;
        }
        return [...prev, data];
    });
    return true;
  };

  const addSimulation = (data) => {
    const validation = validateMonteCarloSimulation(data);
    if(!validation.success) {
        setError(validation.errors[0].message);
        return false;
    }
    setMonteCarloSimulations(prev => [...prev, data]);
    return true;
  };

  const exportData = () => {
    const data = {
        projects, scenarios, economicAssumptions, cashFlows, npvResults
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `npv_export_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const value = {
    projects, currentProject, setCurrentProject, addProject, updateProject, deleteProject,
    scenarios, currentScenario, setCurrentScenario, addScenario, updateScenario, deleteScenario,
    economicAssumptions, setEconomicAssumptions: setAssumptions,
    cashFlows, setCashFlows,
    npvResults, setNpvResults,
    sensitivityAnalysis, setSensitivityAnalysis,
    monteCarloSimulations, addMonteCarloSimulation: addSimulation,
    monteCarloResults, setMonteCarloResults,
    breakEvenAnalysis, setBreakEvenAnalysis,
    loading, error, setError,
    exportData
  };

  return (
    <NPVCalculatorContext.Provider value={value}>
      {children}
    </NPVCalculatorContext.Provider>
  );
};

export const useNPVCalculator = () => {
  const context = useContext(NPVCalculatorContext);
  if (!context) {
    throw new Error('useNPVCalculator must be used within an NPVCalculatorProvider');
  }
  return context;
};