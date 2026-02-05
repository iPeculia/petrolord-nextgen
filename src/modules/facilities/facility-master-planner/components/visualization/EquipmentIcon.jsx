import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const EquipmentIcon = ({ equipment, x, y, onClick, isSelected }) => {
  const size = 40;
  
  // Choose icon shape based on type
  const renderShape = () => {
    switch (equipment.equipment_type) {
        case 'Pump':
            return (
                <g>
                    <circle cx={size/2} cy={size/2} r={size/2 - 2} fill="#1e293b" stroke={isSelected ? "#3b82f6" : "#94a3b8"} strokeWidth="2" />
                    <path d={`M${size/2 - 8} ${size/2 + 8} L${size/2 + 8} ${size/2 - 8} L${size/2 + 8} ${size/2 + 8} Z`} fill="#cbd5e1" />
                </g>
            );
        case 'Vessel':
        case 'Separator':
            return (
                <g>
                    <rect x="5" y="2" width={size-10} height={size-4} rx="6" fill="#1e293b" stroke={isSelected ? "#3b82f6" : "#94a3b8"} strokeWidth="2" />
                    <line x1="5" y1={size/3} x2={size-5} y2={size/3} stroke="#475569" />
                    <line x1="5" y1={size*2/3} x2={size-5} y2={size*2/3} stroke="#475569" />
                </g>
            );
        case 'Compressor':
             return (
                <g>
                    <path d={`M5 10 L${size-5} 2 L${size-5} ${size-2} L5 ${size-10} Z`} fill="#1e293b" stroke={isSelected ? "#3b82f6" : "#94a3b8"} strokeWidth="2" />
                </g>
             );
        default:
            return (
                <rect x="2" y="2" width={size-4} height={size-4} fill="#1e293b" stroke={isSelected ? "#3b82f6" : "#94a3b8"} strokeWidth="2" />
            );
    }
  };

  const statusColor = equipment.status === 'Critical' ? '#ef4444' : equipment.status === 'Warning' ? '#f59e0b' : '#10b981';

  return (
    <g transform={`translate(${x}, ${y})`} onClick={(e) => { e.stopPropagation(); onClick(equipment); }} className="cursor-pointer hover:opacity-80">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <g>
                        {renderShape()}
                        {/* Status Indicator */}
                        <circle cx={size - 4} cy={4} r="4" fill={statusColor} stroke="#0f172a" strokeWidth="1" />
                        
                        {/* Tag Label */}
                        <text x={size/2} y={size + 12} textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">
                            {equipment.tag_no}
                        </text>
                    </g>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 border-slate-700 text-white z-50">
                    <div className="font-bold">{equipment.name}</div>
                    <div className="text-xs">Tag: {equipment.tag_no}</div>
                    <div className="text-xs">Capacity: {equipment.capacity} {equipment.unit}</div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </g>
  );
};

export default EquipmentIcon;