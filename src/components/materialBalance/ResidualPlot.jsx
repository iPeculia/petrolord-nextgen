import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

const ResidualPlot = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis 
                dataKey="x" 
                type="number" 
                name="X (Model Term)" 
                stroke="#94A3B8" 
                tick={{ fill: '#94A3B8', fontSize: 10 }}
            />
            <YAxis 
                dataKey="residual" 
                type="number" 
                name="Residual" 
                stroke="#94A3B8" 
                tick={{ fill: '#94A3B8', fontSize: 10 }}
            />
            <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#F8FAFC' }}
            />
            <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" />
            <Scatter name="Residuals" data={data} fill="#3B82F6" />
        </ScatterChart>
    </ResponsiveContainer>
  );
};

export default ResidualPlot;