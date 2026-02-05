import React, { useState, useMemo } from 'react';
import { useAnalytics } from '@/modules/geoscience/petrophysical-analysis/context/AnalyticsContext';
import { detectAnomalies } from '@/modules/geoscience/petrophysical-analysis/utils/analyticsCalculations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from '@/components/ui/scroll-area';

const AnomalyWidget = () => {
    const { activeLogs, selectedCurves } = useAnalytics();
    const [targetCurve, setTargetCurve] = useState(selectedCurves[0] || '');
    const [threshold, setThreshold] = useState("2.5"); // String for select

    const anomalies = useMemo(() => {
        if (!targetCurve || !activeLogs[targetCurve]) return [];
        return detectAnomalies(
            activeLogs[targetCurve].value_array, 
            activeLogs[targetCurve].depth_array, 
            parseFloat(threshold)
        );
    }, [targetCurve, activeLogs, threshold]);

    return (
        <div className="flex flex-col md:flex-row gap-4 h-[300px]">
            {/* Controls & List */}
            <div className="w-full md:w-1/3 flex flex-col gap-3">
                 <div className="grid grid-cols-2 gap-2">
                    <Select value={targetCurve} onValueChange={setTargetCurve}>
                        <SelectTrigger className="h-8 bg-slate-900 border-slate-700 text-xs"><SelectValue placeholder="Curve" /></SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                            {selectedCurves.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={threshold} onValueChange={setThreshold}>
                        <SelectTrigger className="h-8 bg-slate-900 border-slate-700 text-xs"><SelectValue placeholder="Sensitivity" /></SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                            <SelectItem value="2.0">High (2.0σ)</SelectItem>
                            <SelectItem value="2.5">Medium (2.5σ)</SelectItem>
                            <SelectItem value="3.0">Low (3.0σ)</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>

                 <div className="bg-slate-950/50 rounded border border-slate-800 flex-1 overflow-hidden flex flex-col">
                    <div className="p-2 bg-slate-900/80 border-b border-slate-800 text-xs font-medium text-slate-400">
                        Detected Anomalies ({anomalies.length})
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="divide-y divide-slate-800/50">
                            {anomalies.map((a, idx) => (
                                <div key={idx} className="p-2 hover:bg-slate-800/30 flex justify-between text-xs">
                                    <span className="text-slate-300">Depth: {a.depth.toFixed(1)}m</span>
                                    <span className={a.type === 'High' ? 'text-red-400' : 'text-blue-400'}>
                                        {a.type} (Z: {a.zScore.toFixed(1)})
                                    </span>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                 </div>
            </div>

            {/* Visualizer Placeholder (Simple Map for now) */}
            <div className="flex-1 bg-slate-950/30 border border-slate-800 rounded relative p-4">
                 <h4 className="text-xs text-slate-400 mb-2">Anomaly Distribution</h4>
                 {/* A simple distribution visualization could go here, using a ScatterChart or just bars */}
                 <div className="h-full w-full flex items-end gap-px opacity-70">
                    {anomalies.length > 0 ? (
                         // Simple visualization: Plot anomaly z-scores over normalized depth?
                         // For brevity, we'll just list stats
                         <div className="w-full h-full flex flex-col justify-center items-center text-slate-500 space-y-2">
                             <div className="text-3xl font-bold text-slate-300">{anomalies.length}</div>
                             <div className="text-sm">Statistical outliers detected</div>
                             <div className="flex gap-4 mt-4 text-xs">
                                <span className="text-red-400">High: {anomalies.filter(a => a.type === 'High').length}</span>
                                <span className="text-blue-400">Low: {anomalies.filter(a => a.type === 'Low').length}</span>
                             </div>
                         </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600 text-sm">
                            No significant anomalies detected at this threshold.
                        </div>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default AnomalyWidget;