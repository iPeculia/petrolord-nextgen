import React from 'react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

const TutorialOverlay = () => {
  const handleNotImplemented = () => {
    toast({
      title: '🚧 This feature isn\'t implemented yet—but don\'t worry! You can request it in your next prompt! 🚀',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg text-white">
        <h2 className="text-xl font-bold mb-4">Tutorial Overlay</h2>
        <p className="mb-4">This tutorial will guide you through the application.</p>
        <Button onClick={handleNotImplemented}>Start Tutorial</Button>
      </div>
    </div>
  );
};

export default TutorialOverlay;