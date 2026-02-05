import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChokeSchema } from '@/services/hydraulics/models/Choke';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHydraulicsSimulator } from '@/contexts/HydraulicsSimulatorContext';
import { DEMO_CHOKE } from '@/services/hydraulics/data/demoData';
import { toast } from '@/components/ui/use-toast';
import { Save, PlayCircle } from 'lucide-react';

const ChokeForm = ({ onSuccess }) => {
  const { current_well, chokes, addChoke, updateChoke } = useHydraulicsSimulator();
  
  const existingChoke = chokes.find(c => c.well_id === current_well?.well_id);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(ChokeSchema),
    defaultValues: existingChoke || {
      well_id: current_well?.well_id,
      choke_type: 'Adjustable',
      opening_percent: 50,
      pressure_drop_psi: 0,
      flow_capacity_gpm: 1000,
      created_date: new Date().toISOString()
    }
  });

  useEffect(() => {
    if (existingChoke) reset(existingChoke);
    else if (current_well) setValue('well_id', current_well.well_id);
  }, [existingChoke, current_well, reset, setValue]);

  const onSubmit = (data) => {
     if (existingChoke) {
        updateChoke(existingChoke.choke_id, data);
        toast({ title: "Choke Updated", description: "Configuration saved." });
     } else {
        const newChoke = { ...data, choke_id: crypto.randomUUID(), created_date: new Date().toISOString() };
        addChoke(newChoke);
        toast({ title: "Choke Configured", description: "New choke settings applied." });
     }
     if (onSuccess) onSuccess();
  };

  const loadDemoData = () => {
    if (!current_well) return;
    reset({ ...DEMO_CHOKE, choke_id: crypto.randomUUID(), well_id: current_well.well_id });
    toast({ title: "Demo Choke Loaded", description: "Standard choke settings applied." });
  };

  if (!current_well) return null;

  return (
    <div className="space-y-6 p-4 bg-slate-900 rounded-lg border border-slate-800">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
             <div>
                <h3 className="text-lg font-medium text-slate-200">Choke Manifold</h3>
                <p className="text-sm text-slate-500">Surface backpressure control.</p>
             </div>
             <Button variant="outline" size="sm" onClick={loadDemoData} className="border-slate-700 hover:bg-slate-800">
                <PlayCircle className="mr-2 h-4 w-4 text-yellow-500" /> Use Demo Data
             </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label>Type</Label>
                    <Select onValueChange={v => setValue("choke_type", v)} defaultValue={watch("choke_type")}>
                        <SelectTrigger className="bg-slate-800"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Fixed">Fixed</SelectItem>
                            <SelectItem value="Adjustable">Adjustable</SelectItem>
                            <SelectItem value="Automatic">Automatic</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="space-y-2">
                    <Label>Opening (%)</Label>
                    <Input type="number" step="1" {...register("opening_percent", { valueAsNumber: true })} className="bg-slate-800" />
                    {errors.opening_percent && <span className="text-xs text-red-500">{errors.opening_percent.message}</span>}
                </div>
                <div className="space-y-2">
                    <Label>Pressure Drop (psi)</Label>
                    <Input type="number" step="10" {...register("pressure_drop_psi", { valueAsNumber: true })} className="bg-slate-800" />
                </div>
                <div className="space-y-2">
                    <Label>Flow Capacity (gpm)</Label>
                    <Input type="number" step="10" {...register("flow_capacity_gpm", { valueAsNumber: true })} className="bg-slate-800" />
                </div>
            </div>

            <div className="pt-2 flex justify-end">
                <Button type="submit" className="bg-yellow-600 hover:bg-yellow-700 text-black">
                    <Save className="mr-2 h-4 w-4" /> Save Choke
                </Button>
            </div>
        </form>
    </div>
  );
};

export default ChokeForm;