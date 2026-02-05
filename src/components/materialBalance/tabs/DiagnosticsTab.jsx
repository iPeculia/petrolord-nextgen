import React, { useEffect, useState } from 'react';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { generateDiagnosticData } from '@/utils/materialBalance/DiagnosticDataGenerator';
import MBDiagnosticPlots from '@/components/materialBalance/MBDiagnosticPlots';
import DriveMechanismHelper from '@/components/materialBalance/DriveMechanismHelper';
import DiagnosticSummary from '@/components/materialBalance/DiagnosticSummary';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlayCircle, Settings2, RefreshCw } from 'lucide-react';

const DiagnosticsTab = () => {
    const { 
        productionData, 
        pressureData, 
        pvtData, 
        tankParameters, 
        dispatch,
        diagnosticPlots,
        diagnosticStats,
        diagnosticSettings
    } = useMaterialBalance();

    const [selectedPlot, setSelectedPlot] = useState('F_vs_Eo');

    // Effect to auto-select relevant plot for gas
    useEffect(() => {
        if (tankParameters.reservoirType === 'gas') {
            setSelectedPlot('P_over_Z');
        } else if (selectedPlot === 'P_over_Z') {
            setSelectedPlot('F_vs_Eo');
        }
    }, [tankParameters.reservoirType]);

    const handleRunDiagnostics = () => {
        dispatch({ type: 'RUN_DIAGNOSTICS' });
        
        // Simulate async calculation to prevent UI freeze on large datasets
        setTimeout(() => {
            const results = generateDiagnosticData(
                productionData, 
                pressureData, 
                pvtData, 
                tankParameters
            );
            
            dispatch({ 
                type: 'STORE_DIAGNOSTIC_RESULTS', 
                payload: {
                    plots: results.plots,
                    stats: results.stats,
                    assessment: null 
                } 
            });
        }, 100);
    };

    const getPlotConfig = (type) => {
        switch(type) {
            case 'F_vs_Eo': return { title: 'Solution Gas Drive Plot (F vs Eo)', x: 'Eo (rb/stb)', y: 'F (rb)' };
            case 'F_vs_Total_Expansion': return { title: 'Gas Cap Drive Plot (F vs Eo + Eg)', x: 'Total Expansion (rb/stb)', y: 'F (rb)' };
            case 'Havlena_Odeh': return { title: 'Havlena-Odeh (F/Eo vs Eg/Eo)', x: 'Eg/Eo', y: 'F/Eo' };
            case 'P_over_Z': return { title: 'P/Z vs Cumulative Production', x: 'Gp (MMscf)', y: 'P/Z (psia)' };
            case 'F_vs_Efw': return { title: 'Water Drive Plot (F vs Efw)', x: 'Efw (rb)', y: 'F (rb)' };
            default: return { title: 'Diagnostic Plot', x: 'X', y: 'Y' };
        }
    };

    const plotConfig = getPlotConfig(selectedPlot);
    const currentData = diagnosticPlots?.[selectedPlot] || [];
    const currentStats = diagnosticStats?.[selectedPlot] || { slope: 0, intercept: 0, r2: 0 };

    return (
        <div className="flex flex-col h-full gap-4 animate-in fade-in">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                    <Select value={selectedPlot} onValueChange={setSelectedPlot}>
                        <SelectTrigger className="w-[250px] bg-slate-800 border-slate-700 text-white">
                            <SelectValue placeholder="Select Plot Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700 text-white">
                            {tankParameters.reservoirType === 'gas' ? (
                                <SelectItem value="P_over_Z">P/Z vs Gp</SelectItem>
                            ) : (
                                <>
                                    <SelectItem value="F_vs_Eo">F vs Eo (Solution Gas)</SelectItem>
                                    <SelectItem value="F_vs_Total_Expansion">F vs (Eo + Eg) (Gas Cap)</SelectItem>
                                    <SelectItem value="Havlena_Odeh">Havlena-Odeh Plot</SelectItem>
                                    <SelectItem value="F_vs_Efw">F vs Efw (Water Drive)</SelectItem>
                                </>
                            )}
                        </SelectContent>
                    </Select>
                    
                    <div className="h-6 w-px bg-slate-700" />
                    
                    <Button 
                        onClick={handleRunDiagnostics} 
                        className="bg-blue-600 hover:bg-blue-500 text-white gap-2"
                    >
                        <PlayCircle className="w-4 h-4" />
                        Run Diagnostics
                    </Button>
                </div>
                
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                    <Settings2 className="w-5 h-5" />
                </Button>
            </div>

            <DiagnosticSummary stats={diagnosticStats} params={tankParameters} />

            {/* Main Content */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
                {/* Left: Plot Area */}
                <div className="col-span-1 md:col-span-8 flex flex-col gap-4">
                    <MBDiagnosticPlots 
                        data={currentData}
                        regression={currentStats}
                        title={plotConfig.title}
                        xLabel={plotConfig.x}
                        yLabel={plotConfig.y}
                        type={selectedPlot}
                    />
                    
                    {/* Stats Card */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                            <div className="text-xs text-slate-500 uppercase font-semibold">Slope (m)</div>
                            <div className="text-2xl font-mono text-white mt-1">{currentStats.slope.toExponential(4)}</div>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                            <div className="text-xs text-slate-500 uppercase font-semibold">Intercept (c)</div>
                            <div className="text-2xl font-mono text-white mt-1">{currentStats.intercept.toExponential(4)}</div>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                            <div className="text-xs text-slate-500 uppercase font-semibold">Std Error</div>
                            <div className="text-2xl font-mono text-white mt-1">{currentStats.stdError ? currentStats.stdError.toFixed(4) : 'N/A'}</div>
                        </div>
                    </div>
                </div>

                {/* Right: Analysis Panel */}
                <div className="col-span-1 md:col-span-4 flex flex-col h-full">
                    <DriveMechanismHelper 
                        stats={diagnosticStats} 
                        reservoirType={tankParameters.reservoirType} 
                    />
                </div>
            </div>
        </div>
    );
};

export default DiagnosticsTab;