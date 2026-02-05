import React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const UnitBox = ({ unit, x, y, width = 180, height = 120, onClick, isSelected }) => {
  const utilization = (unit.current_capacity_bpd / unit.design_capacity_bpd) * 100;
  
  let statusColor = "#10b981"; // Green
  let strokeColor = "#059669";
  let statusClass = "text-emerald-500";

  if (utilization > 95) {
      statusColor = "#ef4444"; // Red
      strokeColor = "#b91c1c";
      statusClass = "text-red-500";
  } else if (utilization > 85) {
      statusColor = "#f59e0b"; // Yellow
      strokeColor = "#d97706";
      statusClass = "text-amber-500";
  }

  const isBottleneck = utilization > 95;

  return (
    <g transform={`translate(${x}, ${y})`} onClick={(e) => { e.stopPropagation(); onClick(unit); }} className="cursor-pointer transition-all duration-200">
       <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <g className="group">
                    {/* Shadow/Glow for selected state */}
                    {isSelected && (
                        <rect 
                            x="-2" y="-2" 
                            width={width + 4} 
                            height={height + 4} 
                            rx="10" 
                            fill="none" 
                            stroke="#3b82f6" 
                            strokeWidth="2" 
                            className="animate-pulse"
                        />
                    )}

                    {/* Main Box Body */}
                    <rect 
                        width={width} 
                        height={height} 
                        rx="8" 
                        fill="#1e293b" 
                        stroke={isSelected ? "#3b82f6" : "#334155"} 
                        strokeWidth={isSelected ? 2 : 1}
                        className="group-hover:stroke-blue-400 transition-colors"
                    />
                    
                    {/* Header Background */}
                    <path 
                        d={`M0 8 C0 3.5 3.5 0 8 0 L${width-8} 0 C${width-3.5} 0 ${width} 3.5 ${width} 8 L${width} 36 L0 36 Z`} 
                        fill={isBottleneck ? "#450a0a" : "#0f172a"}
                        className="transition-colors"
                    />
                    
                    {/* Title */}
                    <text x={10} y={24} fill="#e2e8f0" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                        {unit.name.length > 20 ? unit.name.substring(0,18) + '...' : unit.name}
                    </text>
                    
                    {/* Alert Icon if bottleneck */}
                    {isBottleneck && (
                        <g transform={`translate(${width - 24}, 8)`}>
                             <circle cx="8" cy="8" r="8" fill="#ef4444" />
                             <text x="8" y="12" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">!</text>
                        </g>
                    )}

                    {/* Content */}
                    <text x={10} y={55} fill="#cbd5e1" fontSize="11" fontFamily="sans-serif">
                        {unit.unit_type}
                    </text>
                     <text x={10} y={70} fill="#64748b" fontSize="10" fontFamily="sans-serif">
                        Cap: {(unit.design_capacity_bpd/1000).toFixed(0)}k bpd
                    </text>

                    {/* Utilization Bar */}
                    <g transform={`translate(10, ${height - 20})`}>
                        <rect width={width - 20} height="6" rx="3" fill="#334155" />
                        <rect width={(width - 20) * (Math.min(utilization, 100) / 100)} height="6" rx="3" fill={statusColor} />
                    </g>
                    
                    {/* Stats Label */}
                    <text x={10} y={height - 30} fill="#94a3b8" fontSize="10" fontFamily="sans-serif">
                        Utilization: <tspan fill={statusColor} fontWeight="bold">{utilization.toFixed(1)}%</tspan>
                    </text>
                </g>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-900 border-slate-700 text-white p-3 shadow-xl z-50">
                <div className="font-bold mb-1">{unit.name}</div>
                <div className="text-xs text-slate-300">Type: {unit.unit_type}</div>
                <div className="text-xs text-slate-300">Current Rate: {unit.current_capacity_bpd.toLocaleString()} bpd</div>
                <div className="text-xs text-slate-300">Design Capacity: {unit.design_capacity_bpd.toLocaleString()} bpd</div>
                <div className={cn("text-xs mt-1 font-semibold", statusClass)}>
                    {isBottleneck ? "Critical Bottleneck" : "Operating Normally"}
                </div>
            </TooltipContent>
        </Tooltip>
       </TooltipProvider>
    </g>
  );
};

export default UnitBox;