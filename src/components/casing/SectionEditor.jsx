import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

const GRADES = ['J-55', 'K-55', 'L-80', 'N-80', 'C-90', 'T-95', 'P-110', 'Q-125'];
const CONNECTIONS = ['API BTC', 'API LTC', 'API STC', 'VAM Top', 'Tenaris Blue', 'Premium'];

const SectionEditor = ({ isOpen, onClose, onSave, initialData, mode = 'add' }) => {
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

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Populate form with initial data
        Object.keys(initialData).forEach(key => {
          setValue(key, initialData[key]);
        });
      } else {
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
    // Convert numeric strings to numbers
    const processedData = {
      ...data,
      top_depth: parseFloat(data.top_depth),
      bottom_depth: parseFloat(data.bottom_depth),
      weight: parseFloat(data.weight),
      burst_rating: parseFloat(data.burst_rating),
      collapse_rating: parseFloat(data.collapse_rating),
      tensile_strength: parseFloat(data.tensile_strength),
      id: initialData?.id // Preserve ID if editing
    };
    onSave(processedData);
    onClose();
  };

  const topDepth = watch('top_depth');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1E293B] border-slate-700 text-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add Section' : 'Edit Section'}</DialogTitle>
          <DialogDescription className="text-slate-400">
            Define the mechanical properties and interval for this pipe section.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="top_depth">Top Depth (ft)</Label>
              <Input
                id="top_depth"
                type="number"
                step="0.1"
                className="bg-slate-900 border-slate-700"
                {...register('top_depth', { required: 'Top depth is required', min: 0 })}
              />
              {errors.top_depth && <span className="text-red-400 text-xs">{errors.top_depth.message}</span>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bottom_depth">Bottom Depth (ft)</Label>
              <Input
                id="bottom_depth"
                type="number"
                step="0.1"
                className="bg-slate-900 border-slate-700"
                {...register('bottom_depth', { 
                  required: 'Bottom depth is required',
                  validate: (value) => parseFloat(value) > parseFloat(topDepth) || 'Bottom must be deeper than top'
                })}
              />
              {errors.bottom_depth && <span className="text-red-400 text-xs">{errors.bottom_depth.message}</span>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (ppf)</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                className="bg-slate-900 border-slate-700"
                {...register('weight', { required: 'Weight is required', min: 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Select onValueChange={(val) => setValue('grade', val)} defaultValue={initialData?.grade || 'L-80'}>
                <SelectTrigger className="bg-slate-900 border-slate-700">
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                  {GRADES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="connection">Connection</Label>
              <Select onValueChange={(val) => setValue('connection_type', val)} defaultValue={initialData?.connection_type || 'API BTC'}>
                <SelectTrigger className="bg-slate-900 border-slate-700">
                  <SelectValue placeholder="Select Connection" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                  {CONNECTIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-slate-700/50 pt-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="burst" className="text-xs uppercase text-slate-500">Burst (psi)</Label>
              <Input
                id="burst"
                type="number"
                className="bg-slate-900 border-slate-700"
                {...register('burst_rating', { required: true, min: 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collapse" className="text-xs uppercase text-slate-500">Collapse (psi)</Label>
              <Input
                id="collapse"
                type="number"
                className="bg-slate-900 border-slate-700"
                {...register('collapse_rating', { required: true, min: 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tensile" className="text-xs uppercase text-slate-500">Tensile (kips)</Label>
              <Input
                id="tensile"
                type="number"
                className="bg-slate-900 border-slate-700"
                {...register('tensile_strength', { required: true, min: 0 })}
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
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

export default SectionEditor;