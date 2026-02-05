import React, { useMemo, useState } from 'react';
import { useReservoirSimulation } from '@/context/ReservoirSimulationContext';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded shadow-xl text-xs">
        <p className="font-bold text-slate-200 mb-2">Day: {label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-400 capitalize">{entry.name}:</span>
            <span className="font-mono text-slate-200">
                {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ChartsView = () => {
  const { state } = useReservoirSimulation();
  const { selectedModel, simulationState } = state || {};
  const { currentTimeStep } = simulationState || {};

  const [selectedWell, setSelectedWell] = useState('all');

  // Format data for Recharts
  const chartData = useMemo(() => {
    if (!selectedModel || !selectedModel.data || !selectedModel.data.production) return [];

    const prodData = selectedModel.data.production;
    const steps = selectedModel.timeSteps || [];
    
    // Combine arrays into object array
    return steps.map((t, i) => {
        const point = { 
            name: i, // Time step index
            time: typeof t === 'number' ? t : i,
        };
        
        if (selectedWell === 'all') {
            // Field Totals
            if (prodData.field) {
                point.oilRate = prodData.field.oilRate[i];
                point.waterRate = prodData.field.waterRate[i];
                point.gasRate = prodData.field.gasRate[i];
                point.waterCut = prodData.field.waterCut[i] * 100; // percent
                point.cumulativeOil = prodData.field.cumulativeOil[i];
            }
        } else {
            // Specific Well
            const wellData = prodData.wells[selectedWell];
            if (wellData) {
                point.oilRate = wellData.oilRate[i];
                point.waterRate = wellData.waterRate[i];
                point.gasRate = wellData.gasRate[i];
                point.injectionRate = wellData.injectionRate ? wellData.injectionRate[i] : 0;
                point.waterCut = wellData.waterCut[i] * 100;
                point.pressure = wellData.pressure[i];
            }
        }
        return point;
    });
  }, [selectedModel, selectedWell]);

  const wells = useMemo(() => {
      if (!selectedModel || !selectedModel.wells) return [];
      return selectedModel.wells.map(w => ({ id: w.id, type: w.type }));
  }, [selectedModel]);

  if (!selectedModel || !selectedModel.data || !selectedModel.data.production) {
      return (
          <div className="flex items-center justify-center h-full text-slate-500">
              No production data available for this model.
          </div>
      );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 p-4 gap-4 overflow-y-auto">
      {/* Controls */}
      <div className="flex items-center justify-between">
         <h2 className="text-lg font-semibold text-slate-200">Production Performance</h2>
         <Select value={selectedWell} onValueChange={setSelectedWell}>
            <SelectTrigger className="w-[200px] bg-slate-900 border-slate-800">
                <SelectValue placeholder="Select Scope" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800">
                <SelectItem value="all">Field Total</SelectItem>
                {wells.map(w => (
                    <SelectItem key={w.id} value={w.id}>
                        {w.id} ({w.type})
                    </SelectItem>
                ))}
            </SelectContent>
         </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-[500px]">
         {/* Chart 1: Rates */}
         <Card className="bg-slate-900/50 border-slate-800 flex flex-col">
            <CardHeader className="py-3 px-4 border-b border-slate-800/50">
                <CardTitle className="text-sm font-medium text-slate-300">
                    {selectedWell === 'all' ? 'Field Production Rates' : 'Well Rates'}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-4 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                        <Line type="monotone" dataKey="oilRate" name="Oil Rate (stb/d)" stroke="#10b981" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="waterRate" name="Water Rate (stb/d)" stroke="#3b82f6" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="gasRate" name="Gas Rate (mcf/d)" stroke="#f59e0b" strokeWidth={2} dot={false} />
                        {selectedWell !== 'all' && (
                             <Line type="monotone" dataKey="injectionRate" name="Inj Rate (stb/d)" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                        )}
                        {/* Current Time Indicator */}
                        {currentTimeStep !== undefined && (
                             <Line data={[{name: currentTimeStep}]} activeDot={{r: 6, fill: 'white'}} /> 
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
         </Card>

         {/* Chart 2: Cumulative / Pressure */}
         <Card className="bg-slate-900/50 border-slate-800 flex flex-col">
             <CardHeader className="py-3 px-4 border-b border-slate-800/50">
                <CardTitle className="text-sm font-medium text-slate-300">
                    {selectedWell === 'all' ? 'Cumulative Production' : 'Pressure & Water Cut'}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-4 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    {selectedWell === 'all' ? (
                        <AreaChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                            <YAxis stroke="#94a3b8" fontSize={10} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: '10px' }} />
                            <Area type="monotone" dataKey="cumulativeOil" name="Cum Oil (stb)" stroke="#059669" fill="#059669" fillOpacity={0.2} />
                        </AreaChart>
                    ) : (
                        <LineChart data={chartData}>
                             <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                             <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                             <YAxis yAxisId="left" stroke="#94a3b8" fontSize={10} />
                             <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={10} unit="%" />
                             <Tooltip content={<CustomTooltip />} />
                             <Legend wrapperStyle={{ fontSize: '10px' }} />
                             <Line yAxisId="left" type="monotone" dataKey="pressure" name="BHP (psi)" stroke="#ec4899" strokeWidth={2} dot={false} />
                             <Line yAxisId="right" type="monotone" dataKey="waterCut" name="Water Cut (%)" stroke="#3b82f6" strokeWidth={2} strokeDasharray="3 3" dot={false} />
                        </LineChart>
                    )}
                </ResponsiveContainer>
            </CardContent>
         </Card>
      </div>
    </div>
  );
};

export default ChartsView;