import React from 'react';
import { SECTION_TYPES } from '@/utils/sectionViewUtils';

const SectionMiniMap = ({ gridDims, currentType, currentIndex, onSectionChange, wells }) => {
    const { nx, ny } = gridDims;
    const width = 160;
    const height = 160 * (ny / nx);
    
    // Calculate aspect ratio correct scaling
    const cellW = width / nx;
    const cellH = height / ny;

    const handleMapClick = (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Convert pixel to grid index
        const clickedI = Math.floor(x / cellW);
        const clickedJ = Math.floor(y / cellH);

        // Update active section based on current mode
        if (currentType === SECTION_TYPES.INLINE) {
            onSectionChange(Math.min(Math.max(0, clickedI), nx - 1));
        } else {
            onSectionChange(Math.min(Math.max(0, clickedJ), ny - 1));
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-700 rounded p-2 shadow-lg w-max">
            <div className="text-[10px] text-slate-400 mb-1 font-mono uppercase tracking-wider flex justify-between">
                <span>Top View</span>
                <span>{currentType === 'i' ? `IL: ${currentIndex}` : `XL: ${currentIndex}`}</span>
            </div>
            <div 
                className="relative cursor-crosshair border border-slate-800 bg-slate-950"
                style={{ width: `${width}px`, height: `${height}px` }}
                onClick={handleMapClick}
            >
                {/* Simplified Grid Outline */}
                <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none">
                     {/* Wells */}
                     {wells && wells.map(w => (
                         <circle 
                            key={w.id}
                            cx={w.i * cellW + cellW/2}
                            cy={w.j * cellH + cellH/2}
                            r={3}
                            fill={w.type === 'Injector' ? '#3b82f6' : '#ef4444'}
                            stroke="white"
                            strokeWidth={1}
                         />
                     ))}

                     {/* Active Section Line */}
                     {currentType === SECTION_TYPES.INLINE ? (
                         <line 
                            x1={currentIndex * cellW + cellW/2} y1={0}
                            x2={currentIndex * cellW + cellW/2} y2={height}
                            stroke="#f59e0b"
                            strokeWidth={2}
                            strokeDasharray="4 2"
                         />
                     ) : (
                        <line 
                            x1={0} y1={currentIndex * cellH + cellH/2}
                            x2={width} y2={currentIndex * cellH + cellH/2}
                            stroke="#f59e0b"
                            strokeWidth={2}
                            strokeDasharray="4 2"
                         />
                     )}
                </svg>
            </div>
            <div className="mt-1 flex gap-2 justify-center">
                 <div className="flex items-center text-[10px] text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span> Prod
                 </div>
                 <div className="flex items-center text-[10px] text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span> Inj
                 </div>
                 <div className="flex items-center text-[10px] text-slate-500">
                    <span className="w-2 h-0.5 bg-amber-500 mr-1"></span> Section
                 </div>
            </div>
        </div>
    );
};

export default SectionMiniMap;