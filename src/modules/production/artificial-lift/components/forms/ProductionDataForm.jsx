import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productionDataSchema } from '../../models/schemas';
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

const ProductionDataForm = () => {
  const { currentWellId, addProductionData, getProductionData } = useArtificialLift();
  
  const defaultValues = {
    well_id: currentWellId || '',
    current_production_bpd: 0,
    target_production_bpd: 0,
    current_lift_method: 'None',
    current_drawdown: 0,
    gor: 0,
    water_production_bpd: 0
  };

  const { register, handleSubmit, setValue, reset, formState: { errors, isDirty } } = useForm({
    resolver: zodResolver(productionDataSchema.omit({ production_id: true, created_at: true, updated_at: true })),
    defaultValues
  });

  useEffect(() => {
    if (currentWellId) {
      setValue('well_id', currentWellId);
      const existing = getProductionData(currentWellId);
      if (existing) {
        reset(existing);
      }
    }
  }, [currentWellId, getProductionData, reset, setValue]);

  const onSubmit = (data) => {
    addProductionData(data);
  };

  const loadDemoData = () => {
    setValue('current_production_bpd', 500, { shouldValidate: true });
    setValue('target_production_bpd', 1200, { shouldValidate: true });
    setValue('current_lift_method', 'None', { shouldValidate: true });
    setValue('current_drawdown', 800, { shouldValidate: true });
    setValue('gor', 500, { shouldValidate: true });
    setValue('water_production_bpd', 100, { shouldValidate: true });
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
        <h3 className="text-lg font-medium text-white">Production Data</h3>
        <Button type="button" variant="outline" size="sm" onClick={loadDemoData}>
          Use Demo Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Current Production (bpd)" name="current_production_bpd" tooltip="Current production rate in barrels per day" />
        <FormField label="Target Production (bpd)" name="target_production_bpd" tooltip="Desired production rate in barrels per day" />
        
        <div className="space-y-2">
             <div className="flex items-center space-x-2">
                <Label>Current Lift Method</Label>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild><HelpCircle className="w-4 h-4 text-slate-500 hover:text-slate-300" /></TooltipTrigger>
                        <TooltipContent><p>Current artificial lift method in use</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <Select onValueChange={(val) => setValue("current_lift_method", val, { shouldValidate: true })} defaultValue="None">
                <SelectTrigger className="bg-slate-800 border-slate-600">
                    <SelectValue placeholder="Select lift method" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 text-white">
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="ESP">ESP</SelectItem>
                    <SelectItem value="Gas Lift">Gas Lift</SelectItem>
                    <SelectItem value="Rod Pump">Rod Pump</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <FormField label="Current Drawdown (psi)" name="current_drawdown" tooltip="Pressure difference between static and flowing pressure" />
        <FormField label="GOR (scf/stb)" name="gor" tooltip="Gas-oil ratio in standard cubic feet per stock tank barrel" />
        <FormField label="Water Production (bpd)" name="water_production_bpd" tooltip="Water production rate in barrels per day" />
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-800">
        <Button type="submit" disabled={!isDirty} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" /> Save Production Data
        </Button>
      </div>
    </form>
  );
};

export default ProductionDataForm;