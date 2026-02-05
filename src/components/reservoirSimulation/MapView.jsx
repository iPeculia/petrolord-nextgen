import React, { useEffect, useRef, memo } from 'react';
import { useReservoirSimulation } from '@/context/ReservoirSimulationContext.jsx';
import { getColorScale } from '@/utils/reservoirSimulation/colorScales.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';

const MapView = memo(() => {
  const canvasRef = useRef(null);
  const { state, dispatch } = useReservoirSimulation();
  const { selectedModel, simulationState } = state || {};
  const { currentTimeStep = 0, viewVariable = 'pressure' } = simulationState || {};

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    if (!selectedModel) return;
    
    const grid = selectedModel.grid || selectedModel.gridSize;
    if (!grid?.nx) return;

    const { nx, ny } = grid;
    const cellW = width / nx;
    const cellH = height / ny;

    if (!selectedModel.data?.[viewVariable]) return;

    const timeStepsData = selectedModel.data[viewVariable];
    const safeTimeIndex = Math.min(Math.max(0, currentTimeStep), timeStepsData.length - 1);
    const gridData = timeStepsData[safeTimeIndex];

    if (!gridData) return;

    const colorFn = getColorScale(viewVariable);

    for (let i = 0; i < nx; i++) {
        for (let j = 0; j < ny; j++) {
            if (gridData[i]?.[j] !== undefined) {
                ctx.fillStyle = colorFn(gridData[i][j]);
                ctx.fillRect(Math.floor(i * cellW), Math.floor(j * cellH), Math.ceil(cellW), Math.ceil(cellH));
            }
        }
    }

    if (selectedModel.wells) {
        selectedModel.wells.forEach(well => {
            const wx = well.x * cellW + cellW/2;
            const wy = well.y * cellH + cellH/2;
            
            ctx.beginPath();
            ctx.arc(wx, wy, Math.min(cellW, cellH) * 0.4, 0, 2 * Math.PI);
            ctx.fillStyle = well.color || '#ffffff';
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.fill();
            ctx.stroke();
            
            ctx.fillStyle = 'white';
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(well.id || '', wx, wy - 10);
        });
    }
  }, [selectedModel, currentTimeStep, viewVariable]);

  return (
    <div className="w-full h-full flex flex-col relative">
        <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur p-2 rounded-md border border-slate-800">
            <Select value={viewVariable} onValueChange={(val) => dispatch({ type: 'SET_VIEW_VARIABLE', payload: val })}>
                <SelectTrigger className="w-32 h-8 text-xs bg-slate-950 border-slate-700">
                    <SelectValue placeholder="Variable" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="pressure">Pressure</SelectItem>
                    <SelectItem value="sw">Water Sat.</SelectItem>
                    <SelectItem value="so">Oil Sat.</SelectItem>
                    <SelectItem value="sg">Gas Sat.</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="flex-1 flex items-center justify-center p-4 bg-slate-950/50">
            <canvas ref={canvasRef} width={600} height={600} className="max-w-full max-h-full aspect-square border-2 border-slate-800 rounded shadow-2xl bg-slate-900" style={{ imageRendering: 'pixelated' }} />
        </div>
    </div>
  );
});

export default MapView;