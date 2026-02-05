import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePetrophysicalStore } from '@/modules/geoscience/petrophysical-analysis/store/petrophysicalStore.js';
import { useGlobalDataStore } from '@/store/globalDataStore.js';

const ResultRow = ({ label, value, unit }) => {
    const displayValue = value !== null && !isNaN(value) ? value.toFixed(3) : 'N/A';
    return (
        <div className="flex justify-between items-center py-2 border-b">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-sm font-medium">
                {displayValue} {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
            </p>
        </div>
    );
};


const CalculationResultsPanel = () => {
    const { activeWell, analyses: globalAnalyses } = useGlobalDataStore();
    const { activeAnalysisId, localChanges } = usePetrophysicalStore();

    if (!activeWell || !activeAnalysisId) {
        return (
            <Card className="overflow-y-auto">
                <CardHeader>
                    <CardTitle>Results</CardTitle>
                    <CardDescription>Calculated properties will appear here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Select a well and configure parameters to see results.</p>
                </CardContent>
            </Card>
        );
    }
    
    // Merge global state with local changes
    const analysisData = {
        ...(globalAnalyses[activeAnalysisId] || {}),
        ...localChanges
    };

    const calculations = analysisData.calculations || {};

    return (
        <Card className="overflow-y-auto">
            <CardHeader>
                <CardTitle>Calculation Results</CardTitle>
                <CardDescription>Summary of petrophysical properties.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <ResultRow label="Porosity (Density)" value={calculations.porosity} unit="v/v" />
                <ResultRow label="Clay Volume (Vcl)" value={calculations.vcl} unit="v/v" />
                <ResultRow label="Water Saturation (Sw)" value={calculations.sw} unit="v/v" />
                <ResultRow label="Hydrocarbon Sat. (Sh)" value={calculations.sh} unit="v/v" />
                <ResultRow label="API Gravity" value={calculations.apiGravity} unit="°API" />
            </CardContent>
        </Card>
    );
};

export default CalculationResultsPanel;