import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { GRADES, CONNECTION_TYPES } from '../utils/constants';

const SectionEditorModal = ({ isOpen, onClose, onSave, initialData, mode = 'add' }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    defaultValues: {
      top_depth: 0,
      bottom_depth: 0,
      weight: 0,
      grade: 'L-80',
      connection_type: 'API BTC',
      burst_rating: 0,
      collapse_rating: 0,
      tensile_strength: 0
    }
  });

  const topDepth = watch('top_depth');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Populate form with initial data
        Object.keys(initialData).forEach(key => {
          setValue(key, initialData[key]);
        });
      } else {
        // Reset to defaults
        reset({
          top_depth: 0,
          bottom_depth: 0,
          weight: 0,
          grade: 'L-80',
          connection_type: 'API BTC',
          burst_rating: 0,
          collapse_rating: 0,
          tensile_strength: 0
        });
      }
    }
  }, [isOpen, initialData, reset, setValue]);

  const onSubmit = (data) => {
    const processedData = {
      ...data,
      top_depth: Number(data.top_depth),
      bottom_depth: Number(data.bottom_depth),
      weight: Number(data.weight),
      burst_rating: Number(data.burst_rating),
      collapse_rating: Number(data.collapse_rating),
      tensile_strength: Number(data.tensile_strength),
      id: initialData?.id // Preserve ID if editing existing section
    };
    onSave(processedData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1E293B] border-slate-700 text-white sm:max-w-[600px] z-[110]">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add Section' : 'Edit Section'}</DialogTitle>
          <DialogDescription className="text-slate-400">
            Configure mechanical properties for this pipe interval.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* Depth Interval */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="top_depth">Top Depth (ft)</Label>
              <Input
                id="top_depth"
                type="number"
                step="0.1"
                className="bg-slate-900 border-slate-700 focus:ring-orange-500"
                {...register('top_depth', { required: 'Required', min: 0 })}
              />
              {errors.top_depth && <span className="text-red-400 text-xs">{errors.top_depth.message}</span>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bottom_depth">Bottom Depth (ft)</Label>
              <Input
                id="bottom_depth"
                type="number"
                step="0.1"
                className="bg-slate-900 border-slate-700 focus:ring-orange-500"
                {...register('bottom_depth', { 
                  required: 'Required',
                  validate: (value) => Number(value) > Number(topDepth) || 'Must be deeper than top'
                })}
              />
              {errors.bottom_depth && <span className="text-red-400 text-xs">{errors.bottom_depth.message}</span>}
            </div>
          </div>

          {/* Mechanical Specs */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (ppf)</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                className="bg-slate-900 border-slate-700 focus:ring-orange-500"
                {...register('weight', { required: 'Required', min: 0.1 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Select onValueChange={(val) => setValue('grade', val)} defaultValue={initialData?.grade || 'L-80'}>
                <SelectTrigger className="bg-slate-900 border-slate-700">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white z-[120]">
                  {GRADES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="connection">Connection</Label>
              <Select onValueChange={(val) => setValue('connection_type', val)} defaultValue={initialData?.connection_type || 'API BTC'}>
                <SelectTrigger className="bg-slate-900 border-slate-700">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white z-[120]">
                  {CONNECTION_TYPES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Ratings */}
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 space-y-4">
             <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Performance Ratings</h4>
             <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="burst" className="text-slate-400">Burst (psi)</Label>
                  <Input
                    id="burst"
                    type="number"
                    className="bg-slate-950 border-slate-700"
                    {...register('burst_rating', { required: true, min: 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collapse" className="text-slate-400">Collapse (psi)</Label>
                  <Input
                    id="collapse"
                    type="number"
                    className="bg-slate-950 border-slate-700"
                    {...register('collapse_rating', { required: true, min: 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tensile" className="text-slate-400">Tensile (kips)</Label>
                  <Input
                    id="tensile"
                    type="number"
                    className="bg-slate-950 border-slate-700"
                    {...register('tensile_strength', { required: true, min: 0 })}
                  />
                </div>
             </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white">
              Cancel
            </Button>
            <Button type="submit" className="bg-[#BFFF00] text-black hover:bg-[#a3d900]">
              {mode === 'add' ? 'Add Section' : 'Update Section'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SectionEditorModal;