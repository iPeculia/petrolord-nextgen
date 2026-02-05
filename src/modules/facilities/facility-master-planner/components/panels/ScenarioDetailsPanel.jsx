import React from 'react';
import { Edit, Trash2, Play, Download, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { exportToCSV } from '../../utils/exportUtils';

const ScenarioDetailsPanel = ({ scenario, onRun, onDelete }) => {
  if (!scenario) return null;

  const handleExport = () => {
    if (scenario.results && scenario.results.cashflows) {
        const data = scenario.results.cashflows.map((cf, i) => ({ year: i + 1, cashflow: cf }));
        exportToCSV(data, `${scenario.name.replace(/\s+/g, '_')}_cashflows`);
    }
  };

  return (
    <Card className="h-full bg-[#1a1a1a] border-slate-800 text-slate-200">
      <CardHeader className="border-b border-slate-800 pb-4">
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-xl text-white mb-2">{scenario.name}</CardTitle>
                <div className="flex items-center gap-2">
                    <Badge variant={scenario.status === 'Completed' ? 'default' : 'secondary'} className={scenario.status === 'Completed' ? "bg-emerald-600" : "bg-slate-700"}>
                        {scenario.status}
                    </Badge>
                    {scenario.is_baseline && <Badge variant="outline" className="border-blue-500 text-blue-400">Baseline</Badge>}
                </div>
            </div>
            <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 border-slate-700" title="Edit Parameters">
                    <Edit className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" variant="destructive" className="h-8 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50" onClick={() => onDelete(scenario.scenario_id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
                {scenario.description || "No description provided."}
            </p>
        </div>

        <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Key Parameters</h4>
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-500">Oil Price</div>
                    <div className="font-mono text-white">${scenario.parameters.oil_price}/bbl</div>
                </div>
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-500">Gas Price</div>
                    <div className="font-mono text-white">${scenario.parameters.gas_price}/mmbtu</div>
                </div>
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-500">Discount Rate</div>
                    <div className="font-mono text-white">{scenario.parameters.discount_rate}%</div>
                </div>
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-500">CAPEX Factor</div>
                    <div className="font-mono text-white">x{scenario.parameters.capex_multiplier}</div>
                </div>
            </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
            {scenario.status === 'Completed' ? (
                 <div className="space-y-4">
                     <div className="flex items-center gap-2 text-emerald-400 text-sm">
                         <CheckCircle className="w-4 h-4" />
                         Analysis completed on {new Date(scenario.last_run).toLocaleDateString()}
                     </div>
                     <div className="grid grid-cols-2 gap-2">
                        <Button className="w-full bg-slate-800 hover:bg-slate-700" onClick={() => onRun(scenario.scenario_id)}>
                            <Play className="w-4 h-4 mr-2" /> Re-Run
                        </Button>
                        <Button className="w-full bg-slate-800 hover:bg-slate-700" onClick={handleExport}>
                            <Download className="w-4 h-4 mr-2" /> Results
                        </Button>
                     </div>
                 </div>
            ) : (
                <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white" onClick={() => onRun(scenario.scenario_id)}>
                    <Play className="w-4 h-4 mr-2" /> Run Master Plan Analysis
                </Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScenarioDetailsPanel;