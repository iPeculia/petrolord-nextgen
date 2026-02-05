import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PumpSchema } from '@/services/hydraulics/models/Pump';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHydraulicsSimulator } from '@/contexts/HydraulicsSimulatorContext';
import { DEMO_PUMP } from '@/services/hydraulics/data/demoData';
import { toast } from '@/components/ui/use-toast';
import { Save, PlayCircle } from 'lucide-react';

const PumpForm = ({ onSuccess }) => {
  const { current_project, pumps, addPump, updatePump } = useHydraulicsSimulator();
  
  const existingPump = pumps.find(p => p.project_id === current_project?.project_id);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(PumpSchema),
    defaultValues: existingPump || {
      project_id: current_project?.project_id,
      name: 'Main Rig Pump',
      pump_type: 'Triplex',
      liner_size_inches: 6.5,
      stroke_length_inches: 12,
      efficiency_percent: 95,
      max_spm: 120,
      displacement_bbl_per_stroke: 0.12,
      max_pressure_psi: 5000,
      max_flow_gpm: 1200,
      created_date: new Date().toISOString()
    }
  });

  useEffect(() => {
    if (existingPump) reset(existingPump);
    else if (current_project) setValue('project_id', current_project.project_id);
  }, [existingPump, current_project, reset, setValue]);

  const onSubmit = (data) => {
     if (existingPump) {
        updatePump(existingPump.pump_id, data);
        toast({ title: "Pump Updated", description: "Pump configuration saved." });
     } else {
        const newPump = { ...data, pump_id: crypto.randomUUID(), created_date: new Date().toISOString() };
        addPump(newPump);
        toast({ title: "Pump Created", description: "New pump added." });
     }
     if (onSuccess) onSuccess();
  };

  const loadDemoData = () => {
    if (!current_project) return;
    reset({ ...DEMO_PUMP, pump_id: crypto.randomUUID(), project_id: current_project.project_id });
    toast({ title: "Demo Pump Loaded", description: "Triplex pump data populated." });
  };

  if (!current_project) return null;

  return (
    <div className="space-y-6 p-4 bg-slate-900 rounded-lg border border-slate-800">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
             <div>
                <h3 className="text-lg font-medium text-slate-200">Pump Configuration</h3>
                <p className="text-sm text-slate-500">Define mud pump specifications.</p>
             </div>
             <Button variant="outline" size="sm" onClick={loadDemoData} className="border-slate-700 hover:bg-slate-800">
                <PlayCircle className="mr-2 h-4 w-4 text-red-500" /> Use Demo Data
             </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Pump Name</Label>
                    <Input {...register("name")} className="bg-slate-800" />
                    {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                </div>
                 <div className="space-y-2">
                    <Label>Type</Label>
                    <Select onValueChange={v => setValue("pump_type", v)} defaultValue={watch("pump_type")}>
                        <SelectTrigger className="bg-slate-800"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Triplex">Triplex</SelectItem>
                            <SelectItem value="Duplex">Duplex</SelectItem>
                            <SelectItem value="Centrifugal">Centrifugal</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="space-y-2">
                    <Label>Liner Size (in)</Label>
                    <Input type="number" step="0.1" {...register("liner_size_inches", { valueAsNumber: true })} className="bg-slate-800" />
                </div>
                <div className="space-y-2">
                    <Label>Stroke Length (in)</Label>
                    <Input type="number" step="0.1" {...register("stroke_length_inches", { valueAsNumber: true })} className="bg-slate-800" />
                </div>
                <div className="space-y-2">
                    <Label>Efficiency (%)</Label>
                    <Input type="number" step="1" {...register("efficiency_percent", { valueAsNumber: true })} className="bg-slate-800" />
                </div>
                <div className="space-y-2">
                    <Label>Displacement (bbl/stk)</Label>
                    <Input type="number" step="0.001" {...register("displacement_bbl_per_stroke", { valueAsNumber: true })} className="bg-slate-800" />
                </div>
                 <div className="space-y-2">
                    <Label>Max Pressure (psi)</Label>
                    <Input type="number" step="10" {...register("max_pressure_psi", { valueAsNumber: true })} className="bg-slate-800" />
                </div>
                 <div className="space-y-2">
                    <Label>Max Flow (gpm)</Label>
                    <Input type="number" step="10" {...register("max_flow_gpm", { valueAsNumber: true })} className="bg-slate-800" />
                </div>
            </div>

            <div className="pt-2 flex justify-end">
                <Button type="submit" className="bg-red-600 hover:bg-red-700">
                    <Save className="mr-2 h-4 w-4" /> Save Pump
                </Button>
            </div>
        </form>
    </div>
  );
};

export default PumpForm;