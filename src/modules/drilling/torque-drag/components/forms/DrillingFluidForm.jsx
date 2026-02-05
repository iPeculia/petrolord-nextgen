import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DrillingFluidSchema } from '@/services/torqueDrag/models/DrillingFluid';
import { useTorqueDrag } from '@/contexts/TorqueDragContext';
import { useToast } from '@/components/ui/use-toast';
import { DEMO_DRILLING_FLUID } from '@/services/torqueDrag/data/demoData';

const DrillingFluidForm = () => {
  const { current_well, addDrillingFluid } = useTorqueDrag();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(DrillingFluidSchema),
    defaultValues: {
      fluid_id: crypto.randomUUID(),
      well_id: current_well?.well_id || '',
      fluid_type: 'Water-Based',
      density_ppg: 9.0,
      plastic_viscosity_cp: 15,
      yield_point_lbf_per_100ft2: 10,
      gel_strength_10sec_lbf_per_100ft2: 5,
      gel_strength_10min_lbf_per_100ft2: 8,
      solids_content_percent: 5,
      temperature_f: 120,
      created_date: new Date().toISOString()
    }
  });

  const { register, handleSubmit, setValue, formState: { errors }, reset } = form;

  const onSubmit = (data) => {
    try {
      addDrillingFluid(data);
      toast({ title: "Fluid Properties Saved", description: "Drilling fluid configuration updated." });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  const loadDemoData = () => {
      const demo = { ...DEMO_DRILLING_FLUID, fluid_id: crypto.randomUUID(), well_id: current_well?.well_id };
      reset(demo);
  };

  if (!current_well) return <div className="text-center text-slate-500 p-8">Select a well first.</div>;

  return (
    <Card className="bg-slate-900 border-slate-700 text-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-slate-100">Drilling Fluid Properties</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-2">
                <Label>Fluid Type</Label>
                <Select onValueChange={(val) => setValue("fluid_type", val)} defaultValue="Water-Based">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Water-Based">Water-Based</SelectItem>
                        <SelectItem value="Oil-Based">Oil-Based</SelectItem>
                        <SelectItem value="Synthetic">Synthetic</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label>Density (ppg)</Label>
                    <Input type="number" step="0.1" {...register("density_ppg", { valueAsNumber: true })} />
                    {errors.density_ppg && <span className="text-xs text-red-500">{errors.density_ppg.message}</span>}
                </div>
                <div className="grid gap-2">
                    <Label>Temp (°F)</Label>
                    <Input type="number" step="1" {...register("temperature_f", { valueAsNumber: true })} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label>PV (cp)</Label>
                    <Input type="number" step="1" {...register("plastic_viscosity_cp", { valueAsNumber: true })} />
                </div>
                <div className="grid gap-2">
                    <Label>YP (lbf/100ft²)</Label>
                    <Input type="number" step="1" {...register("yield_point_lbf_per_100ft2", { valueAsNumber: true })} />
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label>Gel 10s</Label>
                    <Input type="number" step="1" {...register("gel_strength_10sec_lbf_per_100ft2", { valueAsNumber: true })} />
                </div>
                <div className="grid gap-2">
                    <Label>Gel 10m</Label>
                    <Input type="number" step="1" {...register("gel_strength_10min_lbf_per_100ft2", { valueAsNumber: true })} />
                </div>
            </div>

            <div className="grid gap-2">
                <Label>Solids (%)</Label>
                <Input type="number" step="0.1" {...register("solids_content_percent", { valueAsNumber: true })} />
            </div>

            <div className="flex justify-between pt-4">
                 <Button type="button" variant="outline" onClick={loadDemoData} className="border-slate-600 text-slate-300">
                    Use Demo Data
                 </Button>
                 <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Save className="mr-2 h-4 w-4" /> Save Fluid
                 </Button>
            </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DrillingFluidForm;