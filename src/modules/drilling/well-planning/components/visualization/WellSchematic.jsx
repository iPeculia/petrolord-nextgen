import React, { useRef, useEffect, useState } from 'react';
import { useWellPlanningDesign } from '@/contexts/WellPlanningDesignContext';

const WellSchematic = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const { geometryState } = useWellPlanningDesign();
  const { trajectory, stats } = geometryState;
  const [scale, setScale] = useState(1);
  const [offsetY, setOffsetY] = useState(20);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || trajectory.length === 0) return;

    const ctx = canvas.getContext('2d');
    
    // Resize canvas
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    // Clear
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dynamic Scale Calculation: Fit height
    const maxDepth = stats.totalMD || 10000;
    const heightScale = (canvas.height - 100) / maxDepth;
    const centerX = canvas.width / 2;

    // Draw Grid / Depth Lines
    ctx.strokeStyle = '#252541';
    ctx.lineWidth = 1;
    ctx.font = '10px monospace';
    ctx.fillStyle = '#64748b';
    
    for (let d = 0; d <= maxDepth; d += 1000) {
      const y = offsetY + (d * heightScale);
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(canvas.width - 20, y);
      ctx.stroke();
      ctx.fillText(d.toString(), 5, y + 3);
    }

    // Draw Schematic (Simplified as cylinders)
    let prevY = offsetY;
    
    trajectory.forEach((point, i) => {
        if (i === 0) return;
        const prevPoint = trajectory[i-1];
        
        const sectionLength = point.md - prevPoint.md;
        const currentY = offsetY + (point.md * heightScale);
        
        // Width based on hole size (scaled arbitrarily for viz)
        const width = (point.holeSize * 3); 
        
        ctx.fillStyle = '#252541';
        if (point.sectionType === 'Build') ctx.fillStyle = '#2F3F5F';
        if (point.sectionType === 'Drop') ctx.fillStyle = '#3F2F2F';

        // Draw Wellbore Segment
        ctx.beginPath();
        ctx.rect(centerX - width/2, prevY, width, currentY - prevY);
        ctx.fill();
        ctx.strokeStyle = '#475569';
        ctx.stroke();

        // Casing/Hole Lines
        ctx.strokeStyle = '#e0e0e0';
        ctx.beginPath();
        ctx.moveTo(centerX - width/2, prevY);
        ctx.lineTo(centerX - width/2, currentY);
        ctx.moveTo(centerX + width/2, prevY);
        ctx.lineTo(centerX + width/2, currentY);
        ctx.stroke();

        // Labels
        ctx.fillStyle = '#FFC107';
        ctx.fillText(`${point.holeSize}"`, centerX + width/2 + 5, (prevY + currentY)/2);

        prevY = currentY;
    });

    // Draw Bottom Hole
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    const lastPoint = trajectory[trajectory.length - 1];
    const lastY = offsetY + (lastPoint.md * heightScale);
    ctx.arc(centerX, lastY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText('TD', centerX + 10, lastY + 3);

  }, [trajectory, stats, offsetY]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <canvas ref={canvasRef} className="block" />
      <div className="absolute top-2 right-2 bg-[#1a1a2e]/80 p-2 rounded text-[10px] text-slate-400">
         <div>Scroll to Zoom (Coming Soon)</div>
         <div>Drag to Pan (Coming Soon)</div>
      </div>
    </div>
  );
};

export default WellSchematic;