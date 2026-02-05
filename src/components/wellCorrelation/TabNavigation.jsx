import React from 'react';
import { cn } from '@/lib/utils';
import { Database, Activity, Layers, Zap, CheckSquare, Download } from 'lucide-react';

const TabNavigation = ({ value, onValueChange }) => {
    const tabs = [
        { id: 'data', label: 'Data Management', icon: Database },
        { id: 'correlation', label: 'Correlation Panel', icon: Activity },
        { id: 'horizons', label: 'Horizons & Markers', icon: Layers },
        { id: 'advanced', label: 'Advanced', icon: Zap },
        { id: 'qc', label: 'QC & Comments', icon: CheckSquare },
        { id: 'export', label: 'Export', icon: Download },
    ];

    return (
        <div className="bg-slate-950 border-b border-slate-800 px-4 shrink-0">
            <div className="flex items-center gap-1 overflow-x-auto petro-scrollbar">
                {tabs.map((tab) => {
                    const isActive = value === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onValueChange(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                                isActive 
                                    ? "border-[#CCFF00] text-white" 
                                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                            )}
                        >
                            <Icon size={16} className={isActive ? "text-[#CCFF00]" : "text-slate-500"} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default TabNavigation;