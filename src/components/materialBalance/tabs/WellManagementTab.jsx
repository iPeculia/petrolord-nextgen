import React from 'react';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Activity, Power, AlertCircle } from 'lucide-react';

const WellManagementTab = () => {
    const { wellData } = useMaterialBalance();

    return (
        <div className="space-y-6">
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">Tank Wells</CardTitle>
                </CardHeader>
                <CardContent>
                    {wellData.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">No wells associated with this tank.</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-800 hover:bg-transparent">
                                    <TableHead className="text-slate-400">Well Name</TableHead>
                                    <TableHead className="text-slate-400">Type</TableHead>
                                    <TableHead className="text-slate-400">Status</TableHead>
                                    <TableHead className="text-slate-400">Completion Date</TableHead>
                                    <TableHead className="text-slate-400 text-right">Cum Oil (bbl)</TableHead>
                                    <TableHead className="text-slate-400 text-right">Last Rate (bopd)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {wellData.map((well) => (
                                    <TableRow key={well.id} className="border-slate-800 hover:bg-slate-800/50">
                                        <TableCell className="font-medium text-white">{well.name}</TableCell>
                                        <TableCell className="text-slate-300">{well.type}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={well.status === 'Active' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-red-400 border-red-500/30 bg-red-500/10'}>
                                                {well.status === 'Active' ? <Activity className="w-3 h-3 mr-1" /> : <Power className="w-3 h-3 mr-1" />}
                                                {well.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-400">{well.completionDate}</TableCell>
                                        <TableCell className="text-right font-mono text-slate-300">{well.cumOil.toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-mono text-[#BFFF00]">{well.lastRate}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default WellManagementTab;