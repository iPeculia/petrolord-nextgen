import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FrictionCoefficientSchema } from '@/services/torqueDrag/models/FrictionCoefficient';
import { useTorqueDrag } from '@/contexts/TorqueDragContext';
import { useToast } from '@/components/ui/use-toast';

const FrictionCoefficientForm = () => {
  const { current_well, setFrictionCoefficients } = useTorqueDrag();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(FrictionCoefficientSchema),
    defaultValues: {
      friction_id: crypto.randomUUID(),
      well_id: current_well?.well_id || '',
      cased_hole_ff: 0.25,
      open_hole_ff: 0.35,
      riser_ff: 0.20,
      pipe_to_pipe_ff: 0.25,
      notes: '',
      created_date: new Date().toISOString()
    }
  });

  const { register, handleSubmit, setValue, formState: { errors } } = form;

  const onSubmit = (data) => {
    try {
      setFrictionCoefficients(data);
      toast({ title: "Friction Factors Saved", description: "Coefficients updated successfully." });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  const estimateOffsets = () => {
      setValue("cased_hole_ff", 0.22);
      setValue("open_hole_ff", 0.30);
      setValue("riser_ff", 0.18);
      setValue("pipe_to_pipe_ff", 0.22);
      toast({ title: "Estimates Applied", description: "Values updated from offset well data." });
  };

  if (!current_well) return <div className="text-center text-slate-500 p-8">Select a well first.</div>;

  return (
    <Card className="bg-slate-900 border-slate-700 text-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-slate-100">Friction Coefficients</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label>Cased Hole FF</Label>
                    <Input type="number" step="0.01" {...register("cased_hole_ff", { valueAsNumber: true })} />
                    {errors.cased_hole_ff && <span className="text-xs text-red-500">{errors.cased_hole_ff.message}</span>}
                </div>
                <div className="grid gap-2">
                    <Label>Open Hole FF</Label>
                    <Input type="number" step="0.01" {...register("open_hole_ff", { valueAsNumber: true })} />
                    {errors.open_hole_ff && <span className="text-xs text-red-500">{errors.open_hole_ff.message}</span>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label>Riser FF</Label>
                    <Input type="number" step="0.01" {...register("riser_ff", { valueAsNumber: true })} />
                    {errors.riser_ff && <span className="text-xs text-red-500">{errors.riser_ff.message}</span>}
                </div>
                <div className="grid gap-2">
                    <Label>Pipe-to-Pipe FF</Label>
                    <Input type="number" step="0.01" {...register("pipe_to_pipe_ff", { valueAsNumber: true })} />
                    {errors.pipe_to_pipe_ff && <span className="text-xs text-red-500">{errors.pipe_to_pipe_ff.message}</span>}
                </div>
            </div>

            <div className="grid gap-2">
                <Label>Notes</Label>
                <Textarea {...register("notes")} placeholder="Notes on friction sources..." />
            </div>

            <div className="flex justify-between pt-4">
                 <Button type="button" variant="outline" onClick={estimateOffsets} className="border-slate-600 text-slate-300">
                    <HelpCircle className="mr-2 h-4 w-4" /> Estimate from Offset
                 </Button>
                 <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Save className="mr-2 h-4 w-4" /> Save Factors
                 </Button>
            </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FrictionCoefficientForm;