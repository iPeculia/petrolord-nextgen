import { useEffect } from 'react';
import { useCorrelationPanelStore } from '@/store/correlationPanelStore';
import { createDepthScale } from '@/lib/d3Utils';

export function useDepthCursor(containerRef) {
  const { depthMin, depthMax, zoomLevel, panY, setCursorPosition } = useCorrelationPanelStore();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      const y = event.clientY - rect.top;
      const x = event.clientX - rect.left;
      
      const totalHeight = rect.height * zoomLevel;
      
      const depthScale = createDepthScale(depthMin, depthMax, totalHeight);
      
      const yWithPan = y - panY;

      // Only calculate if cursor is within the visible area
      if (yWithPan >= 0 && yWithPan <= totalHeight) {
          const depth = depthScale.invert(yWithPan);
          // FIX: Corrected argument order to match store definition (x, y, depth)
          setCursorPosition(x, y, depth);
      } else {
          setCursorPosition(x, y, null);
      }
    };
    
    const handleMouseLeave = () => {
        setCursorPosition(null, null, null);
    }

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [containerRef, depthMin, depthMax, zoomLevel, panY, setCursorPosition]);
}