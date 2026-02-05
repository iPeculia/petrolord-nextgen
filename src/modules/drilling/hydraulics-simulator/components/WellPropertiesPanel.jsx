import React from 'react';
import { useHydraulicsSimulator } from '@/contexts/HydraulicsSimulatorContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const WellPropertiesPanel = () => {
    const { current_well } = useHydraulicsSimulator();

    if (!current_well) return null;

    return (
        <Card className="bg-slate-900 border-slate-800 rounded-none shadow-none">
            <CardHeader className="py-3 px-4 bg-slate-800/50 border-b border-slate-800">
                <CardTitle className="text-sm font-medium text-slate-200">Well Configuration</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-slate-500">Rig Name</div>
                    <div className="text-slate-300 font-medium text-right">{current_well.rig_name}</div>
                    
                    <div className="text-slate-500">API Number</div>
                    <div className="text-slate-300 font-medium text-right">{current_well.api_number}</div>
                    
                    <div className="text-slate-500">Total Depth</div>
                    <div className="text-slate-300 font-medium text-right">{current_well.total_depth_ft.toLocaleString()} ft</div>
                    
                    <div className="text-slate-500">Water Depth</div>
                    <div className="text-slate-300 font-medium text-right">{current_well.water_depth_ft.toLocaleString()} ft</div>
                    
                    <div className="text-slate-500">RKB Elev.</div>
                    <div className="text-slate-300 font-medium text-right">{current_well.rkb_elevation_ft} ft</div>
                </div>
                
                <div className="pt-2 border-t border-slate-800">
                    <div className="text-xs text-slate-500 mb-2">Hole Sections</div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-400 px-1">
                            <span>Type</span>
                            <span>OD</span>
                            <span>Depth</span>
                        </div>
                        {/* Demo/Current sections would be mapped here */}
                        <div className="flex justify-between text-xs bg-slate-800/30 p-1 rounded border border-slate-800/50">
                            <span className="text-blue-400">Riser</span>
                            <span className="text-slate-300">21"</span>
                            <span className="text-slate-400">5000'</span>
                        </div>
                        <div className="flex justify-between text-xs bg-slate-800/30 p-1 rounded border border-slate-800/50">
                            <span className="text-green-400">Casing</span>
                            <span className="text-slate-300">13⅜"</span>
                            <span className="text-slate-400">8500'</span>
                        </div>
                        <div className="flex justify-between text-xs bg-slate-800/30 p-1 rounded border border-slate-800/50">
                            <span className="text-yellow-400">Open Hole</span>
                            <span className="text-slate-300">12¼"</span>
                            <span className="text-slate-400">TD</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default WellPropertiesPanel;