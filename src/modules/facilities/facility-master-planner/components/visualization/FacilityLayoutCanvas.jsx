import React from 'react';
import { Building2, ArrowRight, Activity } from 'lucide-react';
import { useFacilityMasterPlanner } from '../../context/FacilityMasterPlannerContext';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const UnitBox = ({ unit, onClick, isSelected }) => {
  const getColor = (type) => {
    switch (type) {
      case 'Separation': return '#0066cc';
      case 'Compression': return '#00cc66';
      case 'Dehydration': return '#ffaa00';
      case 'Power Generation': return '#ff3333';
      case 'Pumping': return '#0066cc';
      case 'Heating': return '#ff6600';
      case 'Cooling': return '#00ccff';
      default: return '#64748b';
    }
  };

  const color = getColor(unit.unit_type);
  const utilization = (unit.current_capacity_bpd / unit.design_capacity_bpd) * 100;
  
  let statusColor = "text-green-500";
  if (utilization > 95) statusColor = "text-red-500";
  else if (utilization > 80) statusColor = "text-yellow-500";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={() => onClick(unit)}
      className={cn(
        "relative w-40 h-32 rounded-lg border-2 flex flex-col items-center justify-center p-2 cursor-pointer transition-all bg-[#1e293b]",
        isSelected ? "border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]" : "border-slate-700 hover:border-slate-500"
      )}
      style={{ borderColor: isSelected ? 'white' : color }}
    >
      <div className="absolute top-2 right-2">
        <Activity className={cn("w-4 h-4", statusColor)} />
      </div>
      <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">{unit.unit_type}</span>
      <h4 className="text-sm font-bold text-white text-center leading-tight">{unit.name}</h4>
      
      <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(utilization, 100)}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[10px] text-slate-500 mt-1">{Math.round(utilization)}% Utilized</span>
    </motion.div>
  );
};

const StreamLine = () => (
    <div className="flex-1 h-0.5 bg-slate-600 relative flex items-center justify-center mx-2">
        <ArrowRight className="w-4 h-4 text-slate-500 absolute" />
    </div>
);

const FacilityLayoutCanvas = () => {
  const { 
    currentFacility, 
    processUnits, 
    currentUnit, 
    setCurrentUnit,
    setCurrentEquipment 
  } = useFacilityMasterPlanner();

  if (!currentFacility) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500">
        <Building2 className="w-16 h-16 mb-4 opacity-20" />
        <p>Select a facility to view layout</p>
      </div>
    );
  }

  // Simple layout logic: group units by type or just list them for now
  // In a real app, this would use a graph layout engine like React Flow
  const facilityUnits = processUnits.filter(u => u.facility_id === currentFacility.facility_id);

  return (
    <div className="w-full h-full bg-[#0f172a] relative overflow-hidden flex flex-col">
       <div className="absolute top-4 left-4 z-10 bg-slate-900/80 p-2 rounded border border-slate-700 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-white">{currentFacility.name} Schematic</h3>
          <p className="text-xs text-slate-400">Interactive Process Flow Diagram</p>
       </div>

       <div className="flex-1 flex items-center justify-start overflow-x-auto p-20 gap-4 min-w-[1000px]">
          {facilityUnits.length > 0 ? (
            facilityUnits.map((unit, index) => (
               <React.Fragment key={unit.unit_id}>
                  <UnitBox 
                    unit={unit} 
                    isSelected={currentUnit?.unit_id === unit.unit_id}
                    onClick={(u) => {
                        setCurrentUnit(u);
                        setCurrentEquipment(null);
                    }}
                  />
                  {index < facilityUnits.length - 1 && <StreamLine />}
               </React.Fragment>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center w-full text-slate-500">
                <p>No process units defined for this facility.</p>
                <p className="text-xs mt-2">Use the sidebar to add units.</p>
            </div>
          )}
       </div>
    </div>
  );
};

export default FacilityLayoutCanvas;