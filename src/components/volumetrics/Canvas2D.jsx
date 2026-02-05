import React, { useRef, useEffect } from 'react';
import { useVisualization } from '@/contexts/VisualizationContext';
import { useVolumetrics } from '@/hooks/useVolumetrics';

const Canvas2D = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const { state: visState } = useVisualization();
    const { state: volState } = useVolumetrics();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const container = containerRef.current;
        
        // Resize canvas
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;

        // Clear
        ctx.fillStyle = '#020617'; // Slate-950
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const surfaces = volState.data.surfaces || [];
        if (surfaces.length === 0) {
            ctx.fillStyle = '#475569';
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('No surfaces loaded. Import data to visualize.', canvas.width / 2, canvas.height / 2);
            return;
        }

        // Simple 2D Top-down projection logic
        // Calculate bounds
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        surfaces.forEach(s => {
            minX = Math.min(minX, s.bounds.minX);
            maxX = Math.max(maxX, s.bounds.maxX);
            minY = Math.min(minY, s.bounds.minY);
            maxY = Math.max(maxY, s.bounds.maxY);
        });

        const padding = 50;
        const rangeX = maxX - minX;
        const rangeY = maxY - minY;
        const scaleX = (canvas.width - padding * 2) / rangeX;
        const scaleY = (canvas.height - padding * 2) / rangeY;
        const scale = Math.min(scaleX, scaleY);

        // Transform function
        const toScreen = (x, y) => ({
            x: padding + (x - minX) * scale,
            y: canvas.height - padding - (y - minY) * scale // Invert Y for canvas coords
        });

        // Draw Points
        if (visState.settings.showSurfaces) {
            surfaces.forEach((surf, idx) => {
                ctx.fillStyle = idx === 0 ? '#ef4444' : '#3b82f6';
                surf.points.forEach(p => {
                    const screen = toScreen(p.x, p.y);
                    ctx.fillRect(screen.x, screen.y, 2, 2);
                });
            });
        }

        // Draw Wells (Placeholder)
        if (visState.settings.showWells) {
            // ... well drawing logic
        }

    }, [visState, volState, canvasRef.current?.width, canvasRef.current?.height]);

    return (
        <div ref={containerRef} className="w-full h-full overflow-hidden">
            <canvas ref={canvasRef} className="block" />
        </div>
    );
};

export default Canvas2D;