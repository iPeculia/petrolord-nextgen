import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { 
    calculateHydrostaticPressure, 
    calculateBurstLoad, 
    calculateCollapseLoad, 
    calculateAxialLoad,
    calculateBuoyancyFactor
} from '@/utils/calculations/loadCaseCalculations';
import { verifyBurst, verifyCollapse, verifyTension } from '@/utils/calculations/designVerificationUtils';
import { formatNumber } from '@/components/casing-design/utils/calculationUtils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

const LoadCaseAnalysisPanel = ({ sections }) => {
    const [params, setParams] = useState({
        fluidDensity: 10.0, // ppg
        surfacePressure: 0, // psi
        burstSF: 1.1,
        collapseSF: 1.125,
        tensionSF: 1.6
    });

    const [results, setResults] = useState([]);
    const [summary, setSummary] = useState({ pass: 0, fail: 0, warning: 0 });

    const handleCalculate = () => {
        if (!sections || sections.length === 0) return;

        // Sort sections top to bottom
        const sortedSections = [...sections].sort((a, b) => a.top_depth - b.top_depth);
        const bf = calculateBuoyancyFactor(params.fluidDensity);
        
        let cumulativeWeight = 0;
        // Calculate cumulative weight from bottom up for tension? 
        // Actually tension is highest at top. We need total weight below a point.
        // Let's calculate total string weight first.
        
        // However, axial load is usually calculated at the TOP of each section (where it holds the weight below it + itself)
        // Simplified approach: Calculate load at the top of each section.
        
        // First, let's get total weights per section
        const sectionWeights = sortedSections.map(s => {
            const length = s.bottom_depth - s.top_depth;
            return length * s.weight;
        });

        const calculatedResults = sortedSections.map((section, index) => {
            // Load at bottom of section for Burst/Collapse (worst case typically at max depth of section)
            // But for Collapse, external pressure is highest at bottom.
            // For Burst, internal pressure is highest at top usually for gas, but hydrostatic is highest at bottom.
            // Let's check bottom depth of section for Burst/Collapse max loads.
            
            const depthOfInterest = section.bottom_depth;
            const hydro = calculateHydrostaticPressure(depthOfInterest, params.fluidDensity);
            
            const burstLoad = calculateBurstLoad(hydro, params.surfacePressure);
            const collapseLoad = calculateCollapseLoad(hydro); // Simplified: Assume empty casing for worst case collapse? Or Evacuated? Using hydro as external load.

            // Axial Load: Calculated at the TOP of the section
            // It supports the weight of this section + all sections below it.
            let weightBelow = 0;
            for(let i = index; i < sortedSections.length; i++) {
                weightBelow += sectionWeights[i];
            }
            const axialLoad = calculateAxialLoad(weightBelow, bf, 0); // Total weight hanging from top of this section * BF

            const burstCheck = verifyBurst(section.burst_rating, burstLoad, params.burstSF);
            const collapseCheck = verifyCollapse(section.collapse_rating, collapseLoad, params.collapseSF);
            const tensionCheck = verifyTension(section.tensile_strength, axialLoad, params.tensionSF);

            return {
                sectionId: section.id || index,
                seq: index + 1,
                interval: `${formatNumber(section.top_depth,0)} - ${formatNumber(section.bottom_depth,0)}`,
                burst: { ...burstCheck, load: burstLoad },
                collapse: { ...collapseCheck, load: collapseLoad },
                tension: { ...tensionCheck, load: axialLoad }
            };
        });

        setResults(calculatedResults);
        
        // Summary
        let pass = 0;
        let fail = 0;
        calculatedResults.forEach(r => {
            if (r.burst.pass && r.collapse.pass && r.tension.pass) pass++;
            else fail++;
        });
        setSummary({ pass, fail, total: calculatedResults.length });
    };

    useEffect(() => {
        handleCalculate();
    }, [sections]); // Recalculate when sections change, not params automatically to avoid jitter? Or yes?
    // Let's auto calc on param change too for responsiveness
    useEffect(() => {
        handleCalculate();
    }, [params]);

    const StatusIcon = ({ pass }) => {
        if (pass) return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
        return <XCircle className="w-4 h-4 text-red-500" />;
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Parameters Panel */}
                <Card className="bg-[#1E293B] border-slate-700 lg:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold text-slate-300 uppercase tracking-wider">Load Parameters</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Fluid Density (ppg)</Label>
                            <Input 
                                type="number" 
                                value={params.fluidDensity}
                                onChange={e => setParams({...params, fluidDensity: e.target.value})}
                                className="bg-slate-950"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Surface Pressure (psi)</Label>
                            <Input 
                                type="number" 
                                value={params.surfacePressure}
                                onChange={e => setParams({...params, surfacePressure: e.target.value})}
                                className="bg-slate-950"
                            />
                        </div>
                        
                        <div className="pt-4 border-t border-slate-800 space-y-4">
                            <Label className="text-slate-400">Safety Factors</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <span className="text-xs text-slate-500">Burst</span>
                                    <Input 
                                        type="number" step="0.05"
                                        value={params.burstSF}
                                        onChange={e => setParams({...params, burstSF: e.target.value})}
                                        className="bg-slate-950 h-8"
                                    />
                                </div>
                                <div>
                                    <span className="text-xs text-slate-500">Collapse</span>
                                    <Input 
                                        type="number" step="0.05"
                                        value={params.collapseSF}
                                        onChange={e => setParams({...params, collapseSF: e.target.value})}
                                        className="bg-slate-950 h-8"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <span className="text-xs text-slate-500">Tension</span>
                                    <Input 
                                        type="number" step="0.05"
                                        value={params.tensionSF}
                                        onChange={e => setParams({...params, tensionSF: e.target.value})}
                                        className="bg-slate-950 h-8"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button onClick={handleCalculate} className="w-full mt-4 bg-slate-800 hover:bg-slate-700">
                            <RefreshCw className="w-4 h-4 mr-2" /> Recalculate
                        </Button>
                    </CardContent>
                </Card>

                {/* Results Table */}
                <Card className="bg-[#1E293B] border-slate-700 lg:col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-bold text-white">Verification Results</CardTitle>
                        <div className="flex gap-2">
                            <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10">
                                Pass: {summary.pass}
                            </Badge>
                            {summary.fail > 0 && (
                                <Badge variant="outline" className="border-red-500/50 text-red-400 bg-red-500/10">
                                    Fail: {summary.fail}
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-800 hover:bg-slate-800/20">
                                    <TableHead className="text-slate-400">Seq</TableHead>
                                    <TableHead className="text-slate-400">Interval</TableHead>
                                    <TableHead className="text-center text-slate-400 bg-slate-900/50">Burst SF</TableHead>
                                    <TableHead className="text-center text-slate-400 bg-slate-900/50">Collapse SF</TableHead>
                                    <TableHead className="text-center text-slate-400 bg-slate-900/50">Tension SF</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {results.map((r, i) => (
                                    <TableRow key={i} className="border-slate-800 hover:bg-slate-800/20">
                                        <TableCell className="text-slate-500 font-mono">{r.seq}</TableCell>
                                        <TableCell className="text-slate-300 text-xs font-mono">{r.interval}</TableCell>
                                        
                                        {/* Burst */}
                                        <TableCell className="text-center border-l border-slate-800">
                                            <div className="flex items-center justify-center gap-2">
                                                <StatusIcon pass={r.burst.pass} />
                                                <span className={`font-mono font-bold ${r.burst.pass ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {formatNumber(r.burst.sf, 2)}
                                                </span>
                                            </div>
                                            <div className="text-[10px] text-slate-600 mt-1">
                                                Load: {formatNumber(r.burst.load, 0)} psi
                                            </div>
                                        </TableCell>

                                        {/* Collapse */}
                                        <TableCell className="text-center border-l border-slate-800">
                                            <div className="flex items-center justify-center gap-2">
                                                <StatusIcon pass={r.collapse.pass} />
                                                <span className={`font-mono font-bold ${r.collapse.pass ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {formatNumber(r.collapse.sf, 2)}
                                                </span>
                                            </div>
                                            <div className="text-[10px] text-slate-600 mt-1">
                                                Load: {formatNumber(r.collapse.load, 0)} psi
                                            </div>
                                        </TableCell>

                                        {/* Tension */}
                                        <TableCell className="text-center border-l border-slate-800">
                                            <div className="flex items-center justify-center gap-2">
                                                <StatusIcon pass={r.tension.pass} />
                                                <span className={`font-mono font-bold ${r.tension.pass ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {formatNumber(r.tension.sf, 2)}
                                                </span>
                                            </div>
                                            <div className="text-[10px] text-slate-600 mt-1">
                                                Load: {formatNumber(r.tension.load / 1000, 0)} kips
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {results.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                            No calculations performed.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default LoadCaseAnalysisPanel;