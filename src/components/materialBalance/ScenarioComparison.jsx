import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const ScenarioComparison = () => {
    // Mock scenarios
    const scenarios = [
        { id: 1, name: 'Base Case', constraints: 'Rate: 5000 stb/d', np: 1.25, rf: 12.5, economicLimit: 45 },
        { id: 2, name: 'Optimistic (Infill)', constraints: 'Rate: 7500 stb/d', np: 1.45, rf: 14.5, economicLimit: 38 },
        { id: 3, name: 'Pressure Support', constraints: 'Inj: 4000 bwi/d', np: 1.65, rf: 16.5, economicLimit: 65 },
    ];

    return (
        <Card className="bg-slate-900 border-slate-800 mt-4">
            <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                    <span>Scenario Comparison Table</span>
                    <Badge variant="outline" className="text-[#BFFF00] border-[#BFFF00]">3 Scenarios</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-800 hover:bg-transparent">
                            <TableHead className="text-slate-400">Scenario Name</TableHead>
                            <TableHead className="text-slate-400">Constraints</TableHead>
                            <TableHead className="text-slate-400 text-right">Cum. Prod (MMstb)</TableHead>
                            <TableHead className="text-slate-400 text-right">Recovery Factor (%)</TableHead>
                            <TableHead className="text-slate-400 text-right">Econ. Limit (Months)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {scenarios.map((s) => (
                            <TableRow key={s.id} className="border-slate-800 hover:bg-slate-800/50">
                                <TableCell className="font-medium text-white">{s.name}</TableCell>
                                <TableCell className="text-slate-400 text-xs">{s.constraints}</TableCell>
                                <TableCell className="text-right text-[#BFFF00] font-mono">{s.np.toFixed(2)}</TableCell>
                                <TableCell className="text-right text-white font-mono">{s.rf.toFixed(1)}%</TableCell>
                                <TableCell className="text-right text-slate-300 font-mono">{s.economicLimit}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default ScenarioComparison;