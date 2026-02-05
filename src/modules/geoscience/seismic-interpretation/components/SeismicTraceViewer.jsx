import React, { useEffect, useState } from 'react';
import { useSeismicStore } from '@/modules/geoscience/seismic-interpretation/store/seismicStore';

const SeismicTraceViewer = ({ activeHorizon, canvasRef, backgroundCanvasRef }) => {
  const { seismicData, horizons, viewSettings, addPick, selectTrace } = useSeismicStore();
  const [isPanning, setIsPanning] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  const getTraceIndexFromX = (x) => {
    if (!seismicData) return -1;
    const canvas = canvasRef.current;
    const { zoom, pan } = viewSettings;
    const traceWidth = canvas.width / seismicData.traceCount * zoom;
    return Math.floor((x - pan.x) / traceWidth);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const bgCanvas = backgroundCanvasRef.current;
    if (!canvas || !bgCanvas || !seismicData) return;

    const ctx = canvas.getContext('2d');
    const bgCtx = bgCanvas.getContext('2d');
    const { width, height } = canvas;

    ctx.clearRect(0, 0, width, height);
    bgCtx.clearRect(0, 0, width, height);

    const { traces, time, traceCount, sampleCount } = seismicData;
    const { zoom, pan, gain, wiggleColor, positiveFill, negativeFill } = viewSettings;

    const traceWidth = width / traceCount * zoom;
    const timeToY = (t) => (t / time[time.length - 1]) * height * zoom;

    bgCtx.fillStyle = '#111827';
    bgCtx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(pan.x, pan.y);

    // Draw traces
    for (let i = 0; i < traceCount; i++) {
      const trace = traces[i];
      if (!trace) continue; // Skip if trace data is missing
      const x_offset = i * traceWidth + traceWidth / 2;

      ctx.beginPath();
      ctx.moveTo(x_offset + trace[0] * traceWidth / 2 * gain, timeToY(time[0]));

      for (let j = 1; j < sampleCount; j++) {
        const x = x_offset + trace[j] * traceWidth / 2 * gain;
        const y = timeToY(time[j]);
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = wiggleColor;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Fill
      const pathPositive = new Path2D();
      const pathNegative = new Path2D();
      pathPositive.moveTo(x_offset, timeToY(time[0]));
      pathNegative.moveTo(x_offset, timeToY(time[0]));

      for (let j = 0; j < sampleCount; j++) {
        const amp = trace[j] * traceWidth / 2 * gain;
        const y = timeToY(time[j]);
        if (amp > 0) {
          pathPositive.lineTo(x_offset + amp, y);
        } else {
          pathNegative.lineTo(x_offset + amp, y);
        }
      }
      pathPositive.lineTo(x_offset, timeToY(time[sampleCount - 1]));
      pathNegative.lineTo(x_offset, timeToY(time[sampleCount - 1]));

      ctx.fillStyle = positiveFill;
      ctx.fill(pathPositive);
      ctx.fillStyle = negativeFill;
      ctx.fill(pathNegative);
    }

    // Draw horizons
    horizons.forEach(horizon => {
        if (horizon.picks.length > 1) {
            ctx.beginPath();
            const firstPick = horizon.picks[0];
            ctx.moveTo(firstPick.trace * traceWidth + traceWidth / 2, timeToY(firstPick.time));
            horizon.picks.forEach(pick => {
                ctx.lineTo(pick.trace * traceWidth + traceWidth / 2, timeToY(pick.time));
            });
            ctx.strokeStyle = horizon.color;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        horizon.picks.forEach(pick => {
            ctx.fillStyle = horizon.color;
            ctx.fillRect(pick.trace * traceWidth + traceWidth / 2 - 3, timeToY(pick.time) - 3, 6, 6);
        });
    });

    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const bgCanvas = backgroundCanvasRef.current;
    const parent = canvas.parentElement;
    
    if(!parent) return;

    const resizeObserver = new ResizeObserver(() => {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      bgCanvas.width = parent.clientWidth;
      bgCanvas.height = parent.clientHeight;
      draw();
    });

    resizeObserver.observe(parent);
    
    return () => resizeObserver.unobserve(parent);
  }, []); // Run only once

  useEffect(() => {
    draw();
  }, [seismicData, horizons, viewSettings, activeHorizon]);

  const handleMouseDown = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    if (e.button === 1) { // Middle mouse button for panning
      setIsPanning(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
      e.target.style.cursor = 'grabbing';
    } else if (e.button === 0) { // Left click
        const traceIndex = getTraceIndexFromX(x);
        selectTrace(traceIndex);
        
        if (activeHorizon) {
            const y = e.clientY - rect.top;
            const { zoom, pan } = viewSettings;
            const timeValue = (y - pan.y) / (e.target.height * zoom) * seismicData.time[seismicData.time.length - 1];

            if (traceIndex >= 0 && traceIndex < seismicData.traceCount) {
                addPick(activeHorizon, traceIndex, timeValue);
            }
        }
    }
  };

  const handleMouseUp = (e) => {
    if (e.button === 1) {
      setIsPanning(false);
      e.target.style.cursor = 'crosshair';
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      const dx = e.clientX - lastMousePos.x;
      const dy = e.clientY - lastMousePos.y;
      useSeismicStore.setState(state => ({
        viewSettings: { ...state.viewSettings, pan: { x: state.viewSettings.pan.x + dx, y: state.viewSettings.pan.y + dy } }
      }));
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const { zoom } = useSeismicStore.getState().viewSettings;
    const newZoom = zoom * (1 - e.deltaY * 0.001);
    useSeismicStore.setState(state => ({
      viewSettings: { ...state.viewSettings, zoom: Math.max(0.1, Math.min(newZoom, 20)) }
    }));
  };

  return (
    <div className="seismic-viewer-wrapper w-full h-full">
      <canvas ref={backgroundCanvasRef} className="seismic-canvas" />
      <canvas
        ref={canvasRef}
        className="seismic-canvas"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
      />
      {!seismicData && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground pointer-events-none">
          <p>Upload a SEG-Y, CSV, or LAS file to begin.</p>
        </div>
      )}
    </div>
  );
};

export default SeismicTraceViewer;