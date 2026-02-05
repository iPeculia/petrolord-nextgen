import React from 'react';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { TerminalSquare, Trash2, AlertCircle, Info, AlertTriangle, PanelBottomClose } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const MBBottomPanel = () => {
  const { calculationLog, clearLog, ui, toggleBottomPanel } = useMaterialBalance();
  
  // Safe check for UI state
  const isOpen = ui?.bottomPanelOpen ?? true;
  const panelHeight = isOpen ? 'h-48' : 'h-0';
  const panelOpacity = isOpen ? 'opacity-100' : 'opacity-0';

  return (
    <div className={`${panelHeight} bg-slate-950 border-t border-slate-800 flex flex-col transition-all duration-300 ease-in-out flex-shrink-0 relative`}>
      {/* Collapse Toggle - Positioned Absolute Top Right */}
      <div className={`absolute top-2 right-2 z-10 ${!isOpen ? 'hidden' : ''}`}>
           <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 text-slate-500 hover:text-white hover:bg-slate-800"
            onClick={toggleBottomPanel}
            title="Collapse Console"
          >
              <PanelBottomClose className="h-4 w-4" />
          </Button>
      </div>

      <div className={`${panelOpacity} transition-opacity duration-300 flex flex-col h-full overflow-hidden`}>
          
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-1.5 border-b border-slate-800 bg-slate-900 pr-10">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center">
              <TerminalSquare className="mr-2 h-3.5 w-3.5 text-[#BFFF00]" /> System Console
            </h2>
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearLog} 
                className="h-6 px-2 text-[10px] text-slate-500 hover:text-red-400 hover:bg-slate-800"
            >
                <Trash2 className="mr-1.5 h-3 w-3" /> Clear Output
            </Button>
          </div>

          {/* Log Content */}
          <ScrollArea className="flex-1 bg-slate-950 font-mono text-xs">
            {calculationLog.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-700 py-8">
                  <TerminalSquare className="h-8 w-8 mb-2 opacity-20" />
                  <span className="text-[10px] uppercase tracking-widest opacity-50">Console Ready</span>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {calculationLog.map((log, index) => (
                  <div key={index} className="flex items-start hover:bg-slate-900/50 rounded p-1 transition-colors">
                    <span className="text-slate-600 mr-3 flex-shrink-0 select-none">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
                    </span> 
                    
                    {log.type === 'error' && <AlertCircle className="w-3.5 h-3.5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />}
                    {log.type === 'warn' && <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />}
                    {log.type === 'info' && <Info className="w-3.5 h-3.5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />}
                    
                    <span className={`break-all ${
                        log.type === 'error' ? 'text-red-400' : 
                        log.type === 'warn' ? 'text-yellow-400' : 
                        'text-slate-300'
                    }`}>
                        {log.message}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
      </div>
    </div>
  );
};

export default MBBottomPanel;