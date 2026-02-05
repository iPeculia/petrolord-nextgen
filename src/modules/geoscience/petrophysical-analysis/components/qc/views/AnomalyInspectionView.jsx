import React, { useState, useMemo } from 'react';
import { useQC } from '@/modules/geoscience/petrophysical-analysis/context/QCContext';
import { useGlobalDataStore } from '@/store/globalDataStore';
import { calculateZScoreSeries, calculateHistogram } from '@/modules/geoscience/petrophysical-analysis/utils/qcCalculations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, BarChart, Bar } from 'recharts';
import { AlertCircle, Activity, BarChart3, List } from 'lucide-react';

const AnomalyInspectionView = () => {
  const { activeWell, wellLogs } = useGlobalDataStore();
  const { qcResults } = useQC();
  
  // Get available curves from active well logs or QC results
  const availableCurves = useMemo(() => {
      if (wellLogs && activeWell && wellLogs[activeWell]) {
          return Object.keys(wellLogs[activeWell]);
      }
      return Object.keys(qcResults);
  }, [wellLogs, activeWell, qcResults]);

  const [selectedCurveId, setSelectedCurveId] = useState(availableCurves[0] || '');
  const [sensitivity, setSensitivity] = useState(3.0); // Z-Score Threshold

  // Derived Data
  const analysisData = useMemo(() => {
      if (!activeWell || !wellLogs[activeWell] || !selectedCurveId) return null;
      
      const curve = wellLogs[activeWell][selectedCurveId];
      if (!curve) return null;

      // 1. Calculate Z-Scores for plotting
      const zScoreData = calculateZScoreSeries(curve.value_array, curve.depth_array);
      
      // 2. Calculate Histogram
      const histogramData = calculateHistogram(curve.value_array, 30);
      
      // 3. Filter Outliers based on current sensitivity slider
      const currentOutliers = zScoreData.filter(d => Math.abs(d.zScore) > sensitivity);

      return {
          curveName: curve.log_name,
          unit: curve.unit,
          zScoreData,
          histogramData,
          outliers: currentOutliers
      };
  }, [activeWell, wellLogs, selectedCurveId, sensitivity]);

  if (!selectedCurveId) {
      return (
          <div className="flex items-center justify-center h-full text-slate-500">
             <div className="text-center">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No curves available for inspection.</p>
             </div>
          </div>
      );
  }

  return (
    <div className="space-y-6 pb-10 h-full flex flex-col">
        {/* Controls Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <div>
                <Label className="mb-2 block text-slate-400">Target Curve</Label>
                <Select value={selectedCurveId} onValueChange={setSelectedCurveId}>
                    <SelectTrigger className="bg-slate-950 border-slate-700">
                        <SelectValue placeholder="Select curve..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                        {availableCurves.map(c => (
                            <SelectItem key={c} value={c}>
                                {wellLogs?.[activeWell]?.[c]?.log_name || c}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <div className="flex justify-between mb-2">
                    <Label className="text-slate-400">Sensitivity Threshold</Label>
                    <span className="text-xs font-mono text-emerald-400">{sensitivity.toFixed(1)}σ</span>
                </div>
                <Slider 
                    value={[sensitivity]} 
                    min={1.0} max={5.0} step={0.1}
                    onValueChange={([val]) => setSensitivity(val)}
                    className="py-2"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>Strict (1.0)</span>
                    <span>Loose (5.0)</span>
                </div>
            </div>
            <div className="flex flex-col justify-center">
                <div className="flex gap-4 items-center justify-end">
                    <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase">Outliers Found</p>
                        <p className="text-2xl font-bold text-white">{analysisData?.outliers?.length || 0}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase">Percentage</p>
                        <p className="text-2xl font-bold text-white">
                            {analysisData ? ((analysisData.outliers.length / analysisData.zScoreData.length) * 100).toFixed(1) : 0}%
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
            {/* Z-Score Plot */}
            <Card className="bg-slate-900 border-slate-800 flex flex-col">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-400" /> Z-Score Analysis
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis 
                                type="number" 
                                dataKey="depth" 
                                name="Depth" 
                                unit="m" 
                                stroke="#64748b" 
                                fontSize={12}
                                domain={['auto', 'auto']}
                            />
                            <YAxis 
                                type="number" 
                                dataKey="zScore" 
                                name="Z-Score" 
                                stroke="#64748b" 
                                fontSize={12} 
                            />
                            <Tooltip 
                                cursor={{ strokeDasharray: '3 3' }}
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                            />
                            <ReferenceLine y={sensitivity} stroke="#ef4444" strokeDasharray="3 3" />
                            <ReferenceLine y={-sensitivity} stroke="#ef4444" strokeDasharray="3 3" />
                            <ReferenceLine y={0} stroke="#94a3b8" />
                            <Scatter 
                                name="Data Points" 
                                data={analysisData?.zScoreData} 
                                fill="#3b82f6" 
                                shape="circle" 
                                r={2}
                            />
                        </ScatterChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Histogram */}
            <Card className="bg-slate-900 border-slate-800 flex flex-col">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-emerald-400" /> Data Distribution
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analysisData?.histogramData} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis 
                                dataKey="name" 
                                stroke="#64748b" 
                                fontSize={10}
                                angle={-45}
                                textAnchor="end"
                                height={50}
                            />
                            <YAxis stroke="#64748b" fontSize={12} />
                            <Tooltip 
                                cursor={{ fill: '#1e293b', opacity: 0.5 }}
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                            />
                            <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>

        {/* Outliers List */}
        <Card className="bg-slate-900 border-slate-800 flex-1 flex flex-col min-h-[250px]">
            <CardHeader className="pb-2">
                 <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <List className="w-4 h-4 text-amber-400" /> Detected Outliers ({analysisData?.outliers?.length})
                    </CardTitle>
                    <Badge variant="outline" className="border-slate-700 text-slate-400">
                        Values &gt; {sensitivity}σ
                    </Badge>
                 </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[200px] w-full">
                    <Table>
                        <TableHeader className="bg-slate-950 sticky top-0">
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="text-slate-400">Depth (m)</TableHead>
                                <TableHead className="text-slate-400">Value ({analysisData?.unit})</TableHead>
                                <TableHead className="text-slate-400">Z-Score</TableHead>
                                <TableHead className="text-slate-400 text-right">Severity</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {analysisData?.outliers?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                                        No outliers detected at current sensitivity level.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                analysisData?.outliers.map((outlier, idx) => (
                                    <TableRow key={idx} className="border-slate-800 hover:bg-slate-800/50">
                                        <TableCell className="font-mono text-slate-300">{outlier.depth.toFixed(2)}</TableCell>
                                        <TableCell className="font-mono text-slate-300">{outlier.value.toFixed(3)}</TableCell>
                                        <TableCell className={`font-mono font-medium ${outlier.zScore > 0 ? 'text-amber-400' : 'text-blue-400'}`}>
                                            {outlier.zScore > 0 ? '+' : ''}{outlier.zScore.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {Math.abs(outlier.zScore) > 4.5 ? (
                                                <Badge className="bg-red-500/20 text-red-400 border-0">Extreme</Badge>
                                            ) : (
                                                <Badge className="bg-amber-500/20 text-amber-400 border-0">Moderate</Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
        </Card>
    </div>
  );
};

export default AnomalyInspectionView;