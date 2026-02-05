import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { useHelp } from '@/contexts/HelpContext';

/**
 * Wrapper component to add consistent Help Tooltips to any UI element
 */
const ContextualHelpWrapper = ({ children, content, shortcut, topicId, className }) => {
  const { preferences, setIsHelpModalOpen, setActiveCategory } = useHelp();

  if (!preferences.tooltips) return children;

  const handleMoreHelp = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (topicId) {
      setActiveCategory(topicId); // Assuming topicId maps to category or handles navigation
      setIsHelpModalOpen(true);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <div className={`relative inline-block ${className}`}>
             {children}
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-slate-900 border border-slate-700 text-white max-w-[300px] p-3 shadow-xl">
           <div className="flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-[#BFFF00] mt-0.5 shrink-0" />
              <div className="space-y-1">
                 <p className="text-sm font-medium">{content}</p>
                 {shortcut && (
                   <p className="text-xs text-slate-400">Shortcut: <span className="bg-slate-800 px-1 rounded font-mono text-white">{shortcut}</span></p>
                 )}
                 {topicId && (
                    <button 
                      onClick={handleMoreHelp}
                      className="text-xs text-blue-400 hover:text-blue-300 underline mt-1"
                    >
                      Learn more
                    </button>
                 )}
              </div>
           </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ContextualHelpWrapper;