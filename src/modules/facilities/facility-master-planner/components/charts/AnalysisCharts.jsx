import React from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  ComposedChart, Area, ReferenceLine, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';

// --- Shared Components ---

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded shadow-xl text-xs z-50">
        <p className="font-bold text-white mb-2 border-b border-slate-800 pb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
            <span className="text-slate-300">{entry.name}:</span>
            <span className="font-mono text-white font-medium">
                {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
                {entry.unit ? ` ${entry.unit}` : ''}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// --- Chart Components ---

// 1. Capacity Utilization Chart
export const CapacityUtilizationChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" unit="%" fontSize={10} />
            <YAxis dataKey="name" type="category" width={90} stroke="#94a3b8" fontSize={10} tick={{fill: '#cbd5e1'}} />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <ReferenceLine x={85} stroke="#f59e0b" strokeDasharray="3 3" />
            <ReferenceLine x={95} stroke="#ef4444" strokeDasharray="3 3" />
            <Bar dataKey="utilization" name="Utilization %" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.utilization > 95 ? '#ef4444' : entry.utilization > 85 ? '#f59e0b' : '#10b981'} />
                ))}
            </Bar>
        </BarChart>
    </ResponsiveContainer>
);

// 2. Capacity Trend Chart
export const CapacityTrendChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
            <defs>
                <linearGradient id="colorOil" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickMargin={10} />
            <YAxis stroke="#94a3b8" fontSize={12} label={{ value: 'Rate (kbpd)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            
            <Area type="monotone" dataKey="oil_production" name="Oil Forecast" stroke="#3b82f6" fillOpacity={1} fill="url(#colorOil)" />
            <Line type="stepAfter" dataKey="capacity_limit" name="Facility Capacity" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="5 5" />
            <Line type="monotone" dataKey="water_production" name="Water Cut" stroke="#06b6d4" strokeWidth={2} dot={false} />
        </ComposedChart>
    </ResponsiveContainer>
);

// 3. Bottleneck Impact Chart
export const BottleneckImpactChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="unit_name" stroke="#94a3b8" fontSize={11} />
            <YAxis stroke="#94a3b8" fontSize={11} />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="production_loss" name="Deferred Production (bpd)" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={40} />
            <Bar dataKey="potential_gain" name="Optimized Gain (bpd)" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
        </BarChart>
    </ResponsiveContainer>
);

// 4. Capex Breakdown Chart
export const CapexBreakdownChart = ({ data }) => {
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right"
                    wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};

// 5. Scenario Comparison Chart
export const ScenarioComparisonChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} label={{ value: 'NPV ($M)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="base_case_npv" name="Base Case" stroke="#3b82f6" strokeWidth={3} dot={{r:4}} activeDot={{r:6}} />
            <Line type="monotone" dataKey="optimistic_npv" name="Upside Case" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
            <Line type="monotone" dataKey="pessimistic_npv" name="Downside Case" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
        </LineChart>
    </ResponsiveContainer>
);

// 6. Expansion Roadmap Chart (Timeline)
export const ExpansionRoadmapChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" dataKey="year" name="Year" domain={['dataMin - 1', 'dataMax + 1']} stroke="#94a3b8" tickCount={data.length + 2} />
            <YAxis type="number" dataKey="capacity_addition" name="Capacity Add" stroke="#94a3b8" label={{ value: 'Added Capacity', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
            <ZAxis dataKey="capex" range={[100, 1000]} name="CAPEX" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
            <Legend />
            <Scatter name="Expansion Projects" data={data} fill="#8884d8">
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.type === 'Oil' ? '#3b82f6' : '#f59e0b'} />
                ))}
            </Scatter>
        </ScatterChart>
    </ResponsiveContainer>
);