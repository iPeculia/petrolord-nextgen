import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ParamInput = ({ label, value, onChange, tooltip, unit }) => (
    <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
            <Label className="text-xs text-slate-400">{label}</Label>
            {tooltip && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger><Info className="w-3 h-3 text-slate-600" /></TooltipTrigger>
                        <TooltipContent>{tooltip}</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </div>
        <div className="relative">
            <Input 
                type="number"
                value={value}
                onChange={e => onChange(parseFloat(e.target.value))}
                className="h-8 bg-slate-900 border-slate-700 pr-8"
            />
            <span className="absolute right-2 top-2 text-xs text-slate-500">{unit}</span>
        </div>
    </div>
);

const EconomicParameters = ({ params, onChange }) => {
    const handleChange = (field, value) => {
        onChange({ ...params, [field]: value });
    };

    return (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <h4 className="text-sm font-medium text-[#BFFF00] border-b border-slate-800 pb-2">Capital Expenditure (CAPEX)</h4>
                <ParamInput 
                    label="Total CAPEX" 
                    value={params.capex} 
                    onChange={v => handleChange('capex', v)} 
                    unit="$MM"
                    tooltip="Total development capital required."
                />
                <ParamInput 
                    label="Drilling & Completion" 
                    value={params.capex_drilling} 
                    onChange={v => handleChange('capex_drilling', v)} 
                    unit="$MM"
                />
                <ParamInput 
                    label="Facilities" 
                    value={params.capex_facilities} 
                    onChange={v => handleChange('capex_facilities', v)} 
                    unit="$MM"
                />
            </div>

            <div className="space-y-4">
                <h4 className="text-sm font-medium text-[#BFFF00] border-b border-slate-800 pb-2">Operating Expenditure (OPEX)</h4>
                <ParamInput 
                    label="Fixed OPEX" 
                    value={params.opex_fixed} 
                    onChange={v => handleChange('opex_fixed', v)} 
                    unit="$MM/yr"
                />
                <ParamInput 
                    label="Variable OPEX" 
                    value={params.opex_variable} 
                    onChange={v => handleChange('opex_variable', v)} 
                    unit="$/bbl"
                />
                <ParamInput 
                    label="Abandonment Cost" 
                    value={params.abex} 
                    onChange={v => handleChange('abex', v)} 
                    unit="$MM"
                />
            </div>

            <div className="space-y-4">
                <h4 className="text-sm font-medium text-[#BFFF00] border-b border-slate-800 pb-2">Financial Assumptions</h4>
                <ParamInput 
                    label="Discount Rate" 
                    value={params.discount_rate} 
                    onChange={v => handleChange('discount_rate', v)} 
                    unit="%"
                    tooltip="Annual discount rate for NPV calculation."
                />
                <ParamInput 
                    label="Tax Rate" 
                    value={params.tax_rate} 
                    onChange={v => handleChange('tax_rate', v)} 
                    unit="%"
                />
                 <ParamInput 
                    label="Inflation Rate" 
                    value={params.inflation_rate} 
                    onChange={v => handleChange('inflation_rate', v)} 
                    unit="%"
                />
            </div>
        </div>
    );
};

export default EconomicParameters;