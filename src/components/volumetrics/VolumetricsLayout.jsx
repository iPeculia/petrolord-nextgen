import React from 'react';
import { useVolumetrics } from '@/hooks/useVolumetrics';
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, LayoutPanelTop, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const VolumetricsLayout = ({ children, leftPanel, rightPanel, bottomPanel }) => {
  const { state, actions } = useVolumetrics();
  const { leftPanelCollapsed, rightPanelCollapsed, bottomPanelCollapsed } = state.ui;

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#0F172A] relative">
      
      {/* Left Sidebar */}
      <div 
        className={cn(
          "flex flex-col border-r border-slate-800 bg-slate-950 transition-all duration-300 ease-in-out",
          leftPanelCollapsed ? "w-[40px]" : "w-64"
        )}
      >
        <div className="h-12 flex items-center justify-between px-2 border-b border-slate-800 bg-slate-900/50">
           {!leftPanelCollapsed && <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Inputs</span>}
           <Button 
             variant="ghost" 
             size="icon" 
             className="h-8 w-8 ml-auto text-slate-400 hover:text-white" 
             onClick={() => actions.togglePanel('leftPanelCollapsed')}
           >
             {leftPanelCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
           </Button>
        </div>
        <div className={cn("flex-1 overflow-y-auto p-2", leftPanelCollapsed && "hidden")}>
          {leftPanel}
        </div>
      </div>

      {/* Center Content & Bottom Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Main Workspace */}
        <main className="flex-1 relative overflow-hidden bg-slate-900/20">
          {children}
        </main>

        {/* Bottom Panel */}
        <div 
            className={cn(
                "border-t border-slate-800 bg-slate-950 transition-all duration-300 ease-in-out flex flex-col",
                bottomPanelCollapsed ? "h-[32px]" : "h-48"
            )}
        >
             <div className="h-8 flex items-center justify-between px-2 border-b border-slate-800 bg-slate-900/50 select-none" onClick={() => actions.togglePanel('bottomPanelCollapsed')}>
                <div className="flex items-center gap-2">
                    <LayoutPanelTop size={14} className="text-slate-400"/>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Logs & Messages</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white">
                    {bottomPanelCollapsed ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
                </Button>
             </div>
             <div className={cn("flex-1 overflow-y-auto p-2", bottomPanelCollapsed && "hidden")}>
                {bottomPanel}
             </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div 
        className={cn(
          "flex flex-col border-l border-slate-800 bg-slate-950 transition-all duration-300 ease-in-out",
          rightPanelCollapsed ? "w-[40px]" : "w-72"
        )}
      >
        <div className="h-12 flex items-center justify-between px-2 border-b border-slate-800 bg-slate-900/50">
           <Button 
             variant="ghost" 
             size="icon" 
             className="h-8 w-8 mr-auto text-slate-400 hover:text-white" 
             onClick={() => actions.togglePanel('rightPanelCollapsed')}
           >
             {rightPanelCollapsed ? <PanelRightOpen size={16} /> : <PanelRightClose size={16} />}
           </Button>
           {!rightPanelCollapsed && <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Properties</span>}
        </div>
        <div className={cn("flex-1 overflow-y-auto p-2", rightPanelCollapsed && "hidden")}>
          {rightPanel}
        </div>
      </div>

    </div>
  );
};

export default VolumetricsLayout;