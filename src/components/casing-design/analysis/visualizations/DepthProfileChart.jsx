import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Cell } from 'recharts';
import { formatNumber } from '@/components/casing-design/utils/calculationUtils';

const DepthProfileChart = ({ sections }) => {
    const data = [...sections]
        .sort((a,b) => a.top_depth - b.top_depth)
        .map((s, i) => ({
            name: `Sec ${i+1}`,
            top: s.top_depth,
            bottom: s.bottom_depth,
            length: s.bottom_depth - s.top_depth,
            weight: s.weight,
            grade: s.grade,
            placeholder: s.top_depth,
            actualLength: s.bottom_depth - s.top_depth
        }));

    const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

    return (
        <Card className="bg-[#1E293B] border-slate-700 h-full">
            <CardHeader>
                <CardTitle className="text-sm font-bold text-slate-300 uppercase tracking-wider">String Profile</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" width={50} tick={{fill: '#94a3b8'}} reversed />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#F8FAFC' }}
                            itemStyle={{ color: '#F8FAFC' }}
                            cursor={{fill: 'transparent'}}
                            formatter={(value, name, props) => {
                                if (name === 'placeholder') return [null, null];
                                return [`${props.payload.top} - ${props.payload.bottom} ft`, 'Interval'];
                            }}
                        />
                    </BarChart>
                </ResponsiveContainer>
                
                {/* Custom CSS Grid Visualization for Depth Profile */}
                <div className="absolute inset-0 top-16 left-6 right-6 bottom-6 flex flex-col gap-1 overflow-y-auto">
                    {data.map((s, i) => (
                        <div key={i} className="relative w-full flex items-center" style={{ height: `${(s.length / (data[data.length-1].bottom)) * 100}%`, minHeight: '30px' }}>
                             <div className="w-16 text-xs text-slate-500 font-mono text-right pr-2 border-r border-slate-700 h-full flex items-start justify-end pt-1">
                                 {formatNumber(s.top, 0)}
                             </div>
                             <div 
                                className="flex-1 mx-2 rounded-md border border-slate-600 flex items-center px-4 justify-between hover:bg-slate-800 transition-colors group"
                                style={{ backgroundColor: `${COLORS[i % COLORS.length]}20`, borderColor: COLORS[i % COLORS.length] }}
                             >
                                 <div className="flex flex-col">
                                     <span className="text-xs font-bold text-white group-hover:text-[#BFFF00]">{s.grade}</span>
                                     <span className="text-[10px] text-slate-400">{s.weight} ppf</span>
                                 </div>
                                 <span className="text-xs font-mono text-slate-300">Length: {formatNumber(s.length, 0)}'</span>
                             </div>
                             {i === data.length - 1 && (
                                 <div className="absolute -bottom-3 left-0 w-16 text-xs text-slate-500 font-mono text-right pr-2">
                                     {formatNumber(s.bottom, 0)}
                                 </div>
                             )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default DepthProfileChart;