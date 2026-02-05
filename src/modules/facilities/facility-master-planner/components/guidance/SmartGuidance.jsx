import React from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFacilityMasterPlanner } from '../../context/FacilityMasterPlannerContext';

const SmartGuidance = () => {
  const { currentProject, currentFacility, processUnits, productionProfiles, setCurrentTab } = useFacilityMasterPlanner();

  let guidance = null;

  if (!currentProject) {
    guidance = {
      title: "Start Your Project",
      message: "Create a new project to define the scope and economic parameters.",
      action: "Create Project",
      onClick: () => {} // Handled by trigger usually
    };
  } else if (!currentFacility) {
    guidance = {
      title: "Define Facility",
      message: "Add a main facility (e.g., FPSO, CPF) to your project.",
      action: "Add Facility",
      onClick: () => {} 
    };
  } else if (processUnits.length === 0) {
    guidance = {
        title: "Build Process Flow",
        message: "Add separation, compression, or other units to build your layout.",
        action: "Go to Overview",
        onClick: () => setCurrentTab('Overview')
    }
  } else if (productionProfiles.length === 0) {
      guidance = {
          title: "Add Forecast",
          message: "Define annual production rates to check capacity constraints.",
          action: "Go to Schedule",
          onClick: () => setCurrentTab('Production Schedule')
      }
  }

  if (!guidance) return null;

  return (
    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 flex items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-500/20 rounded-full mt-1">
            <Lightbulb className="w-4 h-4 text-blue-400" />
        </div>
        <div>
            <h4 className="text-sm font-semibold text-blue-100">{guidance.title}</h4>
            <p className="text-xs text-blue-200/70">{guidance.message}</p>
        </div>
      </div>
      {guidance.action && (
          <Button size="sm" onClick={guidance.onClick} className="bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs">
              {guidance.action} <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
      )}
    </div>
  );
};

export default SmartGuidance;