import React from 'react';
import { Input } from '@/components/ui/input';

const CorrelationMatrix = ({ parameters, correlations, onChange }) => {
    // parameters: ['porosity', 'sw', 'thickness']
    // correlations: { 'porosity-sw': -0.5, ... }
    
    const getCorrelation = (p1, p2) => {
        if (p1 === p2) return 1;
        const key = [p1, p2].sort().join('-');
        return correlations[key] || 0;
    };

    const handleChange = (p1, p2, val) => {
        if (p1 === p2) return;
        const key = [p1, p2].sort().join('-');
        // Enforce -1 to 1
        let num = parseFloat(val);
        if (isNaN(num)) num = 0;
        num = Math.max(-1, Math.min(1, num));
        onChange(key, num);
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-300 border-collapse">
                <thead>
                    <tr>
                        <th className="p-2 border border-slate-800 bg-slate-900"></th>
                        {parameters.map(p => (
                            <th key={p} className="p-2 border border-slate-800 bg-slate-900 font-normal text-slate-400">{p}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {parameters.map(p1 => (
                        <tr key={p1}>
                            <td className="p-2 border border-slate-800 bg-slate-900 font-normal text-slate-400">{p1}</td>
                            {parameters.map(p2 => {
                                const val = getCorrelation(p1, p2);
                                const isDiagonal = p1 === p2;
                                return (
                                    <td key={`${p1}-${p2}`} className="p-1 border border-slate-800 text-center">
                                        {isDiagonal ? (
                                            <span className="text-slate-600">1.0</span>
                                        ) : (
                                            <Input 
                                                type="number" 
                                                step="0.1" 
                                                min="-1" 
                                                max="1"
                                                className={`h-6 w-16 text-center mx-auto border-0 bg-transparent ${val !== 0 ? 'text-[#BFFF00] font-bold' : 'text-slate-500'}`}
                                                value={val}
                                                onChange={(e) => handleChange(p1, p2, e.target.value)}
                                            />
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CorrelationMatrix;