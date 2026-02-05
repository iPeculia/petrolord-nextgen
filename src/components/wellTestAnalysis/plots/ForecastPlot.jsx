import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { runForecast } from '@/utils/wellTestAnalysis/forecastSimulator';
import { useWellTestAnalysisContext } from '@/contexts/WellTestAnalysisContext';

const ForecastPlot = () => {
  const { state } = useWellTestAnalysisContext();
  const { matchingResults, testConfig } = state;
  const { parameters } = matchingResults;

  // Generate forecast data on the fly based on current matched parameters
  const forecastData = useMemo(() => {
      // Base Case (current skin)
      const baseCase = runForecast(parameters, testConfig.initialPressure, 365, 500); // 500 bpd target
      
      // Stimulated Case (skin = 0)
      const stimulatedParams = { ...parameters, s: 0 };
      const stimCase = runForecast(stimulatedParams, testConfig.initialPressure, 365, 500);

      // Merge for plotting
      return baseCase.map((d, i) => ({
          time: d.time,
          basePressure: d.pressure,
          stimPressure: stimCase[i].pressure
      }));
  }, [parameters, testConfig]);

  return (
    <div className="h-full w-full bg-slate-900 rounded-lg p-4 border border-slate-800 relative">
       <div className="absolute top-4 right-4 z-10 bg-slate-900/80 p-2 rounded text-xs text-slate-400 border border-slate-700">
           Production Forecast (Constant Rate: 500 STB/D)
       </div>

       <ResponsiveContainer width="100%" height="100%">
          <LineChart data={forecastData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
             <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
             
             <XAxis 
                dataKey="time" 
                type="number" 
                stroke="#94a3b8" 
                tick={{fill: '#64748b', fontSize: 11}}
                label={{ value: 'Time (days)', position: 'bottom', fill: '#94a3b8', offset: 0 }}
             />
             
             <YAxis 
                stroke="#94a3b8" 
                tick={{fill: '#64748b', fontSize: 11}}
                label={{ value: 'Pressure (psia)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                domain={['auto', 'auto']}
             />
             
             <Tooltip 
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#f1f5f9' }}
                itemStyle={{ fontSize: 12 }}
             />
             
             <Legend verticalAlign="top" height={36}/>

             <Line 
                name="Current (Matched)" 
                type="monotone" 
                dataKey="basePressure" 
                stroke="#3B82F6" 
                strokeWidth={2} 
                dot={false}
             />

             <Line 
                name="Stimulated (s=0)" 
                type="monotone" 
                dataKey="stimPressure" 
                stroke="#10B981" 
                strokeWidth={2} 
                strokeDasharray="5 5"
                dot={false}
             />
          </LineChart>
       </ResponsiveContainer>
    </div>
  );
};

export default ForecastPlot;