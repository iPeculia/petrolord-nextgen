import React, { useRef, useEffect } from 'react';
import { useLogViewer } from '@/modules/geoscience/petrophysical-analysis/context/LogViewerContext';

const DepthTrack = ({ minDepth, maxDepth, height }) => {
  const canvasRef = useRef(null);
  const { zoom, scrollPosition } = useLogViewer();
  const width = 60;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);
    
    // Settings
    ctx.fillStyle = '#1e293b'; // bg-slate-800
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = '#94a3b8'; // text-slate-400
    ctx.font = '10px monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = '#334155'; // border-slate-700
    ctx.lineWidth = 1;

    // Determine interval based on zoom
    let interval = 10; // Default 10m
    if (zoom > 10) interval = 1;
    else if (zoom > 5) interval = 2;
    else if (zoom > 2) interval = 5;
    else if (zoom < 0.5) interval = 50;
    else if (zoom < 0.2) interval = 100;

    const startDepth = Math.floor(scrollPosition / interval) * interval;
    const endDepth = scrollPosition + (height / zoom);

    for (let d = startDepth; d <= endDepth; d += interval) {
        const y = (d - scrollPosition) * zoom;
        
        if (y >= -10 && y <= height + 10) {
            // Major tick
            ctx.beginPath();
            ctx.moveTo(width - 8, y);
            ctx.lineTo(width, y);
            ctx.stroke();
            
            // Label
            ctx.fillText(d.toString(), width - 12, y);
        }
        
        // Minor ticks
        const minorInterval = interval / 5;
        for(let md = d + minorInterval; md < d + interval; md += minorInterval) {
             const my = (md - scrollPosition) * zoom;
             if (my >= 0 && my <= height) {
                 ctx.beginPath();
                 ctx.moveTo(width - 4, my);
                 ctx.lineTo(width, my);
                 ctx.stroke();
             }
        }
    }
    
    // Draw Border
    ctx.beginPath();
    ctx.moveTo(width, 0);
    ctx.lineTo(width, height);
    ctx.stroke();

  }, [zoom, scrollPosition, height, minDepth, maxDepth]);

  return (
    <canvas ref={canvasRef} className="block" />
  );
};

export default DepthTrack;