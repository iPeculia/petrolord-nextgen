import React, { useRef, useEffect } from 'react';
import { useWellPlanningDesign } from '@/contexts/WellPlanningDesignContext';

const WellProfile = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const { geometryState } = useWellPlanningDesign();
  const { trajectory, stats } = geometryState;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || trajectory.length === 0) return;

    const ctx = canvas.getContext('2d');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Scaling
    const maxTVD = stats.totalTVD || 10000;
    const maxDisp = Math.max(stats.displacement || 1000, 1000);
    
    const margin = 50;
    const plotWidth = canvas.width - (margin * 2);
    const plotHeight = canvas.height - (margin * 2);

    const scaleY = plotHeight / maxTVD;
    const scaleX = plotWidth / (maxDisp * 1.5); // *1.5 to leave room on right

    // Origin (Top Left)
    const originX = margin;
    const originY = margin;

    // Draw Axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    
    // Vertical Axis (TVD)
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(originX, originY + plotHeight);
    ctx.stroke();
    
    // Horizontal Axis (Displacement)
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(originX + plotWidth, originY);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.fillText('TVD (ft)', originX - 30, originY + plotHeight / 2);
    ctx.fillText('Displacement (ft)', originX + plotWidth / 2, originY - 20);

    // Plot Trajectory Line
    ctx.strokeStyle = '#FFC107';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(originX, originY); // 0,0

    trajectory.forEach(point => {
        // Simple VS (Vertical Section) calculation assuming displacement approx
        // ideally VS = north * cos(azi) + east * sin(azi) relative to target azi
        // Here we use simplified displacement for Phase 2 2D view
        const disp = Math.sqrt(point.north**2 + point.east**2);
        
        const x = originX + (disp * scaleX);
        const y = originY + (point.tvd * scaleY);
        ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw Points
    trajectory.forEach(point => {
        const disp = Math.sqrt(point.north**2 + point.east**2);
        const x = originX + (disp * scaleX);
        const y = originY + (point.tvd * scaleY);
        
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    });

  }, [trajectory, stats]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
       <canvas ref={canvasRef} className="block" />
       <div className="absolute top-2 right-2 bg-[#1a1a2e]/80 p-2 rounded text-[10px] text-slate-400 border border-[#252541]">
          2D Profile View (TVD vs VS)
       </div>
    </div>
  );
};

export default WellProfile;