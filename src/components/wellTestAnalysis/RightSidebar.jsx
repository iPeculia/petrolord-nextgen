import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Settings2, Info } from 'lucide-react';
import { useWellTestAnalysis } from '@/hooks/useWellTestAnalysis';

const RightSidebar = () => {
  const { parameters, updateParameter, currentTest } = useWellTestAnalysis();

  return (
    <div className="w-80 bg-slate-950 border-l border-slate-800 flex flex-col h-full">
      <div className="p-3 border-b border-slate-800 flex items-center gap-2 bg-slate-900">
        <Settings2 className="w-4 h-4 text-[#BFFF00]" />
        <span className="font-semibold text-sm text-white">Properties Inspector</span>
      </div>

      <ScrollArea className="flex-1">
        <Tabs defaultValue="params" className="w-full">
           <div className="p-2 border-b border-slate-800">
               <TabsList className="w-full bg-slate-900">
                  <TabsTrigger value="params" className="flex-1">Parameters</TabsTrigger>
                  <TabsTrigger value="model" className="flex-1">Model</TabsTrigger>
                  <TabsTrigger value="meta" className="flex-1">Info</TabsTrigger>
               </TabsList>
           </div>

           <TabsContent value="params" className="p-4 space-y-6">
              <div className="space-y-4">
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <Label className="text-slate-300">Permeability (md)</Label>
                        <span className="text-[#BFFF00] font-mono">{parameters?.permeability}</span>
                    </div>
                    <Slider 
                        value={[parameters?.permeability || 10]} 
                        max={1000} 
                        step={1} 
                        onValueChange={([val]) => updateParameter('permeability', val)} 
                    />
                 </div>

                 <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <Label className="text-slate-300">Skin Factor</Label>
                        <span className="text-[#BFFF00] font-mono">{parameters?.skin}</span>
                    </div>
                    <Slider 
                        value={[parameters?.skin || 0]} 
                        min={-5} 
                        max={20} 
                        step={0.1} 
                        onValueChange={([val]) => updateParameter('skin', val)} 
                    />
                 </div>

                 <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <Label className="text-slate-300">Wellbore Storage (bbl/psi)</Label>
                        <span className="text-[#BFFF00] font-mono">{parameters?.wellboreStorage}</span>
                    </div>
                    <Slider 
                        value={[parameters?.wellboreStorage || 0.01]} 
                        max={1} 
                        step={0.001} 
                        onValueChange={([val]) => updateParameter('wellboreStorage', val)} 
                    />
                 </div>
              </div>
           </TabsContent>

           <TabsContent value="meta" className="p-4">
              <Card className="bg-slate-900 border-slate-800">
                 <CardContent className="p-3 space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-slate-500">Test Type</span>
                        <span className="text-white text-right">{currentTest?.type || 'Buildup'}</span>
                        
                        <span className="text-slate-500">Date</span>
                        <span className="text-white text-right">2025-03-14</span>
                        
                        <span className="text-slate-500">Duration</span>
                        <span className="text-white text-right">48 hrs</span>
                        
                        <span className="text-slate-500">Gauge Depth</span>
                        <span className="text-white text-right">8,500 ft</span>
                    </div>
                 </CardContent>
              </Card>
           </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
};

export default RightSidebar;