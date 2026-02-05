import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { irrAnalysisService } from '@/services/economics/irrAnalysisService';
import { useToast } from '@/components/ui/use-toast';
import { 
  validateProject, 
  validateFinancialParameters 
} from '@/utils/economics/validation';

const IRRAnalysisContext = createContext(null);

export const IRRAnalysisProvider = ({ children }) => {
  const { toast } = useToast();
  
  // State
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [financialParams, setFinancialParams] = useState(null);
  const [costStructure, setCostStructure] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [cashflows, setCashflows] = useState([]);
  const [analysisResults, setAnalysisResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Local Storage Keys
  const LS_KEYS = {
    PROJECTS: 'irr_projects',
    CURRENT_PROJECT_ID: 'irr_current_project_id',
    PARAMS: 'irr_financial_parameters',
    COSTS: 'irr_cost_structure',
    REVENUE: 'irr_revenue',
    RESULTS: 'irr_analysis_results'
  };

  // --- Initialization ---
  
  const loadFromLocalStorage = useCallback(() => {
    try {
      const storedProjects = JSON.parse(localStorage.getItem(LS_KEYS.PROJECTS) || '[]');
      setProjects(storedProjects);
      
      const lastProjectId = localStorage.getItem(LS_KEYS.CURRENT_PROJECT_ID);
      if (lastProjectId) {
         const project = storedProjects.find(p => p.project_id === lastProjectId);
         if (project) setCurrentProject(project);
      }
    } catch (e) {
      console.error("Failed to load from local storage", e);
    }
  }, []);

  const saveToLocalStorage = useCallback(() => {
    localStorage.setItem(LS_KEYS.PROJECTS, JSON.stringify(projects));
    if (currentProject) {
      localStorage.setItem(LS_KEYS.CURRENT_PROJECT_ID, currentProject.project_id);
    }
  }, [projects, currentProject]);

  useEffect(() => {
    loadFromLocalStorage();
    fetchAllProjects();
  }, []);

  useEffect(() => {
    saveToLocalStorage();
  }, [saveToLocalStorage]);

  // --- Project Actions ---

  const fetchAllProjects = async () => {
    setLoading(true);
    try {
      const data = await irrAnalysisService.getAllProjects();
      setProjects(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (projectData) => {
    const validation = validateProject(projectData);
    if (!validation.isValid) {
      toast({ title: "Validation Error", description: Object.values(validation.errors)[0], variant: "destructive" });
      return null;
    }

    setLoading(true);
    try {
      const newProject = await irrAnalysisService.createProject(projectData);
      setProjects(prev => [newProject, ...prev]);
      setCurrentProject(newProject);
      toast({ title: "Project Created", description: `Project ${newProject.name} created successfully.` });
      return newProject;
    } catch (err) {
      setError(err.message);
      toast({ title: "Error", description: "Failed to create project", variant: "destructive" });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (projectId, updates) => {
    setLoading(true);
    try {
      const updated = await irrAnalysisService.updateProject(projectId, updates);
      setProjects(prev => prev.map(p => p.project_id === projectId ? updated : p));
      if (currentProject?.project_id === projectId) setCurrentProject(updated);
      toast({ title: "Project Updated" });
      return updated;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectProject = async (projectId) => {
    setLoading(true);
    try {
      const project = projects.find(p => p.project_id === projectId);
      setCurrentProject(project || null);
      
      if (project) {
        // Load details in parallel
        try {
          const [params, costs, rev, results] = await Promise.all([
            irrAnalysisService.getFinancialParameters(projectId),
            irrAnalysisService.getCostStructure(projectId),
            irrAnalysisService.getRevenue(projectId),
            irrAnalysisService.getAnalysisResults(projectId)
          ]);
          
          setFinancialParams(params);
          setCostStructure(costs);
          setRevenue(rev);
          setAnalysisResults(results || []);
          setCashflows([]); 
        } catch (detailErr) {
          console.error("Error loading details", detailErr);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId) => {
    if (!window.confirm("Are you sure? This will delete all project data.")) return;
    setLoading(true);
    try {
      await irrAnalysisService.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.project_id !== projectId));
      if (currentProject?.project_id === projectId) {
        setCurrentProject(null);
        setFinancialParams(null);
        setCostStructure(null);
        setRevenue(null);
      }
      toast({ title: "Project Deleted" });
    } catch (err) {
      setError(err.message);
      toast({ title: "Error", description: "Delete failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const saveFinancialParameters = async (params) => {
    if (!currentProject) return;
    const validation = validateFinancialParameters(params);
    if (!validation.isValid) {
      toast({ title: "Invalid Parameters", description: "Check inputs", variant: "destructive" });
      return;
    }

    try {
      const saved = await irrAnalysisService.upsertFinancialParameters({
        ...params,
        project_id: currentProject.project_id
      });
      setFinancialParams(saved);
      toast({ title: "Parameters Saved" });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const value = {
    projects,
    currentProject,
    financialParams,
    costStructure,
    revenue,
    cashflows,
    analysisResults,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject,
    selectProject,
    saveFinancialParameters,
  };

  return (
    <IRRAnalysisContext.Provider value={value}>
      {children}
    </IRRAnalysisContext.Provider>
  );
};

export const useIRRAnalysis = () => {
  const context = useContext(IRRAnalysisContext);
  if (!context) {
    throw new Error('useIRRAnalysis must be used within an IRRAnalysisProvider');
  }
  return context;
};