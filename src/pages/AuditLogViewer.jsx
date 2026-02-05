import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useRole } from '@/contexts/RoleContext';
import { Navigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Search, Shield } from 'lucide-react';

const AuditLogViewer = () => {
    const { isViewAsSuperAdmin } = useRole();
    const [searchTerm, setSearchTerm] = useState('');

    if (!isViewAsSuperAdmin) return <Navigate to="/dashboard" replace />;

    // Mock data for display - real app connects to edge function
    const logs = [
        { id: 1, action: 'user.create', actor: 'admin@petrolord.com', resource: 'User: 123', timestamp: new Date().toISOString(), status: 'success' },
        { id: 2, action: 'import.bulk', actor: 'system', resource: 'Import: #982', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'success' },
        { id: 3, action: 'settings.update', actor: 'admin@petrolord.com', resource: 'Email Config', timestamp: new Date(Date.now() - 7200000).toISOString(), status: 'failure' },
    ];

    return (
        <div className="p-6 md:p-12 space-y-6 max-w-7xl mx-auto">
             <Helmet><title>Audit Logs | Petrolord</title></Helmet>
             
             <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        <Shield className="w-8 h-8 text-[#BFFF00]" /> Audit Logs
                    </h1>
                    <p className="text-slate-400">Security and action trail for compliance.</p>
                </div>
                <Button variant="outline" className="border-slate-700">
                    <Download className="w-4 h-4 mr-2" /> Export CSV
                </Button>
             </div>

             <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <Input 
                        placeholder="Search logs..." 
                        className="pl-9 bg-[#1E293B] border-slate-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
             </div>

             <div className="bg-[#1E293B] border border-slate-800 rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#0F172A]">
                        <TableRow>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Actor</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Resource</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map(log => (
                            <TableRow key={log.id} className="hover:bg-slate-800/50">
                                <TableCell className="text-slate-400 font-mono text-xs">
                                    {new Date(log.timestamp).toLocaleString()}
                                </TableCell>
                                <TableCell className="text-slate-300">{log.actor}</TableCell>
                                <TableCell><Badge variant="outline">{log.action}</Badge></TableCell>
                                <TableCell className="text-slate-400">{log.resource}</TableCell>
                                <TableCell>
                                    <Badge className={log.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}>
                                        {log.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
             </div>
        </div>
    );
};

export default AuditLogViewer;