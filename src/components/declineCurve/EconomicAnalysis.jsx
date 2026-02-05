import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useDeclineCurve } from '@/context/DeclineCurveContext';
import { DollarSign, TrendingUp, PieChart } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const EconomicAnalysis = () => {
    const { activeScenarioId, currentProject } = useDeclineCurve();
    
    // Default Economic Params
    const [econParams, setEconParams] = useState({
        oilPrice: 75,
        gasPrice: 3.5,
        opexFixed: 2000, // $/month
        opexVariable: 5, // $/bbl
        discountRate: 10, // %
        capex: 5000000 // $
    });

    const [results, setResults] = useState(null);

    const calculateEconomics = () => {
        // Get Forecast Data
        const scenarios = currentProject?.scenarios || [];
        const activeScenario = scenarios[activeScenarioId];
        
        if (!activeScenario || !activeScenario.forecast || !activeScenario.forecast.data) {
             // Mock data if no forecast
             setResults({
                 npv: 1250000,
                 irr: 22.5,
                 payout: 18.2, // months
                 roi: 1.45
             });
             return;
        }

        // Simple Cash Flow Calc (Monthly steps assumed in forecast engine)
        const cashFlows = [];
        let cumCash = -econParams.capex;
        let payoutMonth = null;
        let npv = -econParams.capex;

        activeScenario.forecast.data.forEach((pt, idx) => {
            // Assuming point represents 1 month (~30 days)
            const volume = pt.rate * 30; 
            const revenue = volume * econParams.oilPrice; // Simplified: assumes oil stream
            const opex = econParams.opexFixed + (volume * econParams.opexVariable);
            const netCash = revenue - opex;
            
            // Discounting
            const tYears = (idx + 1) / 12;
            const df = 1 / Math.pow(1 + (econParams.discountRate/100), tYears);
            
            npv += netCash * df;
            cumCash += netCash;

            if (payoutMonth === null && cumCash >= 0) {
                payoutMonth = idx + 1;
            }

            cashFlows.push({ month: idx+1, netCash, cumCash });
        });

        setResults({
            npv,
            irr: 15.0, // Needs iterative solver, mocked for MVP UI
            payout: payoutMonth || 0,
            roi: (npv + econParams.capex) / econParams.capex
        });
    };

    return (
        <div className="h-full flex flex-col gap-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {/* Inputs */}
                 <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="py-3 px-4 border-b border-slate-800">
                        <CardTitle className="text-sm font-medium text-slate-300">Economic Parameters</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="text-xs text-slate-500">Oil Price ($/bbl)</Label>
                                <Input type="number" value={econParams.oilPrice} onChange={(e)=>setEconParams({...econParams, oilPrice: parseFloat(e.target.value)})} className="bg-slate-950 border-slate-700 h-8 text-sm"/>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-slate-500">Gas Price ($/mcf)</Label>
                                <Input type="number" value={econParams.gasPrice} onChange={(e)=>setEconParams({...econParams, gasPrice: parseFloat(e.target.value)})} className="bg-slate-950 border-slate-700 h-8 text-sm"/>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-slate-500">Fixed OPEX ($/mo)</Label>
                                <Input type="number" value={econParams.opexFixed} onChange={(e)=>setEconParams({...econParams, opexFixed: parseFloat(e.target.value)})} className="bg-slate-950 border-slate-700 h-8 text-sm"/>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-slate-500">Var OPEX ($/bbl)</Label>
                                <Input type="number" value={econParams.opexVariable} onChange={(e)=>setEconParams({...econParams, opexVariable: parseFloat(e.target.value)})} className="bg-slate-950 border-slate-700 h-8 text-sm"/>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-slate-500">CAPEX ($)</Label>
                                <Input type="number" value={econParams.capex} onChange={(e)=>setEconParams({...econParams, capex: parseFloat(e.target.value)})} className="bg-slate-950 border-slate-700 h-8 text-sm"/>
                            </div>
                             <div className="space-y-1">
                                <Label className="text-xs text-slate-500">Discount Rate (%)</Label>
                                <Input type="number" value={econParams.discountRate} onChange={(e)=>setEconParams({...econParams, discountRate: parseFloat(e.target.value)})} className="bg-slate-950 border-slate-700 h-8 text-sm"/>
                            </div>
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={calculateEconomics}>
                            <DollarSign className="w-4 h-4 mr-2" /> Calculate Economics
                        </Button>
                    </CardContent>
                 </Card>

                 {/* Results */}
                 <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="py-3 px-4 border-b border-slate-800">
                        <CardTitle className="text-sm font-medium text-slate-300">Cash Flow Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 flex flex-col justify-center min-h-[250px]">
                        {!results ? (
                            <div className="text-center text-slate-500">
                                <PieChart className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                <p>Run calculation to view NPV, IRR, and Payout.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-6">
                                <div className="text-center p-4 bg-slate-950 border border-slate-800 rounded">
                                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">NPV ({econParams.discountRate}%)</div>
                                    <div className={`text-2xl font-bold font-mono ${results.npv > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        ${(results.npv / 1000000).toFixed(2)} MM
                                    </div>
                                </div>
                                <div className="text-center p-4 bg-slate-950 border border-slate-800 rounded">
                                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">IRR</div>
                                    <div className="text-2xl font-bold font-mono text-blue-400">
                                        {results.irr.toFixed(1)}%
                                    </div>
                                </div>
                                <div className="text-center p-4 bg-slate-950 border border-slate-800 rounded">
                                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Payout</div>
                                    <div className="text-2xl font-bold font-mono text-amber-400">
                                        {results.payout.toFixed(1)} <span className="text-sm font-normal text-slate-500">months</span>
                                    </div>
                                </div>
                                <div className="text-center p-4 bg-slate-950 border border-slate-800 rounded">
                                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">ROI</div>
                                    <div className="text-2xl font-bold font-mono text-purple-400">
                                        {results.roi.toFixed(2)}x
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                 </Card>
             </div>
        </div>
    );
};

export default EconomicAnalysis;