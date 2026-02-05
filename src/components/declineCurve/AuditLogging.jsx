import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShieldAlert, Search, Download, Filter, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AuditLogging = () => {
    // Mock Audit Data
    const [logs] = useState([
        { id: 'LOG-001', timestamp: '2023-10-25 14:30:22', user: 'admin@petrolord.com', action: 'EXPORT_DATA', resource: 'Project_Alpha_Forecast.csv', status: 'SUCCESS', ip: '192.168.1.5' },
        { id: 'LOG-002', timestamp: '2023-10-25 14:15:00', user: 'user1@company.com', action: 'DELETE_SCENARIO', resource: 'Scenario_Old_V1', status: 'SUCCESS', ip: '10.0.0.24' },
        { id: 'LOG-003', timestamp: '2023-10-25 13:45:12', user: 'user1@company.com', action: 'LOGIN_ATTEMPT', resource: 'System', status: 'FAILED', ip: '10.0.0.24' },
        { id: 'LOG-004', timestamp: '2023-10-25 10:20:55', user: 'manager@petrolord.com', action: 'UPDATE_PERMISSIONS', resource: 'Project_Alpha', status: 'SUCCESS', ip: '192.168.1.8' },
        { id: 'LOG-005', timestamp: '2023-10-24 16:10:30', user: 'system', action: 'BATCH_PROCESS', resource: 'Wells_Group_B', status: 'SUCCESS', ip: 'localhost' },
    ]);

    const [filter, setFilter] = useState('');

    const filteredLogs = logs.filter(l => 
        l.user.toLowerCase().includes(filter.toLowerCase()) || 
        l.action.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col space-y-4">
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="py-3 px-4 border-b border-slate-800 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-purple-400" /> Compliance & Audit Logs
                    </CardTitle>
                    <div className="flex gap-2">
                         <Button variant="outline" size="sm" className="h-8 border-slate-700 bg-slate-900 hover:bg-slate-800">
                            <FileText className="w-3 h-3 mr-2" /> Generate Report
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 border-slate-700 bg-slate-900 hover:bg-slate-800">
                            <Download className="w-3 h-3 mr-2" /> Export CSV
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    {/* Filters */}
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                            <Input 
                                placeholder="Search logs by user or action..." 
                                className="pl-9 bg-slate-950 border-slate-700"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            />
                        </div>
                        <Select defaultValue="all">
                            <SelectTrigger className="w-[150px] bg-slate-950 border-slate-700"><SelectValue placeholder="Action Type"/></SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                                <SelectItem value="all">All Actions</SelectItem>
                                <SelectItem value="access">Access Control</SelectItem>
                                <SelectItem value="data">Data Modification</SelectItem>
                                <SelectItem value="system">System Events</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon" className="border-slate-700 bg-slate-950">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Logs Table */}
                    <div className="border border-slate-800 rounded-md overflow-hidden bg-slate-950">
                        <div className="grid grid-cols-12 gap-2 p-3 bg-slate-900 text-xs font-semibold text-slate-400 border-b border-slate-800">
                            <div className="col-span-2">Timestamp</div>
                            <div className="col-span-3">User</div>
                            <div className="col-span-2">Action</div>
                            <div className="col-span-3">Resource</div>
                            <div className="col-span-1">Status</div>
                            <div className="col-span-1">IP</div>
                        </div>
                        <ScrollArea className="h-[400px]">
                            <div className="divide-y divide-slate-800">
                                {filteredLogs.map(log => (
                                    <div key={log.id} className="grid grid-cols-12 gap-2 p-3 text-xs hover:bg-slate-900/50 transition-colors">
                                        <div className="col-span-2 text-slate-500 font-mono">{log.timestamp}</div>
                                        <div className="col-span-3 text-slate-300 truncate" title={log.user}>{log.user}</div>
                                        <div className="col-span-2 text-slate-200 font-medium">{log.action}</div>
                                        <div className="col-span-3 text-slate-400 truncate" title={log.resource}>{log.resource}</div>
                                        <div className="col-span-1">
                                            <Badge variant="outline" className={`text-[10px] h-5 px-1 ${log.status === 'SUCCESS' ? 'border-green-500/50 text-green-500' : 'border-red-500/50 text-red-500'}`}>
                                                {log.status}
                                            </Badge>
                                        </div>
                                        <div className="col-span-1 text-slate-600 font-mono">{log.ip}</div>
                                    </div>
                                ))}
                                {filteredLogs.length === 0 && (
                                    <div className="p-8 text-center text-slate-500 text-sm">
                                        No logs found matching criteria.
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AuditLogging;