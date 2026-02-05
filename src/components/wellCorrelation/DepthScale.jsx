import React from 'react';
import { cn } from '@/lib/utils';

const DepthScale = ({ 
    startDepth, 
    endDepth, 
    pixelsPerUnit = 2, 
    majorTickInterval = 50, 
    minorTickInterval = 10,
    unit = 'M',
    width = 60
}) => {
    // Generate ticks
    const ticks = [];
    const totalHeight = (endDepth - startDepth) * pixelsPerUnit;
    
    // Round start to nearest interval for clean ticks
    const firstMajor = Math.ceil(startDepth / majorTickInterval) * majorTickInterval;
    
    for (let d = firstMajor; d <= endDepth; d += majorTickInterval) {
        ticks.push({ depth: d, type: 'major', top: (d - startDepth) * pixelsPerUnit });
    }

    const firstMinor = Math.ceil(startDepth / minorTickInterval) * minorTickInterval;
    for (let d = firstMinor; d <= endDepth; d += minorTickInterval) {
        if (d % majorTickInterval !== 0) {
            ticks.push({ depth: d, type: 'minor', top: (d - startDepth) * pixelsPerUnit });
        }
    }

    return (
        <div 
            className="flex flex-col bg-slate-100 border-r border-slate-300 relative select-none"
            style={{ width: width, height: totalHeight, minHeight: '100%' }}
        >
            {ticks.map((tick, i) => (
                <div 
                    key={`tick-${i}`} 
                    className={cn(
                        "absolute right-0 border-slate-400 flex items-center justify-end pr-1",
                        tick.type === 'major' ? "border-t-2 w-full" : "border-t w-2"
                    )}
                    style={{ top: tick.top }}
                >
                    {tick.type === 'major' && (
                        <span className="text-[10px] font-mono text-slate-700 -mt-2 bg-slate-100 px-0.5">
                            {tick.depth}
                        </span>
                    )}
                </div>
            ))}
            <div className="absolute top-0 w-full text-center border-b bg-slate-200 text-[10px] font-bold py-1">
                {unit}
            </div>
        </div>
    );
};

export default DepthScale;