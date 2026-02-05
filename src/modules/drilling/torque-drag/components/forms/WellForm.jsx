import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WellSchema } from '@/services/torqueDrag/models/Well';
import { useTorqueDrag } from '@/contexts/TorqueDragContext';
import { DEMO_WELL } from '@/services/torqueDrag/data/demoData';
import { useToast } from '@/components/ui/use-toast';

const WellForm = ({ onSuccess }) => {
  const { current_well, current_project, addWell, updateWell, setCurrentWell } = useTorqueDrag();
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(WellSchema),
    defaultValues: current_well || {
      well_id: crypto.randomUUID(),
      project_id: current_project?.project_id || '',
      name: '',
      api_number: '',
      rig_name: '',
      water_depth_ft: 0,
      rkb_elevation_ft: 0,
      total_depth_ft: 0,
      hole_size_inches: 0,
      casing_program: '',
      status: 'Planned',
      created_date: new Date().toISOString()
    }
  });

  const { register, handleSubmit, setValue, formState: { errors }, reset } = form;

  useEffect(() => {
    if (current_well) {
      reset(current_well);
    } else if (current_project) {
        setValue('project_id', current_project.project_id);
    }
  }, [current_well, current_project, reset, setValue]);

  const onSubmit = (data) => {
    try {
      if (current_well) {
        updateWell(current_well.well_id, data);
        toast({ title: "Well updated", description: "Well details saved successfully." });
      } else {
        addWell(data);
        setCurrentWell(data);
        toast({ title: "Well created", description: "New well initialized." });
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  const loadDemoData = () => {
    if (!current_project) {
        toast({ variant: "destructive", title: "Error", description: "Select a project first." });
        return;
    }
    const demo = { 
        ...DEMO_WELL, 
        well_id: crypto.randomUUID(), 
        project_id: current_project.project_id,
        name: `${DEMO_WELL.name} (Copy)` 
    };
    reset(demo);
    toast({ title: "Demo Data Loaded", description: "Form populated with sample data." });
  };

  if (!current_project) return <div className="text-center text-slate-500 p-8">Please select or create a project first.</div>;

  return (
    <Card className="bg-slate-900 border-slate-700 text-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-slate-100">Well Header Definition</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Well Name <span className="text-red-500">*</span></Label>
              <Input id="name" {...register("name")} className={errors.name ? "border-red-500" : ""} />
              {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="api_number">API Number <span className="text-red-500">*</span></Label>
              <Input id="api_number" {...register("api_number")} className={errors.api_number ? "border-red-500" : ""} />
              {errors.api_number && <span className="text-xs text-red-500">{errors.api_number.message}</span>}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="rig_name">Rig Name <span className="text-red-500">*</span></Label>
            <Input id="rig_name" {...register("rig_name")} className={errors.rig_name ? "border-red-500" : ""} />
            {errors.rig_name && <span className="text-xs text-red-500">{errors.rig_name.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="grid gap-2">
                <div className="flex items-center gap-2">
                    <Label htmlFor="water_depth_ft">Water Depth (ft)</Label>
                    <TooltipProvider>
                        <Tooltip>
                        <TooltipTrigger><Info className="h-4 w-4 text-slate-500" /></TooltipTrigger>
                        <TooltipContent>Water depth in feet</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <Input type="number" step="0.1" id="water_depth_ft" {...register("water_depth_ft", { valueAsNumber: true })} />
                {errors.water_depth_ft && <span className="text-xs text-red-500">{errors.water_depth_ft.message}</span>}
             </div>
             
             <div className="grid gap-2">
                <div className="flex items-center gap-2">
                    <Label htmlFor="rkb_elevation_ft">RKB Elevation (ft)</Label>
                    <TooltipProvider>
                        <Tooltip>
                        <TooltipTrigger><Info className="h-4 w-4 text-slate-500" /></TooltipTrigger>
                        <TooltipContent>Rotary Kelly Bushing elevation</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <Input type="number" step="0.1" id="rkb_elevation_ft" {...register("rkb_elevation_ft", { valueAsNumber: true })} />
                {errors.rkb_elevation_ft && <span className="text-xs text-red-500">{errors.rkb_elevation_ft.message}</span>}
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="grid gap-2">
                <Label htmlFor="total_depth_ft">Total Depth (ft) <span className="text-red-500">*</span></Label>
                <Input type="number" step="1" id="total_depth_ft" {...register("total_depth_ft", { valueAsNumber: true })} />
                {errors.total_depth_ft && <span className="text-xs text-red-500">{errors.total_depth_ft.message}</span>}
             </div>
             
             <div className="grid gap-2">
                <Label htmlFor="hole_size_inches">Hole Size (in) <span className="text-red-500">*</span></Label>
                <Input type="number" step="0.125" id="hole_size_inches" {...register("hole_size_inches", { valueAsNumber: true })} />
                {errors.hole_size_inches && <span className="text-xs text-red-500">{errors.hole_size_inches.message}</span>}
             </div>
          </div>

          <div className="grid gap-2">
              <Label htmlFor="casing_program">Casing Program</Label>
              <Textarea id="casing_program" {...register("casing_program")} className="min-h-[80px]" placeholder="e.g. 20in @ 3000ft, 13-3/8in @ 8500ft" />
              {errors.casing_program && <span className="text-xs text-red-500">{errors.casing_program.message}</span>}
          </div>

          <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(val) => setValue("status", val)} defaultValue={current_well?.status || "Planned"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planned">Planned</SelectItem>
                  <SelectItem value="Drilling">Drilling</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={loadDemoData} className="border-slate-600 text-slate-300">
              Use Demo Data
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
              <Save className="mr-2 h-4 w-4" /> Save Well
            </Button>
          </div>

        </form>
      </CardContent>
    </Card>
  );
};

export default WellForm;