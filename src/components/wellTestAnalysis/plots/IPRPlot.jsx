import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Label } from 'recharts';
import { calculateIPR } from '@/utils/wellTestAnalysis/iprCalculator';
import { useWellTestAnalysisContext } from '@/contexts/WellTestAnalysisContext';

const IPRPlot = () => {
  const { state } = useWellTestAnalysisContext();
  const { matchingResults, testConfig } = state;
  const { flowCapacity } = matchingResults;

  const iprData = useMemo(() => {
      if (!flowCapacity?.pi) return [];
      return calculateIPR(flowCapacity.pi, testConfig.initialPressure, testConfig.fluidType);
  }, [flowCapacity, testConfig]);

  if (!flowCapacity) return <div className="flex items-center justify-center h-full text-slate-500">Perform match to see IPR</div>;

  return (
    <div className="h-full w-full bg-slate-900 rounded-lg p-4 border border-slate-800 relative">
       <div className="absolute top-4 right-4 z-10 bg-slate-900/80 p-2 rounded text-xs text-slate-400 border border-slate-700">
           Inflow Performance Relationship
       </div>

       <ResponsiveContainer width="100%" height="100%">
          <LineChart data={iprData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
             <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
             
             <XAxis 
                dataKey="rate" 
                type="number" 
                stroke="#94a3b8" 
                tick={{fill: '#64748b', fontSize: 11}}
                label={{ value: 'Rate (STB/D)', position: 'bottom', fill: '#94a3b8', offset: 0 }}
             />
             
             <YAxis 
                dataKey="pressure"
                type="number" 
                stroke="#94a3b8" 
                tick={{fill: '#64748b', fontSize: 11}}
                label={{ value: 'Pressure (psia)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                domain={[0, 'auto']}
             />
             
             <Tooltip 
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#f1f5f9' }}
                itemStyle={{ fontSize: 12 }}
             />

             <Line 
                type="monotone" 
                dataKey="pressure" 
                stroke="#F59E0B" 
                strokeWidth={3} 
                dot={false}
             />
             
             {/* AOF Marker */}
             <ReferenceLine x={iprData[0]?.rate} stroke="red" strokeDasharray="3 3">
                <Label value="AOF" position="insideTopRight" fill="red" fontSize={10} />
             </ReferenceLine>

          </LineChart>
       </ResponsiveContainer>
    </div>
  );
};

export default IPRPlot;