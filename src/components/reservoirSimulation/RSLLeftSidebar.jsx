import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useReservoirSimulation } from '@/context/ReservoirSimulationContext';
import { Layers, Sliders, BookOpen } from 'lucide-react';
import SampleModelsTab from './tabs/SampleModelsTab.jsx';
import MiniSimulatorTab from './tabs/MiniSimulatorTab.jsx';
import ExercisesTab from './tabs/ExercisesTab.jsx';

const RSLLeftSidebar = () => {
  const { state, dispatch } = useReservoirSimulation();

  return (
    <div className="w-80 border-r border-slate-800 bg-slate-950 flex flex-col h-full">
      <Tabs 
        value={state.activeSidebarTab} 
        onValueChange={(val) => dispatch({ type: 'SET_SIDEBAR_TAB', payload: val })}
        className="flex flex-col h-full"
      >
        <div className="p-2 border-b border-slate-800">
          <TabsList className="w-full bg-slate-900 border border-slate-800">
            <TabsTrigger value="models" className="flex-1 text-xs data-[state=active]:bg-slate-800">
               <Layers className="w-3.5 h-3.5 mr-1.5" /> Models
            </TabsTrigger>
            <TabsTrigger value="simulator" className="flex-1 text-xs data-[state=active]:bg-slate-800">
               <Sliders className="w-3.5 h-3.5 mr-1.5" /> Setup
            </TabsTrigger>
            <TabsTrigger value="exercises" className="flex-1 text-xs data-[state=active]:bg-slate-800">
               <BookOpen className="w-3.5 h-3.5 mr-1.5" /> Learn
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden relative">
          <TabsContent value="models" className="h-full mt-0 absolute inset-0">
             <SampleModelsTab />
          </TabsContent>
          <TabsContent value="simulator" className="h-full mt-0 absolute inset-0">
             <MiniSimulatorTab />
          </TabsContent>
          <TabsContent value="exercises" className="h-full mt-0 absolute inset-0">
             <ExercisesTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default RSLLeftSidebar;