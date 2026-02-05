import React, { useRef, useEffect } from 'react';
import { useVolumetrics } from '@/hooks/useVolumetrics';
import { Trash2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const BottomPanel = () => {
  const { state, actions } = useVolumetrics();
  const scrollRef = useRef(null);

  useEffect(() => {
      if(scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
  }, [state.logs]);

  const getIcon = (level) => {
    switch (level) {
        case 'error': return <AlertCircle size={14} className="text-red-500" />;
        case 'warning': return <AlertTriangle size={14} className="text-yellow-500" />;
        default: return <Info size={14} className="text-blue-500" />;
    }
  };

  const getColor = (level) => {
    switch (level) {
        case 'error': return "text-red-400";
        case 'warning': return "text-yellow-400";
        default: return "text-slate-300";
    }
  };

  return (
    <div className="flex flex-col h-full">
        <div className="flex justify-end mb-2 px-2">
            <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs text-slate-500 hover:text-red-400"
                onClick={actions.clearLogs}
            >
                <Trash2 size={12} className="mr-1" /> Clear Logs
            </Button>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto font-mono text-xs space-y-1 p-2 bg-slate-950 rounded border border-slate-900">
            {state.logs.length === 0 && (
                <div className="text-slate-600 italic text-center py-4">No logs to display</div>
            )}
            {state.logs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 py-0.5 border-b border-slate-900/50 last:border-0">
                    <span className="text-slate-600 shrink-0">[{log.timestamp.toLocaleTimeString()}]</span>
                    <span className="shrink-0 mt-0.5">{getIcon(log.level)}</span>
                    <span className={cn("break-all", getColor(log.level))}>{log.message}</span>
                </div>
            ))}
        </div>
    </div>
  );
};

export default BottomPanel;