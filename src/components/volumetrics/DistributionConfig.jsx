import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const DistributionConfig = ({ parameterKey, label, config, onChange }) => {
    return (
        <div className="grid grid-cols-12 gap-2 items-center bg-slate-900/30 p-2 rounded border border-slate-800 text-xs hover:bg-slate-900/50 transition-colors">
            <div className="col-span-4 flex items-center gap-2">
                <Checkbox 
                    checked={config.active} 
                    onCheckedChange={(c) => onChange(parameterKey, 'active', c)}
                    className="border-slate-600 data-[state=checked]:bg-[#BFFF00] data-[state=checked]:text-slate-950"
                />
                <span className="font-medium text-slate-300 truncate" title={label}>{label}</span>
            </div>
            
            <div className="col-span-3">
                <Select value={config.type} onValueChange={(v) => onChange(parameterKey, 'type', v)}>
                    <SelectTrigger className="h-7 text-xs bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-950 border-slate-800">
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="lognormal">Lognormal</SelectItem>
                        <SelectItem value="triangular">Triangular</SelectItem>
                        <SelectItem value="uniform">Uniform</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <div className="col-span-5 flex gap-1">
                {config.type === 'normal' || config.type === 'lognormal' ? (
                    <>
                        <Input 
                            placeholder="Mean" 
                            className="h-7 text-xs bg-slate-950 border-slate-700" 
                            value={config.mean} 
                            onChange={e => onChange(parameterKey, 'mean', parseFloat(e.target.value))} 
                        />
                        <Input 
                            placeholder="StdDev" 
                            className="h-7 text-xs bg-slate-950 border-slate-700" 
                            value={config.stdDev} 
                            onChange={e => onChange(parameterKey, 'stdDev', parseFloat(e.target.value))} 
                        />
                    </>
                ) : (
                    <>
                         <Input 
                            placeholder="Min" 
                            className="h-7 text-xs bg-slate-950 border-slate-700" 
                            value={config.min} 
                            onChange={e => onChange(parameterKey, 'min', parseFloat(e.target.value))} 
                        />
                        {config.type === 'triangular' && (
                            <Input 
                                placeholder="Mode" 
                                className="h-7 text-xs bg-slate-950 border-slate-700" 
                                value={config.mode} 
                                onChange={e => onChange(parameterKey, 'mode', parseFloat(e.target.value))} 
                            />
                        )}
                        <Input 
                            placeholder="Max" 
                            className="h-7 text-xs bg-slate-950 border-slate-700" 
                            value={config.max} 
                            onChange={e => onChange(parameterKey, 'max', parseFloat(e.target.value))} 
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default DistributionConfig;