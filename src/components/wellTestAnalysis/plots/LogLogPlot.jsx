import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { useWellTestAnalysis } from '@/hooks/useWellTestAnalysis';

const LogLogPlot = () => {
  const { state } = useWellTestAnalysis();
  const { diagnosticData, plotSettings, flowRegimes } = state;

  if (!diagnosticData || diagnosticData.length === 0) {
      return <div className="h-full flex items-center justify-center text-slate-500">No diagnostic data available. Run setup.</div>;
  }

  // Calculate Delta Pressure for log-log plot (Usually P_initial - P_wf)
  // For buildup: P_ws - P_wf_at_shutin
  // We'll assume the data is already standardized as "Delta Pressure" or similar in a real physics engine
  // For this visualizer, we assume 'pressure' column is absolute, so we calculate delta relative to first point
  const startPressure = diagnosticData[0].pressure;
  
  const plotData = diagnosticData.map(d => ({
      ...d,
      deltaP: Math.abs(d.pressure - startPressure) || 0.1, // Avoid log(0)
      derivative: d.derivative || null
  })).filter(d => d.time > 0.001); // Filter very early times

  return (
    <div className="h-full w-full bg-slate-900 rounded-lg p-4 border border-slate-800 relative">
       <div className="absolute top-4 right-4 z-10 bg-slate-900/80 p-2 rounded text-xs text-slate-400 border border-slate-700">
           Diagnostic Plot (Log-Log)
       </div>

       <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
             <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
             
             <XAxis 
                dataKey="time" 
                type="number" 
                scale="log" 
                domain={['auto', 'auto']} 
                stroke="#94a3b8" 
                tick={{fill: '#64748b', fontSize: 11}}
                label={{ value: 'Elapsed Time (hrs)', position: 'bottom', fill: '#94a3b8', offset: 0 }}
                allowDataOverflow
             />
             
             <YAxis 
                type="number" 
                scale="log" 
                domain={['auto', 'auto']} 
                stroke="#94a3b8" 
                tick={{fill: '#64748b', fontSize: 11}}
                label={{ value: 'Pressure / Derivative (psi)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                allowDataOverflow
             />
             
             <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#f1f5f9' }}
                itemStyle={{ fontSize: 12 }}
                formatter={(value) => typeof value === 'number' ? value.toFixed(2) : value}
             />
             
             <Legend verticalAlign="top" height={36}/>

             {/* Delta Pressure Curve */}
             <Scatter 
                name="ΔP" 
                data={plotData} 
                fill="#3B82F6" 
                line={{ stroke: '#3B82F6', strokeWidth: 1.5 }} 
                lineType="fitting"
                shape="circle" 
                legendType="circle"
             />

             {/* Derivative Curve */}
             {plotSettings.showDerivative && (
                 <Scatter 
                    name="Derivative" 
                    data={plotData} 
                    fill="#BFFF00" 
                    line={{ stroke: '#BFFF00', strokeWidth: 2 }} 
                    lineType="fitting"
                    shape="triangle" 
                    legendType="triangle"
                 />
             )}
             
             {/* Flow Regime Highlights */}
             {plotSettings.showRegimes && flowRegimes.map((regime, idx) => (
                 <ReferenceLine 
                    key={idx} 
                    x={regime.startTime} 
                    stroke="#F97316" 
                    strokeDasharray="5 5" 
                    label={{ 
                        value: regime.type, 
                        position: 'insideTopLeft', 
                        fill: '#F97316', 
                        fontSize: 10,
                        angle: -90
                    }} 
                 />
             ))}

          </ScatterChart>
       </ResponsiveContainer>
    </div>
  );
};

export default LogLogPlot;