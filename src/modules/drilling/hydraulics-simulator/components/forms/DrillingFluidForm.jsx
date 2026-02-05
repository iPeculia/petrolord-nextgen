import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DrillingFluidSchema } from '@/services/hydraulics/models/DrillingFluid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, PlayCircle, Save } from 'lucide-react';
import { useHydraulicsSimulator } from '@/contexts/HydraulicsSimulatorContext';
import { DEMO_FLUID } from '@/services/hydraulics/data/demoData';
import { toast } from '@/components/ui/use-toast';

const DrillingFluidForm = ({ onSuccess }) => {
  const { current_project, drilling_fluids, addDrillingFluid, updateDrillingFluid } = useHydraulicsSimulator();
  
  // Find existing fluid for this project or use default
  const existingFluid = drilling_fluids.find(f => f.project_id === current_project?.project_id);

  const { register, handleSubmit, setValue, formState: { errors, isDirty }, reset, watch } = useForm({
    resolver: zodResolver(DrillingFluidSchema),
    defaultValues: existingFluid || {
      project_id: current_project?.project_id,
      name: 'Water Based Mud',
      fluid_type: 'Water-Based',
      base_fluid_density_ppg: 8.33,
      rheology_model: 'Bingham',
      plastic_viscosity_cp: 0,
      yield_point_lbf_per_100ft2: 0,
      gel_strength_10sec_lbf_per_100ft2: 0,
      gel_strength_10min_lbf_per_100ft2: 0,
      lsr_readings: {
        rpm_600: 0, rpm_300: 0, rpm_200: 0, rpm_100: 0, rpm_6: 0, rpm_3: 0
      },
      temperature_f: 70,
      solids_content_percent: 0,
      created_date: new Date().toISOString()
    }
  });

  useEffect(() => {
    if (existingFluid) {
      reset(existingFluid);
    } else if (current_project) {
        setValue('project_id', current_project.project_id);
    }
  }, [existingFluid, current_project, reset, setValue]);

  const onSubmit = (data) => {
    if (existingFluid) {
      updateDrillingFluid(existingFluid.fluid_id, data);
      toast({ title: "Fluid Properties Updated", description: "Changes saved successfully." });
    } else {
      const newFluid = {
        ...data,
        fluid_id: crypto.randomUUID(),
        created_date: new Date().toISOString()
      };
      addDrillingFluid(newFluid);
      toast({ title: "Fluid Properties Created", description: "New fluid configuration saved." });
    }
    if (onSuccess) onSuccess();
  };

  const loadDemoData = () => {
    if (!current_project) return;
    const demo = { 
        ...DEMO_FLUID, 
        fluid_id: crypto.randomUUID(), 
        project_id: current_project.project_id,
        name: `${DEMO_FLUID.name} (Copy)` 
    };
    reset(demo);
    toast({ title: "Demo Data Loaded", description: "Fluid form populated with sample values." });
  };

  if (!current_project) return <div className="text-center p-8 text-slate-500">Please create a project first.</div>;

  return (
    <div className="space-y-6 p-4 bg-slate-900 rounded-lg border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-medium text-slate-200">Fluid Properties</h3>
          <p className="text-sm text-slate-500">Define rheology and density parameters.</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadDemoData} className="border-slate-700 hover:bg-slate-800">
          <PlayCircle className="mr-2 h-4 w-4 text-purple-500" /> Use Demo Data
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* General Properties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Fluid Name</Label>
                <Input {...register("name")} className="bg-slate-800" />
                {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
            </div>
            <div className="space-y-2">
                <Label>Fluid Type</Label>
                <Select onValueChange={v => setValue("fluid_type", v)} defaultValue={watch("fluid_type")}>
                    <SelectTrigger className="bg-slate-800"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Water-Based">Water-Based</SelectItem>
                        <SelectItem value="Oil-Based">Oil-Based</SelectItem>
                        <SelectItem value="Synthetic">Synthetic</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Density (ppg)</Label>
                <Input type="number" step="0.01" {...register("base_fluid_density_ppg", { valueAsNumber: true })} className="bg-slate-800" />
            </div>
             <div className="space-y-2">
                <Label>Temperature (°F)</Label>
                <Input type="number" step="1" {...register("temperature_f", { valueAsNumber: true })} className="bg-slate-800" />
            </div>
        </div>

        {/* Rheology */}
        <div>
            <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Rheology Model</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                 <div className="space-y-2">
                    <Label>Model</Label>
                    <Select onValueChange={v => setValue("rheology_model", v)} defaultValue={watch("rheology_model")}>
                        <SelectTrigger className="bg-slate-800"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Bingham">Bingham Plastic</SelectItem>
                            <SelectItem value="Power Law">Power Law</SelectItem>
                            <SelectItem value="Herschel-Bulkley">Herschel-Bulkley</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>PV (cp)</Label>
                    <Input type="number" {...register("plastic_viscosity_cp", { valueAsNumber: true })} className="bg-slate-800" />
                </div>
                 <div className="space-y-2">
                    <Label>YP (lbf/100ft²)</Label>
                    <Input type="number" {...register("yield_point_lbf_per_100ft2", { valueAsNumber: true })} className="bg-slate-800" />
                </div>
            </div>
            
            <div className="grid grid-cols-6 gap-2">
                 {[600, 300, 200, 100, 6, 3].map(rpm => (
                     <div key={rpm} className="space-y-1">
                         <Label className="text-xs text-slate-500">@{rpm}</Label>
                         <Input type="number" {...register(`lsr_readings.rpm_${rpm}`, { valueAsNumber: true })} className="bg-slate-800 h-8 text-xs" />
                     </div>
                 ))}
            </div>
        </div>

        <div className="flex justify-end">
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                <Save className="mr-2 h-4 w-4" /> Save Fluid
            </Button>
        </div>
      </form>
    </div>
  );
};

export default DrillingFluidForm;