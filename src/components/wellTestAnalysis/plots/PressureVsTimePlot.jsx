import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useWellTestAnalysis } from '@/hooks/useWellTestAnalysis';

const PressureVsTimePlot = () => {
  const { state } = useWellTestAnalysis();
  const { processedData, plotSettings } = state;

  if (!processedData || processedData.length === 0) {
      return <div className="h-full flex items-center justify-center text-slate-500">No data available to plot</div>;
  }

  return (
    <div className="h-full w-full bg-slate-900 rounded-lg p-4 border border-slate-800">
       <h3 className="text-sm font-semibold text-slate-300 mb-2">Pressure History</h3>
       <ResponsiveContainer width="100%" height="90%">
          <LineChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
             <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
             
             <XAxis 
                dataKey="time" 
                type="number" 
                scale={plotSettings.logScale ? "log" : "linear"}
                domain={['auto', 'auto']}
                stroke="#94a3b8" 
                tick={{fill: '#64748b', fontSize: 12}}
                allowDataOverflow
                label={{ value: 'Time (hrs)', position: 'bottom', fill: '#94a3b8', offset: 0 }} 
             />
             
             <YAxis 
                yAxisId="left"
                stroke="#94a3b8" 
                domain={['auto', 'auto']}
                tick={{fill: '#64748b', fontSize: 12}}
                label={{ value: 'Pressure (psia)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} 
             />
             
             {plotSettings.showRate && (
                <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    stroke="#F97316"
                    domain={['auto', 'auto']}
                    tick={{fill: '#F97316', fontSize: 12}}
                    label={{ value: 'Rate (STB/d)', angle: 90, position: 'insideRight', fill: '#F97316' }} 
                />
             )}

             <Tooltip 
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#f1f5f9' }} 
                labelStyle={{ color: '#94a3b8' }}
                itemStyle={{ fontSize: 12 }}
                formatter={(value) => value.toFixed(2)}
             />
             
             <Legend verticalAlign="top" height={36} />

             <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="pressure" 
                stroke="#BFFF00" 
                name="Pressure"
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 4, fill: '#BFFF00' }}
             />
             
             {plotSettings.showRate && (
                 <Line 
                    yAxisId="right"
                    type="stepAfter" 
                    dataKey="rate" 
                    stroke="#F97316" 
                    name="Rate"
                    strokeWidth={2} 
                    dot={false} 
                    strokeDasharray="5 5"
                 />
             )}
          </LineChart>
       </ResponsiveContainer>
    </div>
  );
};

export default PressureVsTimePlot;