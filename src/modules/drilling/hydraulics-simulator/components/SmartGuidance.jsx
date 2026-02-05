import React, { useMemo } from 'react';
import { useHydraulicsSimulator } from '@/contexts/HydraulicsSimulatorContext';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SmartGuidance = () => {
    const { 
        current_project, 
        current_well, 
        hole_sections, 
        drilling_fluids, 
        tubular_components, 
        pumps
    } = useHydraulicsSimulator();

    const recommendation = useMemo(() => {
        if (!current_project) return { text: "Create a new project to get started.", action: "Project" };
        if (!current_well) return { text: "Define a well for your project.", action: "Well" };
        if (!hole_sections.some(s => s.well_id === current_well.well_id)) return { text: "Configure open hole and casing geometry.", action: "Geometry" };
        if (!drilling_fluids.some(f => f.project_id === current_project.project_id)) return { text: "Set up drilling fluid properties.", action: "Fluid" };
        if (!tubular_components.some(t => t.well_id === current_well.well_id)) return { text: "Build your drill string (BHA).", action: "String" };
        if (!pumps.some(p => p.project_id === current_project.project_id)) return { text: "Configure mud pumps and surface equipment.", action: "Equipment" };
        return { text: "System ready! You can now run simulations.", action: "Simulate", ready: true };
    }, [current_project, current_well, hole_sections, drilling_fluids, tubular_components, pumps]);

    // This component is purely informational for the header or dashboard
    // The parent component handles the actual navigation click
    
    return (
        <div className="bg-blue-900/20 border border-blue-900/50 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-blue-900/50 p-2 rounded-full">
                    <Lightbulb className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                    <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wide">Next Step</h4>
                    <p className="text-sm text-slate-300">{recommendation.text}</p>
                </div>
            </div>
            {!recommendation.ready && (
                <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-blue-400 hover:text-white hover:bg-blue-900/50 text-xs"
                    onClick={() => document.querySelector(`[data-tab="${recommendation.action}"]`)?.click()}
                >
                    Go <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
            )}
        </div>
    );
};

export default SmartGuidance;