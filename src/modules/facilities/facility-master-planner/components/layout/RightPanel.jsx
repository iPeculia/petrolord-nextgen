import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFacilityMasterPlanner } from '../../context/FacilityMasterPlannerContext';
import FacilityPropertiesPanel from '../panels/FacilityPropertiesPanel';
import UnitPropertiesPanel from '../panels/UnitPropertiesPanel';
import EquipmentPropertiesPanel from '../panels/EquipmentPropertiesPanel';
import QuickStatsPanel from '../panels/QuickStatsPanel';

const RightPanel = () => {
  const { 
    currentFacility, 
    currentUnit, 
    currentEquipment,
    isRightPanelOpen
  } = useFacilityMasterPlanner();

  if (!isRightPanelOpen) return null;

  return (
    <aside className="w-[300px] bg-[#1a1a1a] border-l border-[#333333] flex flex-col h-[calc(100vh-60px)] fixed top-[60px] right-0 z-40">
       <div className="p-4 border-b border-[#333333] flex items-center justify-between">
         <h3 className="text-sm font-semibold text-white">Properties</h3>
       </div>
       
       <ScrollArea className="flex-1 p-4">
         <div className="space-y-4">
            {/* Context-Sensitive Property Panels */}
            
            {/* Show Equipment Properties if Selected */}
            {currentEquipment ? (
                <EquipmentPropertiesPanel equipment={currentEquipment} />
            ) : currentUnit ? (
                /* Else Show Unit Properties if Selected */
                <UnitPropertiesPanel unit={currentUnit} />
            ) : currentFacility ? (
                /* Else Show Facility Properties if Selected */
                <FacilityPropertiesPanel facility={currentFacility} />
            ) : (
                <div className="text-sm text-slate-500 text-center py-8">Select an item to view properties</div>
            )}

            {/* Always show Quick Stats if facility selected */}
            {currentFacility && <QuickStatsPanel />}
         </div>
       </ScrollArea>
    </aside>
  );
};

export default RightPanel;