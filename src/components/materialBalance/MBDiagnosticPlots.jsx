import React from 'react';
import { ResponsiveContainer, ComposedChart, Scatter, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const MBDiagnosticPlots = ({ data, regression, title, xLabel, yLabel, type }) => {
    if (!data || data.length === 0) {
        return (
            <div className="h-[400px] flex items-center justify-center text-slate-500 border border-dashed border-slate-700 rounded-lg bg-slate-900/50">
                No diagnostic data available. Run diagnostics first.
            </div>
        );
    }

    // Generate regression line points
    const xMin = Math.min(...data.map(d => d.x));
    const xMax = Math.max(...data.map(d => d.x));
    
    // Safety check if regression is valid
    const hasRegression = regression && typeof regression.slope === 'number';
    
    const regressionPoints = hasRegression ? [
        { x: xMin, yReg: regression.slope * xMin + regression.intercept },
        { x: xMax, yReg: regression.slope * xMax + regression.intercept }
    ] : [];

    return (
        <Card className="bg-slate-900 border-slate-800 shadow-xl">
            <CardHeader className="pb-2 border-b border-slate-800">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium text-slate-200">{title}</CardTitle>
                    {hasRegression && (
                        <div className="flex gap-3">
                            <div className="text-xs font-mono text-lime-400 bg-lime-400/10 px-2 py-1 rounded border border-lime-400/20">
                                R² = {regression.r2?.toFixed(4) || "N/A"}
                            </div>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart margin={{ top: 10, right: 30, left: 30, bottom: 30 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                            <XAxis 
                                dataKey="x" 
                                type="number" 
                                domain={['auto', 'auto']} 
                                stroke="#94a3b8" 
                                fontSize={12}
                                tickFormatter={(val) => val < 1 && val > -1 ? val.toFixed(3) : val.toFixed(1)}
                            >
                                <Label value={xLabel} position="bottom" offset={10} fill="#94a3b8" fontSize={12} />
                            </XAxis>
                            <YAxis 
                                dataKey="y" 
                                type="number" 
                                domain={['auto', 'auto']} 
                                stroke="#94a3b8" 
                                fontSize={12}
                            >
                                <Label value={yLabel} angle={-90} position="left" offset={10} fill="#94a3b8" fontSize={12} />
                            </YAxis>
                            <Tooltip 
                                cursor={{ strokeDasharray: '3 3' }}
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                                itemStyle={{ color: '#f8fafc' }}
                                labelStyle={{ color: '#94a3b8' }}
                                formatter={(value) => typeof value === 'number' ? value.toFixed(4) : value}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            
                            <Scatter 
                                name="Data Points" 
                                data={data} 
                                fill="#3b82f6" 
                                shape="circle" 
                                r={5}
                            />
                            
                            {hasRegression && (
                                <Line
                                    name="Regression Fit"
                                    data={regressionPoints}
                                    dataKey="yReg"
                                    stroke="#84cc16"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={false}
                                    isAnimationActive={false}
                                />
                            )}
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default MBDiagnosticPlots;