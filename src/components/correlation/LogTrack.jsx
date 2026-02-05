import React, { useEffect, useRef } from 'react';
import { useLogCurveSamples } from '@/hooks/useWellLogCorrelation.js';
import { createDepthScale, createValueScale } from '@/lib/d3Utils.js';
import { clearCanvas, drawGridLines, drawLogCurve, drawCurveLabel } from '@/lib/canvasUtils.js';
import { getVisibleSampleRange } from '@/lib/performanceOptimization.js';
import { useCorrelationPanelStore } from '@/store/correlationPanelStore.js';
import { Loader2 } from 'lucide-react';
import { useGlobalDataStore } from '@/store/globalDataStore.js';

const LogTrack = ({ curve, height, wellId }) => {
  const canvasRef = useRef(null);
  const width = 120;
  
  const curveName = curve.name;

  const { samples, isLoading } = useLogCurveSamples(wellId, curveName);
  const { depthMin, depthMax, zoomLevel, panY } = useCorrelationPanelStore();
  const { wellLogs, loadLogsForWell } = useGlobalDataStore();

  useEffect(() => {
    if (wellId && !wellLogs[wellId]) {
        loadLogsForWell(wellId);
    }
  },[wellId, wellLogs, loadLogsForWell]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !samples || height <= 0) return;

    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    const totalHeight = height * zoomLevel;
    const depthScale = createDepthScale(depthMin, depthMax, totalHeight);

    const validSamples = samples.depth_array?.map((depth, i) => ({ depth, value: samples.value_array[i] }))
      .filter(s => s.value !== null && s.value !== undefined) || [];

    const values = validSamples.map(s => s.value);
    const minValue = curve.min_value ?? (values.length > 0 ? Math.min(...values) : 0);
    const maxValue = curve.max_value ?? (values.length > 0 ? Math.max(...values) : 1);
    const valueScale = createValueScale(minValue, maxValue, width, curve.scale_mode || 'linear');

    clearCanvas(ctx, width, height, 'white');
    
    ctx.save();
    ctx.translate(0, panY); // Apply vertical pan
    
    drawGridLines(ctx, depthScale, width, '#E2E8F0'); // slate-200 for grid lines
    
    const visibleSamples = getVisibleSampleRange(depthScale.invert(-panY), depthScale.invert(height - panY), validSamples);
    drawLogCurve(ctx, visibleSamples, depthScale, valueScale, curve.color || '#000000');
    
    ctx.restore();
    
    drawCurveLabel(ctx, curve.name.toUpperCase(), samples.unit || '', width, '#334155'); // slate-700 text

  }, [samples, height, depthMin, depthMax, zoomLevel, panY, curve]);

  if (isLoading) {
    return <div className="w-[120px] h-full flex items-center justify-center bg-white border-x border-slate-300"><Loader2 className="animate-spin text-slate-500" /></div>;
  }
  
  if (!samples || !samples.depth_array || samples.depth_array.length === 0) {
      return (
        <div className="w-[120px] h-full flex items-center justify-center bg-white border-x border-slate-300 text-center text-xs text-slate-500 p-2">
          No data for curve: {curveName}
        </div>
      );
  }

  return <canvas ref={canvasRef} width={width} height={height} className="border-x border-slate-300" />;
};

export default LogTrack;