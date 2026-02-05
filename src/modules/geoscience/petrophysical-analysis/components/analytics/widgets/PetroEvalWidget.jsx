import React, { useMemo, useState } from 'react';
import { useAnalytics } from '@/modules/geoscience/petrophysical-analysis/context/AnalyticsContext';
import { petrophysics } from '@/modules/geoscience/petrophysical-analysis/utils/analyticsCalculations';
import { SimpleLineChart } from '../charts/GenericCharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PetroEvalWidget = () => {
    const { activeLogs } = useAnalytics();
    const [densityCurve, setDensityCurve] = useState(Object.keys(activeLogs).find(k => k.includes('RHOB') || k.includes('DEN')) || '');
    const [resistivityCurve, setResistivityCurve] = useState(Object.keys(activeLogs).find(k => k.includes('RES') || k.includes('LLD')) || '');
    
    // Parameters
    const [params, setParams] = useState({
        rhoMa: 2.65,
        rhoFl: 1.0,
        Rw: 0.05,
        m: 2,
        n: 2,
        a: 1
    });

    const handleParamChange = (key, value) => {
        setParams(prev => ({ ...prev, [key]: parseFloat(value) }));
    };

    // Calculation
    const calculatedData = useMemo(() => {
        if (!densityCurve || !activeLogs[densityCurve]) return [];
        
        const den = activeLogs[densityCurve].value_array;
        const res = resistivityCurve && activeLogs[resistivityCurve] ? activeLogs[resistivityCurve].value_array : null;
        const depth = activeLogs[densityCurve].depth_array;
        
        const result = [];
        // Downsample 
        const step = Math.ceil(den.length / 1000);

        for(let i=0; i<den.length; i+=step) {
            if (den[i] === null || isNaN(den[i])) continue;
            
            const phi = petrophysics.calculatePorosity(den[i], params.rhoMa, params.rhoFl);
            const sw = res && res[i] > 0 ? petrophysics.calculateWaterSaturation(phi, res[i], params.Rw, params.a, params.m, params.n) : null;
            const perm = petrophysics.calculatePermeability(phi); // Simple model

            result.push({
                depth: depth[i],
                PHI: phi > 0 ? phi : 0,
                SW: sw,
                PERM: perm
            });
        }
        return result;
    }, [densityCurve, resistivityCurve, activeLogs, params]);

    return (
        <div className="flex flex-col h-full gap-4">
             {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-slate-950/30 border border-slate-800 rounded-lg">
                <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Input Curves</Label>
                    <div className="grid grid-cols-2 gap-2">
                        <Select value={densityCurve} onValueChange={setDensityCurve}>
                             <SelectTrigger className="h-8 bg-slate-900 border-slate-700 text-xs"><SelectValue placeholder="Density" /></SelectTrigger>
                             <SelectContent className="bg-slate-900"><SelectItem value="none">None</SelectItem>{Object.keys(activeLogs).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                        <Select value={resistivityCurve} onValueChange={setResistivityCurve}>
                             <SelectTrigger className="h-8 bg-slate-900 border-slate-700 text-xs"><SelectValue placeholder="Resistivity" /></SelectTrigger>
                             <SelectContent className="bg-slate-900"><SelectItem value="none">None</SelectItem>{Object.keys(activeLogs).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Parameters (Matrix: {params.rhoMa}, Fluid: {params.rhoFl})</Label>
                    <div className="grid grid-cols-4 gap-2">
                        <Input className="h-8 bg-slate-900 border-slate-700 text-xs" type="number" value={params.rhoMa} onChange={e => handleParamChange('rhoMa', e.target.value)} title="Matrix Density" />
                        <Input className="h-8 bg-slate-900 border-slate-700 text-xs" type="number" value={params.Rw} onChange={e => handleParamChange('Rw', e.target.value)} title="Rw" />
                        <Input className="h-8 bg-slate-900 border-slate-700 text-xs" type="number" value={params.m} onChange={e => handleParamChange('m', e.target.value)} title="m (Cementation)" />
                        <Input className="h-8 bg-slate-900 border-slate-700 text-xs" type="number" value={params.n} onChange={e => handleParamChange('n', e.target.value)} title="n (Saturation Exp)" />
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="flex-1 min-h-[250px] bg-slate-950/30 border border-slate-800 rounded-lg p-2">
                <SimpleLineChart 
                    data={calculatedData} 
                    lines={[
                        { key: 'PHI', name: 'Porosity', color: '#38bdf8' },
                        { key: 'SW', name: 'Water Saturation', color: '#f472b6' }
                    ]} 
                />
            </div>
            <div className="text-xs text-slate-500 text-center italic">
                *Calculated using standard density porosity and Archie's equation. Values are estimates.
            </div>
        </div>
    );
};

export default PetroEvalWidget;