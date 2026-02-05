import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Line } from 'recharts';
import { useGlobalDataStore } from '@/store/globalDataStore.js';
import { usePetrophysicalStore } from '@/modules/geoscience/petrophysical-analysis/store/petrophysicalStore.js';
import { calculateRegression } from '../../utils/chartUtils';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const CrossPlot = () => {
  const { activeWell, wellLogs } = useGlobalDataStore();
  const { localChanges } = usePetrophysicalStore();
  
  const [xCurve, setXCurve] = useState('NPHI');
  const [yCurve, setYCurve] = useState('RHOB');
  const [colorCurve, setColorCurve] = useState('GR');
  const [showRegression, setShowRegression] = useState(true);

  const logs = activeWell ? wellLogs[activeWell] : {};
  const calculations = localChanges.calculations || {};

  const availableCurves = useMemo(() => {
      const logKeys = Object.keys(logs || {});
      const calcKeys = Object.keys(calculations || {});
      return [...logKeys, ...calcKeys];
  }, [logs, calculations]);

  const plotData = useMemo(() => {
      const getVals = (name) => {
          if (logs[name]) return logs[name].value_array;
          if (calculations[name]) return calculations[name].values;
          return null;
      };

      const xVals = getVals(xCurve);
      const yVals = getVals(yCurve);
      const cVals = getVals(colorCurve);
      
      if (!xVals || !yVals) return [];

      const data = [];
      for (let i = 0; i < xVals.length; i++) {
          if (xVals[i] !== null && yVals[i] !== null && !isNaN(xVals[i]) && !isNaN(yVals[i])) {
              // Simple downsampling for performance
              if (i % 2 === 0) { 
                  data.push({
                      x: xVals[i],
                      y: yVals[i],
                      z: cVals ? cVals[i] : 0
                  });
              }
          }
      }
      return data;
  }, [xCurve, yCurve, colorCurve, logs, calculations]);

  const regression = useMemo(() => {
      if (!showRegression || plotData.length === 0) return null;
      const x = plotData.map(p => p.x);
      const y = plotData.map(p => p.y);
      return calculateRegression(x, y);
  }, [plotData, showRegression]);

  const regressionLine = useMemo(() => {
      if (!regression || plotData.length === 0) return [];
      const minX = Math.min(...plotData.map(p => p.x));
      const maxX = Math.max(...plotData.map(p => p.x));
      
      return [
          { x: minX, y: regression.slope * minX + regression.intercept },
          { x: maxX, y: regression.slope * maxX + regression.intercept }
      ];
  }, [regression, plotData]);

  if (!activeWell) return <div className="h-full flex items-center justify-center text-muted-foreground">Select a well to view crossplot.</div>;

  return (
    <Card className="h-full flex flex-col border-0 shadow-none bg-transparent">
      <div className="p-4 border-b border-border flex items-center flex-wrap gap-4 bg-card/50">
        <div className="w-32">
            <Label className="text-xs text-muted-foreground mb-1 block">X Axis</Label>
            <Select value={xCurve} onValueChange={setXCurve}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                    {availableCurves.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
        <div className="w-32">
            <Label className="text-xs text-muted-foreground mb-1 block">Y Axis</Label>
            <Select value={yCurve} onValueChange={setYCurve}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                    {availableCurves.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
        <div className="w-32">
            <Label className="text-xs text-muted-foreground mb-1 block">Color (Z)</Label>
            <Select value={colorCurve} onValueChange={setColorCurve}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                    {availableCurves.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
        
        <div className="flex items-center space-x-2 ml-auto">
             <Switch id="reg" checked={showRegression} onCheckedChange={setShowRegression} />
             <Label htmlFor="reg" className="text-xs text-muted-foreground">Regression</Label>
        </div>

        {regression && (
             <div className="text-xs text-muted-foreground border-l border-border pl-4">
                 <div>R²: <span className="font-mono text-foreground">{regression.r2.toFixed(3)}</span></div>
                 <div>y = {regression.slope.toFixed(2)}x + {regression.intercept.toFixed(2)}</div>
             </div>
        )}
      </div>

      <div className="flex-1 min-h-0 p-4 bg-[#0f172a]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
                type="number" 
                dataKey="x" 
                name={xCurve} 
                tick={{fontSize: 10, fill: '#94a3b8'}}
                label={{ value: xCurve, position: 'bottom', offset: 0, fill: '#94a3b8' }}
            />
            <YAxis 
                type="number" 
                dataKey="y" 
                name={yCurve} 
                tick={{fontSize: 10, fill: '#94a3b8'}}
                label={{ value: yCurve, angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
            />
            <ZAxis type="number" dataKey="z" range={[20, 20]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }} />
            
            <Scatter name="Data" data={plotData} fill="#3b82f6" shape="circle" />
            
            {showRegression && (
                <Scatter 
                    name="Regression" 
                    data={regressionLine} 
                    line={{ stroke: '#ef4444', strokeWidth: 2 }} 
                    shape={() => null} 
                    legendType="none"
                />
            )}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default CrossPlot;