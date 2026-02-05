import React, { useState } from 'react';
import { useQC } from '@/modules/geoscience/petrophysical-analysis/context/QCContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Check, X, Minus, ChevronDown, ChevronRight, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const DetailedChecksView = () => {
  const { qcResults } = useQC();
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (id) => {
      setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const curves = Object.keys(qcResults);

  if (curves.length === 0) return (
    <div className="flex flex-col items-center justify-center h-64 border border-slate-800 border-dashed rounded-xl bg-slate-900/50">
        <p className="text-slate-500">Run QC Analysis to populate validation table.</p>
    </div>
  );

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <h3 className="font-semibold text-slate-200">Curve Validation Matrix</h3>
          <Badge variant="outline" className="border-slate-700 text-slate-400">{curves.length} Curves</Badge>
      </div>
      <div className="overflow-auto flex-1">
        <Table>
          <TableHeader className="bg-slate-950 sticky top-0 z-10">
            <TableRow className="hover:bg-transparent border-slate-800">
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="text-slate-400 font-medium">Curve Name</TableHead>
              <TableHead className="text-slate-400 font-medium">Type</TableHead>
              <TableHead className="text-slate-400 font-medium">Quality Score</TableHead>
              <TableHead className="text-slate-400 font-medium">Completeness</TableHead>
              <TableHead className="text-slate-400 font-medium">Gaps</TableHead>
              <TableHead className="text-slate-400 font-medium">Outliers</TableHead>
              <TableHead className="text-slate-400 font-medium text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {curves.map(id => {
                const res = qcResults[id];
                const { metrics, classification, gaps, outliers } = res;
                const isExpanded = expandedRows[id];
                
                // Simple composite score logic for demo
                let score = 100;
                if(metrics.completeness < 95) score -= 20;
                if(gaps.gaps.length > 0) score -= (gaps.gaps.length * 5);
                if(outliers.length > 0) score -= (outliers.length * 0.5);
                score = Math.max(0, Math.round(score));
                
                const status = score > 80 ? 'pass' : score > 50 ? 'warning' : 'fail';

                return (
                    <React.Fragment key={id}>
                        <TableRow className="border-slate-800 hover:bg-slate-800/50 cursor-pointer transition-colors" onClick={() => toggleRow(id)}>
                            <TableCell>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-500">
                                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </Button>
                            </TableCell>
                            <TableCell className="font-medium text-slate-200">{res.curveName || id}</TableCell>
                            <TableCell className="text-slate-400 text-xs uppercase tracking-wider">{classification.type}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden">
                                        <div className={`h-full ${status === 'pass' ? 'bg-emerald-500' : status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${score}%` }}></div>
                                    </div>
                                    <span className="text-xs font-mono text-slate-300">{score}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className={metrics.completeness < 95 ? 'text-red-400 font-medium' : 'text-slate-300'}>
                                    {metrics.completeness.toFixed(1)}%
                                </span>
                            </TableCell>
                            <TableCell>
                                {gaps.gaps.length > 0 ? (
                                    <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-400 text-[10px]">{gaps.gaps.length}</Badge>
                                ) : (
                                    <span className="text-slate-600 text-xs">-</span>
                                )}
                            </TableCell>
                            <TableCell>
                                 {outliers.length > 0 ? (
                                    <span className="text-amber-400 text-xs font-medium">{outliers.length}</span>
                                ) : (
                                    <span className="text-slate-600 text-xs">-</span>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <Badge className={cn(
                                    "uppercase text-[10px] font-bold border-0",
                                    status === 'pass' ? "bg-emerald-500/20 text-emerald-400" : 
                                    status === 'warning' ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400"
                                )}>
                                    {status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                        {isExpanded && (
                            <TableRow className="bg-slate-950/50 border-slate-800">
                                <TableCell colSpan={8} className="p-4">
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div className="p-3 rounded border border-slate-800 bg-slate-900/50">
                                            <p className="text-slate-500 mb-1">Min / Max</p>
                                            <p className="text-slate-200 font-mono">{metrics.min.toFixed(3)} - {metrics.max.toFixed(3)} {metrics.unit}</p>
                                        </div>
                                        <div className="p-3 rounded border border-slate-800 bg-slate-900/50">
                                            <p className="text-slate-500 mb-1">Mean / Std Dev</p>
                                            <p className="text-slate-200 font-mono">{metrics.mean.toFixed(3)} / {metrics.std.toFixed(3)}</p>
                                        </div>
                                        <div className="p-3 rounded border border-slate-800 bg-slate-900/50">
                                            <p className="text-slate-500 mb-1">Negative Values</p>
                                            <p className={metrics.negativePercentage > 0 ? "text-amber-400" : "text-emerald-400"}>
                                                {metrics.negativePercentage.toFixed(2)}%
                                            </p>
                                        </div>
                                    </div>
                                    {outliers.length > 0 && (
                                        <div className="mt-3">
                                            <p className="text-xs font-semibold text-amber-500 mb-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Detected Outliers Preview</p>
                                            <div className="text-xs text-slate-400 font-mono bg-slate-950 p-2 rounded border border-slate-800">
                                                {outliers.slice(0, 5).map((o, i) => (
                                                    <span key={i} className="mr-3">
                                                        @{o.depth.toFixed(1)}m: {o.value.toFixed(2)}
                                                    </span>
                                                ))}
                                                {outliers.length > 5 && <span>... (+{outliers.length - 5} more)</span>}
                                            </div>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        )}
                    </React.Fragment>
                );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DetailedChecksView;