import React from 'react';
import { useTorqueDrag } from '@/contexts/TorqueDragContext';

const ProgressIndicator = () => {
  const { current_project, current_well, trajectory_stations, drill_strings, drilling_fluids, friction_coefficients } = useTorqueDrag();

  const steps = [
    { label: "Project", active: !!current_project },
    { label: "Well", active: !!current_well },
    { label: "Trajectory", active: trajectory_stations.length > 1 }, // Assuming initial demo stations or real ones
    { label: "Pipe", active: drill_strings.length > 0 },
    { label: "Fluid", active: drilling_fluids.length > 0 },
    { label: "Friction", active: friction_coefficients.length > 0 }
  ];

  const completed = steps.filter(s => s.active).length;
  const progress = Math.round((completed / steps.length) * 100);

  return (
    <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Setup Progress</span>
            <span className="text-xs font-bold text-blue-400">{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex justify-between mt-2">
            {steps.map((step, idx) => (
                <div key={idx} className={`text-[10px] ${step.active ? 'text-green-500 font-medium' : 'text-slate-600'}`}>
                    {step.label}
                </div>
            ))}
        </div>
    </div>
  );
};

export default ProgressIndicator;