import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw, Download, Maximize, MoveVertical } from 'lucide-react';
import { useLogViewer } from '@/modules/geoscience/petrophysical-analysis/context/LogViewerContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const LogControls = ({ onExport }) => {
  const { zoom, handleZoomIn, handleZoomOut, handleResetView } = useLogViewer();

  return (
    <div className="flex items-center gap-2 p-2 bg-slate-900 border-b border-slate-800 shrink-0">
      <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom Out</TooltipContent>
          </Tooltip>

          <div className="px-2 min-w-[60px] text-center text-xs font-mono text-slate-300">
             {Math.round(zoom * 100)}%
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom In</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="h-6 w-px bg-slate-700 mx-1" />

      <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleResetView}>
                    <RotateCcw className="w-4 h-4" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>Reset View</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex-1" />

      <Button variant="outline" size="sm" className="h-8 gap-2 border-slate-700" onClick={onExport}>
        <Download className="w-3.5 h-3.5" />
        Export Plot
      </Button>
    </div>
  );
};

export default LogControls;