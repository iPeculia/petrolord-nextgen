import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from '@/components/ui/use-toast';

const DeclineCurveContext = createContext();

export const useDeclineCurve = () => {
    const context = useContext(DeclineCurveContext);
    if (!context) {
        throw new Error('useDeclineCurve must be used within a DeclineCurveProvider');
    }
    return context;
};

export const DeclineCurveProvider = ({ children }) => {
    // Project State
    const [currentProject, setCurrentProject] = useState(null);
    const [currentProjectId, setCurrentProjectId] = useState(null);
    
    // Well State
    const [activeWellId, setActiveWellId] = useState(null);
    const [activeStream, setActiveStream] = useState('Oil'); // 'Oil', 'Gas', 'Water'
    
    // Analysis State
    const [fitConfig, setFitConfig] = useState({ modelType: 'hyperbolic', b: 1.0, Di: 0.5, qi: 100 });
    const [forecastConfig, setForecastConfig] = useState({ duration: 60, economicLimit: 10 });
    const [activeScenarioId, setActiveScenarioId] = useState(null);
    
    // Derived State
    const currentWell = currentProject?.wells?.find(w => w.id === activeWellId) || null;
    const activeScenario = currentProject?.scenarios?.find((s, idx) => 
        activeScenarioId !== null ? idx === activeScenarioId : s.id === activeScenarioId
    ) || null;

    // Load project from LocalStorage on mount if exists
    useEffect(() => {
        const savedProject = localStorage.getItem('dca_active_project');
        if (savedProject) {
            try {
                const parsed = JSON.parse(savedProject);
                setCurrentProject(parsed);
                setCurrentProjectId(parsed.id);
                if (parsed.wells && parsed.wells.length > 0) {
                    setActiveWellId(parsed.wells[0].id);
                }
            } catch (e) {
                console.error("Failed to load saved project", e);
            }
        }
    }, []);

    // Helper: Select a well
    const selectWell = (wellId) => {
        setActiveWellId(wellId);
        // Reset analysis state for new well if needed, or load well-specific settings
        const well = currentProject?.wells?.find(w => w.id === wellId);
        if (well?.model) {
            // Load pre-fitted model settings if available
            const streamModel = activeStream === 'Gas' ? well.model.gas : well.model.oil;
            if (streamModel) {
                setFitConfig({
                    modelType: streamModel.modelType.toLowerCase(),
                    b: streamModel.b || 0,
                    Di: streamModel.Di || 0.5,
                    qi: streamModel.qi || 100
                });
            }
        }
    };

    // Helper: Create new project
    const createProject = (name) => {
        const newProject = {
            id: `proj-${Date.now()}`,
            name,
            created: new Date().toISOString(),
            wells: [],
            scenarios: [],
            groups: []
        };
        setCurrentProject(newProject);
        setCurrentProjectId(newProject.id);
        localStorage.setItem('dca_active_project', JSON.stringify(newProject));
        toast({ title: "Project Created", description: `Active project: ${name}` });
    };

    // Helper: Load full project data (e.g. from Sample Data)
    const loadProjectData = (projectData) => {
        setCurrentProject(projectData);
        setCurrentProjectId(projectData.id);
        if (projectData.wells && projectData.wells.length > 0) {
            setActiveWellId(projectData.wells[0].id);
        }
        localStorage.setItem('dca_active_project', JSON.stringify(projectData));
        // Save to Supabase (Mock)
        console.log("Saving project to cloud...", projectData.id);
    };

    // Helper: Add a well
    const addWell = (well) => {
        const updatedProject = {
            ...currentProject,
            wells: [...(currentProject.wells || []), well]
        };
        setCurrentProject(updatedProject);
        localStorage.setItem('dca_active_project', JSON.stringify(updatedProject));
    };

    // Helper: Save Project
    const saveProject = async () => {
        if (!currentProject) return;
        localStorage.setItem('dca_active_project', JSON.stringify(currentProject));
        // Simulate Cloud Save
        toast({ title: "Project Saved", description: "All changes persisted locally." });
    };

    // Clear Data
    const clearData = () => {
        setCurrentProject(null);
        setCurrentProjectId(null);
        setActiveWellId(null);
        localStorage.removeItem('dca_active_project');
        toast({ title: "Data Cleared", description: "Project data has been reset." });
    };

    const value = {
        currentProject,
        currentProjectId,
        currentWell,
        activeWellId,
        selectWell,
        activeStream, 
        setActiveStream,
        fitConfig,
        setFitConfig,
        forecastConfig,
        setForecastConfig,
        activeScenarioId,
        setActiveScenarioId,
        activeScenario,
        createProject,
        loadProjectData,
        addWell,
        saveProject,
        clearData
    };

    return (
        <DeclineCurveContext.Provider value={value}>
            {children}
        </DeclineCurveContext.Provider>
    );
};