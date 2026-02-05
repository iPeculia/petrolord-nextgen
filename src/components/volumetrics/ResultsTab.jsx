import React from 'react';
import ResultsDisplay from './ResultsDisplay';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { DataExporter } from '@/utils/volumetrics/DataExporter';
import { useVolumetrics } from '@/hooks/useVolumetrics';

const ResultsTab = () => {
    const { state } = useVolumetrics();

    const handleExportCSV = () => {
        if (state.data.results) {
            DataExporter.exportToCSV(state.data.results, `volumetrics_${state.project.name}.csv`);
        }
    };

    return (
        <div className="h-full flex flex-col">
             <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900/30">
                <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Calculation Results</h2>
                <div className="flex gap-2">
                     <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleExportCSV}
                        disabled={!state.data.results}
                        className="h-8 text-xs text-slate-400 hover:text-white"
                    >
                        <Download size={14} className="mr-2" /> CSV
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm"
                        disabled={!state.data.results} 
                        className="h-8 text-xs text-slate-400 hover:text-white"
                    >
                        <Printer size={14} className="mr-2" /> Print
                    </Button>
                </div>
             </div>
             
             <div className="flex-1 overflow-hidden">
                <ResultsDisplay />
             </div>
        </div>
    );
};

export default ResultsTab;