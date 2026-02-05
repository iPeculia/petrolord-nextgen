import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BitNozzleSchema } from '@/services/hydraulics/models/BitNozzle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useHydraulicsSimulator } from '@/contexts/HydraulicsSimulatorContext';
import { toast } from '@/components/ui/use-toast';
import { Save, Calculator } from 'lucide-react';

const BitNozzleForm = ({ onSuccess }) => {
  const { current_well, bit_nozzles, tubular_components, addBitNozzle, updateBitNozzle } = useHydraulicsSimulator();
  
  // Find the Bit component in the tubulars string
  const bitComponent = tubular_components.find(c => c.well_id === current_well?.well_id && c.type === 'Bit');
  
  // Find existing nozzle config for this bit
  const existingNozzle = bit_nozzles.find(n => n.component_id === bitComponent?.component_id);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(BitNozzleSchema),
    defaultValues: existingNozzle || {
      component_id: bitComponent?.component_id,
      nozzle_count: 3,
      nozzle_size_1_32_inch: 16,
      total_flow_area_tfa_in2: 0.589,
      bit_pressure_drop_psi: 500,
      created_date: new Date().toISOString()
    }
  });

  // Auto calculate TFA
  const nozzleCount = watch('nozzle_count');
  const nozzleSize = watch('nozzle_size_1_32_inch');

  useEffect(() => {
    if (nozzleCount && nozzleSize) {
        const tfa = (nozzleCount * Math.pow(nozzleSize, 2)) / 1303.8; // Standard API formula approx
        setValue('total_flow_area_tfa_in2', parseFloat(tfa.toFixed(3)));
    }
  }, [nozzleCount, nozzleSize, setValue]);

  useEffect(() => {
    if (bitComponent && !existingNozzle) {
        setValue('component_id', bitComponent.component_id);
    }
  }, [bitComponent, existingNozzle, setValue]);

  const onSubmit = (data) => {
    if (!bitComponent) {
        toast({ title: "Error", description: "Please add a Bit to your drill string first.", variant: "destructive" });
        return;
    }

    if (existingNozzle) {
        updateBitNozzle(existingNozzle.nozzle_id, data);
        toast({ title: "Nozzles Updated", description: "TFA recalculated." });
    } else {
        const newNozzle = { ...data, nozzle_id: crypto.randomUUID(), created_date: new Date().toISOString() };
        addBitNozzle(newNozzle);
        toast({ title: "Nozzles Configured", description: "Bit hydraulics ready." });
    }
    if (onSuccess) onSuccess();
  };

  if (!bitComponent) return (
      <div className="p-6 text-center border border-dashed border-slate-700 rounded-lg bg-slate-900/50">
          <p className="text-slate-500 mb-2">No Drill Bit Found</p>
          <p className="text-xs text-slate-600">Please go to Drill String tab and add a "Bit" component first.</p>
      </div>
  );

  return (
    <div className="space-y-6 p-4 bg-slate-900 rounded-lg border border-slate-800">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
             <div>
                <h3 className="text-lg font-medium text-slate-200">Bit Nozzles</h3>
                <p className="text-sm text-slate-500">Configure TFA for the drill bit.</p>
             </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Nozzle Count</Label>
                    <Input type="number" step="1" {...register("nozzle_count", { valueAsNumber: true })} className="bg-slate-800" />
                </div>
                <div className="space-y-2">
                    <Label>Size (1/32")</Label>
                    <Input type="number" step="1" {...register("nozzle_size_1_32_inch", { valueAsNumber: true })} className="bg-slate-800" />
                </div>
                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        TFA (in²) <Calculator className="h-3 w-3 text-slate-500" />
                    </Label>
                    <Input type="number" readOnly {...register("total_flow_area_tfa_in2", { valueAsNumber: true })} className="bg-slate-800 font-mono text-blue-400" />
                </div>
                <div className="space-y-2">
                    <Label>Est. Bit Pressure Drop (psi)</Label>
                    <Input type="number" step="10" {...register("bit_pressure_drop_psi", { valueAsNumber: true })} className="bg-slate-800" />
                </div>
            </div>

            <div className="pt-2 flex justify-end">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    <Save className="mr-2 h-4 w-4" /> Save Configuration
                </Button>
            </div>
        </form>
    </div>
  );
};

export default BitNozzleForm;