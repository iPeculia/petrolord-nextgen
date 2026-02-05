import React from 'react';
import { useRiskAnalysis } from '@/context/RiskAnalysisContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StatRow = ({ label, value, colorClass = "text-slate-200" }) => (
  <div className="flex items-center justify-between py-2 border-b border-[#333] last:border-0">
    <span className="text-sm text-slate-400">{label}</span>
    <span className={`text-sm font-medium ${colorClass}`}>{value}</span>
  </div>
);

const QuickStatsPanel = () => {
  const { currentProject, riskRegister } = useRiskAnalysis();
  
  const projectRisks = riskRegister.filter(r => r.project_id === currentProject?.project_id);
  const totalRisks = projectRisks.length;
  const highRisks = projectRisks.filter(r => r.risk_score > 15).length;
  const mediumRisks = projectRisks.filter(r => r.risk_score >= 5 && r.risk_score <= 15).length;
  const lowRisks = projectRisks.filter(r => r.risk_score < 5).length;
  const mitigatedRisks = projectRisks.filter(r => r.status === 'Mitigated').length;
  
  const avgScore = totalRisks > 0 
    ? (projectRisks.reduce((sum, r) => sum + r.risk_score, 0) / totalRisks).toFixed(1) 
    : 0;

  return (
    <Card className="bg-[#262626] border-[#333] text-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-300 uppercase tracking-wider">
          Quick Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <StatRow label="Total Risks" value={totalRisks} />
        <StatRow label="High Priority" value={highRisks} colorClass="text-red-500" />
        <StatRow label="Medium Priority" value={mediumRisks} colorClass="text-yellow-500" />
        <StatRow label="Low Priority" value={lowRisks} colorClass="text-green-500" />
        <StatRow label="Mitigated" value={`${mitigatedRisks} (${totalRisks ? Math.round((mitigatedRisks/totalRisks)*100) : 0}%)`} colorClass="text-blue-400" />
        <StatRow label="Avg Risk Score" value={avgScore} />
      </CardContent>
    </Card>
  );
};

export default QuickStatsPanel;