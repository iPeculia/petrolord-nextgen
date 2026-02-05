import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, Beaker, BarChart3 } from 'lucide-react';
import { useReservoirSimulation } from '@/context/ReservoirSimulationContext';

const RSLTabNavigation = () => {
  const { state, dispatch } = useReservoirSimulation();
  
  // Use 'lab' as default if activeTab is not set, or use the value from context
  const activeTab = state?.activeTab || 'lab';

  return (
    <div className="border-b border-slate-800 bg-slate-900/50 px-4 pt-0">
      <Tabs 
        value={activeTab} 
        onValueChange={(val) => dispatch({ type: 'SET_ACTIVE_TAB', payload: val })}
        className="w-full"
      >
        <TabsList className="bg-transparent border-b border-transparent w-full justify-start h-12 p-0 space-x-6">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-400 text-slate-400 hover:text-white rounded-none px-2 py-3 border-b-2 border-transparent transition-all shadow-none"
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="lab" 
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-400 text-slate-400 hover:text-white rounded-none px-2 py-3 border-b-2 border-transparent transition-all shadow-none"
          >
            <Beaker className="w-4 h-4 mr-2" />
            Simulation Lab
          </TabsTrigger>
          <TabsTrigger 
            value="results" 
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-400 text-slate-400 hover:text-white rounded-none px-2 py-3 border-b-2 border-transparent transition-all shadow-none"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Results & Exports
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default RSLTabNavigation;