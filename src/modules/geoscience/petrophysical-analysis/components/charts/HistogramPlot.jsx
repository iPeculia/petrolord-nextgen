import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useGlobalDataStore } from '@/store/globalDataStore.js';
import { usePetrophysicalStore } from '@/modules/geoscience/petrophysical-analysis/store/petrophysicalStore.js';
import { calculateHistogram, calculateStatistics } from '../../utils/chartUtils';
import { Label } from '@/components/ui/label';

const HistogramPlot = () => {
  const { activeWell, wellLogs } = useGlobalDataStore();
  const { localChanges } = usePetrophysicalStore();
  const [selectedCurve, setSelectedCurve] = useState('GR');
  const [binCount, setBinCount] = useState(20);

  const logs = activeWell ? wellLogs[activeWell] : {};
  const calculations = localChanges.calculations || {};

  // Merge curve keys
  const availableCurves = useMemo(() => {
      const logKeys = Object.keys(logs || {});
      const calcKeys = Object.keys(calculations || {});
      return [...logKeys, ...calcKeys];
  }, [logs, calculations]);

  // Extract data for selected curve
  const curveData = useMemo(() => {
      let data = [];
      if (logs[selectedCurve]) {
          data = logs[selectedCurve].value_array;
      } else if (calculations[selectedCurve]) {
          data = calculations[selectedCurve].values;
      }
      
      // Filter nulls/NaNs
      return data ? data.filter(v => v !== null && !isNaN(v)) : [];
  }, [selectedCurve, logs, calculations]);

  const histogramData = useMemo(() => calculateHistogram(curveData, binCount), [curveData, binCount]);
  const stats = useMemo(() => calculateStatistics(curveData), [curveData]);

  if (!activeWell) return <div className="h-full flex items-center justify-center text-muted-foreground">Select a well to view histogram.</div>;

  return (
    <Card className="h-full flex flex-col border-0 shadow-none bg-transparent">
      <div className="p-4 border-b border-border flex items-center justify-between gap-4 bg-card/50">
        <div className="flex items-center gap-4">
            <div className="w-40">
                <Label className="text-xs text-muted-foreground mb-1 block">Curve</Label>
                <Select value={selectedCurve} onValueChange={setSelectedCurve}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select Curve" /></SelectTrigger>
                    <SelectContent>
                        {availableCurves.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="w-40">
                <Label className="text-xs text-muted-foreground mb-1 block">Bins: {binCount}</Label>
                <Slider 
                    value={[binCount]} 
                    onValueChange={(v) => setBinCount(v[0])} 
                    min={5} max={100} step={5} 
                    className="py-2"
                />
            </div>
        </div>
        <div className="flex gap-4 text-xs text-muted-foreground border-l border-border pl-4">
            <div>Count: <span className="font-mono text-foreground">{stats.count}</span></div>
            <div>Mean: <span className="font-mono text-foreground">{stats.mean}</span></div>
            <div>Std: <span className="font-mono text-foreground">{stats.std}</span></div>
            <div>Min: <span className="font-mono text-foreground">{stats.min}</span></div>
            <div>Max: <span className="font-mono text-foreground">{stats.max}</span></div>
        </div>
      </div>
      <div className="flex-1 min-h-0 p-4 bg-[#0f172a]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={histogramData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
                dataKey="binLabel" 
                tick={{fontSize: 10, fill: '#94a3b8'}} 
                label={{ value: selectedCurve, position: 'bottom', offset: 0, fill: '#94a3b8', fontSize: 12 }}
            />
            <YAxis 
                tick={{fontSize: 10, fill: '#94a3b8'}}
                label={{ value: 'Frequency', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }}
            />
            <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}
                itemStyle={{ color: '#f8fafc' }}
            />
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                {histogramData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fillOpacity={0.8} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default HistogramPlot;