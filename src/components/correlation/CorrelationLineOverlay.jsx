import React from 'react';
import { useCorrelationPanelStore } from '@/store/correlationPanelStore.js';
import { createDepthScale } from '@/lib/d3Utils.js';

const CorrelationLineOverlay = ({ allTops, lines, wellLayout, height }) => {
  const { depthMin, depthMax, zoomLevel, panY, isDrawingLine, fromTopId, cursorX, cursorY } = useCorrelationPanelStore();

  if (height <= 0) return null;

  const totalHeight = height * zoomLevel;
  const depthScale = createDepthScale(depthMin, depthMax, totalHeight);
  const topMap = new Map(allTops.map(t => [t.id, t]));

  const getWellboreX = (wellboreId) => {
    const layout = wellLayout.find(l => l.wellboreId === wellboreId);
    return layout ? layout.xOffset + layout.width / 2 : 0;
  };

  const renderStaticLines = () => {
    if (!lines) return null;
    return lines.map(line => {
      const fromTop = topMap.get(line.from_top_id);
      const toTop = topMap.get(line.to_top_id);

      if (!fromTop || !toTop) return null;

      const x1 = getWellboreX(fromTop.wellbore_id);
      const y1 = depthScale(fromTop.depth_md);
      const x2 = getWellboreX(toTop.wellbore_id);
      const y2 = depthScale(toTop.depth_md);

      return <line key={line.id} x1={x1} y1={y1} x2={x2} y2={y2} stroke={line.color || '#FFFFFF'} strokeWidth="2" />;
    });
  };

  const renderDrawingLine = () => {
    if (!isDrawingLine || !fromTopId || cursorX === null || cursorY === null) return null;

    const fromTop = topMap.get(fromTopId);
    if (!fromTop) return null;

    const x1 = getWellboreX(fromTop.wellbore_id);
    const y1 = depthScale(fromTop.depth_md);
    
    // Adjust cursorY by the panY to get the correct position within the SVG's transformed g-element
    const adjustedCursorY = cursorY - panY;

    return <line x1={x1} y1={y1} x2={cursorX} y2={adjustedCursorY} stroke="#BFFF00" strokeWidth="2" strokeDasharray="5,5" />;
  };

  return (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <g transform={`translate(0, ${panY})`}>
        {renderStaticLines()}
        {renderDrawingLine()}
      </g>
    </svg>
  );
};

export default CorrelationLineOverlay;