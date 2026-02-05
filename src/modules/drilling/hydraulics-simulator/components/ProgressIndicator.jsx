import React, { useMemo } from 'react';
import { useHydraulicsSimulator } from '@/contexts/HydraulicsSimulatorContext';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const ProgressIndicator = () => {
    const { 
        current_project, 
        current_well, 
        hole_sections, 
        drilling_fluids, 
        tubular_components, 
        pumps,
        chokes
    } = useHydraulicsSimulator();

    const steps = useMemo(() => {
        const hasProject = !!current_project;
        const hasWell = !!current_well;
        const hasGeometry = hole_sections.some(s => s.well_id === current_well?.well_id);
        const hasFluid = drilling_fluids.some(f => f.project_id === current_project?.project_id);
        const hasString = tubular_components.some(t => t.well_id === current_well?.well_id);
        const hasPump = pumps.some(p => p.project_id === current_project?.project_id);
        
        return [
            { label: 'Project', completed: hasProject },
            { label: 'Well', completed: hasWell },
            { label: 'Geometry', completed: hasGeometry },
            { label: 'Fluid', completed: hasFluid },
            { label: 'String', completed: hasString },
            { label: 'Equipment', completed: hasPump }
        ];
    }, [current_project, current_well, hole_sections, drilling_fluids, tubular_components, pumps]);

    const completedCount = steps.filter(s => s.completed).length;
    const progress = Math.round((completedCount / steps.length) * 100);

    return (
        <div className="w-full bg-slate-900 border-b border-slate-800 p-2">
            <div className="flex items-center justify-between mb-2 px-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Setup Progress</span>
                <span className="text-xs font-bold text-blue-400">{progress}%</span>
            </div>
            <div className="flex gap-1 px-2">
                {steps.map((step, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                        <div className={cn(
                            "w-full h-1 rounded-full transition-all duration-300",
                            step.completed ? "bg-green-500" : "bg-slate-800"
                        )}></div>
                        <span className={cn(
                            "text-[10px] uppercase font-medium transition-colors",
                            step.completed ? "text-green-500" : "text-slate-600"
                        )}>{step.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProgressIndicator;