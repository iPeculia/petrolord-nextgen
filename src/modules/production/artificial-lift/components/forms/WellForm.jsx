import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { wellSchema } from '../../models/schemas'; // Using the full refined schema for validation
import { useArtificialLift } from '../../context/ArtificialLiftContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const WellForm = ({ wellId, onSuccess }) => {
  const { addWell, updateWell, getWell, currentWell } = useArtificialLift();
  const { toast } = useToast();
  
  const defaultValues = {
    name: '',
    location: '',
    type: 'Vertical',
    status: 'Planned',
    depth_md: 0,
    depth_tvd: 0,
    casing_id: 0,
    tubing_id: 0,
    tubing_od: 0,
    perforation_depth: 0,
    wellhead_pressure: 0
  };

  const { register, handleSubmit, setValue, reset, formState: { errors, isDirty, isValid } } = useForm({
    resolver: zodResolver(wellSchema),
    defaultValues
  });

  // Load well data if editing
  useEffect(() => {
    if (wellId) {
      const well = getWell(wellId);
      if (well) {
        reset(well);
      }
    } else if (currentWell) {
        // If no explicit ID passed but currentWell exists in context (for main tab view)
        reset(currentWell);
    }
  }, [wellId, currentWell, getWell, reset]);

  const onSubmit = (data) => {
    if (currentWell?.well_id) {
      updateWell(currentWell.well_id, data);
    } else {
      addWell(data);
    }
    if (onSuccess) onSuccess();
  };

  const loadDemoData = () => {
    setValue('name', 'Well X-05', { shouldValidate: true });
    setValue('location', 'Field A, Block B', { shouldValidate: true });
    setValue('type', 'Vertical', { shouldValidate: true });
    setValue('status', 'Active', { shouldValidate: true });
    setValue('depth_md', 8500, { shouldValidate: true });
    setValue('depth_tvd', 8200, { shouldValidate: true });
    setValue('casing_id', 6.366, { shouldValidate: true });
    setValue('tubing_id', 2.875, { shouldValidate: true });
    setValue('tubing_od', 3.5, { shouldValidate: true });
    setValue('perforation_depth', 8100, { shouldValidate: true });
    setValue('wellhead_pressure', 150, { shouldValidate: true });
  };

  const FormField = ({ label, name, type = "text", tooltip, ...props }) => (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Label htmlFor={name} className={errors[name] ? "text-red-500" : ""}>{label}</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-4 h-4 text-slate-500 hover:text-slate-300 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Input
        id={name}
        type={type}
        className={`bg-slate-800 border-slate-600 ${errors[name] ? "border-red-500 focus-visible:ring-red-500" : ""}`}
        {...register(name, { valueAsNumber: type === "number" })}
        step={type === "number" ? "0.001" : undefined}
        {...props}
      />
      {errors[name] && <p className="text-xs text-red-500 animate-in slide-in-from-top-1">{errors[name].message}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-slate-900/50 p-6 rounded-lg border border-slate-800">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-white">Well Configuration</h3>
        <Button type="button" variant="outline" size="sm" onClick={loadDemoData}>
          Use Demo Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField 
          label="Well Name" 
          name="name" 
          tooltip="Unique identifier for this well" 
          placeholder="e.g. Well X-05" 
        />
        
        <FormField 
          label="Location" 
          name="location" 
          tooltip="Geographic location of the well" 
          placeholder="e.g. Field A, Block B" 
        />

        <div className="space-y-2">
            <div className="flex items-center space-x-2">
                <Label className={errors.type ? "text-red-500" : ""}>Well Type</Label>
                <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild><HelpCircle className="w-4 h-4 text-slate-500 hover:text-slate-300" /></TooltipTrigger>
                    <TooltipContent><p>Well trajectory type</p></TooltipContent>
                </Tooltip>
                </TooltipProvider>
            </div>
            <Select onValueChange={(val) => setValue("type", val, { shouldValidate: true })} defaultValue={currentWell?.type || "Vertical"}>
                <SelectTrigger className="bg-slate-800 border-slate-600">
                    <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 text-white">
                    <SelectItem value="Vertical">Vertical</SelectItem>
                    <SelectItem value="Deviated">Deviated</SelectItem>
                    <SelectItem value="Horizontal">Horizontal</SelectItem>
                </SelectContent>
            </Select>
             {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
        </div>

        <FormField label="Measured Depth (ft)" name="depth_md" type="number" tooltip="Measured depth along wellbore in feet" />
        <FormField label="TVD (ft)" name="depth_tvd" type="number" tooltip="True vertical depth in feet" />
        <FormField label="Casing ID (in)" name="casing_id" type="number" tooltip="Casing inner diameter in inches" />
        <FormField label="Tubing ID (in)" name="tubing_id" type="number" tooltip="Tubing inner diameter in inches" />
        <FormField label="Tubing OD (in)" name="tubing_od" type="number" tooltip="Tubing outer diameter in inches" />
        <FormField label="Perforation Depth (ft)" name="perforation_depth" type="number" tooltip="Depth of perforations in feet" />
        <FormField label="Wellhead Pressure (psi)" name="wellhead_pressure" type="number" tooltip="Surface pressure in psi" />
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-800">
        <Button type="submit" disabled={!isDirty} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" /> Save Configuration
        </Button>
      </div>
    </form>
  );
};

export default WellForm;