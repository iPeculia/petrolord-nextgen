import React from 'react';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const FormTooltip = ({ content }) => {
  if (!content) return null;
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <HelpCircle className="w-4 h-4 text-slate-500 cursor-help hover:text-blue-400 transition-colors" />
        </TooltipTrigger>
        <TooltipContent className="bg-slate-900 border-slate-700 text-slate-200 max-w-xs">
          <p className="text-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FormTooltip;