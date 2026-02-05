import React, { useEffect } from 'react';
import { useNetworkOptimization } from '@/context/NetworkOptimizationContext';
import NetworkVisualizationEditor from './NetworkVisualizationEditor';
import TabPanel from './TabPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NetworksList from './lists/NetworksList';
import NodesList from './lists/NodesList';
import PipelinesList from './lists/PipelinesList';
import FacilitiesList from './lists/FacilitiesList';
import { Button } from '@/components/ui/button';
import { PlayCircle, Save } from 'lucide-react';
import SmartGuidance from './SmartGuidance';
import DataValidationSummary from './DataValidationSummary';
import { useToast } from '@/components/ui/use-toast';

const NetworkWorkspace = () => {
  const { currentNetwork, setCurrentTab, currentTab } = useNetworkOptimization();
  const { toast } = useToast();

  // Sync internal tab state with context if needed, or just rely on context
  // Using context's currentTab to drive the visual tab selection
  
  const handleSave = () => {
      // Trigger context save logic (already auto-saving but this gives feedback)
      toast({
          title: "Network Saved",
          description: "All changes have been persisted successfully."
      });
  };

  if (!currentNetwork) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#020617] text-slate-400 p-8">
             <div className="max-w-md w-full">
                <h2 className="text-xl text-slate-200 font-semibold mb-4">Welcome to Network Optimization</h2>
                <NetworksList /> 
             </div>
        </div>
    );
  }

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {/* Left Panel: Lists & Management */}
      <div className="w-[420px] border-r border-slate-800 bg-[#0F172A] flex flex-col">
         <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
             <h2 className="font-semibold text-white truncate max-w-[200px]" title={currentNetwork.name}>
                 {currentNetwork.name}
             </h2>
             <div className="flex gap-1">
                 <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={handleSave} title="Save">
                     <Save className="w-4 h-4 text-slate-400" />
                 </Button>
             </div>
         </div>
         
         <Tabs value={currentTab.toLowerCase()} onValueChange={(val) => setCurrentTab(val.charAt(0).toUpperCase() + val.slice(1))} className="flex-1 flex flex-col">
            <div className="px-2 pt-2 border-b border-slate-800 bg-[#0F172A]">
                <TabsList className="w-full grid grid-cols-4 bg-slate-900 mb-2">
                    <TabsTrigger value="networks" className="text-xs px-1">Nets</TabsTrigger>
                    <TabsTrigger value="nodes" className="text-xs px-1">Nodes</TabsTrigger>
                    <TabsTrigger value="pipelines" className="text-xs px-1">Pipes</TabsTrigger>
                    <TabsTrigger value="facilities" className="text-xs px-1">Facils</TabsTrigger>
                </TabsList>
            </div>
            
            <div className="flex-1 overflow-hidden bg-[#0F172A] relative">
                <TabsContent value="networks" className="m-0 p-4 h-full overflow-auto absolute inset-0">
                    <NetworksList />
                </TabsContent>
                <TabsContent value="nodes" className="m-0 p-4 h-full overflow-auto absolute inset-0">
                    <NodesList />
                </TabsContent>
                <TabsContent value="pipelines" className="m-0 p-4 h-full overflow-auto absolute inset-0">
                    <PipelinesList />
                </TabsContent>
                <TabsContent value="facilities" className="m-0 p-4 h-full overflow-auto absolute inset-0">
                    <FacilitiesList />
                </TabsContent>
                {/* Fallback for tabs not in the left list (like Optimization, Results) handled by Main Content switching logic if needed, 
                    but here we assume left panel is for management */}
            </div>
         </Tabs>

         <DataValidationSummary />
      </div>

      {/* Center Panel: Visualization */}
      <div className="flex-1 flex flex-col bg-[#020617] relative">
         <div className="absolute top-4 left-4 right-4 z-10 pointer-events-none">
            <div className="pointer-events-auto max-w-2xl mx-auto">
                <SmartGuidance />
            </div>
         </div>
         
         <NetworkVisualizationEditor />
         
         {/* Bottom Action Bar */}
         <div className="absolute bottom-6 right-6 z-10">
            <Button 
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20 px-6 py-6 rounded-full"
                onClick={() => setCurrentTab('Optimization')}
            >
                <PlayCircle className="w-5 h-5 mr-2" />
                <span className="font-semibold">Start Optimization</span>
            </Button>
         </div>
      </div>

      {/* Right Panel: Properties */}
      <div className="w-[350px] border-l border-slate-800 bg-[#0F172A] hidden xl:flex flex-col">
         <TabPanel />
      </div>
    </div>
  );
};

export default NetworkWorkspace;