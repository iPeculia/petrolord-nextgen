import React, { useState } from 'react';
import WellGeometryForm from './WellGeometryForm';
import SectionManager from './SectionManager';
import DepthDisplay from './DepthDisplay'; 
import WellSchematic from '../visualization/WellSchematic';
import WellProfile from '../visualization/WellProfile';
import DepthTable from './DepthTable';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const WellGeometryTab = () => {
  const [vizTab, setVizTab] = useState('schematic');

  return (
    <div className="geometry-tab-grid p-4 h-full">
      {/* Left Column: Inputs */}
      <div className="geometry-input-panel custom-scrollbar">
        <WellGeometryForm />
        <SectionManager />
      </div>

      {/* Right Column: Visualization */}
      <div className="geometry-viz-panel">
        
        {/* Depth Display Header (New) */}
        <div className="flex-none p-2 border-b border-[#252541] bg-[#151525]">
           <DepthDisplay />
           
           <div className="flex items-center justify-between mt-2">
             <div className="text-xs font-semibold text-slate-300">Visualization</div>
             <Tabs value={vizTab} onValueChange={setVizTab} className="h-6">
                <TabsList className="h-6 bg-[#252541]">
                   <TabsTrigger value="schematic" className="h-5 text-[10px] px-2">Schematic</TabsTrigger>
                   <TabsTrigger value="profile" className="h-5 text-[10px] px-2">Profile View</TabsTrigger>
                </TabsList>
             </Tabs>
           </div>
        </div>
        
        <div className="viz-canvas-container">
           {vizTab === 'schematic' ? <WellSchematic /> : <WellProfile />}
        </div>

        <div className="flex-none depth-table-container custom-scrollbar bg-[#151525]">
           <DepthTable />
        </div>
      </div>
    </div>
  );
};

export default WellGeometryTab;