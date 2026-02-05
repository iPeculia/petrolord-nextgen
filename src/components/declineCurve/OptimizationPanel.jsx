import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { TrendingUp, Target, BarChart, Settings } from 'lucide-react';

const OptimizationPanel = () => {
    return (
        <div className="h-full flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="py-3 px-4 border-b border-slate-800">
                        <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <Target className="w-4 h-4 text-blue-400" /> Optimization Objectives
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                        <div className="space-y-3">
                            <label className="text-sm text-slate-300 block">Objective Function</label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" className="border-blue-500 text-blue-400 bg-blue-500/10">Maximize NPV</Button>
                                <Button variant="outline" className="border-slate-700 text-slate-400 bg-slate-950">Maximize EUR</Button>
                                <Button variant="outline" className="border-slate-700 text-slate-400 bg-slate-950">Minimize Capex</Button>
                                <Button variant="outline" className="border-slate-700 text-slate-400 bg-slate-950">Optimize Rate</Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Discount Rate Constraints</span>
                                <span>8% - 15%</span>
                            </div>
                            <Slider defaultValue={[10]} min={0} max={20} className="w-full" />
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            <Settings className="w-4 h-4 mr-2" /> Run Optimizer
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="py-3 px-4 border-b border-slate-800">
                         <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <BarChart className="w-4 h-4 text-emerald-400" /> Optimal Scenario
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 flex flex-col items-center justify-center min-h-[200px] text-slate-500">
                        <TrendingUp className="w-12 h-12 opacity-20 mb-2" />
                        <p>Run optimization to generate best-case scenario parameters.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default OptimizationPanel;