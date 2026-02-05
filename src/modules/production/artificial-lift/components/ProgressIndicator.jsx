import React, { useEffect, useState } from 'react';
import { useArtificialLift } from '../context/ArtificialLiftContext';
import { Progress } from '@/components/ui/progress';

const ProgressIndicator = () => {
  const { currentWellId, currentWell, getReservoirProperties, getProductionData } = useArtificialLift();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let currentProgress = 0;
    
    // Stage 1: Well Setup (20%)
    if (currentWellId && currentWell) currentProgress += 20;

    // Stage 2: Reservoir Data (20%)
    if (currentWellId && getReservoirProperties(currentWellId)) currentProgress += 20;

    // Stage 3: Production Data (20%)
    if (currentWellId && getProductionData(currentWellId)) currentProgress += 20;

    // Stage 4: Lift Selection (20%) - Mocked for now since selector doesn't fully persist yet
    // Assuming if prod data exists, user has moved to lift selection mentally
    if (currentWellId && getProductionData(currentWellId) && currentProgress >= 60) {
        // This is a simplification; ideally we check specific design objects
    }

    setProgress(currentProgress);
  }, [currentWellId, currentWell, getReservoirProperties, getProductionData]);

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 sticky top-16 z-10 px-6 py-2 flex items-center gap-4">
        <div className="flex-1">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Design Progress</span>
                <span>{progress}% Ready</span>
            </div>
            <Progress value={progress} className="h-1.5 bg-slate-800" indicatorClassName="bg-blue-500" />
        </div>
        <div className="flex text-xs text-slate-500 gap-4 hidden md:flex">
            <span className={progress >= 20 ? "text-blue-400" : ""}>1. Well Setup</span>
            <span className={progress >= 40 ? "text-blue-400" : ""}>2. Reservoir</span>
            <span className={progress >= 60 ? "text-blue-400" : ""}>3. Production</span>
            <span className={progress >= 80 ? "text-blue-400" : ""}>4. Selection</span>
            <span className={progress >= 100 ? "text-blue-400" : ""}>5. Design</span>
        </div>
    </div>
  );
};

export default ProgressIndicator;