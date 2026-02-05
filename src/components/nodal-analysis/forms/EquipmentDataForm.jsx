import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save, Settings2, Info, RotateCcw, Wrench, AlertCircle } from 'lucide-react';
import { useEquipmentData } from '@/hooks/nodal-analysis/useEquipmentData';
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

const EquipmentDataForm = () => {
  const { equipmentData, updateEquipmentData, loading } = useEquipmentData();
  const { toast } = useToast();
  const [confirmAction, setConfirmAction] = useState(null);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
        tubing_od: '', tubing_id: '', tubing_roughness: '0.0006', tubing_length: '',
        casing_od: '', casing_id: '', choke_diameter: '', separator_pressure: ''
    },
    values: equipmentData || undefined
  });

  const onSubmit = async (data) => {
    try {
        await updateEquipmentData(data);
    } catch (error) {
        // Error handled in hook
    }
  };

  const handleAction = () => {
      if (confirmAction === 'demo') {
          const demoData = {
              tubing_od: 2.375,
              tubing_id: 1.995,
              tubing_roughness: 0.0006,
              tubing_length: 12500,
              casing_od: 5.5,
              casing_id: 4.892,
              choke_diameter: 64,
              separator_pressure: 100
          };
          reset(demoData);
          toast({ title: "Demo Config Loaded", description: "Standard 2-3/8\" tubing profile applied." });
      } else if (confirmAction === 'reset') {
          reset({
              tubing_od: '', tubing_id: '', tubing_roughness: '0.0006', tubing_length: '',
              casing_od: '', casing_id: '', choke_diameter: '', separator_pressure: ''
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
            <Settings2 className="w-5 h-5 text-purple-400" />
            Equipment & Geometry
        </CardTitle>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setConfirmAction('reset')} className="text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-white">
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
            </Button>
            <Button variant="outline" size="sm" type="button" onClick={() => setConfirmAction('demo')} className="text-purple-400 border-purple-900/50 bg-purple-900/10 hover:bg-purple-900/20">
                <Wrench className="w-3.5 h-3.5 mr-1" /> Standard Config
            </Button>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Tubing Section */}
                <div className="space-y-4 p-5 border border-slate-700/50 rounded-xl bg-slate-900/20">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700/50">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <h4 className="font-semibold text-blue-300 text-sm uppercase tracking-wider">Tubing String</h4>
                    </div>
                    
                    <div className="space-y-2">
                         <div className="flex items-center justify-between">
                            <Label htmlFor="tubing_od" className="text-slate-300">Outer Diameter (in) <span className="text-red-400">*</span></Label>
                            <Tooltip>
                                <TooltipTrigger asChild><Info className="w-3 h-3 text-slate-600 cursor-help" /></TooltipTrigger>
                                <TooltipContent><p>Standard sizes: 2.375, 2.875, 3.5" (Max 20")</p></TooltipContent>
                            </Tooltip>
                        </div>
                        <Input id="tubing_od" type="number" step="0.001" {...register('tubing_od', { required: true, min: 0.5, max: 20 })} className={errors.tubing_od ? "border-red-500 bg-red-950/10 text-right font-mono" : "bg-slate-900 border-slate-700 font-mono text-right"} />
                        {errors.tubing_od && <span className="text-xs text-red-400 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/> Required</span>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tubing_id" className="text-slate-300">Inner Diameter (in) <span className="text-red-400">*</span></Label>
                        <Input id="tubing_id" type="number" step="0.001" {...register('tubing_id', { required: true, min: 0.5, max: 20 })} className={errors.tubing_id ? "border-red-500 bg-red-950/10 text-right font-mono" : "bg-slate-900 border-slate-700 font-mono text-right"} />
                        {errors.tubing_id && <span className="text-xs text-red-400 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/> Required</span>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tubing_length" className="text-slate-300">Length (ft) <span className="text-red-400">*</span></Label>
                        <Input id="tubing_length" type="number" step="1" {...register('tubing_length', { required: true, min: 100, max: 50000 })} className={errors.tubing_length ? "border-red-500 bg-red-950/10 text-right font-mono" : "bg-slate-900 border-slate-700 font-mono text-right"} />
                        {errors.tubing_length && <span className="text-xs text-red-400 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/> Required</span>}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="tubing_roughness" className="text-slate-300">Roughness (in) <span className="text-red-400">*</span></Label>
                            <Tooltip>
                                <TooltipTrigger asChild><Info className="w-3 h-3 text-slate-600 cursor-help" /></TooltipTrigger>
                                <TooltipContent><p>Typical: 0.0006 for commercial steel (0-1000)</p></TooltipContent>
                            </Tooltip>
                        </div>
                        <Input id="tubing_roughness" type="number" step="0.0001" defaultValue="0.0006" {...register('tubing_roughness', { required: true, min: 0, max: 1000 })} className="bg-slate-900 border-slate-700 font-mono text-right" />
                    </div>
                </div>

                {/* Casing Section */}
                <div className="space-y-4 p-5 border border-slate-700/50 rounded-xl bg-slate-900/20">
                     <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700/50">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <h4 className="font-semibold text-emerald-300 text-sm uppercase tracking-wider">Production Casing</h4>
                    </div>

                    <div className="space-y-2">
                         <div className="flex items-center justify-between">
                            <Label htmlFor="casing_od" className="text-slate-300">Outer Diameter (in) <span className="text-red-400">*</span></Label>
                             <Tooltip>
                                <TooltipTrigger asChild><Info className="w-3 h-3 text-slate-600 cursor-help" /></TooltipTrigger>
                                <TooltipContent><p>Standard sizes: 4.5, 5.5, 7, 9.625" (Max 30")</p></TooltipContent>
                            </Tooltip>
                        </div>
                        <Input id="casing_od" type="number" step="0.001" {...register('casing_od', { required: true, min: 2, max: 30 })} className={errors.casing_od ? "border-red-500 bg-red-950/10 text-right font-mono" : "bg-slate-900 border-slate-700 font-mono text-right"} />
                        {errors.casing_od && <span className="text-xs text-red-400 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/> Required</span>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="casing_id" className="text-slate-300">Inner Diameter (in) <span className="text-red-400">*</span></Label>
                        <Input id="casing_id" type="number" step="0.001" {...register('casing_id', { required: true, min: 1.5, max: 30 })} className={errors.casing_id ? "border-red-500 bg-red-950/10 text-right font-mono" : "bg-slate-900 border-slate-700 font-mono text-right"} />
                        {errors.casing_id && <span className="text-xs text-red-400 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/> Required</span>}
                    </div>
                </div>

                {/* Surface Equipment */}
                <div className="space-y-4 p-5 border border-slate-700/50 rounded-xl bg-slate-900/20">
                     <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700/50">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <h4 className="font-semibold text-orange-300 text-sm uppercase tracking-wider">Surface Control</h4>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="choke_diameter" className="text-slate-300">Choke Size (1/64") <span className="text-red-400">*</span></Label>
                            <Tooltip>
                                <TooltipTrigger asChild><Info className="w-3 h-3 text-slate-600 cursor-help" /></TooltipTrigger>
                                <TooltipContent><p>Integer value in 64ths of an inch (1-256)</p></TooltipContent>
                            </Tooltip>
                        </div>
                        <Input id="choke_diameter" type="number" step="1" {...register('choke_diameter', { required: true, min: 1, max: 256 })} className={errors.choke_diameter ? "border-red-500 bg-red-950/10 text-right font-mono" : "bg-slate-900 border-slate-700 font-mono text-right"} />
                        {errors.choke_diameter && <span className="text-xs text-red-400 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/> Required</span>}
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="separator_pressure" className="text-slate-300">Separator Pressure (psi) <span className="text-red-400">*</span></Label>
                            <Tooltip>
                                <TooltipTrigger asChild><Info className="w-3 h-3 text-slate-600 cursor-help" /></TooltipTrigger>
                                <TooltipContent><p>Surface backpressure at separator (0-10,000 psi)</p></TooltipContent>
                            </Tooltip>
                        </div>
                        <Input id="separator_pressure" type="number" step="1" {...register('separator_pressure', { required: true, min: 0, max: 10000 })} className={errors.separator_pressure ? "border-red-500 bg-red-950/10 text-right font-mono" : "bg-slate-900 border-slate-700 font-mono text-right"} />
                        {errors.separator_pressure && <span className="text-xs text-red-400 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/> Required</span>}
                    </div>
                </div>
            </div>
        </CardContent>
        <CardFooter className="border-t border-slate-800 pt-4 flex justify-end gap-3 bg-slate-900/30 rounded-b-lg">
            <Button type="button" variant="ghost" onClick={() => setConfirmAction('reset')} className="text-slate-400 hover:text-white hover:bg-slate-800">
                Cancel Changes
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 min-w-[150px] shadow-lg shadow-blue-900/20">
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Configuration'}
            </Button>
        </CardFooter>
      </form>

      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
                {confirmAction === 'demo' ? 'Load Standard Config?' : 'Reset Form?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
                {confirmAction === 'demo' 
                    ? "This will overwrite your current entries with standard equipment configuration. This action cannot be undone." 
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

export default EquipmentDataForm;