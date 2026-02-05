import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWellCorrelation } from '@/contexts/WellCorrelationContext';
import { Info, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const ActivityLog = () => {
    const { state } = useWellCorrelation();
    const logs = state.importHistory || []; // Using importHistory as activity log source for demo

    // Mock initial log if empty
    const displayLogs = logs.length > 0 ? logs : [
        { id: 'init', date: new Date().toISOString(), status: 'Success', wellName: 'System initialized. Ready for operations.' }
    ];

    return (
        <ScrollArea className="h-full w-full bg-[#020617] p-2">
            <div className="space-y-1">
                {displayLogs.map((log, idx) => (
                    <div key={log.id || idx} className="flex items-center gap-3 p-2 rounded hover:bg-slate-900/50 text-xs border border-transparent hover:border-slate-800 transition-colors">
                        <span className="text-slate-500 font-mono text-[10px] shrink-0 flex items-center gap-1">
                            <Clock size={10} />
                            {new Date(log.date).toLocaleTimeString()}
                        </span>
                        
                        <div className="shrink-0">
                            {log.status === 'Success' ? <CheckCircle size={12} className="text-[#CCFF00]" /> :
                             log.status === 'Error' ? <AlertTriangle size={12} className="text-red-500" /> :
                             <Info size={12} className="text-blue-400" />}
                        </div>

                        <span className="text-slate-300 font-medium">
                            {log.wellName}
                        </span>
                    </div>
                ))}
                 {displayLogs.length === 1 && (
                     <div className="px-2 py-1 text-[10px] text-slate-600 italic">No recent activity recorded.</div>
                 )}
            </div>
        </ScrollArea>
    );
};

export default ActivityLog;