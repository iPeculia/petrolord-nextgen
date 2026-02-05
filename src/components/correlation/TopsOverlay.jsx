import React from 'react';
import { useCorrelationPanelStore } from '@/store/correlationPanelStore';
import { createDepthScale } from '@/lib/d3Utils';
import { getVisibleTops } from '@/lib/performanceOptimization';
import { useCorrelationLineDrawing } from '@/hooks/useCorrelationLineDrawing';
import { useTopEditing } from '@/hooks/useTopEditing';
import { useStratUnits } from '@/hooks/useWellLogCorrelation';
import { getStratUnitColor, getContrastColor } from '@/lib/colorUtils';

const TopsOverlay = ({ well, wellboreId, wellXOffset, height, width, panelId, projectData, tops }) => {
    const { depthMin, depthMax, zoomLevel, panY, selectedTopId, isDrawingLine, fromTopId } = useCorrelationPanelStore();
    // Pass projectData directly to the hook to avoid race conditions
    const { handleTopClick } = useCorrelationLineDrawing(projectData);
    const { deleteTop } = useTopEditing(wellboreId);
    
    const { data: stratUnits } = useStratUnits(projectData?.id);
    
    const allProjectTops = projectData?.wells.flatMap(w => w.wellbores.flatMap(wb => wb.well_tops)) || [];

    if (!tops || height <= 0) return null;
    
    const totalHeight = height * zoomLevel;
    const depthScale = createDepthScale(depthMin, depthMax, totalHeight);

    const visibleTops = getVisibleTops(depthScale.invert(-panY), depthScale.invert(height - panY), tops);

    const onTopClick = (e, top) => {
        e.stopPropagation();
        if (e.altKey) {
            deleteTop(top.id);
            return;
        }
        handleTopClick(top, panelId);
    };

    const getTopStyle = (top) => {
        const stratUnitColor = getStratUnitColor(top.strat_unit_id, stratUnits);
        const baseStyle = { stroke: stratUnitColor, strokeWidth: 2 };
        
        if (selectedTopId === top.id || fromTopId === top.id) {
            baseStyle.strokeWidth = 3;
            baseStyle.stroke = '#BFFF00';
        }

        if (isDrawingLine && fromTopId) {
            const fromTopData = allProjectTops.find(t => t.id === fromTopId);
            if (fromTopData && fromTopData.wellbore_id === top.wellbore_id) {
                baseStyle.stroke = '#EF4444'; // Red for tops in the same well
            } else {
                 baseStyle.stroke = '#34D399'; // Green for tops in other wells
            }
        }
        return baseStyle;
    };

    return (
        <svg 
            className="absolute top-0 left-0 pointer-events-auto"
            width={width} 
            height={height}
            style={{ transform: `translateX(${wellXOffset}px)` }}
        >
            <g transform={`translate(0, ${panY})`}>
                {visibleTops.map(top => {
                    const y = depthScale(top.depth_md);
                    const style = getTopStyle(top);
                    const labelColor = getStratUnitColor(top.strat_unit_id, stratUnits);
                    const textColor = getContrastColor(labelColor);

                    return (
                        <g 
                            key={top.id} 
                            className="cursor-pointer group" 
                            onClick={(e) => onTopClick(e, top)}
                            title={isDrawingLine ? 'Click to complete line' : `${top.top_name} (${top.depth_md}m)`}
                        >
                            <line
                                x1={0}
                                y1={y}
                                x2={width}
                                y2={y}
                                stroke={style.stroke}
                                strokeWidth={style.strokeWidth}
                                className="transition-all"
                            />
                            <rect 
                                x={5}
                                y={y - 18}
                                width={top.top_name.length * 7 + 10}
                                height={16}
                                fill={labelColor}
                                rx="2"
                                ry="2"
                                style={{ pointerEvents: 'none' }}
                            />
                            <text
                                x={10}
                                y={y - 6}
                                fill={textColor}
                                fontSize="11"
                                fontWeight="bold"
                                className="transition-all group-hover:font-extrabold"
                                style={{ pointerEvents: 'none' }}
                            >
                                {top.top_name}
                            </text>
                        </g>
                    );
                })}
            </g>
        </svg>
    );
};

export default TopsOverlay;