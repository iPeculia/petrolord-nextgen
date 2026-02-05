import React from 'react';
import { useReservoirSimulation } from '@/context/ReservoirSimulationContext';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Repeat } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const TimeControls = () => {
    const { state, dispatch } = useReservoirSimulation();
    
    const { simulationState, selectedModel } = state || {};
    const { currentTimeStep = 0, isPlaying = false, isLooping = false } = simulationState || {};

    // 1. Guard against missing model - render disabled state
    if (!selectedModel) {
        return (
            <div className="h-16 border-t border-slate-800 bg-slate-950/80 px-4 flex items-center justify-center text-slate-600 text-sm shrink-0">
                Time controls disabled - No model loaded
            </div>
        );
    }

    // 2. Guard against missing time steps
    const timeSteps = selectedModel.timeSteps || [];
    const maxSteps = Math.max(0, timeSteps.length - 1);
    const currentTime = timeSteps[currentTimeStep] ?? 0;
    const totalTime = timeSteps[maxSteps] ?? 0;

    const togglePlay = () => {
        dispatch({ type: 'SET_PLAYING', payload: !isPlaying });
    };

    const toggleLoop = () => {
        dispatch({ type: 'TOGGLE_LOOP' });
    };

    const handleSliderChange = (val) => {
        dispatch({ type: 'SET_TIME_STEP', payload: val[0] });
    };

    const stepForward = () => {
        if (currentTimeStep < maxSteps) {
            dispatch({ type: 'SET_TIME_STEP', payload: currentTimeStep + 1 });
        }
    };

    const stepBack = () => {
        if (currentTimeStep > 0) {
            dispatch({ type: 'SET_TIME_STEP', payload: currentTimeStep - 1 });
        }
    };

    return (
        <div className="h-14 border-t border-slate-800 bg-slate-950 px-4 flex items-center gap-4 shrink-0 w-full z-10">
            <div className="flex items-center gap-1">
                <Button 
                    variant="ghost" size="icon" 
                    onClick={stepBack} 
                    disabled={currentTimeStep <= 0}
                    className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
                >
                    <SkipBack className="w-4 h-4" />
                </Button>
                
                <Button 
                    variant="outline" size="icon" 
                    onClick={togglePlay}
                    className={`h-9 w-9 rounded-full border-emerald-500/30 transition-all ${isPlaying ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500' : 'hover:bg-slate-800 hover:border-slate-600 text-white'}`}
                >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 ml-0.5 fill-current" />}
                </Button>

                <Button 
                    variant="ghost" size="icon" 
                    onClick={stepForward}
                    disabled={currentTimeStep >= maxSteps}
                    className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
                >
                    <SkipForward className="w-4 h-4" />
                </Button>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                variant="ghost" size="icon" 
                                onClick={toggleLoop}
                                className={`h-8 w-8 transition-colors ${isLooping ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
                            >
                                <Repeat className="w-3.5 h-3.5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-800 text-slate-200 border-slate-700">
                            <p>{isLooping ? 'Disable Loop' : 'Enable Loop'}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-1.5 min-w-[200px]">
                <div className="flex justify-between text-[10px] text-slate-400 font-medium font-mono uppercase tracking-wider">
                    <span>Day: <span className="text-white">{currentTime}</span></span>
                    <span>Total: {totalTime}d</span>
                </div>
                <Slider 
                    value={[currentTimeStep]} 
                    min={0} 
                    max={maxSteps} 
                    step={1} 
                    onValueChange={handleSliderChange}
                    className="cursor-pointer"
                />
            </div>
        </div>
    );
};

export default TimeControls;