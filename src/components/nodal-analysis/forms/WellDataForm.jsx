import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, AlertCircle, Database, Info, RotateCcw } from 'lucide-react';
import { useWellData } from '@/hooks/nodal-analysis/useWellData';
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

const WellDataForm = () => {
  const { wellData, updateWellData, loading } = useWellData();
  const { toast } = useToast();
  const [confirmAction, setConfirmAction] = useState(null);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
    defaultValues: {
        name: '',
        location: '',
        depth_tvd: '',
        depth_md: '',
        wellhead_pressure: '',
        bottomhole_temp: '',
        fluid_type: 'Oil'
    },
    values: wellData || undefined
  });

  const onSubmit = async (data) => {
    try {
        await updateWellData(data);
    } catch (error) {
        // Error toast handled in hook
    }
  };

  const handleAction = () => {
      if (confirmAction === 'demo') {
          const demoData = {
              name: "Well-P101 (Demo)",
              location: "Permian Basin, Texas",
              depth_tvd: 6847,
              depth_md: 12500,
              wellhead_pressure: 500,
              bottomhole_temp: 180,
              fluid_type: "Oil"
          };
          reset(demoData);
          toast({ title: "Demo Data Loaded", description: "Review and save to apply changes." });
      } else if (confirmAction === 'reset') {
          reset({
              name: '',
              location: '',
              depth_tvd: '',
              depth_md: '',
              wellhead_pressure: '',
              bottomhole_temp: '',
              fluid_type: 'Oil'
          });
          toast({ title: "Form Reset", description: "All fields have been cleared." });
      }
      setConfirmAction(null);
  };

  const fluidType = watch('fluid_type');

  return (
    <TooltipProvider delayDuration={300}>
    <Card className="bg-[#1E293B] border-slate-700 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800">
        <CardTitle className="text-lg text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-400" />
            Well Configuration
        </CardTitle>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setConfirmAction('reset')} className="text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-white">
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
            </Button>
            <Button variant="outline" size="sm" type="button" onClick={() => setConfirmAction('demo')} className="text-blue-400 border-blue-900/50 bg-blue-900/10 hover:bg-blue-900/20">
                <Database className="w-3.5 h-3.5 mr-1" /> Use Demo Data
            </Button>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="name" className="text-slate-300">Well Name <span className="text-red-400">*</span></Label>
                        <Tooltip>
                            <TooltipTrigger asChild><Info className="w-3.5 h-3.5 text-slate-500 cursor-help" /></TooltipTrigger>
                            <TooltipContent side="right"><p>Unique identifier for the well (3-50 chars)</p></TooltipContent>
                        </Tooltip>
                    </div>
                    <Input 
                        id="name" 
                        {...register('name', { required: "Well name is required", minLength: { value: 3, message: "Min 3 chars" }, maxLength: { value: 50, message: "Max 50 chars" } })}
                        className={errors.name ? "border-red-500 bg-red-950/10" : "bg-slate-900 border-slate-700 focus:border-blue-500"}
                        placeholder="e.g. Well-P101"
                    />
                    {errors.name && <span className="text-xs text-red-400 flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1"/> {errors.name.message}</span>}
                </div>

                {/* Location */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                         <Label htmlFor="location" className="text-slate-300">Location <span className="text-red-400">*</span></Label>
                         <Tooltip>
                            <TooltipTrigger asChild><Info className="w-3.5 h-3.5 text-slate-500 cursor-help" /></TooltipTrigger>
                            <TooltipContent side="right"><p>Geographic location or field name</p></TooltipContent>
                        </Tooltip>
                    </div>
                    <Input 
                        id="location" 
                        {...register('location', { required: "Location is required", minLength: { value: 3, message: "Min 3 chars" } })}
                        className={errors.location ? "border-red-500 bg-red-950/10" : "bg-slate-900 border-slate-700 focus:border-blue-500"}
                        placeholder="e.g. Permian Basin"
                    />
                    {errors.location && <span className="text-xs text-red-400 flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1"/> {errors.location.message}</span>}
                </div>

                {/* Fluid Type */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="fluid_type" className="text-slate-300">Fluid Type <span className="text-red-400">*</span></Label>
                        <Tooltip>
                            <TooltipTrigger asChild><Info className="w-3.5 h-3.5 text-slate-500 cursor-help" /></TooltipTrigger>
                            <TooltipContent side="right"><p>Primary fluid phase produced</p></TooltipContent>
                        </Tooltip>
                    </div>
                    <Select 
                        value={fluidType} 
                        onValueChange={(val) => setValue('fluid_type', val)}
                    >
                        <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-200">
                            <SelectValue placeholder="Select Fluid Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                            <SelectItem value="Oil">Oil</SelectItem>
                            <SelectItem value="Gas">Gas</SelectItem>
                            <SelectItem value="Water">Water</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* MD */}
                <div className="space-y-2">
                     <div className="flex items-center gap-2">
                        <Label htmlFor="depth_md" className="text-slate-300">Measured Depth (ft) <span className="text-red-400">*</span></Label>
                        <Tooltip>
                            <TooltipTrigger asChild><Info className="w-3.5 h-3.5 text-slate-500 cursor-help" /></TooltipTrigger>
                            <TooltipContent side="right"><p>Total length along wellbore path (100-50,000 ft)</p></TooltipContent>
                        </Tooltip>
                    </div>
                    <Input 
                        id="depth_md"
                        type="number"
                        step="0.1"
                        {...register('depth_md', { required: "MD is required", min: { value: 100, message: "> 100 ft" }, max: { value: 50000, message: "< 50,000 ft" } })}
                        className={errors.depth_md ? "border-red-500 bg-red-950/10 font-mono text-right" : "bg-slate-900 border-slate-700 font-mono text-right"}
                    />
                     {errors.depth_md && <span className="text-xs text-red-400 flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1"/> {errors.depth_md.message}</span>}
                </div>

                {/* TVD */}
                <div className="space-y-2">
                     <div className="flex items-center gap-2">
                        <Label htmlFor="depth_tvd" className="text-slate-300">True Vertical Depth (ft) <span className="text-red-400">*</span></Label>
                        <Tooltip>
                            <TooltipTrigger asChild><Info className="w-3.5 h-3.5 text-slate-500 cursor-help" /></TooltipTrigger>
                            <TooltipContent side="right"><p>Vertical distance from surface to bottom (100-30,000 ft)</p></TooltipContent>
                        </Tooltip>
                    </div>
                    <Input 
                        id="depth_tvd"
                        type="number"
                        step="0.1"
                        {...register('depth_tvd', { required: "TVD is required", min: { value: 100, message: "> 100 ft" }, max: { value: 30000, message: "< 30,000 ft" } })}
                        className={errors.depth_tvd ? "border-red-500 bg-red-950/10 font-mono text-right" : "bg-slate-900 border-slate-700 font-mono text-right"}
                    />
                    {errors.depth_tvd && <span className="text-xs text-red-400 flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1"/> {errors.depth_tvd.message}</span>}
                </div>

                {/* WHP */}
                <div className="space-y-2">
                     <div className="flex items-center gap-2">
                        <Label htmlFor="wellhead_pressure" className="text-slate-300">Wellhead Pressure (psi) <span className="text-red-400">*</span></Label>
                        <Tooltip>
                            <TooltipTrigger asChild><Info className="w-3.5 h-3.5 text-slate-500 cursor-help" /></TooltipTrigger>
                            <TooltipContent side="right"><p>Pressure measured at the wellhead (0-15,000 psi)</p></TooltipContent>
                        </Tooltip>
                    </div>
                    <Input 
                        id="wellhead_pressure"
                        type="number"
                        step="1"
                        {...register('wellhead_pressure', { required: "WHP is required", min: { value: 0, message: "Must be positive" }, max: { value: 15000, message: "< 15,000 psi" } })}
                        className={errors.wellhead_pressure ? "border-red-500 bg-red-950/10 font-mono text-right" : "bg-slate-900 border-slate-700 font-mono text-right"}
                    />
                    {errors.wellhead_pressure && <span className="text-xs text-red-400 flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1"/> {errors.wellhead_pressure.message}</span>}
                </div>

                {/* BHT */}
                <div className="space-y-2">
                     <div className="flex items-center gap-2">
                        <Label htmlFor="bottomhole_temp" className="text-slate-300">Bottomhole Temp (°F) <span className="text-red-400">*</span></Label>
                        <Tooltip>
                            <TooltipTrigger asChild><Info className="w-3.5 h-3.5 text-slate-500 cursor-help" /></TooltipTrigger>
                            <TooltipContent side="right"><p>Reservoir temperature (50-500 °F)</p></TooltipContent>
                        </Tooltip>
                    </div>
                    <Input 
                        id="bottomhole_temp"
                        type="number"
                        step="1"
                        {...register('bottomhole_temp', { required: "BHT is required", min: { value: 50, message: "> 50 °F" }, max: { value: 500, message: "< 500 °F" } })}
                        className={errors.bottomhole_temp ? "border-red-500 bg-red-950/10 font-mono text-right" : "bg-slate-900 border-slate-700 font-mono text-right"}
                    />
                    {errors.bottomhole_temp && <span className="text-xs text-red-400 flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1"/> {errors.bottomhole_temp.message}</span>}
                </div>
            </div>
        </CardContent>
        <CardFooter className="border-t border-slate-800 pt-4 flex justify-end gap-3 bg-slate-900/30 rounded-b-lg">
            <Button type="button" variant="ghost" onClick={() => setConfirmAction('reset')} className="text-slate-400 hover:text-white hover:bg-slate-800">
                Cancel Changes
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 min-w-[140px] shadow-lg shadow-blue-900/20">
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Configuration'}
            </Button>
        </CardFooter>
      </form>

      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
                {confirmAction === 'demo' ? 'Load Demo Data?' : 'Reset Form?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
                {confirmAction === 'demo' 
                    ? "This will overwrite your current entries with example data. This action cannot be undone." 
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

export default WellDataForm;