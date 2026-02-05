import React, { useMemo, useState } from 'react';
import { useAnalytics } from '@/modules/geoscience/petrophysical-analysis/context/AnalyticsContext';
import { calculateStatistics, generateHistogramData } from '@/modules/geoscience/petrophysical-analysis/utils/analyticsCalculations';
import { HistogramChart } from '../charts/GenericCharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CurveStatsWidget = () => {
  const { activeLogs, selectedCurves } = useAnalytics();
  const [activeCurve, setActiveCurve] = useState(selectedCurves[0] || '');

  // Update active curve if selection changes and current is invalid
  React.useEffect(() => {
      if (selectedCurves.length > 0 && !selectedCurves.includes(activeCurve)) {
          setActiveCurve(selectedCurves[0]);
      }
  }, [selectedCurves, activeCurve]);

  const stats = useMemo(() => {
    if (!activeCurve || !activeLogs[activeCurve]) return null;
    return calculateStatistics(activeLogs[activeCurve].value_array);
  }, [activeCurve, activeLogs]);

  const histogram = useMemo(() => {
    if (!activeCurve || !activeLogs[activeCurve]) return [];
    return generateHistogramData(activeLogs[activeCurve].value_array);
  }, [activeCurve, activeLogs]);

  if (!activeCurve) return <div className="text-slate-500 text-sm">Select a curve from the toolbar to view statistics.</div>;

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex justify-between items-center">
        <Select value={activeCurve} onValueChange={setActiveCurve}>
          <SelectTrigger className="w-[180px] h-8 bg-slate-900 border-slate-700 text-xs">
            <SelectValue placeholder="Select Curve" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
             {selectedCurves.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Stats Table */}
        <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800/50">
           <h4 className="text-xs font-semibold text-slate-400 uppercase mb-3">Descriptive Statistics</h4>
           {stats ? (
             <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                <StatRow label="Minimum" value={stats.min.toFixed(4)} />
                <StatRow label="Maximum" value={stats.max.toFixed(4)} />
                <StatRow label="Mean" value={stats.mean.toFixed(4)} />
                <StatRow label="Median" value={stats.median.toFixed(4)} />
                <StatRow label="Std Dev" value={stats.stdDev.toFixed(4)} />
                <StatRow label="Variance" value={stats.variance.toFixed(4)} />
                <StatRow label="P10" value={stats.p10.toFixed(4)} />
                <StatRow label="P90" value={stats.p90.toFixed(4)} />
                <StatRow label="Count" value={stats.count} />
             </div>
           ) : (
             <div className="text-slate-500 text-xs">No valid data points</div>
           )}
        </div>

        {/* Histogram */}
        <div className="bg-slate-950/50 rounded-lg border border-slate-800/50 p-2 flex flex-col">
            <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2 px-2">Distribution</h4>
            <div className="flex-1 min-h-[150px]">
                <HistogramChart data={histogram} color="#38bdf8" />
            </div>
        </div>
      </div>
    </div>
  );
};

const StatRow = ({ label, value }) => (
    <div className="flex justify-between border-b border-slate-800/50 pb-1 last:border-0">
        <span className="text-slate-400">{label}</span>
        <span className="font-mono text-slate-200">{value}</span>
    </div>
);

export default CurveStatsWidget;