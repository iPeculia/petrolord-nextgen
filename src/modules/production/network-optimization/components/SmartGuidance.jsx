import React from 'react';
import { useNetworkOptimization } from '@/context/NetworkOptimizationContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SmartGuidance = () => {
  const { currentNetwork, nodes, pipelines, facilities, setCurrentTab } = useNetworkOptimization();

  // Determine guidance step
  let step = {
      title: 'Get Started',
      description: 'Create or select a network to begin modeling.',
      action: 'Networks',
      actionLabel: 'Go to Networks'
  };

  if (currentNetwork) {
      if (nodes.length === 0) {
          step = {
              title: 'Add Nodes',
              description: 'Your network is empty. Start by adding wells, junctions, or separators.',
              action: 'Nodes',
              actionLabel: 'Add Nodes'
          };
      } else if (nodes.length < 2) {
           step = {
              title: 'Expand Network',
              description: 'Add more nodes to create a meaningful topology.',
              action: 'Nodes',
              actionLabel: 'Add Nodes'
          };
      } else if (pipelines.length === 0) {
           step = {
              title: 'Connect Nodes',
              description: 'Use pipelines to connect your nodes and define flow paths.',
              action: 'Pipelines',
              actionLabel: 'Add Pipelines'
          };
      } else if (facilities.length === 0) {
           step = {
              title: 'Add Facilities',
              description: 'Define processing equipment like separators or compressors.',
              action: 'Facilities',
              actionLabel: 'Add Facilities'
          };
      } else {
           step = {
              title: 'Ready to Optimize',
              description: 'Your network topology looks good. You can now define optimization scenarios.',
              action: 'Optimization',
              actionLabel: 'Go to Optimization'
          };
      }
  }

  return (
    <div className="w-full px-4 mb-4">
        <Alert className="bg-indigo-950/30 border-indigo-900/50 flex items-start">
            <Lightbulb className="h-5 w-5 text-indigo-400 mt-0.5" />
            <div className="flex-1 ml-4">
                <AlertTitle className="text-indigo-300 mb-1">{step.title}</AlertTitle>
                <AlertDescription className="text-slate-400 text-sm flex justify-between items-center">
                    <span>{step.description}</span>
                    <Button 
                        variant="link" 
                        size="sm" 
                        className="text-indigo-400 hover:text-indigo-300 p-0 h-auto"
                        onClick={() => setCurrentTab(step.action)}
                    >
                        {step.actionLabel} <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                </AlertDescription>
            </div>
        </Alert>
    </div>
  );
};

export default SmartGuidance;