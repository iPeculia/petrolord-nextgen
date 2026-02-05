import { useEffect } from 'react';
import { useCorrelationPanelStore } from '@/store/correlationPanelStore';

export function useCorrelationInteraction(containerRef) {
  const { zoomLevel, setZoomLevel, panY, setPan, resetView, isDrawingLine, startDrawingLine, cancelDrawingLine } = useCorrelationPanelStore();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (event) => {
      event.preventDefault();
      const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.min(Math.max(zoomLevel * zoomFactor, 0.5), 5.0);
      setZoomLevel(newZoom);
    };

    let isPannning = false;
    let lastY = 0;

    const handleMouseDown = (event) => {
        // Prevent panning while drawing
        if (isDrawingLine) return;
        isPannning = true;
        lastY = event.clientY;
    };
    
    const handleMouseMove = (event) => {
        if (!isPannning) return;
        const deltaY = event.clientY - lastY;
        lastY = event.clientY;
        setPan(0, panY + deltaY);
    };

    const handleMouseUp = () => {
        isPannning = false;
    };
    
    const handleKeyDown = (event) => {
        if (event.key === '+' || event.key === '=') {
            setZoomLevel(Math.min(zoomLevel * 1.2, 5.0));
        } else if (event.key === '-') {
            setZoomLevel(Math.max(zoomLevel / 1.2, 0.5));
        } else if (event.key.toLowerCase() === 'r') {
            resetView();
        } else if (event.key.toLowerCase() === 'l') {
            if(isDrawingLine) {
                cancelDrawingLine();
            } else {
                startDrawingLine(null);
            }
        } else if (event.key === 'Escape') {
            if(isDrawingLine) {
                cancelDrawingLine();
            }
        }
    }

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [containerRef, zoomLevel, panY, setZoomLevel, setPan, resetView, isDrawingLine, startDrawingLine, cancelDrawingLine]);
}