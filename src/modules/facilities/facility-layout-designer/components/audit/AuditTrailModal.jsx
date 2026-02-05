import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, User } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { format } from 'date-fns';

const AuditTrailModal = ({ isOpen, onClose, layoutId }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        if (isOpen && layoutId) {
            fetchLogs();
        }
    }, [isOpen, layoutId]);

    const fetchLogs = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('facility_layout_audit_log')
            .select(`
                *,
                profiles:user_id (display_name, email)
            `)
            .eq('layout_id', layoutId)
            .order('created_at', { ascending: false })
            .limit(100);

        if (!error) {
            setLogs(data || []);
        }
        setLoading(false);
    };

    const filteredLogs = logs.filter(log => 
        log.action.toLowerCase().includes(filter.toLowerCase()) ||
        log.profiles?.display_name?.toLowerCase().includes(filter.toLowerCase())
    );

    const getActionColor = (action) => {
        if (action.includes('CREATE')) return 'bg-green-500/20 text-green-400';
        if (action.includes('DELETE')) return 'bg-red-500/20 text-red-400';
        if (action.includes('UPDATE')) return 'bg-blue-500/20 text-blue-400';
        if (action.includes('STATUS')) return 'bg-purple-500/20 text-purple-400';
        return 'bg-slate-500/20 text-slate-400';
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#1a1a1a] border-slate-700 text-white max-w-4xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Audit Trail</DialogTitle>
                </DialogHeader>

                <div className="flex items-center gap-2 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <Input 
                            placeholder="Filter by action or user..." 
                            className="pl-9 bg-slate-900 border-slate-700"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-auto border rounded-md border-slate-800">
                    <Table>
                        <TableHeader className="bg-slate-900 sticky top-0">
                            <TableRow className="border-slate-800 hover:bg-slate-900">
                                <TableHead className="text-slate-400 w-[180px]">Timestamp</TableHead>
                                <TableHead className="text-slate-400 w-[150px]">User</TableHead>
                                <TableHead className="text-slate-400 w-[150px]">Action</TableHead>
                                <TableHead className="text-slate-400">Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredLogs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                                        No audit records found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredLogs.map((log) => (
                                    <TableRow key={log.id} className="border-slate-800 hover:bg-slate-800/30">
                                        <TableCell className="text-xs text-slate-400 font-mono">
                                            {format(new Date(log.created_at), 'MMM d, HH:mm:ss')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px]">
                                                    {log.profiles?.display_name?.[0] || <User className="w-3 h-3"/>}
                                                </div>
                                                <span className="text-xs">{log.profiles?.display_name || 'System'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`text-[10px] border-0 ${getActionColor(log.action)}`}>
                                                {log.action}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-400 font-mono">
                                            {JSON.stringify(log.details)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AuditTrailModal;