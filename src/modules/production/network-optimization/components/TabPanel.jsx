import React from 'react';
import { useNetworkOptimization } from '@/context/NetworkOptimizationContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const TabPanel = () => {
  const { 
    currentTab, 
    selectedNode, 
    selectedPipeline,
    nodes,
    pipelines
  } = useNetworkOptimization();

  // Helper to render property rows
  const PropertyRow = ({ label, value }) => (
    <div className="flex justify-between py-2 text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-200 font-medium">{value}</span>
    </div>
  );

  // Content for Properties Tab (Dynamic based on selection)
  const renderPropertiesContent = () => {
    if (selectedNode) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{selectedNode.name}</h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs text-blue-400 border border-slate-700">
              {selectedNode.type}
            </span>
          </div>
          <Separator className="bg-slate-800" />
          <div className="space-y-1">
             <PropertyRow label="Node ID" value={selectedNode.node_id.substring(0,8)} />
             <PropertyRow label="Elevation" value={`${selectedNode.location.elevation} ft`} />
             <PropertyRow label="Coordinates" value={`(${selectedNode.location.x}, ${selectedNode.location.y})`} />
             {selectedNode.well_data && (
                <>
                  <Separator className="bg-slate-800 my-2" />
                  <h4 className="text-xs font-semibold text-slate-500 uppercase mt-2 mb-1">Production Data</h4>
                  <PropertyRow label="Rate" value={`${selectedNode.well_data.production_rate_bpd} bpd`} />
                  <PropertyRow label="Pressure" value={`${selectedNode.well_data.static_pressure_psi} psi`} />
                  <PropertyRow label="Temp" value={`${selectedNode.well_data.temperature_f} °F`} />
                </>
             )}
          </div>
        </div>
      );
    } else if (selectedPipeline) {
       return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{selectedPipeline.name}</h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs text-slate-400 border border-slate-700">
              Pipeline
            </span>
          </div>
          <Separator className="bg-slate-800" />
          <div className="space-y-1">
             <PropertyRow label="Length" value={`${selectedPipeline.length_miles} miles`} />
             <PropertyRow label="Diameter" value={`${selectedPipeline.diameter_inches} inches`} />
             <PropertyRow label="Material" value={selectedPipeline.material} />
             <PropertyRow label="Roughness" value={`${selectedPipeline.roughness_microns} µm`} />
          </div>
        </div>
      );
    }
    
    return (
      <div className="text-center py-10 text-slate-500">
        <p>Select a node or pipeline to view properties</p>
      </div>
    );
  };

  // Render content based on current active tab from Sidebar
  const renderTabContent = () => {
    switch (currentTab) {
      case 'Nodes':
        return (
          <div className="p-4 space-y-4">
             <div className="flex justify-between items-center">
                <h3 className="font-semibold text-white">Network Nodes</h3>
                <Button size="sm" variant="outline" className="h-8 border-slate-700 hover:bg-slate-800">
                  <Plus className="h-4 w-4 mr-2" /> Add Node
                </Button>
             </div>
             <ScrollArea className="h-[calc(100vh-200px)] pr-4">
                <div className="space-y-2">
                   {nodes.map(node => (
                     <Card key={node.node_id} className="bg-slate-900 border-slate-800 hover:border-slate-700 cursor-pointer">
                        <CardContent className="p-3">
                           <div className="flex justify-between items-start">
                              <div>
                                 <p className="text-sm font-medium text-slate-200">{node.name}</p>
                                 <p className="text-xs text-slate-500">{node.type}</p>
                              </div>
                              <span className="text-xs text-slate-600">ID: {node.node_id.substring(0,4)}</span>
                           </div>
                        </CardContent>
                     </Card>
                   ))}
                </div>
             </ScrollArea>
          </div>
        );
      case 'Pipelines':
         return (
          <div className="p-4 space-y-4">
             <div className="flex justify-between items-center">
                <h3 className="font-semibold text-white">Pipelines</h3>
                <Button size="sm" variant="outline" className="h-8 border-slate-700 hover:bg-slate-800">
                  <Plus className="h-4 w-4 mr-2" /> Add Pipeline
                </Button>
             </div>
             <ScrollArea className="h-[calc(100vh-200px)] pr-4">
                <div className="space-y-2">
                   {pipelines.map(pipe => (
                     <Card key={pipe.pipeline_id} className="bg-slate-900 border-slate-800 hover:border-slate-700 cursor-pointer">
                        <CardContent className="p-3">
                           <div className="flex justify-between items-start">
                              <div>
                                 <p className="text-sm font-medium text-slate-200">{pipe.name}</p>
                                 <p className="text-xs text-slate-500">{pipe.length_miles} mi • {pipe.diameter_inches}"</p>
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                   ))}
                </div>
             </ScrollArea>
          </div>
        );
      case 'Optimization':
         return (
            <div className="p-4 space-y-4">
               <h3 className="font-semibold text-white mb-4">Optimization Scenarios</h3>
               <Card className="bg-slate-900 border-slate-800">
                  <CardHeader className="p-4">
                     <CardTitle className="text-sm">Base Case</CardTitle>
                     <CardDescription>Maximize Production</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                     <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                        Run Simulation
                     </Button>
                  </CardContent>
               </Card>
               {/* Add more placeholder content for optimization */}
            </div>
         );
      default: // Default to showing Properties if "Networks" or "Results" or "Settings" is selected for now, or just generic info
         return (
            <div className="p-4">
               <Tabs defaultValue="properties" className="w-full">
                  <TabsList className="w-full grid grid-cols-2 bg-slate-900">
                    <TabsTrigger value="properties">Properties</TabsTrigger>
                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  </TabsList>
                  <TabsContent value="properties" className="mt-4">
                     {renderPropertiesContent()}
                  </TabsContent>
                  <TabsContent value="analysis" className="mt-4">
                     <div className="text-center py-10 text-slate-500">
                        <p>No analysis results available for selection.</p>
                     </div>
                  </TabsContent>
               </Tabs>
            </div>
         );
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0F172A]">
       {renderTabContent()}
    </div>
  );
};

export default TabPanel;