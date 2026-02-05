import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Colors ---
const COLORS = ['#BFFF00', '#38BDF8', '#A78BFA', '#F472B6', '#FB923C', '#FACC15', '#4ADE80'];
const DARK_BG = '#1E293B';
const GRID_COLOR = '#334155';
const TEXT_COLOR = '#94A3B8';

// --- KPI Card ---
export const KPICard = ({ title, value, subtext, trend, icon: Icon, color = "text-[#BFFF00]" }) => {
  let TrendIcon = Minus;
  let trendColor = "text-slate-400";
  
  if (trend > 0) {
    TrendIcon = ArrowUp;
    trendColor = "text-emerald-400";
  } else if (trend < 0) {
    TrendIcon = ArrowDown;
    trendColor = "text-red-400";
  }

  return (
    <Card className="bg-[#1E293B] border-slate-800 hover:border-slate-700 transition-all">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-400">{title}</p>
            <h3 className="text-2xl font-bold text-white mt-2">{value}</h3>
          </div>
          <div className={cn("p-2 rounded-lg bg-slate-800/50", color)}>
            {Icon && <Icon className="w-5 h-5" />}
          </div>
        </div>
        {(subtext || trend !== undefined) && (
          <div className="flex items-center mt-4 text-xs">
            {trend !== undefined && (
              <span className={cn("flex items-center font-medium mr-2", trendColor)}>
                <TrendIcon className="w-3 h-3 mr-1" />
                {Math.abs(trend)}%
              </span>
            )}
            <span className="text-slate-500">{subtext}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// --- Bar Chart Widget ---
export const BarChartWidget = ({ title, data, dataKey, xKey = "name", color = "#BFFF00", height = 300 }) => (
  <Card className="bg-[#1E293B] border-slate-800 h-full">
    <CardHeader>
      <CardTitle className="text-lg text-white">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
            <XAxis dataKey={xKey} stroke={TEXT_COLOR} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke={TEXT_COLOR} fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: DARK_BG, borderColor: GRID_COLOR, color: '#fff' }}
              itemStyle={{ color: '#fff' }}
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            />
            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

// --- Line Chart Widget ---
export const LineChartWidget = ({ title, data, lines = [], xKey = "name", height = 300 }) => (
  <Card className="bg-[#1E293B] border-slate-800 h-full">
    <CardHeader>
      <CardTitle className="text-lg text-white">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
            <XAxis dataKey={xKey} stroke={TEXT_COLOR} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke={TEXT_COLOR} fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: DARK_BG, borderColor: GRID_COLOR, color: '#fff' }}
            />
            <Legend />
            {lines.map((line, index) => (
              <Line 
                key={line.key}
                type="monotone" 
                dataKey={line.key} 
                name={line.name}
                stroke={line.color || COLORS[index % COLORS.length]} 
                strokeWidth={2}
                dot={{ r: 3, fill: line.color || COLORS[index % COLORS.length] }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

// --- Area Chart Widget ---
export const AreaChartWidget = ({ title, data, dataKey, xKey = "name", color = "#BFFF00", height = 300 }) => (
  <Card className="bg-[#1E293B] border-slate-800 h-full">
    <CardHeader>
      <CardTitle className="text-lg text-white">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey={xKey} stroke={TEXT_COLOR} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke={TEXT_COLOR} fontSize={12} tickLine={false} axisLine={false} />
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
            <Tooltip contentStyle={{ backgroundColor: DARK_BG, borderColor: GRID_COLOR, color: '#fff' }} />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              fillOpacity={1} 
              fill={`url(#color${dataKey})`} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

// --- Pie Chart Widget ---
export const PieChartWidget = ({ title, data, dataKey = "value", nameKey = "name", height = 300 }) => (
  <Card className="bg-[#1E293B] border-slate-800 h-full">
    <CardHeader>
      <CardTitle className="text-lg text-white">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey={dataKey}
              nameKey={nameKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: DARK_BG, borderColor: GRID_COLOR, color: '#fff' }} />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);