import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TubularComponentSchema } from '@/services/hydraulics/models/TubularComponent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Save, PlayCircle } from 'lucide-react';
import { useHydraulicsSimulator } from '@/contexts/HydraulicsSimulatorContext';
import { DEMO_TUBULARS } from '@/services/hydraulics/data/demoData';
import { toast } from '@/components/ui/use-toast';

const TubularsArraySchema = z.object({
  components: z.array(TubularComponentSchema)
});

const TubularComponentForm = ({ onSuccess }) => {
  const { current_well, tubular_components, addTubularComponent, deleteTubularComponent } = useHydraulicsSimulator();

  const [defaultComponents] = useState(() => {
    const existing = tubular_components.filter(c => c.well_id === current_well?.well_id);
    return existing.length > 0 ? existing : [{
      component_id: crypto.randomUUID(),
      well_id: current_well?.well_id,
      type: 'Drill Pipe',
      od_inches: 5,
      id_inches: 4.276,
      weight_per_foot_lbm: 19.5,
      length_ft: 1000,
      tool_joint_od_inches: 6.5,
      roughness_microns: 25,
      sequence: 1,
      created_date: new Date().toISOString()
    }];
  });

  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(TubularsArraySchema),
    defaultValues: { components: defaultComponents }
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "components"
  });

  const onSubmit = (data) => {
    // Replace strategy
    const existingIds = tubular_components.filter(c => c.well_id === current_well.well_id).map(c => c.component_id);
    existingIds.forEach(id => deleteTubularComponent(id));
    
    data.components.forEach(comp => {
        addTubularComponent({ ...comp, well_id: current_well.well_id });
    });

    toast({ title: "Drill String Saved", description: `${data.components.length} components configured.` });
    if (onSuccess) onSuccess();
  };

  const loadDemoData = () => {
     if (!current_well) return;
     const demoData = DEMO_TUBULARS.map(t => ({
         ...t,
         component_id: crypto.randomUUID(),
         well_id: current_well.well_id
     }));
     replace(demoData);
     toast({ title: "Demo String Loaded", description: "Standard BHA loaded." });
  };

  const handleAddRow = () => {
    append({
      component_id: crypto.randomUUID(),
      well_id: current_well?.well_id,
      type: 'Drill Collar',
      od_inches: 6.5,
      id_inches: 2.25,
      weight_per_foot_lbm: 85,
      length_ft: 30,
      tool_joint_od_inches: 6.5,
      roughness_microns: 50,
      sequence: fields.length + 1,
      created_date: new Date().toISOString()
    });
  };

  if (!current_well) return <div className="text-center p-8 text-slate-500">Please create a well first.</div>;

  return (
    <div className="space-y-6 p-4 bg-slate-900 rounded-lg border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-medium text-slate-200">Drill String & BHA</h3>
          <p className="text-sm text-slate-500">Configure from top to bottom (Surface to Bit).</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadDemoData} className="border-slate-700 hover:bg-slate-800">
          <PlayCircle className="mr-2 h-4 w-4 text-orange-500" /> Use Demo BHA
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
         <div className="rounded-md border border-slate-800 overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-950">
                    <TableRow>
                        <TableHead className="w-[50px]">Seq</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>OD (in)</TableHead>
                        <TableHead>ID (in)</TableHead>
                        <TableHead>Weight (lb/ft)</TableHead>
                        <TableHead>Length (ft)</TableHead>
                        <TableHead>TJ OD (in)</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {fields.map((field, index) => (
                        <TableRow key={field.id} className="bg-slate-900/50">
                            <TableCell className="font-mono text-xs">{index + 1}</TableCell>
                            <TableCell>
                                <select {...register(`components.${index}.type`)} className="h-8 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-200">
                                    <option value="Drill Pipe">Drill Pipe</option>
                                    <option value="HWDP">HWDP</option>
                                    <option value="Drill Collar">Drill Collar</option>
                                    <option value="Motor">Motor</option>
                                    <option value="Bit">Bit</option>
                                </select>
                            </TableCell>
                            <TableCell>
                                <Input type="number" step="0.001" {...register(`components.${index}.od_inches`, { valueAsNumber: true })} className="h-8 text-xs bg-slate-800 w-20" />
                            </TableCell>
                            <TableCell>
                                <Input type="number" step="0.001" {...register(`components.${index}.id_inches`, { valueAsNumber: true })} className="h-8 text-xs bg-slate-800 w-20" />
                            </TableCell>
                            <TableCell>
                                <Input type="number" step="0.1" {...register(`components.${index}.weight_per_foot_lbm`, { valueAsNumber: true })} className="h-8 text-xs bg-slate-800 w-20" />
                            </TableCell>
                            <TableCell>
                                <Input type="number" step="0.1" {...register(`components.${index}.length_ft`, { valueAsNumber: true })} className="h-8 text-xs bg-slate-800 w-20" />
                            </TableCell>
                            <TableCell>
                                <Input type="number" step="0.001" {...register(`components.${index}.tool_joint_od_inches`, { valueAsNumber: true })} className="h-8 text-xs bg-slate-800 w-20" />
                            </TableCell>
                            <TableCell>
                                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="h-8 w-8 text-red-400">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
         </div>

         <div className="flex justify-between pt-2">
             <Button type="button" variant="outline" size="sm" onClick={handleAddRow} className="border-dashed border-slate-600 text-slate-400">
                <Plus className="mr-2 h-4 w-4" /> Add Component
             </Button>
             
             <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                <Save className="mr-2 h-4 w-4" /> Save Drill String
            </Button>
        </div>
      </form>
    </div>
  );
};

export default TubularComponentForm;