import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import SampleModelSelector from '../SampleModelSelector.jsx';

const SampleModelsTab = () => {
  return (
    <ScrollArea className="h-full">
      <div className="max-w-6xl mx-auto py-8">
        <div className="px-6 mb-4">
            <h2 className="text-2xl font-bold text-slate-200">Sample Model Library</h2>
            <p className="text-slate-500">Select a pre-configured reservoir model to begin simulation.</p>
        </div>
        <SampleModelSelector />
      </div>
    </ScrollArea>
  );
};

export default SampleModelsTab;