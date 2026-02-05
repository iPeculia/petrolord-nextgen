import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { WellSchema } from '@/services/hydraulics/models/Well';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, PlayCircle, Save } from 'lucide-react';
import { useHydraulicsSimulator } from '@/contexts/HydraulicsSimulatorContext';
import { DEMO_WELL } from '@/services/hydraulics/data/demoData';
import { toast } from '@/components/ui/use-toast';

const WellForm = ({ onSuccess }) => {
  const { current_project, current_well, addWell, updateWell, setCurrentWell } = useHydraulicsSimulator();

  const { register, handleSubmit, setValue, formState: { errors, isDirty }, reset } = useForm({
    resolver: zodResolver(WellSchema),
    defaultValues: current_well || {
      project_id: current_project?.project_id,
      name: '',
      api_number: '',
      rig_name: '',
      water_depth_ft: 0,
      rkb_elevation_ft: 0,
      mud_line_elevation_ft: 0,
      total_depth_ft: 0,
      status: 'Planned',
      created_date: new Date().toISOString()
    }
  });

  useEffect(() => {
    if (current_well) {
      reset(current_well);
    } else if (current_project) {
        setValue('project_id', current_project.project_id);
    }
  }, [current_well, current_project, reset, setValue]);

  const onSubmit = (data) => {
    if (current_well) {
      updateWell(current_well.well_id, data);
      toast({ title: "Well updated", description: "Well configuration saved." });
    } else {
      const newWell = {
        ...data,
        well_id: crypto.randomUUID(),
        created_date: new Date().toISOString()
      };
      addWell(newWell);
      setCurrentWell(newWell);
      toast({ title: "Well created", description: "New well added to project." });
    }
    if (onSuccess) onSuccess();
  };

  const loadDemoData = () => {
    if (!current_project) {
        toast({ title: "Error", description: "Please create a project first.", variant: "destructive" });
        return;
    }
    const demo = { 
        ...DEMO_WELL, 
        well_id: crypto.randomUUID(), 
        project_id: current_project.project_id,
        name: `${DEMO_WELL.name} (Demo)` 
    };
    reset(demo);
    toast({ title: "Demo data loaded", description: "Well form populated." });
  };

  if (!current_project) return <div className="text-center p-8 text-slate-500">Please select or create a project first.</div>;

  return (
    <div className="space-y-6 p-4 bg-slate-900 rounded-lg border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-medium text-slate-200">Well Header</h3>
          <p className="text-sm text-slate-500">Configure well geometry constraints and location.</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadDemoData} className="border-slate-700 hover:bg-slate-800">
          <PlayCircle className="mr-2 h-4 w-4 text-green-500" /> Use Demo Data
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="name">Well Name <span className="text-red-500">*</span></Label>
              <TooltipProvider><Tooltip><TooltipTrigger asChild><Info className="h-3 w-3 text-slate-500" /></TooltipTrigger><TooltipContent>Enter a descriptive name for the well</TooltipContent></Tooltip></TooltipProvider>
            </div>
            <Input id="name" {...register("name")} className={errors.name ? "border-red-500" : ""} />
            {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="api_number">API Number <span className="text-red-500">*</span></Label>
              <TooltipProvider><Tooltip><TooltipTrigger asChild><Info className="h-3 w-3 text-slate-500" /></TooltipTrigger><TooltipContent>API well number (10-14 digits)</TooltipContent></Tooltip></TooltipProvider>
            </div>
            <Input id="api_number" {...register("api_number")} className={errors.api_number ? "border-red-500" : ""} />
            {errors.api_number && <span className="text-xs text-red-500">{errors.api_number.message}</span>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="rig_name">Rig Name <span className="text-red-500">*</span></Label>
              <TooltipProvider><Tooltip><TooltipTrigger asChild><Info className="h-3 w-3 text-slate-500" /></TooltipTrigger><TooltipContent>Name of the drilling rig</TooltipContent></Tooltip></TooltipProvider>
            </div>
            <Input id="rig_name" {...register("rig_name")} className={errors.rig_name ? "border-red-500" : ""} />
            {errors.rig_name && <span className="text-xs text-red-500">{errors.rig_name.message}</span>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
              <TooltipProvider><Tooltip><TooltipTrigger asChild><Info className="h-3 w-3 text-slate-500" /></TooltipTrigger><TooltipContent>Current operational status</TooltipContent></Tooltip></TooltipProvider>
            </div>
            <Select onValueChange={(val) => setValue("status", val)} defaultValue={current_well?.status || "Planned"}>
              <SelectTrigger className="bg-slate-900 border-slate-700">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Planned">Planned</SelectItem>
                <SelectItem value="Drilling">Drilling</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="total_depth_ft">Total Depth (ft) <span className="text-red-500">*</span></Label>
              <TooltipProvider><Tooltip><TooltipTrigger asChild><Info className="h-3 w-3 text-slate-500" /></TooltipTrigger><TooltipContent>Total measured depth in feet</TooltipContent></Tooltip></TooltipProvider>
            </div>
            <Input type="number" step="0.1" id="total_depth_ft" {...register("total_depth_ft", { valueAsNumber: true })} className={errors.total_depth_ft ? "border-red-500" : ""} />
            {errors.total_depth_ft && <span className="text-xs text-red-500">{errors.total_depth_ft.message}</span>}
          </div>

           <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="water_depth_ft">Water Depth (ft) <span className="text-red-500">*</span></Label>
              <TooltipProvider><Tooltip><TooltipTrigger asChild><Info className="h-3 w-3 text-slate-500" /></TooltipTrigger><TooltipContent>Water depth in feet (0 for onshore)</TooltipContent></Tooltip></TooltipProvider>
            </div>
            <Input type="number" step="0.1" id="water_depth_ft" {...register("water_depth_ft", { valueAsNumber: true })} className={errors.water_depth_ft ? "border-red-500" : ""} />
            {errors.water_depth_ft && <span className="text-xs text-red-500">{errors.water_depth_ft.message}</span>}
          </div>

           <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="rkb_elevation_ft">RKB Elevation (ft) <span className="text-red-500">*</span></Label>
              <TooltipProvider><Tooltip><TooltipTrigger asChild><Info className="h-3 w-3 text-slate-500" /></TooltipTrigger><TooltipContent>Rotary Kelly Bushing elevation above MSL</TooltipContent></Tooltip></TooltipProvider>
            </div>
            <Input type="number" step="0.1" id="rkb_elevation_ft" {...register("rkb_elevation_ft", { valueAsNumber: true })} className={errors.rkb_elevation_ft ? "border-red-500" : ""} />
            {errors.rkb_elevation_ft && <span className="text-xs text-red-500">{errors.rkb_elevation_ft.message}</span>}
          </div>

           <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="mud_line_elevation_ft">Mud Line Elev. (ft) <span className="text-red-500">*</span></Label>
              <TooltipProvider><Tooltip><TooltipTrigger asChild><Info className="h-3 w-3 text-slate-500" /></TooltipTrigger><TooltipContent>Mud line elevation relative to MSL</TooltipContent></Tooltip></TooltipProvider>
            </div>
            <Input type="number" step="0.1" id="mud_line_elevation_ft" {...register("mud_line_elevation_ft", { valueAsNumber: true })} className={errors.mud_line_elevation_ft ? "border-red-500" : ""} />
            {errors.mud_line_elevation_ft && <span className="text-xs text-red-500">{errors.mud_line_elevation_ft.message}</span>}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={!isDirty && !!current_well}>
            <Save className="mr-2 h-4 w-4" /> {current_well ? 'Update Well' : 'Create Well'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WellForm;