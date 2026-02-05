import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
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
  SelectValue 
} from '@/components/ui/select';
import { useCasingOperations, useWells } from '@/hooks/useCasingDesign';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient'; // Direct import for lookup if needed

const CreateDesignModal = ({ isOpen, onClose, onSuccess }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const { createDesign } = useCasingOperations();
  const { wells, loading: wellsLoading } = useWells();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Find the well to get the project_id
      const selectedWell = wells.find(w => w.id === data.well_id);
      let projectId = selectedWell?.project_id;
      
      // Fallback: If not found in memory, try to fetch it
      if (!projectId && data.well_id) {
          const { data: wellData } = await supabase.from('wells').select('project_id').eq('id', data.well_id).single();
          if (wellData) projectId = wellData.project_id;
      }

      await createDesign({
        name: data.name,
        type: data.type,
        od: parseFloat(data.od),
        well_id: data.well_id,
        project_id: projectId
      });
      
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("CreateDesignModal Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1E293B] border-slate-700 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Design</DialogTitle>
          <DialogDescription className="text-slate-400">
            Initialize a new casing or tubing design case.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Design Name</Label>
            <Input 
              id="name" 
              placeholder="e.g., Production Casing - Run 1" 
              className="bg-slate-900 border-slate-700"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <span className="text-red-400 text-xs">{errors.name.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select onValueChange={(val) => setValue('type', val)} defaultValue="Casing">
                <SelectTrigger className="bg-slate-900 border-slate-700">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                  <SelectItem value="Casing">Casing</SelectItem>
                  <SelectItem value="Tubing">Tubing</SelectItem>
                </SelectContent>
              </Select>
              {/* Register hidden input for react-hook-form validation if needed, or just use state */}
              <input type="hidden" {...register('type', { value: 'Casing' })} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="od">Top OD (in)</Label>
              <Input 
                id="od" 
                type="number" 
                step="0.125" 
                placeholder="9.625" 
                className="bg-slate-900 border-slate-700"
                {...register('od', { required: 'OD is required', min: 0 })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="well">Well Assignment</Label>
            <Select onValueChange={(val) => setValue('well_id', val)}>
                <SelectTrigger className="bg-slate-900 border-slate-700">
                  <SelectValue placeholder={wellsLoading ? "Loading wells..." : "Select a well"} />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white max-h-[200px]">
                  {wells.map(well => (
                    <SelectItem key={well.id} value={well.id}>{well.name}</SelectItem>
                  ))}
                  {wells.length === 0 && !wellsLoading && (
                    <div className="p-2 text-sm text-slate-500 text-center">No wells found</div>
                  )}
                </SelectContent>
            </Select>
            <input type="hidden" {...register('well_id', { required: 'Well is required' })} />
            {errors.well_id && <span className="text-red-400 text-xs">{errors.well_id.message}</span>}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-[#BFFF00] text-black hover:bg-[#a3d900]"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Design
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDesignModal;