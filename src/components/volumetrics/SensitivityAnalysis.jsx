import React from 'react';
import TornadoChart from './TornadoChart';
import SpiderPlot from './SpiderPlot';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VolumeCalculationEngine } from '@/services/volumetrics/VolumeCalculationEngine';
import { useVolumetrics } from '@/hooks/useVolumetrics';

const SensitivityAnalysis = () => {
    const { state } = useVolumetrics();
    const params = state.data.parameters || {};

    // Generate deterministic Sensitivity Data on the fly (simplified for demo)
    // In a real app, this would be a user-triggered calculation
    
    // Tornado Data: +/- 20% variation
    const baseResult = VolumeCalculationEngine.calculateSimpleVolumetrics(params).metrics?.stoiip || 0;
    
    const calculateVariation = (key, factor) => {
        const modParams = { ...params, [key]: params[key] * factor };
        return VolumeCalculationEngine.calculateSimpleVolumetrics(modParams).metrics?.stoiip || 0;
    };

    const tornadoData = [
        { parameter: 'Porosity', base: baseResult, low: calculateVariation('porosity', 0.8), high: calculateVariation('porosity', 1.2) },
        { parameter: 'Water Sat.', base: baseResult, low: calculateVariation('water_saturation', 1.2), high: calculateVariation('water_saturation', 0.8) }, // Sw inverse
        { parameter: 'Thickness', base: baseResult, low: calculateVariation('thickness', 0.8), high: calculateVariation('thickness', 1.2) },
        { parameter: 'Area', base: baseResult, low: calculateVariation('area', 0.8), high: calculateVariation('area', 1.2) },
        { parameter: 'FVF', base: baseResult, low: calculateVariation('formation_volume_factor', 1.2), high: calculateVariation('formation_volume_factor', 0.8) }, // Bo inverse
    ];

    // Spider Plot Data: -30% to +30% in steps
    const steps = [-0.3, -0.15, 0, 0.15, 0.3];
    const spiderData = steps.map(pct => {
        const factor = 1 + pct;
        return {
            percentChange: pct * 100,
            porosity: calculateVariation('porosity', factor),
            sw: calculateVariation('water_saturation', factor), // Note: this applies factor directly, physics might break if > 1
            thickness: calculateVariation('thickness', factor),
            area: calculateVariation('area', factor)
        };
    });

    return (
        <div className="p-4 h-full overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-950 border-slate-800 h-[400px]">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-400">Tornado Chart (STOIIP Impact)</CardTitle>
                </CardHeader>
                <CardContent className="h-[340px]">
                    <TornadoChart data={tornadoData} />
                </CardContent>
            </Card>

            <Card className="bg-slate-950 border-slate-800 h-[400px]">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-400">Spider Plot (Sensitivity)</CardTitle>
                </CardHeader>
                <CardContent className="h-[340px]">
                    <SpiderPlot data={spiderData} />
                </CardContent>
            </Card>
        </div>
    );
};

export default SensitivityAnalysis;