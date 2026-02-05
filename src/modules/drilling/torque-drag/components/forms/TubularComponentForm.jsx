import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TubularComponentSchema } from '@/services/torqueDrag/models/TubularComponent';
import { useTorqueDrag } from '@/contexts/TorqueDragContext';
import { useToast } from '@/components/ui/use-toast';
import { DEMO_COMPONENTS } from '@/services/torqueDrag/data/demoData';

const TubularComponentForm = () => {
  const { current_well, addTubularComponent } = useTorqueDrag();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(TubularComponentSchema),
    defaultValues: {
      component_id: crypto.randomUUID(),
      well_id: current_well?.well_id || '',
      type: 'Drill Pipe',
      od_inches: 5.0,
      id_inches: 4.276,
      weight_per_foot_lbm: 19.5,
      grade: 'S',
      material: 'Steel',
      connection_type: 'API',
      tool_joint_od_inches: 6.5,
      box_length_inches: 12,
      yield_strength_psi: 135000,
      tensile_strength_psi: 145000,
      created_date: new Date().toISOString()
    }
  });

  const { register, handleSubmit, setValue, formState: { errors }, reset } = form;

  const onSubmit = (data) => {
    try {
      addTubularComponent({ ...data, component_id: crypto.randomUUID() });
      toast({ title: "Component Added", description: `${data.type} added to library.` });
      // Don't reset completely, just ID, to allow rapid entry of similar items
      setValue('component_id', crypto.randomUUID());
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  const loadDemoData = () => {
      const demo = DEMO_COMPONENTS[0];
      reset({ ...demo, component_id: crypto.randomUUID(), well_id: current_well?.well_id });
  };

  if (!current_well) return <div className="text-center text-slate-500 p-8">Select a well first.</div>;

  return (
    <Card className="bg-slate-900 border-slate-700 text-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-slate-100">Add Tubular Component</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label>Type</Label>
                    <Select onValueChange={(val) => setValue("type", val)} defaultValue="Drill Pipe">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Drill Pipe">Drill Pipe</SelectItem>
                            <SelectItem value="HWDP">HWDP</SelectItem>
                            <SelectItem value="Drill Collar">Drill Collar</SelectItem>
                            <SelectItem value="Casing">Casing</SelectItem>
                            <SelectItem value="Tubing">Tubing</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label>Material</Label>
                    <Select onValueChange={(val) => setValue("material", val)} defaultValue="Steel">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Steel">Steel</SelectItem>
                            <SelectItem value="Aluminum">Aluminum</SelectItem>
                            <SelectItem value="Composite">Composite</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                    <Label>OD (in)</Label>
                    <Input type="number" step="0.001" {...register("od_inches", { valueAsNumber: true })} />
                    {errors.od_inches && <span className="text-xs text-red-500">{errors.od_inches.message}</span>}
                </div>
                <div className="grid gap-2">
                    <Label>ID (in)</Label>
                    <Input type="number" step="0.001" {...register("id_inches", { valueAsNumber: true })} />
                    {errors.id_inches && <span className="text-xs text-red-500">{errors.id_inches.message}</span>}
                </div>
                <div className="grid gap-2">
                    <Label>Weight (lb/ft)</Label>
                    <Input type="number" step="0.01" {...register("weight_per_foot_lbm", { valueAsNumber: true })} />
                    {errors.weight_per_foot_lbm && <span className="text-xs text-red-500">{errors.weight_per_foot_lbm.message}</span>}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                    <Label>Grade</Label>
                    <Select onValueChange={(val) => setValue("grade", val)} defaultValue="S">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {['E', 'X', 'G', 'S', 'SS', 'NS'].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label>Yield (psi)</Label>
                    <Input type="number" step="1" {...register("yield_strength_psi", { valueAsNumber: true })} />
                </div>
                <div className="grid gap-2">
                    <Label>Tensile (psi)</Label>
                    <Input type="number" step="1" {...register("tensile_strength_psi", { valueAsNumber: true })} />
                </div>
            </div>

             <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                    <Label>Conn. Type</Label>
                    <Select onValueChange={(val) => setValue("connection_type", val)} defaultValue="API">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="API">API</SelectItem>
                            <SelectItem value="Flush">Flush</SelectItem>
                            <SelectItem value="Integral">Integral</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label>TJ OD (in)</Label>
                    <Input type="number" step="0.1" {...register("tool_joint_od_inches", { valueAsNumber: true })} />
                </div>
                <div className="grid gap-2">
                    <Label>Box Len (in)</Label>
                    <Input type="number" step="1" {...register("box_length_inches", { valueAsNumber: true })} />
                </div>
            </div>

            <div className="flex justify-between pt-2">
                 <Button type="button" variant="outline" onClick={loadDemoData} className="border-slate-600 text-slate-300">
                    Demo Data
                 </Button>
                 <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="mr-2 h-4 w-4" /> Add Component
                 </Button>
            </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TubularComponentForm;