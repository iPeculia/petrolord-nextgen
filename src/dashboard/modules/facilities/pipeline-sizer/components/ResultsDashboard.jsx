import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, CheckCircle2, AlertTriangle, ArrowRightCircle, Target } from 'lucide-react';
import { Area, ComposedChart, Line, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const ResultsDashboard = ({ results, constraints, onSelectSize, selectedSize }) => {
  // Sort results by status priority: pass first, then warning, then fail
  const sortedResults = [...(results || [])].sort((a, b) => {
    const statusPriority = { pass: 0, warning: 1, fail: 2 };
    if (statusPriority[a.status] !== statusPriority[b.status]) {
      return statusPriority[a.status] - statusPriority[b.status];
    }
    return parseFloat(a.nps) - parseFloat(b.nps); // Then by size
  });

  const optimalResult = results?.find(r => r.status === 'pass');

  // Helper to safely handle value changes
  const handleValueChange = (val) => {
    if (onSelectSize) {
        onSelectSize(val);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
        
        {/* Step 4: Primary Selection Action */}
        <Card className="bg-slate-900 border-emerald-500/50 border-2 shadow-lg shadow-emerald-900/10 relative z-10">
            <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-500" />
                    Select Pipe Size to Proceed
                </CardTitle>
                <p className="text-sm text-slate-400">
                    Review the analysis below and select a pipe diameter to unlock the next steps (Integrity & Operations).
                </p>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 items-center bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                    <div className="flex-1 w-full sm:w-auto">
                        <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Primary Pipe Size</label>
                        <Select value={selectedSize || ''} onValueChange={handleValueChange}>
                            <SelectTrigger className="w-full bg-slate-900 border-slate-700 h-11 text-white">
                                <SelectValue placeholder="Select a valid pipe size..." />
                            </SelectTrigger>
                            {/* Critical Fix: z-[200] ensures dropdown appears above fullscreen container */}
                            <SelectContent className="bg-slate-900 border-slate-700 z-[200]">
                                {results?.map(r => (
                                    <SelectItem 
                                        key={r.nps} 
                                        value={r.nps}
                                        className={cn(
                                            "cursor-pointer focus:bg-slate-800 focus:text-white",
                                            r.status === 'pass' ? 'text-emerald-400 font-medium' : 
                                            r.status === 'warning' ? 'text-amber-400' : 'text-red-400'
                                        )}
                                    >
                                        <div className="flex items-center justify-between w-full min-w-[200px]">
                                            <span>{r.nps}" NPS</span>
                                            <Badge variant="outline" className={cn("ml-2 text-[10px] h-5", 
                                                r.status === 'pass' ? 'border-emerald-500 text-emerald-500' : 
                                                r.status === 'warning' ? 'border-amber-500 text-amber-500' : 
                                                'border-red-500 text-red-500'
                                            )}>
                                                {r.status.toUpperCase()}
                                            </Badge>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="hidden sm:block h-10 w-px bg-slate-800"></div>

                    <div className="flex-1 w-full sm:w-auto flex items-center gap-3">
                         {selectedSize ? (
                             <>
                                <div className="bg-emerald-500/20 p-2 rounded-full">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-emerald-400">Selection Confirmed</div>
                                    <div className="text-xs text-slate-500">You can now proceed to Step 5.</div>
                                </div>
                             </>
                         ) : (
                             <>
                                <div className="bg-slate-800 p-2 rounded-full">
                                    <AlertTriangle className="w-6 h-6 text-slate-500" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-slate-300">No Selection</div>
                                    <div className="text-xs text-slate-500">Choose a size to enable the "Next" button.</div>
                                </div>
                             </>
                         )}
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* Summary Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <Card className="lg:col-span-2 bg-slate-900 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white">Performance vs Diameter</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={results}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="idInches" stroke="#94a3b8" label={{ value: 'Diameter (in)', position: 'insideBottom', offset: -5 }} />
                            <YAxis yAxisId="left" stroke="#3b82f6" label={{ value: 'Pressure Drop (psi)', angle: -90, position: 'insideLeft' }} />
                            <YAxis yAxisId="right" orientation="right" stroke="#10b981" label={{ value: 'Velocity (ft/s)', angle: 90, position: 'insideRight' }} />
                            <RechartsTooltip 
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', zIndex: 1000 }} 
                                wrapperStyle={{ zIndex: 1000 }}
                            />
                            <Legend />
                            <Area yAxisId="left" type="monotone" dataKey="totalDrop" fill="#3b82f6" stroke="#3b82f6" fillOpacity={0.2} name="Pressure Drop" />
                            <Line yAxisId="right" type="monotone" dataKey="velocity" stroke="#10b981" strokeWidth={2} name="Velocity" />
                            <ReferenceLine yAxisId="right" y={constraints.maxVelocity} stroke="#ef4444" strokeDasharray="3 3" label="Max Vel" />
                            <ReferenceLine yAxisId="right" y={constraints.minVelocity} stroke="#f59e0b" strokeDasharray="3 3" label="Min Vel" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </CardContent>
             </Card>

             <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white">Recommendation</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-center items-center h-[300px] space-y-4">
                    {(() => {
                        if (optimalResult) {
                            return (
                                <>
                                    <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center border-4 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-pulse">
                                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                    </div>
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-white">{optimalResult.nps}"</div>
                                        <div className="text-sm text-emerald-400 font-semibold uppercase tracking-wider">Optimal Size</div>
                                    </div>
                                    <div className="text-sm text-center text-slate-400 px-4">
                                        Provides balanced velocity ({optimalResult.velocity} ft/s) and pressure drop ({optimalResult.totalDrop} psi).
                                    </div>
                                    {selectedSize !== optimalResult.nps && (
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="mt-2 border-emerald-500 text-emerald-400 hover:bg-emerald-500/10"
                                            onClick={() => onSelectSize(optimalResult.nps)}
                                        >
                                            Select {optimalResult.nps}"
                                        </Button>
                                    )}
                                </>
                            );
                        } else {
                            return (
                                <div className="text-center text-red-400">
                                    <AlertTriangle className="w-16 h-16 mx-auto mb-4" />
                                    <h4 className="text-lg font-bold">No Passing Solution</h4>
                                    <p className="text-sm">Adjust constraints or pipe schedule.</p>
                                </div>
                            );
                        }
                    })()}
                </CardContent>
             </Card>
        </div>

        {/* Detailed Table */}
        <Card className="bg-slate-900 border-slate-700 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Detailed Size Screening</CardTitle>
                <div className="text-xs text-slate-400 hidden sm:block">Click 'Select' to proceed</div>
            </CardHeader>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-slate-800">
                        <TableRow>
                            <TableHead className="text-slate-300 w-[80px]">NPS</TableHead>
                            <TableHead className="text-slate-300">ID (in)</TableHead>
                            <TableHead className="text-slate-300">Velocity (ft/s)</TableHead>
                            <TableHead className="text-slate-300">Total dP (psi)</TableHead>
                            <TableHead className="text-slate-300">Arr. Press.</TableHead>
                            <TableHead className="text-slate-300">Erosion Ratio</TableHead>
                            <TableHead className="text-slate-300">Status</TableHead>
                            <TableHead className="text-slate-300 text-right pr-6">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {results && results.map(row => (
                            <TableRow key={row.nps} className={`border-slate-800 transition-colors ${selectedSize === row.nps ? 'bg-emerald-900/20 hover:bg-emerald-900/30' : 'hover:bg-slate-800/30'}`}>
                                <TableCell className="font-bold text-white">{row.nps}"</TableCell>
                                <TableCell className="text-slate-400">{row.idInches.toFixed(3)}</TableCell>
                                <TableCell className={
                                    parseFloat(row.velocity) > constraints.maxVelocity ? 'text-red-400 font-bold' : 
                                    parseFloat(row.velocity) < constraints.minVelocity ? 'text-amber-400' : 'text-emerald-400'
                                }>{row.velocity}</TableCell>
                                <TableCell className="text-slate-300">{row.totalDrop}</TableCell>
                                <TableCell className={parseFloat(row.arrivalPressure) < constraints.minArrivalPressure ? 'text-red-400' : 'text-slate-300'}>{row.arrivalPressure}</TableCell>
                                <TableCell className={parseFloat(row.erosionRatio) > 1 ? 'text-red-400' : 'text-slate-300'}>{row.erosionRatio}</TableCell>
                                <TableCell>
                                    <Badge variant={row.status === 'pass' ? 'default' : 'destructive'} className={
                                        row.status === 'pass' ? 'bg-emerald-600 hover:bg-emerald-600' : 
                                        row.status === 'warning' ? 'bg-amber-600 hover:bg-amber-600' : 'bg-red-600 hover:bg-red-600'
                                    }>
                                        {row.status.toUpperCase()}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right pr-4">
                                    <Button 
                                        size="sm" 
                                        variant={selectedSize === row.nps ? "default" : "outline"} 
                                        onClick={() => onSelectSize(row.nps)} 
                                        className={cn(
                                            "min-w-[100px] transition-all",
                                            selectedSize === row.nps 
                                                ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500" 
                                                : "border-slate-600 hover:border-emerald-500 hover:text-emerald-400"
                                        )}
                                    >
                                        {selectedSize === row.nps ? <CheckCircle2 className="w-4 h-4 mr-2"/> : <ArrowRightCircle className="w-4 h-4 mr-2"/>}
                                        {selectedSize === row.nps ? "Selected" : "Select"}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    </div>
  );
};

export default ResultsDashboard;