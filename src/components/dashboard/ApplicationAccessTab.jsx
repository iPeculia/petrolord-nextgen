import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search, Lock, ShieldCheck } from 'lucide-react';
import { UniversityAdminService } from '@/services/universityAdminService';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const ApplicationAccessTab = ({ universityId }) => {
    const [records, setRecords] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (universityId) {
            setLoading(true);
            UniversityAdminService.getApplicationAccessRecords(universityId)
                .then(setRecords)
                .finally(() => setLoading(false));
        }
    }, [universityId]);

    const filteredRecords = records.filter(r => 
        r.profiles?.display_name?.toLowerCase().includes(search.toLowerCase()) || 
        r.applications?.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-4">
             <div className="flex justify-between items-center bg-[#1E293B] p-4 rounded-lg border border-slate-800">
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input 
                        placeholder="Search student or app..." 
                        className="pl-9 bg-[#0F172A] border-slate-700 text-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                 <div className="flex items-center gap-2 text-sm text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Active Grants: {filteredRecords.filter(r => r.is_active).length}
                </div>
            </div>

            <Card className="bg-[#1E293B] border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Lock className="w-5 h-5 text-blue-400" /> Application Access Registry
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader className="bg-[#0F172A]">
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead>Student Name</TableHead>
                                <TableHead>Application</TableHead>
                                <TableHead>Granted On</TableHead>
                                <TableHead>Expires On</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRecords.map(record => (
                                <TableRow key={record.id} className="border-slate-800 hover:bg-slate-800/50">
                                    <TableCell className="font-medium text-slate-200">
                                        {record.profiles?.display_name || 'Unknown User'}
                                        <div className="text-xs text-slate-500">{record.profiles?.email}</div>
                                    </TableCell>
                                    <TableCell className="text-slate-300 font-semibold">{record.applications?.name}</TableCell>
                                    <TableCell className="text-slate-400 text-xs font-mono">
                                        {format(new Date(record.access_granted_date), 'MMM d, yyyy')}
                                    </TableCell>
                                    <TableCell className="text-slate-400 text-xs font-mono">
                                        {record.access_expires_date ? format(new Date(record.access_expires_date), 'MMM d, yyyy') : 'Indefinite'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={record.is_active ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' : 'border-red-500/50 text-red-400 bg-red-500/10'}>
                                            {record.is_active ? 'Active' : 'Revoked'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredRecords.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                        No access records found matching your search.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default ApplicationAccessTab;