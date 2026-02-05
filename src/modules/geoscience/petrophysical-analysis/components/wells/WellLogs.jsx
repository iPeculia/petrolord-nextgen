import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart2, FileText, ArrowUpDown, Activity, Ruler } from 'lucide-react';

const WellLogs = ({ logs }) => {
    const [viewMode, setViewMode] = useState('summary'); // summary | data

    // Convert logs object to array for easier mapping
    const logsList = useMemo(() => {
        if (!logs) return [];
        return Object.values(logs).map(log => {
            // Calculate stats
            const validValues = log.value_array?.filter(v => v !== null && v !== undefined) || [];
            const min = validValues.length ? Math.min(...validValues) : null;
            const max = validValues.length ? Math.max(...validValues) : null;
            const sum = validValues.reduce((a, b) => a + b, 0);
            const mean = validValues.length ? sum / validValues.length : null;
            const count = validValues.length;

            return {
                ...log,
                stats: { min, max, mean, count }
            };
        });
    }, [logs]);

    if (!logs || logsList.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-40 text-slate-500 bg-slate-900/20 rounded-lg border border-dashed border-slate-800">
                <Activity className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">No log data imported for this well.</p>
                <p className="text-xs mt-1">Import an LAS file to see curves.</p>
            </div>
        );
    }

    // Data Table Preparation
    const depthArray = logsList[0]?.depth_array || [];
    const previewLimit = 100; // Limit rows for performance in simple view
    
    return (
        <div className="space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between px-1">
                <div className="flex gap-2">
                     <Badge variant="outline" className="text-blue-400 border-blue-500/30">
                        {logsList.length} Curves
                     </Badge>
                     <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
                        {depthArray.length.toLocaleString()} Depth Points
                     </Badge>
                </div>
                <Tabs value={viewMode} onValueChange={setViewMode} className="h-8">
                    <TabsList className="h-8 bg-slate-900 border border-slate-800">
                        <TabsTrigger value="summary" className="text-xs h-7 px-3">Summary</TabsTrigger>
                        <TabsTrigger value="data" className="text-xs h-7 px-3">Log Data</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="flex-1 overflow-hidden min-h-[300px] bg-slate-950/50 border border-slate-800 rounded-lg relative">
                {viewMode === 'summary' && (
                    <ScrollArea className="h-full">
                        <div className="p-0">
                             <Table>
                                <TableHeader className="bg-slate-900 sticky top-0">
                                    <TableRow className="border-slate-800 hover:bg-transparent">
                                        <TableHead className="text-xs font-semibold text-slate-400 w-[150px]">Curve Name</TableHead>
                                        <TableHead className="text-xs font-semibold text-slate-400 w-[80px]">Unit</TableHead>
                                        <TableHead className="text-xs font-semibold text-slate-400 text-right">Min</TableHead>
                                        <TableHead className="text-xs font-semibold text-slate-400 text-right">Max</TableHead>
                                        <TableHead className="text-xs font-semibold text-slate-400 text-right">Mean</TableHead>
                                        <TableHead className="text-xs font-semibold text-slate-400 text-right">Count</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logsList.map((log) => (
                                        <TableRow key={log.id || log.log_name} className="border-slate-800/50 hover:bg-slate-900/40">
                                            <TableCell className="font-medium text-slate-200 text-xs">
                                                <div className="flex items-center gap-2">
                                                    <Activity className="w-3 h-3 text-blue-500" />
                                                    {log.log_name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-slate-400 text-xs font-mono">{log.unit || '-'}</TableCell>
                                            <TableCell className="text-right font-mono text-xs text-slate-300">
                                                {log.stats.min !== null ? log.stats.min.toFixed(4) : '-'}
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-xs text-slate-300">
                                                {log.stats.max !== null ? log.stats.max.toFixed(4) : '-'}
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-xs text-slate-300">
                                                {log.stats.mean !== null ? log.stats.mean.toFixed(4) : '-'}
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-xs text-slate-400">
                                                {log.stats.count.toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </ScrollArea>
                )}

                {viewMode === 'data' && (
                     <div className="h-full flex flex-col">
                        <div className="p-2 bg-amber-500/10 border-b border-amber-500/20 text-amber-400 text-xs text-center">
                            Showing first {previewLimit} rows of data
                        </div>
                        <ScrollArea className="flex-1">
                            <Table>
                                <TableHeader className="bg-slate-900 sticky top-0">
                                    <TableRow className="border-slate-800 hover:bg-transparent">
                                        <TableHead className="text-xs font-bold text-blue-400 w-[100px] sticky left-0 bg-slate-900 z-10 border-r border-slate-800">Depth</TableHead>
                                        {logsList.map(log => (
                                            <TableHead key={log.id || log.log_name} className="text-xs font-medium text-slate-400 min-w-[100px] text-right">
                                                <div className="flex flex-col items-end">
                                                    <span>{log.log_name}</span>
                                                    <span className="text-[9px] opacity-70">{log.unit}</span>
                                                </div>
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {depthArray.slice(0, previewLimit).map((depth, idx) => (
                                        <TableRow key={idx} className="border-slate-800/50 hover:bg-slate-900/40">
                                            <TableCell className="font-mono text-xs text-blue-300 font-medium border-r border-slate-800 bg-slate-950/30 sticky left-0">
                                                {depth.toFixed(2)}
                                            </TableCell>
                                            {logsList.map(log => (
                                                <TableCell key={log.id || log.log_name} className="text-right font-mono text-xs text-slate-300">
                                                    {log.value_array[idx] !== null ? log.value_array[idx].toFixed(4) : '-'}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                     </div>
                )}
            </div>
        </div>
    );
};

export default WellLogs;