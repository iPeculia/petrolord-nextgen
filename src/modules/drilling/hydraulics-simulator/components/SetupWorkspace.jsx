import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Save } from 'lucide-react';
import { useHydraulicsSimulator } from '@/contexts/HydraulicsSimulatorContext';
import { toast } from '@/components/ui/use-toast';

// Forms
import ProjectForm from './forms/ProjectForm';
import WellForm from './forms/WellForm';
import HoleSectionForm from './forms/HoleSectionForm';
import DrillingFluidForm from './forms/DrillingFluidForm';
import TubularComponentForm from './forms/TubularComponentForm';
import BitNozzleForm from './forms/BitNozzleForm';
import PumpForm from './forms/PumpForm';
import ChokeForm from './forms/ChokeForm';

// Components
import HydraulicsSchematicCanvas from './HydraulicsSchematicCanvas';
import ProgressIndicator from './ProgressIndicator';
import SmartGuidance from './SmartGuidance';
import DataValidationSummary from './DataValidationSummary';

const SetupWorkspace = () => {
  const { current_project, current_well, setCurrentTab } = useHydraulicsSimulator();
  const [activeTab, setActiveTab] = useState("project");

  const handleNext = (nextTab) => {
    setActiveTab(nextTab);
  };

  const handleGlobalSave = () => {
     // The context auto-saves to local storage, but this gives user feedback
     toast({ title: "Project Saved", description: "All configurations have been persisted." });
  };

  return (
    <div className="h-full flex flex-col gap-4 p-2 overflow-hidden">
        {/* Top Progress / Navigation */}
        <div className="flex flex-col gap-2 shrink-0">
            <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                    <SmartGuidance />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleGlobalSave} className="border-slate-700 bg-slate-900 hover:bg-slate-800">
                        <Save className="mr-2 h-4 w-4" /> Save Project
                    </Button>
                    <Button 
                        disabled={!current_well} 
                        onClick={() => setCurrentTab('Hydraulics')}
                        className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20"
                    >
                        Start Simulation <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
            <ProgressIndicator />
        </div>

        {/* Main Workspace Layout */}
        <div className="flex-1 grid grid-cols-12 gap-4 overflow-hidden min-h-0">
            
            {/* Left Panel - Forms */}
            <div className="col-span-12 lg:col-span-5 flex flex-col overflow-hidden h-full">
                <Card className="flex-1 bg-slate-900 border-slate-800 flex flex-col overflow-hidden shadow-xl">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col h-full">
                        <div className="px-2 pt-2 pb-0 border-b border-slate-800 bg-slate-950/50 z-10">
                            <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent w-full justify-start p-1">
                                <TabsTrigger value="project" data-tab="Project" className="text-xs px-3 py-1.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white">Project</TabsTrigger>
                                <TabsTrigger value="well" data-tab="Well" disabled={!current_project} className="text-xs px-3 py-1.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white">Well</TabsTrigger>
                                <TabsTrigger value="geometry" data-tab="Geometry" disabled={!current_well} className="text-xs px-3 py-1.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white">Geometry</TabsTrigger>
                                <TabsTrigger value="fluid" data-tab="Fluid" disabled={!current_project} className="text-xs px-3 py-1.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white">Fluid</TabsTrigger>
                                <TabsTrigger value="string" data-tab="String" disabled={!current_well} className="text-xs px-3 py-1.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white">String</TabsTrigger>
                                <TabsTrigger value="equipment" data-tab="Equipment" disabled={!current_project} className="text-xs px-3 py-1.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white">Equipment</TabsTrigger>
                            </TabsList>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto overflow-x-hidden p-1 custom-scrollbar">
                            <TabsContent value="project" className="m-0 h-full p-2">
                                <ProjectForm onSuccess={() => handleNext('well')} />
                            </TabsContent>
                            <TabsContent value="well" className="m-0 h-full p-2">
                                <WellForm onSuccess={() => handleNext('geometry')} />
                            </TabsContent>
                            <TabsContent value="geometry" className="m-0 h-full p-2">
                                <HoleSectionForm onSuccess={() => handleNext('fluid')} />
                            </TabsContent>
                             <TabsContent value="fluid" className="m-0 h-full p-2">
                                <DrillingFluidForm onSuccess={() => handleNext('string')} />
                            </TabsContent>
                             <TabsContent value="string" className="m-0 h-full p-2 space-y-4">
                                <TubularComponentForm />
                                <BitNozzleForm onSuccess={() => handleNext('equipment')} />
                            </TabsContent>
                             <TabsContent value="equipment" className="m-0 h-full p-2 space-y-4">
                                <PumpForm />
                                <ChokeForm />
                            </TabsContent>
                        </div>
                    </Tabs>
                </Card>
            </div>

            {/* Right Panel - Visualization & Validation */}
            <div className="col-span-12 lg:col-span-7 flex flex-col gap-4 h-full overflow-hidden">
                 <Card className="flex-1 bg-slate-900 border-slate-800 overflow-hidden flex flex-col shadow-xl min-h-[300px]">
                    <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                        <h3 className="text-sm font-medium text-slate-300">Live Schematic Preview</h3>
                        <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-1 rounded border border-slate-700">Auto-updating</span>
                    </div>
                    <div className="flex-1 relative bg-[#0f172a] p-4 flex items-center justify-center overflow-hidden">
                        <HydraulicsSchematicCanvas />
                    </div>
                 </Card>

                 {/* Validation Summary */}
                 <div className="h-48 shrink-0">
                    <DataValidationSummary />
                 </div>
            </div>
        </div>
    </div>
  );
};

export default SetupWorkspace;