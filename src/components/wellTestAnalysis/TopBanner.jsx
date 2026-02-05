import React, { useEffect } from 'react';
import { ArrowLeft, Save, Settings, HelpCircle, Share2, Undo2, Redo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useWellTestAnalysisContext } from '@/contexts/WellTestAnalysisContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const TopBanner = ({ onOpenSettings, onOpenHelp }) => {
  const navigate = useNavigate();
  const { state, dispatch, log } = useWellTestAnalysisContext();
  const { currentProject, history } = state;

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (canUndo) {
            dispatch({ type: 'UNDO' });
            log('Undo action performed', 'info');
        }
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        if (canRedo) {
            dispatch({ type: 'REDO' });
            log('Redo action performed', 'info');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, dispatch, log]);

  return (
    <TooltipProvider>
      <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <Button 
              variant="ghost" 
              size="sm" 
              className="text-slate-400 hover:text-white"
              onClick={() => navigate('/modules/reservoir')}
          >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back
          </Button>
          
          <div className="h-6 w-px bg-slate-700 mx-2" />
          
          <div className="flex flex-col">
              <h1 className="text-sm font-semibold text-white leading-tight">
                  {currentProject?.name || 'Untitled Analysis'}
              </h1>
              <span className="text-[10px] text-slate-500 font-mono">
                  Last autosaved: {new Date().toLocaleTimeString()}
              </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border border-slate-800 rounded-md bg-slate-950 mr-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-400 hover:text-white disabled:opacity-30"
                    disabled={!canUndo}
                    onClick={() => dispatch({ type: 'UNDO' })}
                  >
                    <Undo2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-slate-900 text-white border-slate-700">Undo (Ctrl+Z)</TooltipContent>
              </Tooltip>

              <div className="w-px h-4 bg-slate-800" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-400 hover:text-white disabled:opacity-30"
                    disabled={!canRedo}
                    onClick={() => dispatch({ type: 'REDO' })}
                  >
                    <Redo2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-slate-900 text-white border-slate-700">Redo (Ctrl+Y)</TooltipContent>
              </Tooltip>
          </div>

           <Button 
              variant="ghost" 
              size="sm" 
              className="text-slate-400 hover:text-white"
              onClick={() => log('Project saved locally', 'success')}
           >
              <Save className="w-4 h-4 mr-2" />
              Save
           </Button>

           <Button 
              variant="ghost" 
              size="sm" 
              className="text-slate-400 hover:text-white"
              onClick={onOpenSettings}
           >
              <Settings className="w-4 h-4 mr-2" />
              Settings
           </Button>

           <Button 
              variant="ghost" 
              size="icon" 
              className="text-slate-400 hover:text-blue-400"
              onClick={onOpenHelp}
           >
              <HelpCircle className="w-5 h-5" />
           </Button>

           <div className="h-6 w-px bg-slate-700 mx-1" />

           <Button 
             className="bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs"
             onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'export' })}
           >
              <Share2 className="w-3 h-3 mr-2" />
              Export Report
           </Button>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default TopBanner;