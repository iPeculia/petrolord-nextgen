import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Printer, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const ChartToolbar = () => {
  const handleNotImplemented = () => {
    toast({
      title: '🚧 This feature isn\'t implemented yet—but don\'t worry! You can request it in your next prompt! 🚀',
    });
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-md border border-slate-700">
      <Button variant="ghost" size="icon" onClick={handleNotImplemented}><Download className="w-4 h-4" /></Button>
      <Button variant="ghost" size="icon" onClick={handleNotImplemented}><Printer className="w-4 h-4" /></Button>
      <Button variant="ghost" size="icon" onClick={handleNotImplemented}><ZoomIn className="w-4 h-4" /></Button>
      <Button variant="ghost" size="icon" onClick={handleNotImplemented}><ZoomOut className="w-4 h-4" /></Button>
      <Button variant="ghost" size="icon" onClick={handleNotImplemented}><Maximize className="w-4 h-4" /></Button>
    </div>
  );
};

export default ChartToolbar;