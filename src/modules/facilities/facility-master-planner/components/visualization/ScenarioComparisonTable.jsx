import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const ScenarioComparisonTable = ({ scenarios }) => {
  if (scenarios.length === 0) {
    return <div className="p-8 text-center text-slate-500 bg-[#1a1a1a] rounded-lg border border-slate-800">Select scenarios to compare</div>;
  }

  const metrics = [
    { key: 'npv', label: 'NPV ($M)', format: (v) => `$${v.toLocaleString()}`, higherBetter: true },
    { key: 'irr', label: 'IRR (%)', format: (v) => `${v.toFixed(1)}%`, higherBetter: true },
    { key: 'total_capex', label: 'Total CAPEX ($M)', format: (v) => `$${v.toLocaleString()}`, higherBetter: false },
    { key: 'break_even_oil_price', label: 'Break Even ($/bbl)', format: (v) => `$${v.toFixed(2)}`, higherBetter: false },
    { key: 'peak_oil_rate', label: 'Peak Oil (bpd)', format: (v) => v.toLocaleString(), higherBetter: true },
    { key: 'expansion_count', label: 'Expansions', format: (v) => v, higherBetter: false },
  ];

  // Helper to determine best/worst for coloring
  const getValueRank = (scenarios, metricKey, isHigherBetter) => {
    const validValues = scenarios
        .map(s => s.results ? s.results[metricKey] : null)
        .filter(v => v !== null);
    
    if (validValues.length === 0) return {};

    const max = Math.max(...validValues);
    const min = Math.min(...validValues);
    
    const best = isHigherBetter ? max : min;
    const worst = isHigherBetter ? min : max;

    return { best, worst };
  };

  return (
    <div className="rounded-lg border border-slate-800 bg-[#1a1a1a] overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-900">
          <TableRow className="border-slate-800 hover:bg-slate-900">
            <TableHead className="w-[180px] text-slate-400 font-bold">Metric</TableHead>
            {scenarios.map(s => (
              <TableHead key={s.scenario_id} className="text-slate-200 font-semibold text-center min-w-[140px]">
                {s.name}
                {s.is_baseline && <span className="ml-2 text-[10px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">Base</span>}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {metrics.map((metric) => {
            const ranks = getValueRank(scenarios, metric.key, metric.higherBetter);
            return (
              <TableRow key={metric.key} className="border-slate-800 hover:bg-slate-800/50">
                <TableCell className="font-medium text-slate-400 bg-slate-900/30">{metric.label}</TableCell>
                {scenarios.map(s => {
                    const val = s.results ? s.results[metric.key] : null;
                    if (val === null) return <TableCell key={s.scenario_id} className="text-center text-slate-600">-</TableCell>;
                    
                    const isBest = val === ranks.best && scenarios.length > 1;
                    const isWorst = val === ranks.worst && scenarios.length > 1;
                    
                    return (
                        <TableCell key={s.scenario_id} className="text-center">
                           <div className={cn(
                               "inline-flex items-center gap-1 font-mono",
                               isBest ? "text-emerald-400 font-bold" : isWorst ? "text-red-400" : "text-white"
                           )}>
                               {metric.format(val)}
                               {isBest && <ArrowUpRight className="w-3 h-3" />}
                               {isWorst && <ArrowDownRight className="w-3 h-3" />}
                           </div>
                        </TableCell>
                    );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ScenarioComparisonTable;