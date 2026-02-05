import React, { useEffect, useRef } from 'react';
import { useCorrelationPanelStore } from '@/store/correlationPanelStore';
import { createDepthScale } from '@/lib/d3Utils';
import { clearCanvas, drawDepthLabels } from '@/lib/canvasUtils';

const DepthAxis = ({ height }) => {
    const canvasRef = useRef(null);
    const { depthMin, depthMax, zoomLevel, panY } = useCorrelationPanelStore();
    const width = 60;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || height <= 0) return;

        const ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;

        const totalHeight = height * zoomLevel;
        const depthScale = createDepthScale(depthMin, depthMax, totalHeight);
        
        clearCanvas(ctx, width, height, '#F8FAFC');

        ctx.fillStyle = '#F8FAFC'; // slate-50
        ctx.fillRect(0, 0, width, height);
        
        ctx.save();
        ctx.translate(0, panY); // Apply pan
        drawDepthLabels(ctx, depthScale, '#1E293B'); // slate-800 text
        ctx.restore();

    }, [depthMin, depthMax, height, zoomLevel, panY]);


    return <canvas ref={canvasRef} width={width} height={height} />;
};

export default DepthAxis;