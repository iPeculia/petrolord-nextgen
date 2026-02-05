import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { formatNumber } from '../../utils/calculationUtils';

const SectionDetailsTable = ({ sections }) => {
    return (
        <div className="border border-slate-700 rounded-lg overflow-hidden bg-[#1E293B]">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-900 border-slate-700 hover:bg-slate-900">
                        <TableHead className="text-slate-400 font-medium">Seq</TableHead>
                        <TableHead className="text-slate-400 font-medium">Interval (ft)</TableHead>
                        <TableHead className="text-slate-400 font-medium">Length (ft)</TableHead>
                        <TableHead className="text-slate-400 font-medium">Weight (ppf)</TableHead>
                        <TableHead className="text-slate-400 font-medium">Total Wt (klb)</TableHead>
                        <TableHead className="text-slate-400 font-medium">Grade</TableHead>
                        <TableHead className="text-slate-400 font-medium">Connection</TableHead>
                        <TableHead className="text-right text-slate-400 font-medium">Burst (psi)</TableHead>
                        <TableHead className="text-right text-slate-400 font-medium">Collapse (psi)</TableHead>
                        <TableHead className="text-right text-slate-400 font-medium">Tensile (kips)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sections.map((section, index) => {
                        const length = section.bottom_depth - section.top_depth;
                        const totalWeight = (length * section.weight) / 1000;
                        
                        return (
                            <TableRow key={section.id || index} className="border-slate-800 hover:bg-slate-800/50">
                                <TableCell className="text-slate-500 font-mono">{index + 1}</TableCell>
                                <TableCell className="text-slate-200 font-medium">
                                    {formatNumber(section.top_depth, 0)} - {formatNumber(section.bottom_depth, 0)}
                                </TableCell>
                                <TableCell className="text-slate-300">{formatNumber(length, 0)}</TableCell>
                                <TableCell className="text-slate-300">{section.weight}</TableCell>
                                <TableCell className="text-slate-300 font-mono">{formatNumber(totalWeight, 1)}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/5">
                                        {section.grade}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-slate-400 text-sm">{section.connection_type}</TableCell>
                                <TableCell className="text-right text-slate-300 font-mono">{formatNumber(section.burst_rating, 0)}</TableCell>
                                <TableCell className="text-right text-slate-300 font-mono">{formatNumber(section.collapse_rating, 0)}</TableCell>
                                <TableCell className="text-right text-slate-300 font-mono">{formatNumber(section.tensile_strength, 0)}</TableCell>
                            </TableRow>
                        );
                    })}
                    {sections.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={10} className="text-center py-8 text-slate-500">
                                No sections found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default SectionDetailsTable;