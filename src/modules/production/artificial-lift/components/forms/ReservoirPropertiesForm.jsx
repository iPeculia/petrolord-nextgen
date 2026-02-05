import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reservoirPropertiesSchema } from '../../models/schemas';
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

const ReservoirPropertiesForm = () => {
  const { currentWellId, addReservoirProperties, getReservoirProperties } = useArtificialLift();
  
  const defaultValues = {
    well_id: currentWellId || '',
    static_pressure: 0,
    temperature: 0,
    productivity_index: 0,
    fluid_type: 'Oil',
    oil_gravity_api: 0,
    gas_gravity: 0,
    water_cut: 0,
    viscosity: 0,
    density: 0,
    bubble_point: 0
  };

  const { register, handleSubmit, setValue, reset, formState: { errors, isDirty } } = useForm({
    resolver: zodResolver(reservoirPropertiesSchema.omit({ property_id: true, created_at: true, updated_at: true })),
    defaultValues
  });

  useEffect(() => {
    if (currentWellId) {
      setValue('well_id', currentWellId);
      const existing = getReservoirProperties(currentWellId);
      if (existing) {
        reset(existing);
      }
    }
  }, [currentWellId, getReservoirProperties, reset, setValue]);

  const onSubmit = (data) => {
    addReservoirProperties(data);
  };

  const loadDemoData = () => {
    setValue('static_pressure', 3200, { shouldValidate: true });
    setValue('temperature', 180, { shouldValidate: true });
    setValue('productivity_index', 2.5, { shouldValidate: true });
    setValue('fluid_type', 'Oil', { shouldValidate: true });
    setValue('oil_gravity_api', 35, { shouldValidate: true });
    setValue('gas_gravity', 0.65, { shouldValidate: true });
    setValue('water_cut', 0.15, { shouldValidate: true });
    setValue('viscosity', 0.8, { shouldValidate: true });
    setValue('density', 45, { shouldValidate: true });
    setValue('bubble_point', 2500, { shouldValidate: true });
  };

  const FormField = ({ label, name, type = "number", tooltip, ...props }) => (
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
        {...register(name, { valueAsNumber: true })}
        step="0.01"
        {...props}
      />
      {errors[name] && <p className="text-xs text-red-500 animate-in slide-in-from-top-1">{errors[name].message}</p>}
    </div>
  );

  if (!currentWellId) {
      return (
          <div className="p-8 text-center border border-dashed border-slate-700 rounded-lg bg-slate-900/50">
              <p className="text-slate-400">Please select or create a well first.</p>
          </div>
      );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-slate-900/50 p-6 rounded-lg border border-slate-800">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-white">Reservoir Properties</h3>
        <Button type="button" variant="outline" size="sm" onClick={loadDemoData}>
          Use Demo Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Static Pressure (psi)" name="static_pressure" tooltip="Reservoir pressure at datum depth in psi" />
        <FormField label="Temperature (°F)" name="temperature" tooltip="Reservoir temperature in Fahrenheit" />
        <FormField label="Productivity Index (bbl/psi/d)" name="productivity_index" tooltip="Well productivity in barrels per day per psi drawdown" />
        
        <div className="space-y-2">
             <div className="flex items-center space-x-2">
                <Label>Fluid Type</Label>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild><HelpCircle className="w-4 h-4 text-slate-500 hover:text-slate-300" /></TooltipTrigger>
                        <TooltipContent><p>Type of fluid produced</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <Select onValueChange={(val) => setValue("fluid_type", val, { shouldValidate: true })} defaultValue="Oil">
                <SelectTrigger className="bg-slate-800 border-slate-600">
                    <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 text-white">
                    <SelectItem value="Oil">Oil</SelectItem>
                    <SelectItem value="Gas">Gas</SelectItem>
                    <SelectItem value="Water">Water</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <FormField label="Oil Gravity (API)" name="oil_gravity_api" tooltip="Oil density in API degrees" />
        <FormField label="Gas Gravity (sg)" name="gas_gravity" tooltip="Gas density relative to air" />
        <FormField label="Water Cut (decimal)" name="water_cut" tooltip="Fraction of water in production (0-1)" step="0.01" max="1" min="0" />
        <FormField label="Viscosity (cP)" name="viscosity" tooltip="Oil viscosity in centipoise" />
        <FormField label="Density (lb/ft³)" name="density" tooltip="Fluid density in pounds per cubic foot" />
        <FormField label="Bubble Point (psi)" name="bubble_point" tooltip="Pressure at which gas comes out of solution" />
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-800">
        <Button type="submit" disabled={!isDirty} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" /> Save Properties
        </Button>
      </div>
    </form>
  );
};

export default ReservoirPropertiesForm;