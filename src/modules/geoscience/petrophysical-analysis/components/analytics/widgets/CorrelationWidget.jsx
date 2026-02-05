import React, { useMemo, useState } from 'react';
import { useAnalytics } from '@/modules/geoscience/petrophysical-analysis/context/AnalyticsContext';
import { calculateCorrelation } from '@/modules/geoscience/petrophysical-analysis/utils/analyticsCalculations';
import { CrossPlotChart } from '../charts/GenericCharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CorrelationWidget = ({ mode = "matrix" }) => {
  const { activeLogs, selectedCurves } = useAnalytics();
  const [xAxis, setXAxis] = useState(selectedCurves[0] || '');
  const [yAxis, setYAxis] = useState(selectedCurves[1] || '');

  // Correlation Matrix Calculation
  const matrix = useMemo(() => {
      if (mode !== 'matrix' || selectedCurves.length < 2) return [];
      
      return selectedCurves.map(rowCurve => {
          return selectedCurves.map(colCurve => {
              if (rowCurve === colCurve) return 1;
              const c1 = activeLogs[rowCurve]?.value_array;
              const c2 = activeLogs[colCurve]?.value_array;
              return calculateCorrelation(c1, c2);
          });
      });
  }, [mode, selectedCurves, activeLogs]);

  // Crossplot Data Preparation
  const crossplotData = useMemo(() => {
      if (mode !== 'crossplot' || !xAxis || !yAxis || !activeLogs[xAxis] || !activeLogs[yAxis]) return [];
      
      const xData = activeLogs[xAxis].value_array;
      const yData = activeLogs[yAxis].value_array;
      const depth = activeLogs[xAxis].depth_array; // Assuming synced depths for now
      
      // Downsample for performance if needed (>2000 points)
      const step = Math.ceil(xData.length / 2000);
      
      const data = [];
      for(let i = 0; i < xData.length; i += step) {
          if (xData[i] !== null && yData[i] !== null && !isNaN(xData[i]) && !isNaN(yData[i])) {
              data.push({
                  [xAxis]: xData[i],
                  [yAxis]: yData[i],
                  depth: depth ? depth[i] : i
              });
          }
      }
      return data;
  }, [mode, xAxis, yAxis, activeLogs]);

  if (mode === 'crossplot') {
      return (
          <div className="flex flex-col h-full gap-4">
              <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">X-Axis:</span>
                      <Select value={xAxis} onValueChange={setXAxis}>
                        <SelectTrigger className="w-[140px] h-8 bg-slate-900 border-slate-700 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                            {selectedCurves.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                  </div>
                  <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Y-Axis:</span>
                      <Select value={yAxis} onValueChange={setYAxis}>
                        <SelectTrigger className="w-[140px] h-8 bg-slate-900 border-slate-700 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                            {selectedCurves.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                  </div>
              </div>
              <div className="flex-1 min-h-[250px] bg-slate-950/30 rounded-lg border border-slate-800/50 p-2">
                  <CrossPlotChart data={crossplotData} xKey={xAxis} yKey={yAxis} name="Well Data" />
              </div>
          </div>
      );
  }

  // Matrix Render
  if (selectedCurves.length < 2) return <div className="text-slate-500 text-sm">Select at least 2 curves to view correlation matrix.</div>;

  return (
      <div className="overflow-auto">
          <table className="w-full border-collapse text-xs text-center">
              <thead>
                  <tr>
                      <th className="p-2 bg-slate-950"></th>
                      {selectedCurves.map(c => <th key={c} className="p-2 font-medium text-slate-400 bg-slate-900/50 border border-slate-800">{c}</th>)}
                  </tr>
              </thead>
              <tbody>
                  {matrix.map((row, i) => (
                      <tr key={selectedCurves[i]}>
                          <td className="p-2 font-medium text-slate-400 bg-slate-900/50 border border-slate-800 text-left">{selectedCurves[i]}</td>
                          {row.map((val, j) => {
                              const color = val > 0 ? `rgba(191, 255, 0, ${Math.abs(val)})` : `rgba(244, 114, 182, ${Math.abs(val)})`;
                              return (
                                  <td key={j} className="p-2 border border-slate-800" style={{ backgroundColor: color, color: Math.abs(val) > 0.5 ? '#000' : '#fff' }}>
                                      {val.toFixed(2)}
                                  </td>
                              );
                          })}
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
  );
};

export default CorrelationWidget;