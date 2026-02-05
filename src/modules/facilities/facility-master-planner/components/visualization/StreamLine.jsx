import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const StreamLine = ({ start, end, stream }) => {
  const { fluid_type, design_flow_rate, design_flow_unit } = stream;
  
  // Midpoint calculation for label placement
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  
  // Color coding by fluid
  const getColor = (type) => {
      switch(type) {
          case 'Gas': return '#ef4444'; // Red
          case 'Oil': return '#10b981'; // Green
          case 'Water': return '#3b82f6'; // Blue
          case 'Condensate': return '#f59e0b'; // Amber
          default: return '#94a3b8'; // Slate
      }
  };

  const strokeColor = getColor(fluid_type);

  // Bezier curve for smoother lines
  const controlPoint1 = { x: midX, y: start.y };
  const controlPoint2 = { x: midX, y: end.y };
  const pathD = `M${start.x} ${start.y} C${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${end.x} ${end.y}`;

  return (
    <g>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <g className="cursor-pointer hover:opacity-80 group">
                        {/* Interaction Hit Area (Invisible but wider) */}
                        <path 
                            d={pathD}
                            fill="none" 
                            stroke="transparent" 
                            strokeWidth="10"
                        />

                        {/* Visible Stream Path */}
                        <path 
                            d={pathD}
                            fill="none" 
                            stroke={strokeColor} 
                            strokeWidth="2"
                            strokeDasharray={fluid_type === 'Gas' ? "5,5" : "0"}
                            className="group-hover:stroke-width-3 transition-all"
                            markerEnd={`url(#arrow-${fluid_type})`}
                        />
                        
                        {/* Define Arrow Marker dynamically */}
                        <defs>
                            <marker id={`arrow-${fluid_type}`} markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                                <path d="M0,0 L0,6 L9,3 z" fill={strokeColor} />
                            </marker>
                        </defs>

                        {/* Label Badge */}
                        <g transform={`translate(${midX - 20}, ${midY - 10})`}>
                            <rect width="40" height="16" rx="4" fill="#0f172a" stroke={strokeColor} strokeWidth="1" />
                            <text x="20" y="11" textAnchor="middle" fill={strokeColor} fontSize="9" fontWeight="bold">
                                {fluid_type}
                            </text>
                        </g>
                    </g>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 border-slate-700 text-white z-50">
                    <div className="font-bold">{stream.stream_name}</div>
                    <div className="text-xs">Flow: {design_flow_rate.toLocaleString()} {design_flow_unit}</div>
                    <div className="text-xs">Type: {fluid_type}</div>
                    <div className="text-xs text-slate-400 mt-1">Click for details</div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </g>
  );
};

export default StreamLine;