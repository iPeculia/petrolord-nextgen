import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';
import { useDesigns } from '@/hooks/useCasingDesign';
import { compareDesigns, getComparisonStatus } from '@/utils/comparison/comparisonUtils';
import { formatNumber } from '@/components/casing-design/utils/calculationUtils';
import { supabase } from '@/lib/customSupabaseClient';

const ComparisonToolModal = ({ isOpen, onClose, currentDesign, currentSections }) => {
    const { designs } = useDesigns();
    const [selectedDesignId, setSelectedDesignId] = useState('');
    const [comparisonData, setComparisonData] = useState(null);
    const [compSections, setCompSections] = useState([]);

    useEffect(() => {
        const fetchComparisonSections = async () => {
            if (!selectedDesignId) {
                setComparisonData(null);
                setCompSections([]);
                return;
            }

            const designB = designs.find(d => d.id === selectedDesignId);
            if (!designB) return;

            const { data: sectionsB } = await supabase
                .from('design_sections')
                .select('*')
                .eq('design_id', selectedDesignId);

            setCompSections(sectionsB || []);
            const analysis = compareDesigns(currentDesign, currentSections, designB, sectionsB || []);
            setComparisonData(analysis);
        };

        fetchComparisonSections();
    }, [selectedDesignId, designs, currentDesign, currentSections]);

    const StatusBadge = ({ status }) => {
        if (status === 'better') return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">Better</Badge>;
        if (status === 'worse') return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">Worse</Badge>;
        return <Badge variant="outline" className="text-slate-500">Equal</Badge>;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#0F172A] border-slate-700 text-white sm:max-w-[1000px] h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Design Comparison</DialogTitle>
                </DialogHeader>

                <div className="flex gap-4 items-center p-4 bg-[#1E293B] rounded-lg border border-slate-700">
                    <div className="flex-1">
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Base Design</div>
                        <div className="font-medium text-white">{currentDesign.name}</div>
                    </div>
                    <ArrowRight className="text-slate-500" />
                    <div className="flex-1">
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Compare With</div>
                        <Select value={selectedDesignId} onValueChange={setSelectedDesignId}>
                            <SelectTrigger className="bg-slate-900 border-slate-600">
                                <SelectValue placeholder="Select a design..." />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                {designs.filter(d => d.id !== currentDesign.id).map(d => (
                                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {comparisonData && (
                    <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                                 <div className="text-slate-500 text-sm mb-2">Total Weight</div>
                                 <div className="flex justify-between items-end">
                                     <div className="text-2xl font-bold">{formatNumber(comparisonData.metricsA.totalWeight / 1000, 1)} k</div>
                                     <div className={`text-sm ${comparisonData.diffs.totalWeight < 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                         {comparisonData.diffs.totalWeight > 0 ? '+' : ''}{formatNumber(comparisonData.diffs.totalWeight / 1000, 1)} k
                                     </div>
                                 </div>
                             </div>
                             <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                                 <div className="text-slate-500 text-sm mb-2">Total Depth</div>
                                 <div className="flex justify-between items-end">
                                     <div className="text-2xl font-bold">{formatNumber(comparisonData.metricsA.totalDepth, 0)} ft</div>
                                     <div className="text-sm text-slate-400">
                                         {comparisonData.metricsB.totalDepth} ft (Ref)
                                     </div>
                                 </div>
                             </div>
                             <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                                 <div className="text-slate-500 text-sm mb-2">Section Count</div>
                                 <div className="flex justify-between items-end">
                                     <div className="text-2xl font-bold">{comparisonData.metricsA.sectionCount}</div>
                                     <div className="text-sm text-slate-400">
                                         vs {comparisonData.metricsB.sectionCount}
                                     </div>
                                 </div>
                             </div>
                        </div>

                        {/* Detailed Comparison Table */}
                        <div className="border border-slate-700 rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader className="bg-slate-900">
                                    <TableRow>
                                        <TableHead className="text-slate-300">Parameter</TableHead>
                                        <TableHead className="text-slate-300 font-bold">{currentDesign.name}</TableHead>
                                        <TableHead className="text-slate-300 font-bold text-blue-400">Comparison Target</TableHead>
                                        <TableHead className="text-right text-slate-300">Delta</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow className="border-slate-800">
                                        <TableCell className="text-slate-400">Primary Grade</TableCell>
                                        <TableCell>{comparisonData.metricsA.avgGrade}</TableCell>
                                        <TableCell className="text-blue-200">{comparisonData.metricsB.avgGrade}</TableCell>
                                        <TableCell className="text-right text-slate-500">-</TableCell>
                                    </TableRow>
                                    <TableRow className="border-slate-800">
                                        <TableCell className="text-slate-400">Max Burst Rating (psi)</TableCell>
                                        <TableCell>{Math.max(...currentSections.map(s => s.burst_rating))}</TableCell>
                                        <TableCell className="text-blue-200">{Math.max(...compSections.map(s => s.burst_rating))}</TableCell>
                                        <TableCell className="text-right text-slate-500">-</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}

                {!selectedDesignId && (
                     <div className="flex-1 flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-lg">
                         Select a design above to start comparison
                     </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ComparisonToolModal;