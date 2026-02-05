import React from 'react';
import { Progress } from '@/components/ui/progress';

const SimulationProgress = ({ progress, status }) => {
    return (
        <div className="w-full space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
                <span>{status}</span>
                <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
        </div>
    );
};

export default SimulationProgress;