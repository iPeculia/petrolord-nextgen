import React, { useRef } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import { Download, Maximize2, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import html2canvas from 'html2canvas';

const MBChart = ({ 
  title, 
  data, 
  series = [], 
  xAxisKey = 'x', 
  type = 'line',
  yAxisLabel,
  xAxisLabel,
  height = 400,
  className
}) => {
  const chartRef = useRef(null);

  const handleExport = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = `${title.replace(/\s+/g, '_')}_chart.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  // Define colors for series
  const colors = ['#BFFF00', '#3B82F6', '#F97316', '#EF4444', '#A855F7', '#10B981'];

  return (
    <Card className={cn("w-full border-slate-800 bg-slate-900/50", className)}>
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b border-slate-800">
        <CardTitle className="text-base font-medium text-slate-200">{title}</CardTitle>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" onClick={handleExport}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4" ref={chartRef}>
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer>
            {type === 'scatter' ? (
              <ScatterChart margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis 
                  type="number" 
                  dataKey={xAxisKey} 
                  name={xAxisLabel} 
                  stroke="#94A3B8"
                  tick={{ fill: '#94A3B8' }}
                  label={{ value: xAxisLabel, position: 'bottom', fill: '#94A3B8', offset: 0 }} 
                />
                <YAxis 
                  type="number" 
                  stroke="#94A3B8"
                  tick={{ fill: '#94A3B8' }}
                  label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', fill: '#94A3B8' }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#F8FAFC' }}
                  itemStyle={{ color: '#F8FAFC' }}
                  cursor={{ strokeDasharray: '3 3' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                {series.map((s, i) => (
                  <Scatter 
                    key={s.key} 
                    name={s.name} 
                    data={data} 
                    fill={s.color || colors[i % colors.length]} 
                    line={s.line || false}
                  />
                ))}
              </ScatterChart>
            ) : (
              <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis 
                  dataKey={xAxisKey} 
                  stroke="#94A3B8"
                  tick={{ fill: '#94A3B8' }}
                  label={{ value: xAxisLabel, position: 'bottom', fill: '#94A3B8', offset: 0 }}
                />
                <YAxis 
                  stroke="#94A3B8"
                  tick={{ fill: '#94A3B8' }}
                  label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', fill: '#94A3B8' }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#F8FAFC' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                {series.map((s, i) => (
                  <Line
                    key={s.key}
                    type="monotone"
                    dataKey={s.key}
                    name={s.name}
                    stroke={s.color || colors[i % colors.length]}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MBChart;