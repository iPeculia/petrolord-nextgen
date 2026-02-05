import React, { useState } from 'react';
import { useWorkflowStore } from '@/store/workflowStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileText, RotateCcw, Filter } from 'lucide-react';

const HistoryView = () => {
    const { executionHistory } = useWorkflowStore();
    const [filter, setFilter] = useState('');

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed': case 'success': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'failed': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'running': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    const filteredHistory = executionHistory.filter(
        item => item.workflowName.toLowerCase().includes(filter.toLowerCase()) || 
                item.executedBy.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="relative w-72">
                    <Search className="absolute left-2 top-2.5 w-4 h-4 text-slate-500" />
                    <Input 
                        placeholder="Search history..." 
                        className="pl-8 bg-slate-900 border-slate-700 text-white"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="bg-slate-900 border-slate-700">
                        <Filter className="w-4 h-4 mr-2" /> Filter
                    </Button>
                    <Button variant="outline" size="sm" className="bg-slate-900 border-slate-700">
                        Export CSV
                    </Button>
                </div>
            </div>

            <div className="border border-slate-800 rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-900">
                        <TableRow className="border-slate-800 hover:bg-slate-900">
                            <TableHead className="text-slate-400">Workflow Name</TableHead>
                            <TableHead className="text-slate-400">Run Date</TableHead>
                            <TableHead className="text-slate-400">Duration</TableHead>
                            <TableHead className="text-slate-400">Status</TableHead>
                            <TableHead className="text-slate-400">User</TableHead>
                            <TableHead className="text-right text-slate-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredHistory.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-32 text-slate-500">No execution history found</TableCell>
                            </TableRow>
                        ) : (
                            filteredHistory.map((item) => (
                                <TableRow key={item.id} className="border-slate-800 hover:bg-slate-900/50">
                                    <TableCell className="font-medium text-slate-200">{item.workflowName}</TableCell>
                                    <TableCell className="text-slate-400">{new Date(item.startTime).toLocaleString()}</TableCell>
                                    <TableCell className="text-slate-400 font-mono text-xs">{item.duration}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={getStatusColor(item.status)}>
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-400 text-sm">{item.executedBy}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white">
                                                <FileText className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-400">
                                                <RotateCcw className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default HistoryView;