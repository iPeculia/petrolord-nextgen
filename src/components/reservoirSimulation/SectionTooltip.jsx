import React from 'react';

const SectionTooltip = ({ cell, visible, x, y }) => {
    if (!visible || !cell) return null;

    return (
        <div 
            className="fixed z-50 bg-slate-900 border border-slate-700 shadow-xl rounded p-3 pointer-events-none w-48 transition-opacity duration-150"
            style={{ left: x + 15, top: y + 15 }}
        >
            <div className="text-xs font-bold text-white mb-2 pb-1 border-b border-slate-800">
                Cell: [{cell.i}, {cell.j}, {cell.k}]
            </div>
            <div className="space-y-1.5">
                <div className="flex justify-between text-xs"><span className="text-slate-400">TVD (m):</span><span className="text-emerald-400 font-mono">{cell.tvd.toFixed(1)}</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-400">Pressure:</span><span className="text-indigo-400 font-mono">{cell.pressure?.toFixed(1)} bar</span></div>
                <div className="h-px bg-slate-800 my-1" />
                <div className="grid grid-cols-3 gap-1 text-[10px] text-center">
                    <div className="bg-blue-900/30 rounded p-1 border border-blue-900/50"><div className="text-blue-400 mb-0.5">Sw</div><div className="font-mono text-white">{(cell.sw * 100).toFixed(0)}%</div></div>
                    <div className="bg-green-900/30 rounded p-1 border border-green-900/50"><div className="text-green-400 mb-0.5">So</div><div className="font-mono text-white">{(cell.so * 100).toFixed(0)}%</div></div>
                    <div className="bg-orange-900/30 rounded p-1 border border-orange-900/50"><div className="text-orange-400 mb-0.5">Sg</div><div className="font-mono text-white">{(cell.sg * 100).toFixed(0)}%</div></div>
                </div>
            </div>
        </div>
    );
};

export default SectionTooltip;