import React from 'react';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFacilityMasterPlanner } from '../../context/FacilityMasterPlannerContext';

const ProgressIndicator = () => {
  const { currentProject, currentFacility, processUnits, productionProfiles } = useFacilityMasterPlanner();

  const steps = [
    { id: 1, label: 'Project', status: currentProject ? 'completed' : 'active' },
    { id: 2, label: 'Facility', status: currentProject && !currentFacility ? 'active' : currentFacility ? 'completed' : 'pending' },
    { id: 3, label: 'Process Units', status: currentFacility && processUnits.length === 0 ? 'active' : processUnits.length > 0 ? 'completed' : 'pending' },
    { id: 4, label: 'Schedule', status: processUnits.length > 0 && productionProfiles.length === 0 ? 'active' : productionProfiles.length > 0 ? 'completed' : 'pending' }
  ];

  return (
    <div className="flex items-center space-x-2 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex items-center gap-2">
            {step.status === 'completed' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : step.status === 'active' ? (
              <div className="relative flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-blue-500 text-[10px] font-bold text-white items-center justify-center">
                    {step.id}
                </span>
              </div>
            ) : (
              <Circle className="w-5 h-5 text-slate-700" />
            )}
            <span className={cn(
              "text-xs font-medium transition-colors",
              step.status === 'completed' ? "text-slate-300" :
              step.status === 'active' ? "text-blue-400" : "text-slate-600"
            )}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className="h-px w-6 bg-slate-800" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressIndicator;