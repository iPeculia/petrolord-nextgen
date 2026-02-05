import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Save, Info } from 'lucide-react';
import { useHydraulicsSimulator } from '@/contexts/HydraulicsSimulatorContext';
import { HoleSectionSchema } from '@/services/hydraulics/models/HoleSection';
import { toast } from '@/components/ui/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Schema for array of sections
const SectionsArraySchema = z.object({
  sections: z.array(HoleSectionSchema)
});

const HoleSectionForm = ({ onSuccess }) => {
  const { current_well, hole_sections, addHoleSection, updateHoleSection, deleteHoleSection } = useHydraulicsSimulator();
  
  // Initialize with existing sections or empty default
  const [defaultSections] = useState(() => {
    const wellSections = hole_sections.filter(s => s.well_id === current_well?.well_id);
    return wellSections.length > 0 ? wellSections : [{
      section_id: crypto.randomUUID(),
      well_id: current_well?.well_id,
      section_name: 'Surface Casing',
      type: 'Casing',
      od_inches: 20,
      id_inches: 19,
      top_depth_ft: 0,
      bottom_depth_ft: 3000,
      roughness_microns: 25,
      sequence: 1,
      created_date: new Date().toISOString()
    }];
  });

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(SectionsArraySchema),
    defaultValues: { sections: defaultSections }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections"
  });

  const onSubmit = (data) => {
    // Sync with context
    // This is a simplified sync strategy: delete all for this well and re-add from form
    // In a real backend, you'd want to diff changes.
    
    // For local context:
    const existingIds = hole_sections.filter(s => s.well_id === current_well.well_id).map(s => s.section_id);
    existingIds.forEach(id => deleteHoleSection(id));
    
    data.sections.forEach(section => {
        addHoleSection({ ...section, well_id: current_well.well_id });
    });

    toast({ title: "Hole Sections Saved", description: `${data.sections.length} sections configured.` });
    if (onSuccess) onSuccess();
  };

  const handleAddRow = () => {
    append({
      section_id: crypto.randomUUID(),
      well_id: current_well?.well_id,
      section_name: 'New Section',
      type: 'Open Hole',
      od_inches: 12.25,
      id_inches: 12.25,
      top_depth_ft: 0,
      bottom_depth_ft: 0,
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
          <h3 className="text-lg font-medium text-slate-200">Hole & Casing Configuration</h3>
          <p className="text-sm text-slate-500">Define wellbore geometry from top to bottom.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="rounded-md border border-slate-800 overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-950">
                    <TableRow>
                        <TableHead className="w-[50px]">Seq</TableHead>
                        <TableHead>Section Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>OD (in)</TableHead>
                        <TableHead>ID (in)</TableHead>
                        <TableHead>Top (ft)</TableHead>
                        <TableHead>Bottom (ft)</TableHead>
                        <TableHead>Len (ft)</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {fields.map((field, index) => {
                        // Watch specific fields for calculations
                        const top = watch(`sections.${index}.top_depth_ft`);
                        const bottom = watch(`sections.${index}.bottom_depth_ft`);
                        const length = (bottom - top).toFixed(1);

                        return (
                            <TableRow key={field.id} className="bg-slate-900/50">
                                <TableCell className="font-mono text-xs">{index + 1}</TableCell>
                                <TableCell>
                                    <Input {...register(`sections.${index}.section_name`)} className="h-8 text-xs bg-slate-800" />
                                    {errors.sections?.[index]?.section_name && <span className="text-[10px] text-red-500 block">{errors.sections[index].section_name.message}</span>}
                                </TableCell>
                                <TableCell>
                                    <select {...register(`sections.${index}.type`)} className="h-8 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="Casing">Casing</option>
                                        <option value="Liner">Liner</option>
                                        <option value="Open Hole">Open Hole</option>
                                        <option value="Riser">Riser</option>
                                    </select>
                                </TableCell>
                                <TableCell>
                                    <Input type="number" step="0.001" {...register(`sections.${index}.od_inches`, { valueAsNumber: true })} className="h-8 text-xs bg-slate-800 w-20" />
                                </TableCell>
                                <TableCell>
                                    <Input type="number" step="0.001" {...register(`sections.${index}.id_inches`, { valueAsNumber: true })} className="h-8 text-xs bg-slate-800 w-20" />
                                     {errors.sections?.[index]?.id_inches && <span className="text-[10px] text-red-500 block">{errors.sections[index].id_inches.message}</span>}
                                </TableCell>
                                <TableCell>
                                    <Input type="number" step="1" {...register(`sections.${index}.top_depth_ft`, { valueAsNumber: true })} className="h-8 text-xs bg-slate-800 w-24" />
                                </TableCell>
                                <TableCell>
                                    <Input type="number" step="1" {...register(`sections.${index}.bottom_depth_ft`, { valueAsNumber: true })} className="h-8 text-xs bg-slate-800 w-24" />
                                     {errors.sections?.[index]?.bottom_depth_ft && <span className="text-[10px] text-red-500 block">{errors.sections[index].bottom_depth_ft.message}</span>}
                                </TableCell>
                                <TableCell className="text-xs text-slate-400 font-mono">
                                    {length > 0 ? length : '-'}
                                </TableCell>
                                <TableCell>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>

        <div className="flex justify-between pt-2">
             <Button type="button" variant="outline" size="sm" onClick={handleAddRow} className="border-dashed border-slate-600 text-slate-400 hover:text-slate-200 hover:bg-slate-800">
                <Plus className="mr-2 h-4 w-4" /> Add Section
             </Button>
             
             <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Save className="mr-2 h-4 w-4" /> Save Sections
            </Button>
        </div>
      </form>
    </div>
  );
};

export default HoleSectionForm;