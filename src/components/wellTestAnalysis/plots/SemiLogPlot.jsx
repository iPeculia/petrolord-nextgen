import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useWellTestAnalysis } from '@/hooks/useWellTestAnalysis';

const SemiLogPlot = () => {
  const { state } = useWellTestAnalysis();
  const { diagnosticData } = state;

  if (!diagnosticData || diagnosticData.length === 0) {
      return <div className="h-full flex items-center justify-center text-slate-500">No diagnostic data available.</div>;
  }

  // Use Horner Time if available, else standard Time
  // Horner Time decreases from infinity to 1, so axis is usually reversed
  const dataKey = diagnosticData[0].hornerTime ? "hornerTime" : "time";
  const label = dataKey === "hornerTime" ? "Horner Time (tp+dt)/dt" : "Time (hrs)";

  return (
    <div className="h-full w-full bg-slate-900 rounded-lg p-4 border border-slate-800 relative">
       <div className="absolute top-4 right-4 z-10 bg-slate-900/80 p-2 rounded text-xs text-slate-400 border border-slate-700">
           Semi-Log Analysis {dataKey === 'hornerTime' ? '(Horner)' : '(MDH)'}
       </div>

       <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
             <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
             
             <XAxis 
                dataKey={dataKey} 
                type="number" 
                scale="log" 
                domain={['auto', 'auto']} 
                stroke="#94a3b8" 
                tick={{fill: '#64748b', fontSize: 11}}
                label={{ value: label, position: 'bottom', fill: '#94a3b8', offset: 0 }}
                reversed={dataKey === "hornerTime"} // Reverse axis for Horner
                allowDataOverflow
             />
             
             <YAxis 
                dataKey="pressure"
                type="number" 
                domain={['auto', 'auto']} 
                stroke="#94a3b8" 
                tick={{fill: '#64748b', fontSize: 11}}
                label={{ value: 'Pressure (psia)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
             />
             
             <Tooltip 
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#f1f5f9' }}
                itemStyle={{ fontSize: 12 }}
                formatter={(value) => value.toFixed(2)}
             />
             
             <Legend />

             <Scatter 
                name="Pressure" 
                data={diagnosticData} 
                fill="#3B82F6" 
                line={{ stroke: '#3B82F6', strokeWidth: 2 }} 
                shape="circle" 
             />
             
             {/* Ideal Semi-Log Straight Line could be overlaid here if matching was active */}

          </ScatterChart>
       </ResponsiveContainer>
    </div>
  );
};

export default SemiLogPlot;