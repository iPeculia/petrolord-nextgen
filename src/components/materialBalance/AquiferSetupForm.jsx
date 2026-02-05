import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AquiferSetupForm = ({ params, onChange }) => {
  const handleChange = (field, value) => {
    onChange(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-3 p-3 bg-slate-950/50 rounded border border-slate-800">
      <h4 className="text-xs font-semibold uppercase text-slate-500 mb-2">Aquifer Parameters</h4>
      
      <div className="space-y-1">
        <Label className="text-xs">Aquifer Model</Label>
        <Select value={params.type} onValueChange={(v) => handleChange('type', v)}>
            <SelectTrigger className="h-8">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="steady_state">Steady State (Schilthuis)</SelectItem>
                <SelectItem value="pot_aquifer">Pot Aquifer (Small)</SelectItem>
                <SelectItem value="van_everdingen">Van Everdingen-Hurst (Unsteady)</SelectItem>
            </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
         <Label className="text-xs">Influx Constant (C / B)</Label>
         <div className="flex gap-2">
             <Input 
                type="number" 
                className="h-8" 
                value={params.constant} 
                onChange={(e) => handleChange('constant', parseFloat(e.target.value))} 
             />
             <span className="text-xs text-slate-500 self-center">bbl/psi</span>
         </div>
      </div>
    </div>
  );
};

export default AquiferSetupForm;