import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldAlert, Zap, BarChart3, TrendingUp, FileText, Download, CheckCircle2, Settings, FileJson, Activity, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { cn } from '@/lib/utils';

// Helper to check for missing results
const NoResultsState = () => (
    <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-center">
        <Activity className="w-16 h-16 mb-4 text-slate-600" />
        <h3 className="text-lg font-semibold text-slate-300">Analysis Required</h3>
        <p className="max-w-sm mt-2">Please run the sizing calculation in Step 3 to view integrity data.</p>
    </div>
);

export const Step5Integrity = ({ results, selectedSize, onSelectSize, material }) => {
    if (!results) return <NoResultsState />;

    const selectedResult = results.find(r => r.nps === selectedSize);
    
    // Sort options numerically by NPS size if possible
    const options = results.map(r => ({
        val: r.nps,
        label: `${r.nps}" (${r.status.toUpperCase()})`,
        status: r.status
    }));

    return (
        <div className="space-y-6">
            {/* Pipe Selector Header */}
            <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <div className="flex items-center gap-4">
                    <Label className="text-slate-300">Selected Pipe Size for Analysis:</Label>
                    <Select value={selectedSize || ''} onValueChange={onSelectSize}>
                        <SelectTrigger className="w-[200px] bg-slate-950 border-slate-700 text-white">
                            <SelectValue placeholder="Select Pipe Size" />
                        </SelectTrigger>
                        {/* Critical Fix: z-[200] ensures dropdown appears above fullscreen container */}
                        <SelectContent className="bg-slate-900 border-slate-700 z-[200]">
                            {options.map(opt => (
                                <SelectItem key={opt.val} value={opt.val} className={
                                    opt.status === 'fail' ? 'text-red-400' : opt.status === 'warning' ? 'text-amber-400' : 'text-emerald-400'
                                }>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {selectedResult && (
                     <Badge variant={selectedResult.status === 'pass' ? 'default' : 'destructive'} 
                            className={selectedResult.status === 'pass' ? 'bg-emerald-600' : selectedResult.status === 'warning' ? 'bg-amber-600' : 'bg-red-600'}>
                         Status: {selectedResult.status.toUpperCase()}
                     </Badge>
                )}
            </div>

            {!selectedSize || !selectedResult ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400 border-2 border-dashed border-slate-700 rounded-lg">
                    <ShieldAlert className="w-16 h-16 mb-4 text-slate-600" />
                    <p>Select a pipe size above to view integrity details.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="bg-slate-900 border-slate-700">
                        <CardHeader><CardTitle className="text-white flex items-center gap-2"><ShieldAlert className="text-amber-500 w-5 h-5"/> Integrity Summary ({selectedSize}")</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader><TableRow><TableHead>Risk Type</TableHead><TableHead>Status</TableHead><TableHead>Metric</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {[
                                        { type: 'Erosion', status: selectedResult.erosionRatio > 1.0 ? 'Critical' : selectedResult.erosionRatio > 0.8 ? 'Warning' : 'Safe', val: `${(selectedResult.erosionRatio * 100).toFixed(0)}% of Limit` },
                                        { type: 'Corrosion (CO2)', status: material === 'CS' ? 'Check Required' : 'Safe', val: material === 'CS' ? 'Calculate Rate' : 'N/A (CRA/SS)' },
                                        { type: 'Hydrate Formation', status: 'Analysis Pending', val: 'Requires HYSYS' },
                                        { type: 'Slug Flow', status: selectedResult.velocity < 5 ? 'Risk' : 'Low Risk', val: `Vel: ${selectedResult.velocity} ft/s` }
                                    ].map(r => (
                                        <TableRow key={r.type}>
                                            <TableCell className="font-medium text-slate-200">{r.type}</TableCell>
                                            <TableCell><Badge variant={r.status === 'Safe' || r.status === 'Low Risk' ? 'default' : 'destructive'} className={r.status.includes('Safe') ? 'bg-emerald-600' : 'bg-amber-600'}>{r.status}</Badge></TableCell>
                                            <TableCell className="text-slate-400">{r.val}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <div className="space-y-6">
                        <Card className="bg-slate-900 border-slate-700">
                            <CardHeader><CardTitle className="text-white">Material Constraints</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                                    <span className="text-slate-400">Selected Material</span>
                                    <span className="text-white font-bold">{material}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                                    <span className="text-slate-400">Max Design Velocity</span>
                                    <span className="text-white font-bold">60 ft/s</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export const Step6Operations = ({ results, selectedSize, onSelectSize, flowRate }) => {
    if (!results) return <NoResultsState />;

    const selectedResult = results.find(r => r.nps === selectedSize);
    const options = results.map(r => ({
        val: r.nps,
        label: `${r.nps}"`,
        status: r.status
    }));

    return (
        <div className="space-y-6">
             <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <div className="flex items-center gap-4">
                    <Label className="text-slate-300">Scenario Pipe Size:</Label>
                    <Select value={selectedSize || ''} onValueChange={onSelectSize}>
                        <SelectTrigger className="w-[200px] bg-slate-950 border-slate-700 text-white">
                            <SelectValue placeholder="Select Pipe Size" />
                        </SelectTrigger>
                        {/* Critical Fix: z-[200] ensures dropdown appears above fullscreen container */}
                        <SelectContent className="bg-slate-900 border-slate-700 z-[200]">
                            {options.map(opt => (
                                <SelectItem key={opt.val} value={opt.val} className="focus:bg-slate-800 focus:text-white cursor-pointer">{opt.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {!selectedSize || !selectedResult ? (
                 <div className="flex flex-col items-center justify-center h-64 text-slate-400 border-2 border-dashed border-slate-700 rounded-lg">
                    <Zap className="w-16 h-16 mb-4 text-slate-600" />
                    <p>Select a pipe size to run operational scenarios.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {[
                        { name: 'Design Rate', flow: flowRate, vel: selectedResult.velocity, dp: selectedResult.totalDrop },
                        { name: 'Turndown (50%)', flow: flowRate * 0.5, vel: selectedResult.velocity * 0.5, dp: selectedResult.totalDrop * 0.25 },
                        { name: 'Ramp Up (120%)', flow: flowRate * 1.2, vel: selectedResult.velocity * 1.2, dp: selectedResult.totalDrop * 1.44 },
                    ].map(s => (
                        <Card key={s.name} className="bg-slate-900 border-slate-700">
                            <CardHeader><CardTitle className="text-white text-sm uppercase tracking-wide">{s.name}</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between"><span className="text-slate-400">Velocity</span> <span className="text-white">{s.vel.toFixed(1)} ft/s</span></div>
                                <div className="flex justify-between"><span className="text-slate-400">Pressure Drop</span> <span className="text-white">{s.dp.toFixed(1)} psi</span></div>
                                <div className="mt-4 pt-4 border-t border-slate-800 text-center">
                                    {s.vel < 3 ? <Badge className="bg-amber-600">Solids Risk</Badge> : <Badge className="bg-emerald-600">Stable</Badge>}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export const Step7Sensitivity = ({ runSensitivity, results, inputs }) => {
    const [variable, setVariable] = useState('flowRate');
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <Card className="bg-slate-900 border-slate-700 h-fit">
                <CardHeader><CardTitle className="text-white flex items-center gap-2"><Settings className="w-4 h-4"/> Variables</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Parameter to Vary</Label>
                        <Select value={variable} onValueChange={setVariable}>
                            <SelectTrigger className="bg-slate-950 border-slate-700 text-white"><SelectValue/></SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700 z-[200]">
                                <SelectItem value="flowRate" className="focus:bg-slate-800 focus:text-white cursor-pointer">Flow Rate (+/- 50%)</SelectItem>
                                <SelectItem value="temperature" className="focus:bg-slate-800 focus:text-white cursor-pointer">Inlet Temp (+/- 50F)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button className="w-full bg-blue-600 text-white" onClick={() => runSensitivity(inputs, variable, inputs.flowRate * 0.5, inputs.flowRate * 1.5)}>Run Sensitivity</Button>
                </CardContent>
            </Card>

            <Card className="col-span-2 bg-slate-900 border-slate-700 h-[400px]">
                <CardHeader><CardTitle className="text-white">Impact Analysis</CardTitle></CardHeader>
                <CardContent className="h-full pb-10">
                    {results ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={results}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="x" stroke="#94a3b8" label={{ value: variable, position: 'bottom' }} />
                                <YAxis stroke="#3b82f6" label={{ value: 'Pressure Drop (psi)', angle: -90, position: 'insideLeft' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                                <Line type="monotone" dataKey="pressureDrop" stroke="#3b82f6" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-500">Run sensitivity analysis to see results</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export const Step8Optimization = ({ results }) => (
    <Card className="bg-slate-900 border-slate-700">
        <CardHeader><CardTitle className="text-white flex items-center gap-2"><TrendingUp className="text-emerald-500 w-5 h-5"/> Cost Optimization</CardTitle></CardHeader>
        <CardContent>
            <div className="space-y-4">
                <p className="text-slate-400">Comparing Capital Expenditure (CAPEX) vs Operational Expenditure (OPEX - Power) for valid sizing options.</p>
                <Table>
                    <TableHeader><TableRow><TableHead>Size</TableHead><TableHead>CAPEX Index</TableHead><TableHead>OPEX (Power)</TableHead><TableHead>Total Cost (10yr NPV)</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {results?.filter(r => r.status !== 'fail').map(r => (
                            <TableRow key={r.nps}>
                                <TableCell className="font-bold text-white">{r.nps}"</TableCell>
                                <TableCell className="text-slate-300">${(Math.pow(parseFloat(r.nps), 1.5) * 1000).toLocaleString()}</TableCell>
                                <TableCell className="text-slate-300">{r.powerKW} kW</TableCell>
                                <TableCell className="text-emerald-400 font-mono">{(Math.pow(parseFloat(r.nps), 1.5) * 1000 + r.powerKW * 500).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
    </Card>
);

export const Step9Reporting = ({ studyData, onGenerateReport }) => {

    const exportJSON = () => {
        const blob = new Blob([JSON.stringify(studyData, null, 2)], { type: 'application/json' });
        saveAs(blob, `pipeline_study_${Date.now()}.json`);
    };

    const exportCSV = () => {
        if(!studyData.results) return;
        const ws = XLSX.utils.json_to_sheet(studyData.results);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Results");
        XLSX.writeFile(wb, `pipeline_results_${Date.now()}.xlsx`);
    };

    const ExportCard = ({ title, description, icon: Icon, colorClass, onClick, bgColorClass }) => (
        <div 
            onClick={onClick}
            className={cn(
                "group relative flex flex-col items-center justify-center p-8 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden",
                "bg-slate-900/50 hover:bg-slate-800 border-slate-700 hover:border-slate-600",
                "hover:shadow-xl hover:scale-[1.02]",
                "active:scale-95"
            )}
        >
            <div className={cn(
                "mb-6 p-5 rounded-full transition-colors duration-300", 
                "bg-slate-800 group-hover:bg-slate-700",
                bgColorClass
            )}>
                <Icon className={cn("w-10 h-10 transition-transform duration-300 group-hover:scale-110", colorClass)} />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2 text-center group-hover:text-blue-100 transition-colors">
                {title}
            </h3>
            
            <p className="text-sm text-slate-400 text-center max-w-[200px] leading-relaxed group-hover:text-slate-300 transition-colors">
                {description}
            </p>

            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                <ArrowRight className={cn("w-5 h-5", colorClass)} />
            </div>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center space-y-12 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col items-center text-center space-y-4 max-w-2xl">
                <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center border-2 border-blue-500/20 mb-4 animate-pulse">
                    <CheckCircle2 className="w-10 h-10 text-blue-500" />
                </div>
                
                <h2 className="text-4xl font-bold text-white tracking-tight">Study Complete</h2>
                <p className="text-lg text-slate-400">
                    Your hydraulic analysis for <span className="text-white font-semibold">{studyData.meta?.caseName}</span> is ready. 
                    Choose an export format below to save your data.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl px-4">
                <ExportCard 
                    title="PDF Report"
                    description="Professional documentation including charts, inputs, and executive summary."
                    icon={FileText}
                    colorClass="text-blue-500"
                    bgColorClass="group-hover:bg-blue-500/10"
                    onClick={onGenerateReport}
                />

                <ExportCard 
                    title="Excel Export"
                    description="Raw tabular data and calculation results suitable for further analysis."
                    icon={FileSpreadsheet}
                    colorClass="text-emerald-500"
                    bgColorClass="group-hover:bg-emerald-500/10"
                    onClick={exportCSV}
                />

                <ExportCard 
                    title="JSON Data"
                    description="Full case object format for saving, sharing, or reloading into the application."
                    icon={FileJson}
                    colorClass="text-amber-500"
                    bgColorClass="group-hover:bg-amber-500/10"
                    onClick={exportJSON}
                />
            </div>
        </div>
    );
};