import React, { useMemo, useState, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut } from 'lucide-react';
import DepthScale from './DepthScale';
import LogTrack from './LogTrack';

const WellLogViewer = ({ well, settings, markers = [], horizons = [], interactive = false }) => {
    const [localZoom, setLocalZoom] = useState(settings?.verticalScale || 5);
    const containerRef = useRef(null);

    const pixelsPerUnit = interactive ? localZoom : (settings?.verticalScale || 5);
    
    // Zoom Handlers
    const handleZoomIn = () => setLocalZoom(prev => Math.min(prev * 1.5, 50));
    const handleZoomOut = () => setLocalZoom(prev => Math.max(prev / 1.5, 0.5));

    // Move useMemo before any conditional returns to satisfy React Hooks rules
    const processedData = useMemo(() => {
        // Safety check inside the hook
        if (!well || !Array.isArray(well.data) || !well.depthRange || typeof well.depthRange.start !== 'number') {
            return [];
        }

        const startDepth = well.depthRange.start;
        const depthKey = well.metadata?.depthColumn || 'DEPT';
        
        return well.data.map(row => {
            const depth = row[depthKey] || row['DEPT'] || row['DEPTH'] || 0;
            return {
                ...row,
                y: (depth - startDepth) * pixelsPerUnit,
                depth
            };
        });
    }, [well, pixelsPerUnit]);

    // Render safety check
    if (!well || !well.depthRange || typeof well.depthRange.start !== 'number' || typeof well.depthRange.stop !== 'number') {
        return (
            <div className="flex items-center justify-center h-full text-slate-400 text-xs bg-slate-50">
                Invalid Well Data Structure
            </div>
        );
    }

    const { depthRange } = well;
    // Ensure height is positive and safe
    const heightCalc = (depthRange.stop - depthRange.start) * pixelsPerUnit;
    const totalHeight = isNaN(heightCalc) || heightCalc < 0 ? 1000 : Math.max(100, heightCalc);

    // Default tracks config (Safe check for curves)
    const tracks = [
        { id: 'gamma', title: 'Gamma Ray', curve: 'GR', min: 0, max: 150, color: '#22c55e', fill: true, unit: 'API' },
        { id: 'res', title: 'Resistivity', curve: 'RES', min: 0.2, max: 2000, color: '#ef4444', scale: 'log', unit: 'OHMM' },
        { id: 'por', title: 'Porosity', curve: 'NPHI', min: 0.45, max: -0.15, color: '#3b82f6', unit: 'V/V' }
    ];

    return (
        <div className="flex flex-col h-full bg-white select-none relative group">
            {/* Context Toolbar */}
            {interactive && (
                <div className="absolute top-2 right-2 z-50 flex gap-1 bg-white/90 shadow-sm border border-slate-200 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleZoomOut}><ZoomOut className="w-3 h-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleZoomIn}><ZoomIn className="w-3 h-3" /></Button>
                </div>
            )}

            {/* Header Legend */}
            <div className="flex border-b border-slate-300 bg-slate-50 shrink-0 sticky top-0 z-40">
                <div className="w-[60px] border-r border-slate-300 p-1 flex items-end justify-center pb-1 text-[10px] font-bold text-slate-600 bg-slate-100">
                    Depth
                </div>
                {tracks.map((track, i) => (
                    <div key={i} className="flex-1 border-r border-slate-300 p-1 min-w-[80px] overflow-hidden bg-white">
                        <div className="text-[10px] font-bold text-center truncate" style={{color: track.color}}>
                            {track.title}
                        </div>
                        <div className="flex justify-between text-[8px] text-slate-500 font-mono mt-0.5 px-1">
                            <span>{track.min}</span>
                            <span>{track.unit}</span>
                            <span>{track.max}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Canvas Scroll Area */}
            <ScrollArea className="flex-1 bg-slate-50/50" ref={containerRef}>
                 <div className="flex relative" style={{ height: totalHeight }}>
                     
                     {/* Depth Scale */}
                     <DepthScale 
                        startDepth={depthRange.start} 
                        endDepth={depthRange.stop} 
                        pixelsPerUnit={pixelsPerUnit}
                        unit={depthRange.unit || 'M'}
                     />

                     {/* Marker Overlays */}
                     <div className="absolute inset-0 pointer-events-none z-30">
                         {(markers || []).map(marker => {
                             if (!marker || typeof marker.depth !== 'number') return null;
                             
                             const top = (marker.depth - depthRange.start) * pixelsPerUnit;
                             const horizon = (horizons || []).find(h => h.id === marker.horizonId);
                             const color = horizon?.color || marker.color || '#ef4444';
                             
                             return (
                                 <div 
                                     key={marker.id}
                                     className="absolute left-0 right-0 flex items-center group/marker pointer-events-auto cursor-pointer"
                                     style={{ top }}
                                 >
                                     <div className="w-full border-t-2 border-dashed opacity-70 group-hover/marker:opacity-100" style={{ borderColor: color }} />
                                     <div className="absolute right-2 bg-white/90 text-[10px] px-1.5 py-0.5 rounded border shadow-sm font-bold translate-y-[-50%]" style={{ color, borderColor: color }}>
                                         {marker.name}
                                     </div>
                                 </div>
                             );
                         })}
                     </div>

                     {/* Log Tracks */}
                     {tracks.map((track, i) => {
                        // Safe data access
                        const firstRow = processedData[0] || {};
                        const availableKeys = Object.keys(firstRow);
                        
                        // Improved matching
                        let curveKey = availableKeys.find(k => k === track.curve);
                        if (!curveKey) curveKey = availableKeys.find(k => k.toUpperCase().includes(track.curve));
                        
                        const trackData = curveKey ? processedData.map(d => ({
                            y: d.y,
                            value: d[curveKey]
                        })) : [];

                        return (
                             <div key={i} className="flex-1 border-r border-slate-200 relative min-w-[80px] bg-white z-10">
                                 {trackData.length > 0 ? (
                                    <LogTrack 
                                        width={200} // abstract internal width
                                        height={totalHeight}
                                        data={trackData}
                                        min={track.min}
                                        max={track.max}
                                        color={track.color}
                                        fill={track.fill}
                                        scaleType={track.scale}
                                    />
                                 ) : (
                                     <div className="h-full flex items-center justify-center text-[9px] text-slate-300 rotate-90 whitespace-nowrap">
                                         No Data ({track.curve})
                                     </div>
                                 )}
                             </div>
                        );
                     })}
                </div>
            </ScrollArea>
        </div>
    );
};

export default WellLogViewer;