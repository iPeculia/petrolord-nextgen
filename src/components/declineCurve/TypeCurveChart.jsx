import React, { useMemo, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Scatter, ComposedChart, ReferenceLine, Legend } from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { generateFetkovichTypeCurves, normalizeWellData } from '@/utils/declineCurve/TypeCurveEngine';
import { useDeclineCurve } from '@/context/DeclineCurveContext';
import { Maximize2, Move } from 'lucide-react';

const TypeCurveChart = () => {
    const { currentWell, activeStream } = useDeclineCurve();
    const [timeShift, setTimeShift] = useState(1); // Multiplier for time (Match Point t)
    const [rateShift, setRateShift] = useState(1); // Multiplier for rate (Match Point q)

    const typeCurves = useMemo(() => generateFetkovichTypeCurves(), []);
    
    // Prepare Type Curve Background Data
    // Recharts needs a unified domain. We'll sample the dimensionless time domain.
    const displayData = useMemo(() => {
        const points = [];
        // tD from 0.01 to 10000
        for(let i=-2; i<=4; i+=0.1) {
            const tdd = Math.pow(10, i);
            const point = { tdd: tdd, tddLog: tdd }; // tddLog for plotting if we want linear axis acting as log
            
            typeCurves.forEach(curve => {
                // Find nearest point
                const p = curve.points.find(cp => Math.abs(Math.log10(cp.x) - Math.log10(tdd)) < 0.05);
                if (p) point[`b_${curve.b}`] = p.y;
            });
            points.push(point);
        }
        return points;
    }, [typeCurves]);

    // Prepare Well Data Overlay
    // well t_norm = t_elapsed * timeShift
    // well q_norm = (q / qPeak) * rateShift
    const wellOverlayData = useMemo(() => {
        if (!currentWell?.data) return [];
        
        const rateKey = activeStream === 'Oil' ? 'oilRate' : activeStream === 'Gas' ? 'gasRate' : 'waterRate';
        
        // Find Peak for initial normalization
        const maxRate = Math.max(...currentWell.data.map(d => d[rateKey] || 0));
        if (maxRate === 0) return [];

        // Normalize raw
        const rawNorm = normalizeWellData(
            currentWell.data.map(d => ({ t: new Date(d.date).getTime()/ (1000*60*60*24), q: d[rateKey] })), 
            maxRate
        );

        // Apply Shifts for Matching
        return rawNorm.map(d => ({
            tdd: d.t_elapsed * timeShift,
            well_qdd: d.q_norm * rateShift,
            originalDate: d.date
        }));

    }, [currentWell, activeStream, timeShift, rateShift]);

    // Combine for Chart? 
    // Recharts struggles with two independent data sources on same axis unless we merge or use XAxis type="number"
    // We will use ComposedChart with Scatter for Well Data and Lines for Type Curves.
    // However, Recharts needs one 'data' array for the X-axis domain usually. 
    // Strategy: Use the displayData as the master frame, and add well points as a separate scatter series
    // But scatter points won't align with the categorical X-axis of the lines perfectly if we just index.
    // Solution: Use XAxis type="number" and scale="log".

    const formatLogTick = (val) => {
        if (val === 0) return "0";
        const log = Math.log10(val);
        return Number.isInteger(log) ? `10^${log}` : "";
    };

    return (
        <div className="h-full flex flex-col gap-4">
            <Card className="flex-1 bg-slate-950 border-slate-800 p-4 relative flex flex-col min-h-[400px]">
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <Badge variant="outline" className="bg-slate-900 text-slate-400 border-slate-700">Fetkovich</Badge>
                </div>
                
                <h3 className="text-xs font-semibold text-slate-400 uppercase mb-2">Type Curve Matching</h3>
                
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                            <XAxis 
                                dataKey="tdd" 
                                type="number" 
                                scale="log" 
                                domain={[0.01, 1000]} 
                                tickFormatter={formatLogTick}
                                stroke="#94a3b8"
                                label={{ value: 'tD (Dimensionless Time)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 10 }}
                                allowDataOverflow
                            />
                            <YAxis 
                                type="number" 
                                scale="log" 
                                domain={[0.001, 1.2]} 
                                tickFormatter={formatLogTick}
                                stroke="#94a3b8"
                                label={{ value: 'qD (Dimensionless Rate)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }}
                                allowDataOverflow
                            />
                            <Tooltip 
                                cursor={{ strokeDasharray: '3 3' }}
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
                                labelFormatter={() => ''}
                            />
                            <Legend verticalAlign="top" height={36}/>
                            
                            {/* Type Curves Background */}
                            {typeCurves.map((curve, idx) => (
                                <Line 
                                    key={curve.name}
                                    data={displayData}
                                    type="monotone" 
                                    dataKey={`b_${curve.b}`} 
                                    stroke={`hsl(${210}, ${10 + idx * 10}%, ${40 + idx * 8}%)`} 
                                    dot={false}
                                    strokeWidth={idx === 6 || idx === 0 ? 2 : 1} // Highlight b=0 and b=1
                                    name={`b=${curve.b}`}
                                    isAnimationActive={false}
                                />
                            ))}

                            {/* Well Data Overlay */}
                            <Scatter 
                                name="Well Data" 
                                data={wellOverlayData} 
                                fill="#22c55e" 
                                shape="circle"
                                line={false}
                                dataKey="well_qdd" // Y value
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Match Controls */}
            <Card className="bg-slate-900 border-slate-800 p-4">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                         <Move className="w-4 h-4 text-blue-400" />
                         <span className="text-xs font-semibold text-slate-300 uppercase">Match Adjustment</span>
                    </div>
                    
                    <div className="flex-1 space-y-3">
                        <div className="flex justify-between text-xs text-slate-400">
                             <span>Time Match (X-Axis Shift)</span>
                             <span className="font-mono text-slate-200">{timeShift.toFixed(2)}x</span>
                        </div>
                        <Slider 
                            value={[Math.log10(timeShift)]} 
                            min={-2} max={2} step={0.01} 
                            onValueChange={(val) => setTimeShift(Math.pow(10, val[0]))}
                            className="w-full"
                        />
                    </div>

                    <div className="flex-1 space-y-3">
                        <div className="flex justify-between text-xs text-slate-400">
                             <span>Rate Match (Y-Axis Shift)</span>
                             <span className="font-mono text-slate-200">{rateShift.toFixed(2)}x</span>
                        </div>
                        <Slider 
                            value={[Math.log10(rateShift)]} 
                            min={-1} max={1} step={0.01} 
                            onValueChange={(val) => setRateShift(Math.pow(10, val[0]))}
                            className="w-full"
                        />
                    </div>
                    
                    <Button variant="outline" className="h-9 border-slate-700 hover:bg-slate-800">
                        Auto-Match
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default TypeCurveChart;