import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save, Droplets, RotateCcw, Beaker, Info, AlertCircle } from 'lucide-react';
import { useFluidProperties } from '@/hooks/nodal-analysis/useFluidProperties';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const FluidPropertiesForm = () => {
  const { fluidProperties, updateFluidProperties, loading } = useFluidProperties();
  const { toast } = useToast();
  const [confirmAction, setConfirmAction] = useState(null);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
        oil_gravity_api: '', gas_gravity: '', water_cut: '', gor: '', viscosity: '', density: ''
    },
    values: fluidProperties || undefined
  });

  const onSubmit = async (data) => {
    try {
        await updateFluidProperties(data);
    } catch (error) {
        // Error handled in hook
    }
  };

  const handleAction = () => {
      if (confirmAction === 'demo') {
          const demoData = {
              oil_gravity_api: 35,
              gas_gravity: 0.75,
              water_cut: 10,
              gor: 500,
              viscosity: 2.5,
              density: 52
          };
          reset(demoData);
          toast({ title: "Fluid Model Loaded", description: "Standard 35 API Oil properties applied." });
      } else if (confirmAction === 'reset') {
          reset({
              oil_gravity_api: '', gas_gravity: '', water_cut: '', gor: '', viscosity: '', density: ''
          });
          toast({ title: "Form Reset", description: "All fields have been cleared." });
      }
      setConfirmAction(null);
  };

  return (
    <TooltipProvider delayDuration={300}>
    <Card className="bg-[#1E293B] border-slate-700 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800">
        <CardTitle className="text-lg text-white flex items-center gap-2">
            <Droplets className="w-5 h-5 text-cyan-400" />
            Fluid PVT Properties
        </CardTitle>
        <div className="flex gap-2">
             <Button variant="outline" size="sm" type="button" onClick={() => setConfirmAction('reset')} className="text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-white">
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
            </Button>
            <Button variant="outline" size="sm" type="button" onClick={() => setConfirmAction('demo')} className="text-cyan-400 border-cyan-900/50 bg-cyan-900/10 hover:bg-cyan-900/20">
                <Beaker className="w-3.5 h-3.5 mr-1" /> Example Fluid
            </Button>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="oil_gravity_api" className="text-slate-300">Oil Gravity (API) <span className="text-red-400">*</span></Label>
                        <Tooltip>
                            <TooltipTrigger asChild><Info className="w-3.5 h-3.5 text-slate-500 cursor-help" /></TooltipTrigger>
                            <TooltipContent side="right"><p>Stock tank oil gravity (0-100 API)</p></TooltipContent>
                        </Tooltip>
                    </div>
                    <Input 
                        id="oil_gravity_api" 
                        type="number" step="0.1" 
                        {...register('oil_gravity_api', { required: true, min: 0, max: 100 })} 
                        className={errors.oil_gravity_api ? "border-red-500 bg-red-950/10 font-mono text-right" : "bg-slate-900 border-slate-700 font-mono text-right"}
                        placeholder="35.0"
                    />
                    {errors.oil_gravity_api && <span className="text-xs text-red-400 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/> Required (0-100)</span>}
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="gas_gravity" className="text-slate-300">Gas Specific Gravity <span className="text-red-400">*</span></Label>
                        <Tooltip>
                            <TooltipTrigger asChild><Info className="w-3.5 h-3.5 text-slate-500 cursor-help" /></TooltipTrigger>
                            <TooltipContent side="right"><p>Relative to Air = 1.0 (0-2.0)</p></TooltipContent>
                        </Tooltip>
                    </div>
                    <Input 
                        id="gas_gravity" 
                        type="number" step="0.01" 
                        {...register('gas_gravity', { required: true, min: 0, max: 2 })} 
                        className={errors.gas_gravity ? "border-red-500 bg-red-950/10 font-mono text-right" : "bg-slate-900 border-slate-700 font-mono text-right"}
                        placeholder="0.65" 
                    />
                    {errors.gas_gravity && <span className="text-xs text-red-400 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/> Required (0-2)</span>}
                </div>

                <div className="space-y-3">
                     <div className="flex items-center gap-2">
                        <Label htmlFor="water_cut" className="text-slate-300">Water Cut (%) <span className="text-red-400">*</span></Label>
                        <Tooltip>
                            <TooltipTrigger asChild><Info className="w-3.5 h-3.5 text-slate-500 cursor-help" /></TooltipTrigger>
                            <TooltipContent side="right"><p>Percentage of water in total liquid (0-100%)</p></TooltipContent>
                        </Tooltip>
                    </div>
                    <Input 
                        id="water_cut" 
                        type="number" step="0.1" 
                        {...register('water_cut', { required: true, min: 0, max: 100 })} 
                        className={errors.water_cut ? "border-red-500 bg-red-950/10 font-mono text-right" : "bg-slate-900 border-slate-700 font-mono text-right"}
                        placeholder="0.0" 
                    />
                    {errors.water_cut && <span className="text-xs text-red-400 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/> Required (0-100)</span>}
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="gor" className="text-slate-300">GOR (scf/stb) <span className="text-red-400">*</span></Label>
                        <Tooltip>
                            <TooltipTrigger asChild><Info className="w-3.5 h-3.5 text-slate-500 cursor-help" /></TooltipTrigger>
                            <TooltipContent side="right"><p>Producing Gas-Oil Ratio (0-100,000)</p></TooltipContent>
                        </Tooltip>
                    </div>
                    <Input 
                        id="gor" 
                        type="number" step="1" 
                        {...register('gor', { required: true, min: 0, max: 100000 })} 
                        className={errors.gor ? "border-red-500 bg-red-950/10 font-mono text-right" : "bg-slate-900 border-slate-700 font-mono text-right"}
                        placeholder="500"
                    />
                    {errors.gor && <span className="text-xs text-red-400 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/> Required</span>}
                </div>

                <div className="space-y-3">
                     <div className="flex items-center gap-2">
                        <Label htmlFor="viscosity" className="text-slate-300">Oil Viscosity (cp) <span className="text-red-400">*</span></Label>
                        <Tooltip>
                            <TooltipTrigger asChild><Info className="w-3.5 h-3.5 text-slate-500 cursor-help" /></TooltipTrigger>
                            <TooltipContent side="right"><p>Dead oil viscosity (0-10,000 cp)</p></TooltipContent>
                        </Tooltip>
                    </div>
                    <Input 
                        id="viscosity" 
                        type="number" step="0.01" 
                        {...register('viscosity', { required: true, min: 0, max: 10000 })} 
                        className={errors.viscosity ? "border-red-500 bg-red-950/10 font-mono text-right" : "bg-slate-900 border-slate-700 font-mono text-right"}
                        placeholder="1.0" 
                    />
                    {errors.viscosity && <span className="text-xs text-red-400 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/> Required</span>}
                </div>

                <div className="space-y-3">
                     <div className="flex items-center gap-2">
                        <Label htmlFor="density" className="text-slate-300">Fluid Density (lbm/ft³) <span className="text-red-400">*</span></Label>
                        <Tooltip>
                            <TooltipTrigger asChild><Info className="w-3.5 h-3.5 text-slate-500 cursor-help" /></TooltipTrigger>
                            <TooltipContent side="right"><p>Average fluid density (0-100)</p></TooltipContent>
                        </Tooltip>
                    </div>
                    <Input 
                        id="density" 
                        type="number" step="0.1" 
                        {...register('density', { required: true, min: 0, max: 100 })} 
                        className={errors.density ? "border-red-500 bg-red-950/10 font-mono text-right" : "bg-slate-900 border-slate-700 font-mono text-right"}
                        placeholder="62.4"
                    />
                    {errors.density && <span className="text-xs text-red-400 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/> Required</span>}
                </div>
            </div>
        </CardContent>
        <CardFooter className="border-t border-slate-800 pt-4 flex justify-end gap-3 bg-slate-900/30 rounded-b-lg">
            <Button type="button" variant="ghost" onClick={() => setConfirmAction('reset')} className="text-slate-400 hover:text-white hover:bg-slate-800">
                Cancel Changes
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 min-w-[150px] shadow-lg shadow-blue-900/20">
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Fluid Data'}
            </Button>
        </CardFooter>
      </form>

      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
                {confirmAction === 'demo' ? 'Load Example Fluid?' : 'Reset Form?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
                {confirmAction === 'demo' 
                    ? "This will overwrite your current entries with example Black Oil fluid properties. This action cannot be undone." 
                    : "This will clear all fields in the form. This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction} className="bg-blue-600 hover:bg-blue-700 text-white">Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
    </TooltipProvider>
  );
};

export default FluidPropertiesForm;