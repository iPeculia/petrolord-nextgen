import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { wellBaseSchema } from '../models/schemas';
import { useArtificialLift } from '../context/ArtificialLiftContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
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
import { ScrollArea } from "@/components/ui/scroll-area";

const NewWellModal = ({ open, onOpenChange }) => {
  const { addWell } = useArtificialLift();
  
  // We use wellBaseSchema here because wellSchema is a ZodEffects object (due to .refine())
  // and ZodEffects does not support .omit(). The form validation uses the base rules,
  // while the full context validation will still run the refined checks.
  
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(wellBaseSchema.omit({ well_id: true, created_at: true, updated_at: true })),
    defaultValues: {
      type: "Vertical",
      status: "Planned",
      depth_md: 0,
      depth_tvd: 0,
      casing_id: 0,
      tubing_id: 0,
      tubing_od: 0,
      perforation_depth: 0,
      wellhead_pressure: 0
    }
  });

  const onSubmit = async (data) => {
    const result = await addWell(data);
    if (result) {
      reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-[#1E293B] border-slate-700 text-white max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Create New Well</DialogTitle>
          <DialogDescription className="text-slate-400">
            Enter the basic configuration details for your new well.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-6 pt-2">
          <form id="new-well-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="name">Well Name</Label>
                <Input id="name" {...register("name")} className="bg-slate-800 border-slate-600" placeholder="e.g. Well A-101" />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...register("location")} className="bg-slate-800 border-slate-600" placeholder="e.g. Permian Basin, Block 4" />
                {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Well Type</Label>
                <Select onValueChange={(val) => setValue("type", val)} defaultValue="Vertical">
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

              <div className="space-y-2">
                <Label>Status</Label>
                <Select onValueChange={(val) => setValue("status", val)} defaultValue="Planned">
                  <SelectTrigger className="bg-slate-800 border-slate-600">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600 text-white">
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Planned">Planned</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="depth_md">Measured Depth (ft)</Label>
                <Input id="depth_md" type="number" step="0.1" {...register("depth_md", { valueAsNumber: true })} className="bg-slate-800 border-slate-600" />
                {errors.depth_md && <p className="text-xs text-red-500">{errors.depth_md.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="depth_tvd">TVD (ft)</Label>
                <Input id="depth_tvd" type="number" step="0.1" {...register("depth_tvd", { valueAsNumber: true })} className="bg-slate-800 border-slate-600" />
                {errors.depth_tvd && <p className="text-xs text-red-500">{errors.depth_tvd.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="casing_id">Casing ID (in)</Label>
                <Input id="casing_id" type="number" step="0.001" {...register("casing_id", { valueAsNumber: true })} className="bg-slate-800 border-slate-600" />
                {errors.casing_id && <p className="text-xs text-red-500">{errors.casing_id.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tubing_od">Tubing OD (in)</Label>
                <Input id="tubing_od" type="number" step="0.001" {...register("tubing_od", { valueAsNumber: true })} className="bg-slate-800 border-slate-600" />
                {errors.tubing_od && <p className="text-xs text-red-500">{errors.tubing_od.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tubing_id">Tubing ID (in)</Label>
                <Input id="tubing_id" type="number" step="0.001" {...register("tubing_id", { valueAsNumber: true })} className="bg-slate-800 border-slate-600" />
                {errors.tubing_id && <p className="text-xs text-red-500">{errors.tubing_id.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="perforation_depth">Perforation Depth (ft)</Label>
                <Input id="perforation_depth" type="number" step="0.1" {...register("perforation_depth", { valueAsNumber: true })} className="bg-slate-800 border-slate-600" />
                {errors.perforation_depth && <p className="text-xs text-red-500">{errors.perforation_depth.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="wellhead_pressure">Wellhead Pressure (psi)</Label>
                <Input id="wellhead_pressure" type="number" step="0.1" {...register("wellhead_pressure", { valueAsNumber: true })} className="bg-slate-800 border-slate-600" />
                {errors.wellhead_pressure && <p className="text-xs text-red-500">{errors.wellhead_pressure.message}</p>}
              </div>
            </div>
          </form>
        </ScrollArea>

        <DialogFooter className="p-6 pt-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="mr-2 text-slate-400 hover:text-white">Cancel</Button>
          <Button type="submit" form="new-well-form" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
            {isSubmitting ? "Creating..." : "Create Well"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewWellModal;