import React from 'react';
import { useWellPlanningDesign } from '@/contexts/WellPlanningDesignContext';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import WellGeometryTab from '../geometry/WellGeometryTab';

// Placeholder components for other tabs
const PlaceholderContent = ({ title, description }) => (
  <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-500 space-y-4">
    <div className="w-16 h-16 rounded-full bg-[#252541] flex items-center justify-center mb-2">
      <div className="w-8 h-8 rounded-full bg-[#FFC107]/20 border-2 border-[#FFC107] animate-pulse"></div>
    </div>
    <h2 className="text-2xl font-bold text-[#e0e0e0]">{title}</h2>
    <p className="max-w-md">{description}</p>
    <div className="p-4 rounded border border-[#252541] bg-[#1a1a2e] text-xs font-mono text-left w-full max-w-lg mt-8">
      <div className="text-[#FFC107] mb-2">// Development Status: Phase 2</div>
      <div>Modules pending implementation...</div>
    </div>
  </div>
);

const CenterPanel = () => {
  const { activeTab, currentWell } = useWellPlanningDesign();

  if (!currentWell) {
     return (
        <div className="flex-1 bg-[#151525] flex items-center justify-center text-slate-500">
           Select a well to begin planning
        </div>
     );
  }

  return (
    <div className="flex-1 bg-[#151525] relative overflow-hidden flex flex-col">
       <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} className="h-full">
            <TabsContent value="geometry" className="h-full m-0">
               <WellGeometryTab />
            </TabsContent>
            
            <TabsContent value="casing" className="h-full m-0">
               <PlaceholderContent 
                 title="Casing & Cementing Design" 
                 description="Configure casing strings, selecting grades and weights. Calculate burst, collapse, and tensile loads."
               />
            </TabsContent>
            
            <TabsContent value="drilling" className="h-full m-0">
               <PlaceholderContent 
                 title="Drilling Program" 
                 description="Define BHA configurations, bit selection, drilling fluids, and operational parameters for each hole section."
               />
            </TabsContent>
            
            <TabsContent value="schematic" className="h-full m-0">
               <PlaceholderContent 
                 title="Wellbore Schematic" 
                 description="Visual representation of the wellbore architecture including completion equipment and geological formation tops."
               />
            </TabsContent>

            <TabsContent value="analysis" className="h-full m-0">
               <PlaceholderContent 
                 title="Engineering Analysis" 
                 description="Run torque & drag analysis, hydraulics optimization, and anti-collision scanning against offset wells."
               />
            </TabsContent>
          </Tabs>
       </div>
    </div>
  );
};

export default CenterPanel;