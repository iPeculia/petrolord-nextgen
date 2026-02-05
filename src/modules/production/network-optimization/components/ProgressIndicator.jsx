import React from 'react';
import { useNetworkOptimization } from '@/context/NetworkOptimizationContext';
import { Progress } from '@/components/ui/progress';

const ProgressIndicator = () => {
  const { currentNetwork, nodes, pipelines, facilities } = useNetworkOptimization();

  // Simple progress logic
  let progress = 0;
  let status = 'Start';

  if (currentNetwork) {
      progress += 20; // Network created
      status = 'Network Defined';
      
      if (nodes.length > 0) {
          progress += 20;
          status = 'Nodes Added';
      }
      if (pipelines.length > 0) {
          progress += 20;
          status = 'Connected';
      }
      if (facilities.length > 0) {
          progress += 20;
          status = 'Facilities Added';
      }
      if (nodes.length > 2 && pipelines.length > 1) {
          progress += 20; // Readyish
          status = 'Ready to Optimize';
      }
  }

  return (
    <div className="w-full max-w-xs mx-auto mb-4 px-2">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Progress: {status}</span>
            <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-1 bg-slate-800" />
    </div>
  );
};

export default ProgressIndicator;