import React from 'react';
import { useVolumetrics } from '@/hooks/useVolumetrics';
import { useVisualization, VisualizationProvider } from '@/contexts/VisualizationContext';
import Canvas3D from './Canvas3D';
import Canvas2D from './Canvas2D';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Box, Layers, Grid as GridIcon, Maximize, Eye } from 'lucide-react';

const VisualizationControls = () => {
    const { state, actions } = useVisualization();
    
    return (
        <div className="h-full border-l border-slate-800 bg-slate-950 p-4 flex flex-col gap-6 w-64">
            <div>
                <h4 className="text-xs font-semibold text-slate-500 mb-3 uppercase">View Mode</h4>
                <div className="flex p-1 bg-slate-900 rounded border border-slate-800">
                    <Button 
                        size="sm" 
                        variant="ghost" 
                        className={`flex-1 h-7 text-xs ${state.mode === '2D' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
                        onClick={() => actions.setMode('2D')}
                    >
                        2D Map
                    </Button>
                    <Button 
                        size="sm" 
                        variant="ghost" 
                        className={`flex-1 h-7 text-xs ${state.mode === '3D' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
                        onClick={() => actions.setMode('3D')}
                    >
                        3D View
                    </Button>
                </div>
            </div>

            <div>
                <h4 className="text-xs font-semibold text-slate-500 mb-3 uppercase">Visibility</h4>
                <div className="space-y-2">
                    <Toggle 
                        pressed={state.settings.showSurfaces} 
                        onPressedChange={(v) => actions.updateSettings({ showSurfaces: v })}
                        className="w-full justify-start text-sm text-slate-300 data-[state=on]:bg-slate-800 data-[state=on]:text-[#BFFF00]"
                    >
                        <Layers className="w-4 h-4 mr-2" /> Surfaces
                    </Toggle>
                    <Toggle 
                        pressed={state.settings.showWells} 
                        onPressedChange={(v) => actions.updateSettings({ showWells: v })}
                        className="w-full justify-start text-sm text-slate-300 data-[state=on]:bg-slate-800 data-[state=on]:text-[#BFFF00]"
                    >
                        <Maximize className="w-4 h-4 mr-2 rotate-90" /> Wells
                    </Toggle>
                    <Toggle 
                        pressed={state.settings.showGrid} 
                        onPressedChange={(v) => actions.updateSettings({ showGrid: v })}
                        className="w-full justify-start text-sm text-slate-300 data-[state=on]:bg-slate-800 data-[state=on]:text-[#BFFF00]"
                    >
                        <GridIcon className="w-4 h-4 mr-2" /> Reference Grid
                    </Toggle>
                </div>
            </div>

            {state.mode === '3D' && (
                <div>
                    <h4 className="text-xs font-semibold text-slate-500 mb-3 uppercase">Z-Scale</h4>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">1x</span>
                        <input 
                            type="range" 
                            min="1" max="20" step="1"
                            value={state.settings.verticalExaggeration}
                            onChange={(e) => actions.updateSettings({ verticalExaggeration: parseFloat(e.target.value) })}
                            className="flex-1 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#BFFF00]"
                        />
                        <span className="text-xs text-slate-400">20x</span>
                    </div>
                    <div className="text-center text-xs text-[#BFFF00] mt-1 font-mono">
                        {state.settings.verticalExaggeration}x
                    </div>
                </div>
            )}
        </div>
    );
};

const VisualizationContent = () => {
    const { state } = useVisualization();

    return (
        <div className="flex h-full w-full">
            <div className="flex-1 relative bg-black">
                {state.mode === '3D' ? <Canvas3D /> : <Canvas2D />}
                
                <div className="absolute top-4 left-4 pointer-events-none">
                    <div className="bg-slate-900/80 backdrop-blur px-3 py-1 rounded text-xs text-slate-300 border border-slate-800">
                        {state.mode} Visualization
                    </div>
                </div>
            </div>
            <VisualizationControls />
        </div>
    );
};

const VisualizationTab = () => {
    return (
        <VisualizationProvider>
            <VisualizationContent />
        </VisualizationProvider>
    );
};

export default VisualizationTab;