import React from 'react';
import { ShieldAlert, AlertTriangle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const RiskAssessmentPanel = ({ risks = [] }) => {
  // Dummy data
  const displayRisks = risks.length > 0 ? risks : [
      { risk_id: 1, risk_name: "Compressor Failure", probability_percent: 15, impact_description: "Shutdown", risk_severity: "High", mitigation_strategy: "Redundant Train" },
      { risk_id: 2, risk_name: "Export Pipeline Corrosion", probability_percent: 45, impact_description: "Leak/Env Damage", risk_severity: "Critical", mitigation_strategy: "Inhibitor Injection" },
      { risk_id: 3, risk_name: "Supply Chain Delay", probability_percent: 60, impact_description: "Schedule Slip", risk_severity: "Medium", mitigation_strategy: "Early Procurement" },
      { risk_id: 4, risk_name: "Power Gen Trip", probability_percent: 25, impact_description: "Partial Shutdown", risk_severity: "Low", mitigation_strategy: "Load Shedding Logic" },
  ];

  const getSeverityBadge = (severity) => {
      let colorClass = 'bg-blue-900/50 text-blue-400 border-blue-800';
      if (severity === 'Critical') colorClass = 'bg-red-900/50 text-red-400 border-red-800';
      else if (severity === 'High') colorClass = 'bg-orange-900/50 text-orange-400 border-orange-800';
      else if (severity === 'Medium') colorClass = 'bg-amber-900/50 text-amber-400 border-amber-800';
      
      return (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${colorClass}`}>
              {severity}
          </span>
      );
  }

  return (
    <Card className="h-full bg-[#1a1a1a] border-slate-800 text-slate-200 shadow-xl flex flex-col">
      <CardHeader className="pb-2 border-b border-slate-800">
        <CardTitle className="flex items-center gap-2 text-base">
            <ShieldAlert className="w-5 h-5 text-orange-500" />
            Risk Assessment Matrix
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-auto">
        <Table>
            <TableHeader className="bg-slate-900/50 sticky top-0">
                <TableRow className="border-slate-700 hover:bg-transparent">
                    <TableHead className="text-slate-400 font-semibold w-[30%]">Risk Scenario</TableHead>
                    <TableHead className="text-slate-400 font-semibold w-[15%]">Prob.</TableHead>
                    <TableHead className="text-slate-400 font-semibold w-[20%]">Severity</TableHead>
                    <TableHead className="text-slate-400 font-semibold w-[35%]">Mitigation</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {displayRisks.map(risk => (
                    <TableRow key={risk.risk_id} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                        <TableCell className="font-medium text-slate-200">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-3 h-3 text-slate-500" />
                                {risk.risk_name}
                            </div>
                        </TableCell>
                        <TableCell className="text-slate-300">{risk.probability_percent}%</TableCell>
                        <TableCell>
                            {getSeverityBadge(risk.risk_severity)}
                        </TableCell>
                        <TableCell className="text-xs text-slate-400">{risk.mitigation_strategy}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RiskAssessmentPanel;