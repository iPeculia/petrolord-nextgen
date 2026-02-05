import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Info, AlertTriangle, CheckCircle, Terminal } from 'lucide-react';

const CalculationLog = ({ logs }) => {
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
        // Simple auto-scroll logic if needed
    }
  }, [logs]);

  const getIcon = (type) => {
    switch (type) {
        case 'error': return <AlertTriangle className="w-3 h-3 text-red-500" />;
        case 'warning': return <AlertTriangle className="w-3 h-3 text-yellow-500" />;
        case 'success': return <CheckCircle className="w-3 h-3 text-green-500" />;
        default: return <Info className="w-3 h-3 text-blue-500" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 border-t border-slate-800">
      <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Terminal className="w-3 h-3" />
        SYSTEM CONSOLE
      </div>
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1 font-mono text-xs">
          {logs.length === 0 && <div className="text-slate-600 italic px-2">System ready...</div>}
          {logs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2 text-slate-300 hover:bg-slate-900 p-1 rounded">
              <span className="text-slate-500 shrink-0">
                {format(new Date(log.timestamp), 'HH:mm:ss')}
              </span>
              <span className="mt-0.5 shrink-0">{getIcon(log.type)}</span>
              <span className={log.type === 'error' ? 'text-red-400' : ''}>{log.message}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CalculationLog;