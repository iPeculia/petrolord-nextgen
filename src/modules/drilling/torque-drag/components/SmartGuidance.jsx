import React from 'react';
import { useTorqueDrag } from '@/contexts/TorqueDragContext';
import { Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SmartGuidance = () => {
  const { current_project, current_well, trajectory_stations, drill_strings } = useTorqueDrag();

  let recommendation = "Create a new project to get started.";
  let action = "Create Project";

  if (current_project) {
      if (!current_well) {
          recommendation = "Define the well header parameters.";
          action = "Add Well";
      } else if (trajectory_stations.length <= 1) {
          recommendation = "Import or define the wellbore trajectory.";
          action = "Define Trajectory";
      } else if (drill_strings.length === 0) {
          recommendation = "Assemble your drill string configuration.";
          action = "Build String";
      } else {
          recommendation = "You are ready to run simulations.";
          action = "Run Analysis";
      }
  }

  return (
    <div className="bg-blue-900/20 border border-blue-900/50 rounded-md p-3 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400">
                <Lightbulb className="h-4 w-4" />
            </div>
            <div>
                <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Recommended Action</div>
                <div className="text-sm text-slate-300">{recommendation}</div>
            </div>
        </div>
        {/* Action button functionality would need to hook into navigation state, omitting for simple display */}
    </div>
  );
};

export default SmartGuidance;