import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useDeclineCurve } from '@/context/DeclineCurveContext';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { calculateTimeToLimit } from '@/utils/declineCurve/DeclineModels';

const KPICard = ({ label, value, unit, tooltip, status = 'neutral' }) => {
    const statusColors = {
        neutral: 'text-slate-200',
        good: 'text-green-400',
        warning: 'text-amber-400',
        poor: 'text-red-400'
    };

    return (
        <Card className="bg-slate-900 border-slate-800 flex-1 min-w-[120px]">
            <CardContent className="p-3">
                <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">{label}</span>
                    {tooltip && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="h-3 w-3 text-slate-600 hover:text-slate-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="w-[200px] text-xs">{tooltip}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
                <div className="flex items-baseline gap-1">
                    <span className={`text-lg font-mono font-bold ${statusColors[status]}`}>
                        {value}
                    </span>
                    {unit && <span className="text-[10px] text-slate-500">{unit}</span>}
                </div>
            </CardContent>
        </Card>
    );
};

const KPICards = () => {
    const { currentProject, forecastConfig, activeStream } = useDeclineCurve();
    
    // Get latest scenario and ensure it matches active stream
    const latestScenario = currentProject?.scenarios && currentProject.scenarios.length > 0 
        ? currentProject.scenarios[currentProject.scenarios.length - 1] 
        : null;
    
    // Check if scenario matches current stream
    const isMatchingStream = latestScenario && latestScenario.results && latestScenario.results.stream === activeStream;
    const params = isMatchingStream ? latestScenario.results.params : null;
    const r2 = isMatchingStream ? latestScenario.results.r2 : null;

    let econLimitYears = "—";
    let eur = "—";
    let remaining = "—";

    if (params) {
        // Time to economic limit
        const tLimitDays = calculateTimeToLimit(forecastConfig.economicLimit, params.qi, params.Di, params.b);
        if (tLimitDays > 0) {
            econLimitYears = (tLimitDays / 365).toFixed(1);
        } else {
            econLimitYears = "0.0";
        }

        // Placeholder for EUR (requires cumulative at tLimit)
        // For accurate EUR, we need to implement Cum(tLimit) + Prior Cum.
        // This is simplified for UI display verification in Phase 2.
    }
    
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 w-full">
            <KPICard 
                label="qi (Initial)" 
                value={params ? params.qi.toFixed(0) : "—"} 
                unit="bbl/d" 
                tooltip="Initial production rate at t=0 of the decline phase"
            />
            <KPICard 
                label="Di (Decline)" 
                value={params ? `${(params.Di * 100).toFixed(1)}` : "—"} 
                unit="%/yr" 
                tooltip="Nominal annual decline rate at t=0"
            />
            <KPICard 
                label="b-Factor" 
                value={params ? params.b.toFixed(2) : "—"} 
                tooltip="Decline exponent (0=Exponential, 1=Harmonic)"
            />
            <KPICard 
                label="EUR" 
                value={eur} 
                unit="Mbbl" 
                tooltip="Estimated Ultimate Recovery"
            />
             <KPICard 
                label="Remaining" 
                value={remaining} 
                unit="Mbbl" 
                tooltip="Remaining Recoverable Reserves"
            />
            <KPICard 
                label="R²" 
                value={r2 !== null ? r2.toFixed(3) : "—"} 
                status={r2 > 0.9 ? 'good' : r2 > 0.7 ? 'warning' : r2 !== null ? 'poor' : 'neutral'}
                tooltip="Coefficient of determination (Goodness of fit)"
            />
             <KPICard 
                label="Econ Limit" 
                value={econLimitYears} 
                unit="Years" 
                tooltip={`Time until economic limit rate (${forecastConfig.economicLimit}) is reached`}
            />
        </div>
    );
};

export default KPICards;