import { useState, useCallback } from 'react';
import { useFacilityMasterPlanner } from '../context/FacilityMasterPlannerContext';
import FacilityPlanningEngine from '../utils/facilityPlanningEngine';
import { useToast } from '@/components/ui/use-toast';

const useAdvancedPlanning = () => {
  const { 
    scenarios, 
    addScenario, 
    updateScenario, 
    deleteScenario, 
    currentProject, 
    currentFacility,
    productionProfiles 
  } = useFacilityMasterPlanner();
  
  const { toast } = useToast();
  const [comparingScenarios, setComparingScenarios] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper to get profile for current project
  const getProjectProfile = () => {
      // Assuming one profile per project for simplicity in this hook, or pick the first
      return productionProfiles.find(p => p.project_id === currentProject?.project_id)?.data || [];
  };

  const createNewScenario = useCallback((data) => {
    try {
        const newScenario = FacilityPlanningEngine.createScenario(
            data.name, 
            data.description, 
            data.parameters
        );
        newScenario.project_id = currentProject?.project_id; // Link to project
        addScenario(newScenario);
        return newScenario;
    } catch (error) {
        toast({ title: "Error", description: "Failed to create scenario.", variant: "destructive" });
        return null;
    }
  }, [addScenario, currentProject, toast]);

  const runScenarioAnalysis = useCallback(async (scenarioId) => {
    setIsProcessing(true);
    try {
        const scenario = scenarios.find(s => s.scenario_id === scenarioId);
        if (!scenario) throw new Error("Scenario not found");

        const profile = getProjectProfile();
        if (!profile || profile.length === 0) throw new Error("No production profile available for analysis");
        
        if (!currentFacility) throw new Error("No facility definition available");

        // Simulate async delay for "Engine" run
        await new Promise(resolve => setTimeout(resolve, 1500));

        const resultScenario = FacilityPlanningEngine.runScenarioMasterPlan(scenario, profile, currentFacility);
        
        updateScenario(scenarioId, resultScenario);
        toast({ title: "Analysis Complete", description: `Scenario "${scenario.name}" processed successfully.` });
        return resultScenario;
    } catch (error) {
        console.error(error);
        toast({ title: "Analysis Failed", description: error.message, variant: "destructive" });
    } finally {
        setIsProcessing(false);
    }
  }, [scenarios, currentFacility, productionProfiles, updateScenario, toast, getProjectProfile]);

  const toggleComparison = useCallback((scenarioId) => {
      setComparingScenarios(prev => {
          if (prev.includes(scenarioId)) return prev.filter(id => id !== scenarioId);
          if (prev.length >= 4) {
              toast({ title: "Limit Reached", description: "You can compare up to 4 scenarios at once." });
              return prev;
          }
          return [...prev, scenarioId];
      });
  }, [toast]);

  const getRankedScenarios = useCallback((metric = 'npv') => {
      // Only rank scenarios with results
      const validScenarios = scenarios.filter(s => s.results);
      return FacilityPlanningEngine.rankScenarios(validScenarios, metric);
  }, [scenarios]);

  return {
      scenarios,
      comparingScenarios,
      isProcessing,
      createNewScenario,
      runScenarioAnalysis,
      toggleComparison,
      setComparingScenarios,
      deleteScenario,
      getRankedScenarios
  };
};

export default useAdvancedPlanning;