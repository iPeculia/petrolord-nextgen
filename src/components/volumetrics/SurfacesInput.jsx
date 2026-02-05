import React, { useState } from 'react';
import { useVolumetrics } from '@/hooks/useVolumetrics';
import { Database, Plus, Trash2, Eye, EyeOff, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import SurfaceImportDialog from './SurfaceImportDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { surfaceManager } from '@/services/volumetrics/SurfaceManager';
import { useToast } from '@/components/ui/use-toast';

const SurfacesInput = () => {
  const { state, actions } = useVolumetrics();
  const { toast } = useToast();
  const [importOpen, setImportOpen] = useState(false);
  const [topId, setTopId] = useState('');
  const [baseId, setBaseId] = useState('');

  const surfaces = state.data.surfaces || [];

  const handleImport = (newSurface) => {
      // Add to manager for logic
      surfaceManager.addSurface(newSurface);
      // Add to state for UI
      const updatedSurfaces = [...surfaces, newSurface];
      actions.updateData({ surfaces: updatedSurfaces });
  };

  const handleRemove = (id) => {
      surfaceManager.removeSurface(id);
      const updatedSurfaces = surfaces.filter(s => s.id !== id);
      actions.updateData({ surfaces: updatedSurfaces });
      
      if (topId === id) setTopId('');
      if (baseId === id) setBaseId('');
  };

  const handleCalculateGRV = () => {
      if (!topId || !baseId) {
          toast({ title: "Selection Missing", description: "Please select both Top and Base surfaces.", variant: "destructive" });
          return;
      }

      try {
          const grv = surfaceManager.calculateGRV(topId, baseId);
          // Update parameters for calculation engine
          // Assuming Imperial for now: Volume in ft3 -> need acre-ft
          // 1 acre = 43560 sq ft
          const grvAcreFt = Math.abs(grv) / 43560;
          
          actions.updateData({ 
              parameters: {
                  ...state.data.parameters,
                  grv_calculated: grvAcreFt,
                  area: surfaces.find(s => s.id === topId).stats.area / 43560, // rough area
                  thickness: grvAcreFt / (surfaces.find(s => s.id === topId).stats.area / 43560) // avg thickness
              }
          });

          toast({ 
              title: "GRV Calculated", 
              description: `Gross Rock Volume: ${grvAcreFt.toFixed(1)} acre-ft (Approx)` 
          });

      } catch (err) {
          toast({ title: "Error", description: err.message, variant: "destructive" });
      }
  };

  return (
    <div className="h-full flex flex-col p-4 gap-4">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-slate-200 flex items-center gap-2">
                <Database className="w-5 h-5 text-[#BFFF00]" /> Surface Manager
            </h3>
            <Button size="sm" onClick={() => setImportOpen(true)} className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600">
                <Plus className="w-4 h-4 mr-2" /> Import Surface
            </Button>
        </div>

        <div className="grid grid-cols-3 gap-6 flex-1 overflow-hidden">
            {/* Surface List */}
            <div className="col-span-2 flex flex-col bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                <div className="p-3 border-b border-slate-800 bg-slate-900/50 text-xs font-semibold text-slate-500 uppercase">Loaded Surfaces</div>
                <ScrollArea className="flex-1 p-3">
                    {surfaces.length === 0 ? (
                        <div className="text-center text-slate-600 italic py-10">No surfaces loaded. Import data to begin.</div>
                    ) : (
                        <div className="space-y-2">
                            {surfaces.map(surface => (
                                <div key={surface.id} className="flex items-center justify-between bg-slate-900 p-3 rounded border border-slate-800">
                                    <div>
                                        <div className="font-medium text-slate-200 text-sm">{surface.name}</div>
                                        <div className="text-xs text-slate-500 mt-1 font-mono">
                                            Points: {surface.stats.pointCount.toLocaleString()} | Z: {surface.bounds.minZ.toFixed(0)} to {surface.bounds.maxZ.toFixed(0)}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-400" onClick={() => handleRemove(surface.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </div>

            {/* Calculation Panel */}
            <div className="col-span-1 flex flex-col gap-4">
                 <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-4">
                    <h4 className="text-sm font-semibold text-slate-300">Volume Calculation</h4>
                    
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-500">Top Horizon</Label>
                        <Select value={topId} onValueChange={setTopId}>
                            <SelectTrigger className="bg-slate-900 border-slate-700"><SelectValue placeholder="Select Top..." /></SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800">
                                {surfaces.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs text-slate-500">Base Horizon</Label>
                        <Select value={baseId} onValueChange={setBaseId}>
                            <SelectTrigger className="bg-slate-900 border-slate-700"><SelectValue placeholder="Select Base..." /></SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800">
                                {surfaces.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button 
                        className="w-full bg-[#BFFF00] text-slate-900 hover:bg-[#a3d900] font-bold mt-4"
                        disabled={!topId || !baseId}
                        onClick={handleCalculateGRV}
                    >
                        Compute GRV
                    </Button>

                    {state.data.parameters.grv_calculated && (
                        <div className="mt-4 p-3 bg-slate-900/50 border border-slate-800 rounded">
                            <div className="text-xs text-slate-500">Calculated GRV</div>
                            <div className="text-xl font-mono text-[#BFFF00]">{state.data.parameters.grv_calculated.toFixed(1)} <span className="text-sm text-slate-500">acre-ft</span></div>
                            <div className="text-xs text-slate-500 mt-1">Ready for main calculation</div>
                        </div>
                    )}
                 </div>
            </div>
        </div>

        <SurfaceImportDialog 
            open={importOpen} 
            onOpenChange={setImportOpen} 
            onImport={handleImport} 
        />
    </div>
  );
};

export default SurfacesInput;