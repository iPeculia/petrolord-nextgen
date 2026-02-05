import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { geometryStorage } from '@/modules/drilling/well-planning/utils/geometryStorage';
import { calculateTrajectory, calculateStats } from '@/modules/drilling/well-planning/utils/geometryUtils';
import { v4 as uuidv4 } from 'uuid';

// Restored robust initial state
const initialState = {
  activeTab: 'geometry',
  currentProject: null,
  currentWell: null,
  projects: [],
  wells: [], // This is 'projectWells' in some components, mapped in logic below
  isLoading: false,
  error: null,
  state: {
     ui: {
       leftPanelOpen: true,
       rightPanelOpen: true,
       activeView: '2d'
     },
     geometry: {
       sections: [],
       trajectory: [],
       stats: { totalMD: 0, totalTVD: 0, maxInc: 0, displacement: 0 }
     }
  }
};

const WellPlanningDesignContext = createContext(initialState);

export const useWellPlanningDesign = () => {
  const context = useContext(WellPlanningDesignContext);
  if (!context) {
    throw new Error('useWellPlanningDesign must be used within a WellPlanningDesignProvider');
  }
  return context;
};

// Mock Data Generator for Restoration Phase
const generateMockWell = (id) => ({
  id,
  name: `Well ${id.slice(0, 4)}`,
  type: 'Deviated',
  status: 'Planning',
  targetDepth: 12500,
  location: { lat: 29.7604, long: -95.3698 },
  holeSize: 8.5
});

export const WellPlanningDesignProvider = ({ children }) => {
  // UI State
  const [activeTab, setActiveTab] = useState('geometry');
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  
  // Data State
  const [currentProject, setCurrentProject] = useState({ id: 'proj-001', name: 'Permian Basin Alpha' });
  const [currentWell, setCurrentWell] = useState(null);
  const [projects, setProjects] = useState([{ id: 'proj-001', name: 'Permian Basin Alpha' }]);
  const [projectWells, setProjectWells] = useState([]); // List of wells in current project
  
  // App Logic State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Geometry Specific State
  const [sections, setSections] = useState([]);
  const [geometryState, setGeometryState] = useState(initialState.state.geometry);

  // Safe Toggle Functions
  const toggleLeftPanel = useCallback(() => setLeftPanelOpen(prev => !prev), []);
  const toggleRightPanel = useCallback(() => setRightPanelOpen(prev => !prev), []);

  // --- Geometry Actions (Restored) ---
  const addSection = useCallback((newSection) => {
    setSections(prev => [...prev, newSection]);
  }, []);

  const updateSection = useCallback((id, field, value) => {
    setSections(prev => prev.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  }, []);

  const deleteSection = useCallback((id) => {
    setSections(prev => prev.filter(s => s.id !== id));
  }, []);

  // Bundle Actions for Consumers
  const geometryActions = useMemo(() => ({
    addSection,
    updateSection,
    deleteSection
  }), [addSection, updateSection, deleteSection]);

  // --- Calculation Effect ---
  // Automatically recalculate trajectory whenever sections change
  useEffect(() => {
    try {
        const trajectory = calculateTrajectory(sections);
        const stats = calculateStats(trajectory);
        
        setGeometryState({
            sections,
            trajectory,
            stats
        });

        // Persist if a well is selected
        if (currentWell) {
            geometryStorage.saveSections(currentWell.id, sections);
        }
    } catch (err) {
        console.error("Trajectory Calculation Error:", err);
        // Don't crash the app, just log
    }
  }, [sections, currentWell]);

  // --- Initialization ---
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Load mock wells for the restoration phase
        const mockWells = [
            { ...generateMockWell(uuidv4()), name: 'Well-P101 (Demo)' },
            { ...generateMockWell(uuidv4()), name: 'Well-P102 (Draft)' }
        ];
        setProjectWells(mockWells);
        
        // Auto-select first well
        if (mockWells.length > 0) {
            const initialWell = mockWells[0];
            setCurrentWell(initialWell);
            
            // Load sections or init default if empty
            const savedSections = geometryStorage.getSections(initialWell.id);
            if (savedSections && savedSections.length > 0) {
                setSections(savedSections);
            } else {
                setSections([
                    { id: uuidv4(), name: 'Surface Casing', type: 'Vertical', length: 2000, inclination: 0, azimuth: 0, holeSize: 17.5 },
                    { id: uuidv4(), name: 'Build Section', type: 'Build', length: 1500, inclination: 30, azimuth: 45, holeSize: 12.25 },
                    { id: uuidv4(), name: 'Tangent Section', type: 'Hold', length: 3000, inclination: 30, azimuth: 45, holeSize: 12.25 }
                ]);
            }
        }
      } catch (err) {
        console.error("Context Initialization Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, []); // Run once on mount

  // Context Value Object
  const value = {
    activeTab,
    setActiveTab,
    state: {
      ui: { leftPanelOpen, rightPanelOpen },
      geometry: geometryState, // Using the computed geometry state
      projects
    },
    // Top Level Data
    currentProject,
    setCurrentProject,
    currentWell,
    setCurrentWell,
    projectWells,
    
    // Status
    isLoading,
    error,
    
    // UI Helpers
    toggleLeftPanel,
    toggleRightPanel,
    
    // Geometry Logic
    geometryState, // Direct access for convenience
    geometryActions,
    createWell: (wellData) => {
        const newWell = { ...wellData, id: uuidv4() };
        setProjectWells(prev => [...prev, newWell]);
        setCurrentWell(newWell);
        setSections([
            { id: uuidv4(), name: 'Surface', type: 'Vertical', length: 1000, inclination: 0, azimuth: 0, holeSize: 20 }
        ]);
    }
  };

  return (
    <WellPlanningDesignContext.Provider value={value}>
      {children}
    </WellPlanningDesignContext.Provider>
  );
};