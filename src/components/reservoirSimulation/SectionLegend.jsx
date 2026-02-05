import React from 'react';
import { FACIES_COLORS } from '@/utils/sectionViewUtils.js';

const SectionLegend = ({ property, min, max }) => {
    if (property === 'facies') {
        return (
            <div className="bg-slate-900/80 p-2 rounded border border-slate-800 backdrop-blur-sm">
                <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase">Facies</div>
                <div className="space-y-1">
                    {Object.entries(FACIES_COLORS).map(([key, color]) => (
                         key !== 'Null' && (
                            <div key={key} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-sm border border-white/10" style={{ backgroundColor: color }} />
                                <span className="text-xs text-slate-300">{key}</span>
                            </div>
                         )
                    ))}
                </div>
            </div>
        );
    }

    let gradient = '';
    let label = '';
    switch(property) {
        case 'sw': gradient = 'linear-gradient(to right, #f0f9ff, #0284c7)'; label = 'Water Saturation'; break;
        case 'so': gradient = 'linear-gradient(to right, #ecfccb, #166534)'; label = 'Oil Saturation'; break;
        case 'sg': gradient = 'linear-gradient(to right, #fff7ed, #ea580c)'; label = 'Gas Saturation'; break;
        case 'pressure': gradient = 'linear-gradient(to right, #eef2ff, #4338ca)'; label = 'Pressure (bar)'; break;
        default: return null;
    }

    return (
        <div className="bg-slate-900/80 p-3 rounded border border-slate-800 backdrop-blur-sm min-w-[180px]">
            <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase">{label}</div>
            <div className="h-3 w-full rounded-sm border border-white/10 mb-1" style={{ background: gradient }} />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>{min.toFixed(2)}</span>
                <span>{max.toFixed(2)}</span>
            </div>
        </div>
    );
};

export default SectionLegend;