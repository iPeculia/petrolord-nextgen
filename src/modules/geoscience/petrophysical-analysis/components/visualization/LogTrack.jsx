import React, { useRef, useEffect, useMemo } from 'react';
import { useLogViewer } from '@/modules/geoscience/petrophysical-analysis/context/LogViewerContext';

const LogTrack = ({ curves, markers, height, width = 200, depthArray }) => {
  const canvasRef = useRef(null);
  const { zoom, scrollPosition, visibleCurves, curveColors, selectedMarker, setSelectedMarker } = useLogViewer();

  // --- 1. Curve Rendering Logic ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !curves || !depthArray) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    // Set dimensions considering pixel ratio for crisp rendering
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);
    
    // Draw Grid - Vertical lines
    ctx.strokeStyle = '#1e293b'; // slate-800
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for(let i = 1; i < 4; i++) {
        const x = (width / 4) * i;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
    }
    ctx.stroke();

    // Draw Horizontal Grid Lines based on depth intervals (optional, simplified here)
    // Note: Real apps usually sync this with DepthTrack intervals.
    
    // Draw Curves
    curves.forEach((curve, index) => {
        if (visibleCurves[curve.log_name] === false) return;
        if (!curve.value_array) return;

        const color = curveColors[curve.log_name] || getDefaultColor(index);
        const values = curve.value_array;
        
        // Robust Min/Max calculation
        // Filters out nulls and ensures finite numbers
        const validValues = values.filter(v => v !== null && Number.isFinite(v));
        if (validValues.length === 0) return; // Skip if no data
        
        let minVal = Math.min(...validValues);
        let maxVal = Math.max(...validValues);
        
        // Avoid division by zero
        if (minVal === maxVal) {
             maxVal = minVal + 1; 
        }
        const range = maxVal - minVal;

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;

        let isDrawing = false;

        // Optimization: Iterate only through visible depth range
        // Find start index based on scrollPosition (depth)
        // Binary search would be faster for huge arrays, but linear scan is ok for <10k points if we break early
        // Or assuming sorted depth:
        
        // Simple bounds check
        const startDepth = scrollPosition - (100 / zoom); // buffer
        const endDepth = scrollPosition + (height / zoom) + (100 / zoom);

        for (let i = 0; i < depthArray.length; i++) {
            const depth = depthArray[i];
            
            // Skip if before visible area
            if (depth < startDepth) continue;
            // Stop if passed visible area
            if (depth > endDepth) break;

            const y = (depth - scrollPosition) * zoom;
            const val = values[i];

            if (val === null || !Number.isFinite(val)) {
                isDrawing = false; // Lift pen
                continue;
            }

            // Map value to X
            const x = ((val - minVal) / range) * width;

            if (!isDrawing) {
                ctx.moveTo(x, y);
                isDrawing = true;
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    });

  }, [zoom, scrollPosition, width, height, curves, visibleCurves, curveColors, depthArray]);


  // --- 2. Helper to get default colors ---
  const getDefaultColor = (idx) => {
      const colors = ['#ef4444', '#22c55e', '#3b82f6', '#eab308', '#a855f7', '#ec4899', '#f97316'];
      return colors[idx % colors.length];
  };

  // --- 3. Marker Overlay Logic ---
  const visibleMarkers = useMemo(() => {
      if (!markers) return [];
      return markers.filter(m => {
          const y = (m.depth - scrollPosition) * zoom;
          return y >= -20 && y <= height + 20;
      });
  }, [markers, scrollPosition, zoom, height]);

  return (
    <div className="relative border-r border-slate-800 bg-slate-950/30" style={{ width }}>
      <canvas ref={canvasRef} className="block absolute inset-0 z-0" />
      
      {/* Marker Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {visibleMarkers.map(marker => {
              const y = (marker.depth - scrollPosition) * zoom;
              const isSelected = selectedMarker === marker.id;

              return (
                  <div 
                    key={marker.id}
                    className="absolute w-full group pointer-events-auto"
                    style={{ top: y, height: '1px' }}
                    onClick={() => setSelectedMarker(isSelected ? null : marker.id)}
                  >
                      {/* Dashed Line */}
                      <div 
                        className={`h-px w-full border-b border-dashed transition-colors ${isSelected ? 'border-white' : 'border-opacity-50'}`}
                        style={{ borderColor: marker.color || '#fff' }}
                      />
                      
                      {/* Label */}
                      <div 
                        className={`absolute right-1 -top-3 text-[10px] px-1 rounded transition-all cursor-pointer
                            ${isSelected ? 'bg-slate-800 text-white opacity-100 z-20 ring-1 ring-slate-600' : 'text-transparent group-hover:text-slate-200 group-hover:bg-slate-900/80'}
                        `}
                      >
                          {marker.name}
                      </div>
                  </div>
              );
          })}
      </div>

      {/* Track Header Info (Overlay) */}
      <div className="absolute top-0 left-0 right-0 p-1 bg-gradient-to-b from-slate-900/90 to-transparent z-20 pointer-events-none">
          <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center px-1">
            {curves.map((c, i) => {
                if (visibleCurves[c.log_name] === false) return null;
                
                // Calculate dynamic min/max for display
                const validVals = c.value_array?.filter(v => v !== null && Number.isFinite(v)) || [];
                const min = validVals.length ? Math.min(...validVals) : 0;
                const max = validVals.length ? Math.max(...validVals) : 0;
                
                return (
                    <div key={i} className="flex flex-col items-center" style={{ color: curveColors[c.log_name] || getDefaultColor(i) }}>
                        <span className="text-[9px] font-bold leading-none">{c.log_name}</span>
                        <div className="flex gap-1 text-[7px] opacity-80 leading-none mt-0.5 font-mono">
                            <span>{min.toFixed(0)}</span>
                            <span>-</span>
                            <span>{max.toFixed(0)}</span>
                        </div>
                    </div>
                );
            })}
          </div>
      </div>
    </div>
  );
};

export default LogTrack;