import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FiscalTermsChart from './FiscalTermsChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FiscalTerms = ({ terms, onChange, chartData }) => {
    const handleChange = (field, value) => {
        onChange({ ...terms, [field]: parseFloat(value) });
    };

    return (
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="col-span-1 space-y-4 p-4">
                <h4 className="text-sm font-medium text-[#BFFF00] border-b border-slate-800 pb-2">Fiscal Regime</h4>
                
                <div className="space-y-1">
                    <Label className="text-xs text-slate-400">Royalty Rate</Label>
                    <div className="relative">
                        <Input 
                            type="number"
                            value={terms.royalty_rate}
                            onChange={e => handleChange('royalty_rate', e.target.value)}
                            className="h-8 bg-slate-900 border-slate-700 pr-8"
                        />
                        <span className="absolute right-2 top-2 text-xs text-slate-500">%</span>
                    </div>
                </div>

                <div className="space-y-1">
                    <Label className="text-xs text-slate-400">Govt. Profit Share</Label>
                    <div className="relative">
                        <Input 
                            type="number"
                            value={terms.govt_share}
                            onChange={e => handleChange('govt_share', e.target.value)}
                            className="h-8 bg-slate-900 border-slate-700 pr-8"
                        />
                        <span className="absolute right-2 top-2 text-xs text-slate-500">%</span>
                    </div>
                </div>

                <div className="space-y-1">
                    <Label className="text-xs text-slate-400">Cost Recovery Limit</Label>
                    <div className="relative">
                        <Input 
                            type="number"
                            value={terms.cost_recovery_limit}
                            onChange={e => handleChange('cost_recovery_limit', e.target.value)}
                            className="h-8 bg-slate-900 border-slate-700 pr-8"
                        />
                        <span className="absolute right-2 top-2 text-xs text-slate-500">%</span>
                    </div>
                </div>
            </div>

            <div className="col-span-2">
                 <Card className="h-full bg-slate-950 border-slate-800 flex flex-col">
                    <CardHeader className="py-3 border-b border-slate-900">
                        <CardTitle className="text-xs font-medium text-slate-400 uppercase">Project Cash Flow Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-2 min-h-[250px]">
                         <FiscalTermsChart data={chartData} />
                    </CardContent>
                 </Card>
            </div>
        </div>
    );
};

export default FiscalTerms;