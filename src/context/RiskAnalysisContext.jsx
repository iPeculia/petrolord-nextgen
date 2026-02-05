import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { validateProject, createProject } from '@/services/riskAnalysis/models/Project';
import { validateRisk, createRisk } from '@/services/riskAnalysis/models/RiskRegister';
import { validateRiskParameter, createRiskParameter } from '@/services/riskAnalysis/models/RiskParameter';
import { validateScenario, createScenario } from '@/services/riskAnalysis/models/Scenario';
import { validateSimulation, createSimulation } from '@/services/riskAnalysis/models/MonteCarloSimulation';
import { validateRiskMitigation, createRiskMitigation } from '@/services/riskAnalysis/models/RiskMitigation';
import { generateDemoData } from '@/services/riskAnalysis/data/demoData';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const RiskAnalysisContext = createContext(null);

export const RiskAnalysisProvider = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // --- Data State ---
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [riskRegister, setRiskRegister] = useState([]);
  const [riskParameters, setRiskParameters] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [simulations, setSimulations] = useState([]);
  const [analysisResults, setAnalysisResults] = useState({});
  const [sensitivityAnalysis, setSensitivityAnalysis] = useState({});
  const [mitigations, setMitigations] = useState([]);
  
  // --- UI State ---
  const [currentRisk, setCurrentRisk] = useState(null);
  const [currentTab, setCurrentTab] = useState('Setup');
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Local Storage Keys
  const LS_KEYS = {
    PROJECTS: 'risk_analysis_projects',
    RISK_REGISTER: 'risk_analysis_register',
    RISK_PARAMETERS: 'risk_analysis_parameters',
    SCENARIOS: 'risk_analysis_scenarios',
    SIMULATIONS: 'risk_analysis_simulations',
    ANALYSIS_RESULTS: 'risk_analysis_results',
    SENSITIVITY: 'risk_analysis_sensitivity',
    MITIGATIONS: 'risk_analysis_mitigations',
    CURRENT_PROJECT_ID: 'risk_analysis_current_project_id',
    UI_STATE: 'risk_analysis_ui_state'
  };

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const storedProjects = JSON.parse(localStorage.getItem(LS_KEYS.PROJECTS) || '[]');
        const storedRisks = JSON.parse(localStorage.getItem(LS_KEYS.RISK_REGISTER) || '[]');
        const storedParams = JSON.parse(localStorage.getItem(LS_KEYS.RISK_PARAMETERS) || '[]');
        const storedScenarios = JSON.parse(localStorage.getItem(LS_KEYS.SCENARIOS) || '[]');
        const storedSimulations = JSON.parse(localStorage.getItem(LS_KEYS.SIMULATIONS) || '[]');
        const storedResults = JSON.parse(localStorage.getItem(LS_KEYS.ANALYSIS_RESULTS) || '{}');
        const storedSensitivity = JSON.parse(localStorage.getItem(LS_KEYS.SENSITIVITY) || '{}');
        const storedMitigations = JSON.parse(localStorage.getItem(LS_KEYS.MITIGATIONS) || '[]');
        const storedUI = JSON.parse(localStorage.getItem(LS_KEYS.UI_STATE) || '{}');
        
        setProjects(storedProjects);
        setRiskRegister(storedRisks);
        setRiskParameters(storedParams);
        setScenarios(storedScenarios);
        setSimulations(storedSimulations);
        setAnalysisResults(storedResults);
        setSensitivityAnalysis(storedSensitivity);
        setMitigations(storedMitigations);

        // UI State Restoration
        if (storedUI.leftSidebarCollapsed !== undefined) setLeftSidebarCollapsed(storedUI.leftSidebarCollapsed);
        if (storedUI.rightPanelCollapsed !== undefined) setRightPanelCollapsed(storedUI.rightPanelCollapsed);
        if (storedUI.currentTab) setCurrentTab(storedUI.currentTab);

        // Restore current project
        const lastProjectId = localStorage.getItem(LS_KEYS.CURRENT_PROJECT_ID);
        if (lastProjectId && storedProjects.length > 0) {
          const project = storedProjects.find(p => p.project_id === lastProjectId);
          if (project) setCurrentProject(project);
        } else if (storedProjects.length === 0 && user) {
           // Load Demo Data if empty
           const demoData = generateDemoData(user.id);
           setProjects(demoData.projects);
           setRiskRegister(demoData.risks);
           setRiskParameters(demoData.riskParameters);
           setScenarios(demoData.scenarios);
           setSimulations(demoData.simulations);
           setAnalysisResults(demoData.analysisResults);
           setSensitivityAnalysis(demoData.sensitivityAnalysis);
           setMitigations(demoData.mitigations);
           setCurrentProject(demoData.projects[0]);
        }
      } catch (err) {
        console.error("Failed to load risk analysis data:", err);
        setError("Failed to load local data");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  // Persistence Effects (Auto-save)
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(LS_KEYS.PROJECTS, JSON.stringify(projects));
      localStorage.setItem(LS_KEYS.RISK_REGISTER, JSON.stringify(riskRegister));
      localStorage.setItem(LS_KEYS.RISK_PARAMETERS, JSON.stringify(riskParameters));
      localStorage.setItem(LS_KEYS.SCENARIOS, JSON.stringify(scenarios));
      localStorage.setItem(LS_KEYS.SIMULATIONS, JSON.stringify(simulations));
      localStorage.setItem(LS_KEYS.ANALYSIS_RESULTS, JSON.stringify(analysisResults));
      localStorage.setItem(LS_KEYS.SENSITIVITY, JSON.stringify(sensitivityAnalysis));
      localStorage.setItem(LS_KEYS.MITIGATIONS, JSON.stringify(mitigations));
      localStorage.setItem(LS_KEYS.UI_STATE, JSON.stringify({
        leftSidebarCollapsed,
        rightPanelCollapsed,
        currentTab
      }));
      if (currentProject) {
        localStorage.setItem(LS_KEYS.CURRENT_PROJECT_ID, currentProject.project_id);
      }
    }
  }, [
    projects, riskRegister, riskParameters, scenarios, simulations, 
    analysisResults, sensitivityAnalysis, mitigations, currentProject, 
    loading, leftSidebarCollapsed, rightPanelCollapsed, currentTab
  ]);

  // --- UI Actions ---
  const toggleLeftSidebar = () => setLeftSidebarCollapsed(prev => !prev);
  const toggleRightPanel = () => setRightPanelCollapsed(prev => !prev);

  // --- Data Actions ---

  const addProject = (projectData) => {
    try {
      const newProject = createProject(projectData);
      setProjects(prev => [...prev, newProject]);
      setCurrentProject(newProject);
      toast({ title: "Project Created", description: `Project ${newProject.name} created.` });
      return newProject;
    } catch (err) {
      console.error(err);
      toast({ title: "Validation Error", description: err.errors?.[0]?.message || "Invalid project data", variant: "destructive" });
    }
  };

  const updateProject = (projectId, updates) => {
    setProjects(prev => prev.map(p => p.project_id === projectId ? { ...p, ...updates } : p));
    if (currentProject?.project_id === projectId) {
      setCurrentProject(prev => ({ ...prev, ...updates }));
    }
  };

  const deleteProject = (projectId) => {
    setProjects(prev => prev.filter(p => p.project_id !== projectId));
    if (currentProject?.project_id === projectId) setCurrentProject(null);
    setRiskRegister(prev => prev.filter(r => r.project_id !== projectId));
    setScenarios(prev => prev.filter(s => s.project_id !== projectId));
  };

  const addRisk = (riskData) => {
    try {
      const newRisk = createRisk(riskData);
      setRiskRegister(prev => [...prev, newRisk]);
      toast({ title: "Risk Added", description: "New risk entry created." });
      return newRisk;
    } catch (err) {
       toast({ title: "Validation Error", description: err.errors?.[0]?.message || "Invalid risk data", variant: "destructive" });
    }
  };

  const updateRisk = (riskId, updates) => {
    setRiskRegister(prev => prev.map(r => r.risk_id === riskId ? { ...r, ...updates } : r));
    if (currentRisk?.risk_id === riskId) {
        setCurrentRisk(prev => ({ ...prev, ...updates }));
    }
  };

  const deleteRisk = (riskId) => {
    setRiskRegister(prev => prev.filter(r => r.risk_id !== riskId));
    if (currentRisk?.risk_id === riskId) setCurrentRisk(null);
  };

  const addRiskParameter = (paramData) => {
    try {
      const newParam = createRiskParameter(paramData);
      setRiskParameters(prev => [...prev, newParam]);
      return newParam;
    } catch (err) {
       toast({ title: "Validation Error", description: err.errors?.[0]?.message || "Invalid parameter data", variant: "destructive" });
    }
  };
  
  const updateRiskParameter = (paramId, updates) => {
    setRiskParameters(prev => prev.map(p => p.parameter_id === paramId ? { ...p, ...updates } : p));
  };

  const deleteRiskParameter = (paramId) => {
    setRiskParameters(prev => prev.filter(p => p.parameter_id !== paramId));
  };

  const addScenario = (scenarioData) => {
    try {
      const newScenario = createScenario(scenarioData);
      setScenarios(prev => [...prev, newScenario]);
      return newScenario;
    } catch (err) {
      toast({ title: "Error", description: "Invalid scenario data", variant: "destructive" });
    }
  };
  
  const updateScenario = (scenarioId, updates) => {
    setScenarios(prev => prev.map(s => s.scenario_id === scenarioId ? { ...s, ...updates } : s));
  };

  const deleteScenario = (scenarioId) => {
    setScenarios(prev => prev.filter(s => s.scenario_id !== scenarioId));
  };

  const addSimulation = (simData) => {
    try {
      const newSim = createSimulation(simData);
      setSimulations(prev => [...prev, newSim]);
      return newSim;
    } catch (err) {
      console.error(err);
    }
  };

  const updateSimulation = (simId, updates) => {
     setSimulations(prev => prev.map(s => s.simulation_id === simId ? { ...s, ...updates } : s));
  };

  const addMitigation = (mitigationData) => {
    try {
      const newMitigation = createRiskMitigation(mitigationData);
      setMitigations(prev => [...prev, newMitigation]);
      return newMitigation;
    } catch (err) {
      toast({ title: "Error", description: "Invalid mitigation data", variant: "destructive" });
    }
  };

  const updateMitigation = (mitigationId, updates) => {
    setMitigations(prev => prev.map(m => m.mitigation_id === mitigationId ? { ...m, ...updates } : m));
  };

  const deleteMitigation = (mitigationId) => {
    setMitigations(prev => prev.filter(m => m.mitigation_id !== mitigationId));
  };
  
  // Custom setter wrappers
  const setAnalysisResultsWrapper = (results) => setAnalysisResults(results);
  const setSensitivityAnalysisWrapper = (analysis) => setSensitivityAnalysis(analysis);

  // Hook Interface
  const contextValue = {
    // Data State
    projects,
    currentProject,
    riskRegister,
    riskParameters,
    scenarios,
    simulations,
    analysisResults,
    sensitivityAnalysis,
    mitigations,
    loading,
    error,
    
    // UI State
    currentRisk,
    currentTab,
    leftSidebarCollapsed,
    rightPanelCollapsed,

    // UI Actions
    setCurrentProject,
    setCurrentRisk,
    setCurrentTab,
    toggleLeftSidebar,
    toggleRightPanel,
    setLoading,
    setError,

    // Data Actions
    addProject,
    updateProject,
    deleteProject,
    
    addRisk,
    updateRisk,
    deleteRisk,
    
    addRiskParameter,
    updateRiskParameter,
    deleteRiskParameter,
    
    addScenario,
    updateScenario,
    deleteScenario,
    
    addSimulation,
    updateSimulation,
    
    setAnalysisResults: setAnalysisResultsWrapper,
    setSensitivityAnalysis: setSensitivityAnalysisWrapper,
    
    addMitigation,
    updateMitigation,
    deleteMitigation,
  };

  return (
    <RiskAnalysisContext.Provider value={contextValue}>
      {children}
    </RiskAnalysisContext.Provider>
  );
};

export const useRiskAnalysis = () => {
  const context = useContext(RiskAnalysisContext);
  if (!context) {
    throw new Error('useRiskAnalysis must be used within a RiskAnalysisProvider');
  }
  return context;
};