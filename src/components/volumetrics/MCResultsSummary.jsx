import React from 'react';
import { Card } from '@/components/ui/card';

const StatBox = ({ label, p10, p50, p90, unit }) => (
    <div className="bg-slate-900/50 border border-slate-800 rounded p-3 flex flex-col gap-2">
        <div className="text-xs font-semibold text-slate-400 uppercase">{label}</div>
        <div className="grid grid-cols-3 gap-2 text-center">
            <div>
                <div className="text-[10px] text-slate-500">P90</div>
                <div className="text-sm font-bold text-green-400">{p90.toFixed(1)}</div>
            </div>
            <div>
                <div className="text-[10px] text-slate-500">P50</div>
                <div className="text-sm font-bold text-blue-400">{p50.toFixed(1)}</div>
            </div>
            <div>
                <div className="text-[10px] text-slate-500">P10</div>
                <div className="text-sm font-bold text-purple-400">{p10.toFixed(1)}</div>
            </div>
        </div>
        <div className="text-[10px] text-right text-slate-600">{unit}</div>
    </div>
);

const MCResultsSummary = ({ stats }) => {
    if (!stats) return null;
    // stats: { stoiip: {P90, P50...}, recoverable: {P90...} }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
             <StatBox 
                label="STOIIP" 
                p90={stats.stoiip.P90} 
                p50={stats.stoiip.P50} 
                p10={stats.stoiip.P10} 
                unit="MMbbl" 
            />
            <StatBox 
                label="Recoverable Resources" 
                p90={stats.recoverable.P90} 
                p50={stats.recoverable.P50} 
                p10={stats.recoverable.P10} 
                unit="MMbbl" 
            />
        </div>
    );
};

export default MCResultsSummary;