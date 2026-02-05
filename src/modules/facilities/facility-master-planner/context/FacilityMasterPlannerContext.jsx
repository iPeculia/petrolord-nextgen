import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import usePlanningEngine from '../hooks/usePlanningEngine';
import useNotifications from '../hooks/useNotifications';
import * as Schemas from '../models/schemas';
import * as DemoData from '../data/demoData';

const FacilityMasterPlannerContext = createContext(null);

const STORAGE_KEY_PREFIX = 'fmp_data_';

export const FacilityMasterPlannerProvider = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // --- Notifications ---
  const notificationState = useNotifications();

  // --- Planning Engine Integration ---
  const { 
    runFullAnalysis, 
    generateExpansionPlan, 
    estimateQuickCapex, 
    isProcessing: isEngineProcessing,
    lastAnalysisResult
  } = usePlanningEngine();

  // --- Data State Definitions ---
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  
  const [facilities, setFacilities] = useState([]);
  const [currentFacility, setCurrentFacility] = useState(null);
  
  const [processUnits, setProcessUnits] = useState([]);
  const [currentUnit, setCurrentUnit] = useState(null);
  
  const [equipment, setEquipment] = useState([]);
  const [currentEquipment, setCurrentEquipment] = useState(null);
  
  const [streams, setStreams] = useState([]);
  const [productionProfiles, setProductionProfiles] = useState([]);
  
  const [scenarios, setScenarios] = useState([]);
  const [currentScenario, setCurrentScenario] = useState(null);
  
  const [expansionPlans, setExpansionPlans] = useState([]);
  const [capacityAnalysis, setCapacityAnalysis] = useState([]);
  const [masterPlans, setMasterPlans] = useState([]);
  const [riskAnalysis, setRiskAnalysis] = useState([]);
  
  // --- UI State ---
  const [currentTab, setCurrentTab] = useState('Overview');
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Persistence & Initialization ---
  
  // Load initial data
  useEffect(() => {
    const loadData = () => {
      try {
        setLoading(true);
        const storedProjects = localStorage.getItem(`${STORAGE_KEY_PREFIX}projects`);
        
        if (storedProjects) {
          setProjects(JSON.parse(storedProjects));
          setFacilities(JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}facilities`) || '[]'));
          setProcessUnits(JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}processUnits`) || '[]'));
          setEquipment(JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}equipment`) || '[]'));
          setStreams(JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}streams`) || '[]'));
          setProductionProfiles(JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}productionProfiles`) || '[]'));
          setScenarios(JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}scenarios`) || '[]'));
          setExpansionPlans(JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}expansionPlans`) || '[]'));
          setCapacityAnalysis(JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}capacityAnalysis`) || '[]'));
          setMasterPlans(JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}masterPlans`) || '[]'));
          setRiskAnalysis(JSON.parse(localStorage.getItem(`${STORAGE_KEY_PREFIX}riskAnalysis`) || '[]'));
        } else {
          loadDemoData();
        }
      } catch (err) {
        console.error("Failed to load FMP data:", err);
        setError("Failed to load local data. Using defaults.");
        loadDemoData();
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const loadDemoData = () => {
    setProjects([DemoData.demoProject]);
    setFacilities([DemoData.demoFacility]);
    setProcessUnits(DemoData.demoProcessUnits);
    setEquipment(DemoData.demoEquipment);
    setStreams(DemoData.demoStreams);
    setProductionProfiles(DemoData.demoProductionProfiles);
    setScenarios(DemoData.demoScenarios);
    setExpansionPlans(DemoData.demoExpansionPlans);
    setCapacityAnalysis(DemoData.demoCapacityAnalysis);
    setMasterPlans(DemoData.demoMasterPlans);
    setRiskAnalysis(DemoData.demoRiskAnalysis);
    
    setCurrentProject(DemoData.demoProject);
    setCurrentFacility(DemoData.demoFacility);
    if(DemoData.demoProcessUnits.length > 0) setCurrentUnit(DemoData.demoProcessUnits[0]);
    if(DemoData.demoScenarios.length > 0) setCurrentScenario(DemoData.demoScenarios.find(s => s.is_baseline));
  };

  // Auto-save Effect (Debounced)
  useEffect(() => {
    if (loading) return;

    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}projects`, JSON.stringify(projects));
        localStorage.setItem(`${STORAGE_KEY_PREFIX}facilities`, JSON.stringify(facilities));
        localStorage.setItem(`${STORAGE_KEY_PREFIX}processUnits`, JSON.stringify(processUnits));
        localStorage.setItem(`${STORAGE_KEY_PREFIX}equipment`, JSON.stringify(equipment));
        localStorage.setItem(`${STORAGE_KEY_PREFIX}streams`, JSON.stringify(streams));
        localStorage.setItem(`${STORAGE_KEY_PREFIX}productionProfiles`, JSON.stringify(productionProfiles));
        localStorage.setItem(`${STORAGE_KEY_PREFIX}scenarios`, JSON.stringify(scenarios));
        localStorage.setItem(`${STORAGE_KEY_PREFIX}expansionPlans`, JSON.stringify(expansionPlans));
        localStorage.setItem(`${STORAGE_KEY_PREFIX}capacityAnalysis`, JSON.stringify(capacityAnalysis));
        localStorage.setItem(`${STORAGE_KEY_PREFIX}masterPlans`, JSON.stringify(masterPlans));
        localStorage.setItem(`${STORAGE_KEY_PREFIX}riskAnalysis`, JSON.stringify(riskAnalysis));
      } catch (err) {
        console.error("Auto-save failed:", err);
        setError("Auto-save failed. Check storage quota.");
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    projects, facilities, processUnits, equipment, streams, 
    productionProfiles, scenarios, expansionPlans, capacityAnalysis, 
    masterPlans, riskAnalysis, loading
  ]);

  // --- Helper for CRUD Operations ---
  const createCRUD = (state, setState, schema, idField, nameStr) => ({
    add: (item) => {
      // Allow flexible adding for scenarios (bypass strict schema check for now to allow dynamic properties)
      if (nameStr !== 'Scenario') {
          const validation = schema.safeParse(item);
          if (!validation.success) {
            console.error(`${nameStr} validation failed:`, validation.error);
            toast({ title: "Validation Error", description: `Invalid ${nameStr} data.`, variant: "destructive" });
            return false;
          }
      }
      setState(prev => [...prev, item]);
      toast({ title: "Success", description: `${nameStr} created successfully.` });
      notificationState.addNotification('success', `${nameStr} created successfully.`);
      return true;
    },
    update: (id, updates) => {
      setState(prev => prev.map(i => i[idField] === id ? { ...i, ...updates } : i));
      if (nameStr === 'Scenario' && updates.status === 'Completed') {
          // Special case for analysis completion
      } else {
          toast({ title: "Updated", description: `${nameStr} updated.` });
      }
      return true;
    },
    delete: (id) => {
      setState(prev => prev.filter(i => i[idField] !== id));
      toast({ title: "Deleted", description: `${nameStr} deleted.` });
      return true;
    }
  });

  // --- CRUD Actions ---
  const projectOps = createCRUD(projects, setProjects, Schemas.ProjectSchema, 'project_id', 'Project');
  const deleteProject = (id) => {
    projectOps.delete(id);
    if (currentProject?.project_id === id) setCurrentProject(null);
  };

  const facilityOps = createCRUD(facilities, setFacilities, Schemas.FacilitySchema, 'facility_id', 'Facility');
  const deleteFacility = (id) => {
    facilityOps.delete(id);
    if (currentFacility?.facility_id === id) setCurrentFacility(null);
  };

  const processUnitOps = createCRUD(processUnits, setProcessUnits, Schemas.ProcessUnitSchema, 'unit_id', 'Process Unit');
  const deleteProcessUnit = (id) => {
    processUnitOps.delete(id);
    if (currentUnit?.unit_id === id) setCurrentUnit(null);
  };

  const equipmentOps = createCRUD(equipment, setEquipment, Schemas.EquipmentSchema, 'equipment_id', 'Equipment');
  const deleteEquipment = (id) => {
    equipmentOps.delete(id);
    if (currentEquipment?.equipment_id === id) setCurrentEquipment(null);
  };

  const streamOps = createCRUD(streams, setStreams, Schemas.StreamSchema, 'stream_id', 'Stream');
  const productionProfileOps = createCRUD(productionProfiles, setProductionProfiles, Schemas.ProductionProfileSchema, 'profile_id', 'Production Profile');
  const scenarioOps = createCRUD(scenarios, setScenarios, Schemas.ScenarioSchema, 'scenario_id', 'Scenario');
  const deleteScenario = (id) => {
      scenarioOps.delete(id);
      if (currentScenario?.scenario_id === id) setCurrentScenario(null);
  }
  const expansionPlanOps = createCRUD(expansionPlans, setExpansionPlans, Schemas.ExpansionPlanSchema, 'expansion_id', 'Expansion Plan');
  const capacityAnalysisOps = createCRUD(capacityAnalysis, setCapacityAnalysis, Schemas.CapacityAnalysisSchema, 'analysis_id', 'Capacity Analysis');
  const masterPlanOps = createCRUD(masterPlans, setMasterPlans, Schemas.MasterPlanSchema, 'plan_id', 'Master Plan');
  const riskAnalysisOps = createCRUD(riskAnalysis, setRiskAnalysis, Schemas.RiskAnalysisSchema, 'risk_id', 'Risk Analysis');

  const exportData = () => {
    const data = {
      projects, facilities, processUnits, equipment, streams,
      productionProfiles, scenarios, expansionPlans, capacityAnalysis,
      masterPlans, riskAnalysis,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fmp_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const value = {
    // Data State
    projects, currentProject,
    facilities, currentFacility,
    processUnits, currentUnit,
    equipment, currentEquipment,
    streams,
    productionProfiles, 
    scenarios, currentScenario,
    expansionPlans, capacityAnalysis,
    masterPlans, riskAnalysis,
    loading, error,

    // UI State
    currentTab, setCurrentTab,
    isLeftSidebarOpen, setIsLeftSidebarOpen,
    isRightPanelOpen, setIsRightPanelOpen,
    isHelpOpen, setIsHelpOpen,
    isSettingsOpen, setIsSettingsOpen,
    isNotificationsOpen, setIsNotificationsOpen,

    // Notifications Hook Export
    ...notificationState,
    clearAllNotifications: notificationState.clearAll, // Specific export for clarity

    // Planning Engine
    runFullAnalysis,
    generateExpansionPlan,
    estimateQuickCapex,
    isEngineProcessing,
    lastAnalysisResult,

    // Selection Methods
    setCurrentProject,
    setCurrentFacility,
    setCurrentUnit,
    setCurrentEquipment,
    setCurrentScenario,

    // CRUD Methods
    addProject: projectOps.add, updateProject: projectOps.update, deleteProject,
    addFacility: facilityOps.add, updateFacility: facilityOps.update, deleteFacility,
    addProcessUnit: processUnitOps.add, updateProcessUnit: processUnitOps.update, deleteProcessUnit,
    addEquipment: equipmentOps.add, updateEquipment: equipmentOps.update, deleteEquipment,
    addStream: streamOps.add, updateStream: streamOps.update, deleteStream: streamOps.delete,
    addProductionProfile: productionProfileOps.add, updateProductionProfile: productionProfileOps.update, deleteProductionProfile: productionProfileOps.delete,
    addScenario: scenarioOps.add, updateScenario: scenarioOps.update, deleteScenario,
    addExpansionPlan: expansionPlanOps.add, updateExpansionPlan: expansionPlanOps.update, deleteExpansionPlan: expansionPlanOps.delete,
    addCapacityAnalysis: capacityAnalysisOps.add, updateCapacityAnalysis: capacityAnalysisOps.update, deleteCapacityAnalysis: capacityAnalysisOps.delete,
    addMasterPlan: masterPlanOps.add, updateMasterPlan: masterPlanOps.update, deleteMasterPlan: masterPlanOps.delete,
    addRiskAnalysis: riskAnalysisOps.add, updateRiskAnalysis: riskAnalysisOps.update, deleteRiskAnalysis: riskAnalysisOps.delete,

    setLoading, setError,
    exportData, loadDemoData
  };

  return (
    <FacilityMasterPlannerContext.Provider value={value}>
      {children}
    </FacilityMasterPlannerContext.Provider>
  );
};

export const useFacilityMasterPlanner = () => {
  const context = useContext(FacilityMasterPlannerContext);
  if (!context) {
    throw new Error('useFacilityMasterPlanner must be used within a FacilityMasterPlannerProvider');
  }
  return context;
};

export default FacilityMasterPlannerContext;