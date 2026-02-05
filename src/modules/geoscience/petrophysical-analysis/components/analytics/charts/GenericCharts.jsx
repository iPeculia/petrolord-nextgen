import React from 'react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  LineChart, Line, ScatterChart, Scatter, ZAxis, Legend 
} from 'recharts';

const chartTheme = {
  grid: "#334155",
  text: "#94a3b8",
  tooltipBg: "#0f172a",
  tooltipBorder: "#1e293b"
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950 border border-slate-800 p-2 rounded shadow-xl text-xs">
        <p className="font-medium text-slate-300 mb-1">{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(4) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const HistogramChart = ({ data, color = "#8884d8", dataKey = "count", xKey = "label" }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
        <XAxis dataKey={xKey} stroke={chartTheme.text} fontSize={10} tick={{fill: chartTheme.text}} />
        <YAxis stroke={chartTheme.text} fontSize={10} tick={{fill: chartTheme.text}} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey={dataKey} fill={color} radius={[2, 2, 0, 0]} name="Count" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const CrossPlotChart = ({ data, xKey, yKey, name }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
        <XAxis type="number" dataKey={xKey} name={xKey} stroke={chartTheme.text} fontSize={10} label={{ value: xKey, position: 'bottom', fill: chartTheme.text, fontSize: 10 }} />
        <YAxis type="number" dataKey={yKey} name={yKey} stroke={chartTheme.text} fontSize={10} label={{ value: yKey, angle: -90, position: 'insideLeft', fill: chartTheme.text, fontSize: 10 }} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
        <Scatter name={name} data={data} fill="#BFFF00" fillOpacity={0.6} shape="circle" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export const SimpleLineChart = ({ data, lines }) => {
  const colors = ["#BFFF00", "#38bdf8", "#f472b6", "#a78bfa"];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
        <XAxis dataKey="depth" type="number" domain={['auto', 'auto']} stroke={chartTheme.text} fontSize={10} />
        <YAxis stroke={chartTheme.text} fontSize={10} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {lines.map((line, idx) => (
           <Line 
             key={line.key} 
             type="monotone" 
             dataKey={line.key} 
             stroke={line.color || colors[idx % colors.length]} 
             dot={false} 
             strokeWidth={1.5}
             name={line.name}
           />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

// Default View Component to resolve default import errors
const GenericCharts = () => {
  // Sample Data for Preview
  const histogramData = [
    { label: '0-10', count: 20 }, { label: '10-20', count: 45 },
    { label: '20-30', count: 30 }, { label: '30-40', count: 15 },
    { label: '40-50', count: 10 }
  ];

  const scatterData = Array.from({ length: 50 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    z: Math.random() * 100
  }));

  const lineData = Array.from({ length: 20 }, (_, i) => ({
    depth: i * 100,
    gr: 20 + Math.random() * 80,
    res: 1 + Math.random() * 10
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 h-80">
        <h3 className="text-sm font-medium text-slate-300 mb-4">Porosity Distribution</h3>
        <HistogramChart data={histogramData} color="#38bdf8" />
      </div>
      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 h-80">
        <h3 className="text-sm font-medium text-slate-300 mb-4">Porosity vs Permeability</h3>
        <CrossPlotChart data={scatterData} xKey="x" yKey="y" name="Sample Data" />
      </div>
      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 h-80 col-span-1 lg:col-span-2">
        <h3 className="text-sm font-medium text-slate-300 mb-4">Depth Trends</h3>
        <SimpleLineChart 
          data={lineData} 
          lines={[
            { key: 'gr', name: 'Gamma Ray', color: '#BFFF00' }, 
            { key: 'res', name: 'Resistivity', color: '#f472b6' }
          ]} 
        />
      </div>
    </div>
  );
};

export default GenericCharts;