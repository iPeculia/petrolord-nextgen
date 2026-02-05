import React from 'react';
import { useHydraulicsSimulator } from '@/contexts/HydraulicsSimulatorContext';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const DataValidationSummary = () => {
    const { 
        current_project, 
        current_well, 
        hole_sections, 
        drilling_fluids, 
        tubular_components,
        pumps
    } = useHydraulicsSimulator();

    const issues = [];

    if (!current_project) issues.push({ severity: 'high', msg: 'Missing Project', tab: 'Project' });
    else {
        if (!current_project.unit_system) issues.push({ severity: 'medium', msg: 'Project Unit System not defined', tab: 'Project' });
    }

    if (!current_well) issues.push({ severity: 'high', msg: 'Missing Well', tab: 'Well' });
    else {
         if (!current_well.total_depth_ft) issues.push({ severity: 'medium', msg: 'Well Total Depth is 0', tab: 'Well' });
    }

    const wellSections = hole_sections.filter(s => s.well_id === current_well?.well_id);
    if (current_well && wellSections.length === 0) issues.push({ severity: 'high', msg: 'No Hole Sections defined', tab: 'Geometry' });
    
    // Check if sections cover TD (rough check)
    if (current_well && wellSections.length > 0) {
        const maxDepth = Math.max(...wellSections.map(s => s.bottom_depth_ft));
        if (maxDepth < current_well.total_depth_ft) issues.push({ severity: 'medium', msg: `Geometry only defined to ${maxDepth}ft (TD: ${current_well.total_depth_ft}ft)`, tab: 'Geometry' });
    }

    const wellFluids = drilling_fluids.filter(f => f.project_id === current_project?.project_id);
    if (current_project && wellFluids.length === 0) issues.push({ severity: 'high', msg: 'No Fluid Properties defined', tab: 'Fluid' });

    const wellString = tubular_components.filter(t => t.well_id === current_well?.well_id);
    if (current_well && wellString.length === 0) issues.push({ severity: 'high', msg: 'No Drill String defined', tab: 'String' });
    
    // Check for bit
    if (wellString.length > 0 && !wellString.some(c => c.type === 'Bit')) issues.push({ severity: 'high', msg: 'Drill String missing Bit', tab: 'String' });

    if (issues.length === 0) {
        return (
            <div className="p-4 bg-green-900/10 border border-green-900/30 rounded-lg flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-sm text-green-400 font-medium">Data Validation Passed</span>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col h-full max-h-[200px]">
            <div className="bg-slate-950 px-3 py-2 border-b border-slate-800 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Validation Issues</span>
                <span className="bg-red-900/50 text-red-400 text-[10px] px-2 py-0.5 rounded-full">{issues.length} Issues</span>
            </div>
            <ScrollArea className="flex-1">
                <div className="divide-y divide-slate-800">
                    {issues.map((issue, idx) => (
                        <div key={idx} className="px-3 py-2 flex items-start gap-2 hover:bg-slate-800/50 cursor-pointer"
                             onClick={() => document.querySelector(`[data-tab="${issue.tab}"]`)?.click()}
                        >
                            <AlertCircle className={`h-4 w-4 mt-0.5 ${issue.severity === 'high' ? 'text-red-500' : 'text-yellow-500'}`} />
                            <div>
                                <p className={`text-xs font-medium ${issue.severity === 'high' ? 'text-red-400' : 'text-yellow-400'}`}>{issue.msg}</p>
                                <p className="text-[10px] text-slate-500">Go to {issue.tab}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

export default DataValidationSummary;