import React from 'react';
import { useReservoirSimulation } from '@/context/ReservoirSimulationContext';
import { SAMPLE_MODELS_DATA } from '@/data/reservoirSimulation/sampleModelsData';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, Grid, Info, Droplets } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SampleModelSelector = () => {
  const { dispatch, state } = useReservoirSimulation();
  const activeModelId = state?.selectedModel?.id;

  const handleSelect = (model) => {
    dispatch({ type: 'LOAD_SAMPLE_MODEL', payload: model });
    // Keep user on the current tab (likely Lab) but ensure model is loaded
  };

  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      {SAMPLE_MODELS_DATA.map((model) => {
        const isActive = activeModelId === model.id;
        
        return (
            <Card 
                key={model.id} 
                className={`
                    bg-slate-900/50 transition-all duration-200 cursor-pointer
                    ${isActive ? 'border-emerald-500 ring-1 ring-emerald-500/20' : 'border-slate-800 hover:border-slate-600'}
                `}
                onClick={() => handleSelect(model)}
            >
                <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-sm font-semibold text-slate-200 leading-tight">
                            {model.name}
                        </CardTitle>
                        <Badge variant="outline" className="shrink-0 border-slate-700 text-slate-400 text-[9px] uppercase tracking-wider">
                            {model.type}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                    <p className="text-xs text-slate-400 line-clamp-2 min-h-[2.5em] mb-3">
                        {model.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-mono">
                        <div className="flex items-center">
                            <Grid className="w-3 h-3 mr-1.5 text-blue-400 shrink-0" />
                            <span>{model.grid.nx}x{model.grid.ny}x{model.grid.nz}</span>
                        </div>
                        <div className="flex items-center">
                            <Info className="w-3 h-3 mr-1.5 text-purple-400 shrink-0" />
                            <span>{model.timeSteps.length} Steps</span>
                        </div>
                        <div className="flex items-center col-span-2">
                             <Droplets className="w-3 h-3 mr-1.5 text-emerald-400 shrink-0" />
                             <span className="truncate">
                                 {model.wells ? `${model.wells.length} Wells` : 'No Wells'}
                             </span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="p-3 pt-0">
                    <Button 
                        size="sm" 
                        className={`w-full text-xs h-8 ${isActive ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
                    >
                        <PlayCircle className="w-3 h-3 mr-2" />
                        {isActive ? 'Active Model' : 'Load Model'}
                    </Button>
                </CardFooter>
            </Card>
        );
      })}
    </div>
  );
};

export default SampleModelSelector;