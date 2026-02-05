import React from 'react';
import { useRiskAnalysis } from '@/context/RiskAnalysisContext';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell, ReferenceLine, Label } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#1a1a1a] border border-[#333] p-3 rounded shadow-lg text-xs z-50">
        <p className="font-bold text-slate-200 mb-1">{data.title}</p>
        <p className="text-slate-400">Score: <span className="text-slate-200">{data.risk_score.toFixed(1)}</span></p>
        <p className="text-slate-400">Prob: <span className="text-slate-200">{data.x}%</span></p>
        <p className="text-slate-400">Impact: <span className="text-slate-200">${data.y.toLocaleString()}</span></p>
      </div>
    );
  }
  return null;
};

const RiskMatrix = () => {
  const { currentProject, riskRegister } = useRiskAnalysis();
  
  if (!currentProject) return null;

  const projectRisks = riskRegister.filter(r => r.project_id === currentProject.project_id);
  
  const data = projectRisks.map(r => ({
    x: r.probability_percent,
    y: r.impact_value,
    z: r.risk_score, // Size or intensity
    risk_score: r.risk_score,
    title: r.title,
    id: r.risk_id
  }));

  const maxImpact = Math.max(...data.map(d => d.y), 1000000) * 1.1;

  const getColor = (score) => {
    if (score > 15) return '#ef4444'; // Red
    if (score >= 5) return '#eab308'; // Yellow
    return '#22c55e'; // Green
  };

  return (
    <Card className="bg-[#1a1a1a] border-[#333] text-slate-200 h-full flex flex-col">
        <CardHeader className="pb-2 border-b border-[#333] shrink-0">
            <CardTitle className="text-sm font-medium text-slate-300">Risk Matrix</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 min-h-[300px] p-4">
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <XAxis 
                        type="number" 
                        dataKey="x" 
                        name="Probability" 
                        unit="%" 
                        domain={[0, 100]} 
                        stroke="#64748b"
                        tick={{fill: '#64748b', fontSize: 10}}
                    >
                        <Label value="Probability (%)" offset={-10} position="insideBottom" fill="#64748b" fontSize={12} />
                    </XAxis>
                    <YAxis 
                        type="number" 
                        dataKey="y" 
                        name="Impact" 
                        unit="$" 
                        domain={[0, maxImpact]} 
                        stroke="#64748b"
                        tick={{fill: '#64748b', fontSize: 10}}
                        tickFormatter={(value) => `$${value/1000}k`}
                    >
                         <Label value="Impact ($)" angle={-90} position="insideLeft" fill="#64748b" fontSize={12} />
                    </YAxis>
                    <ZAxis type="number" dataKey="z" range={[50, 400]} name="Score" />
                    <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                    <ReferenceLine x={50} stroke="#333" strokeDasharray="3 3" />
                    <ReferenceLine y={maxImpact/2} stroke="#333" strokeDasharray="3 3" />
                    <Scatter name="Risks" data={data}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getColor(entry.risk_score)} fillOpacity={0.8} stroke="#fff" strokeWidth={1} />
                        ))}
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
  );
};

export default RiskMatrix;