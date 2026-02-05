import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

const ModuleEditor = ({ isOpen, onClose, module, onSave }) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      title: '',
      description: '',
      is_published: false
    }
  });

  const isPublished = watch('is_published');

  useEffect(() => {
    if (module) {
      setValue('title', module.title);
      setValue('description', module.description);
      setValue('is_published', module.is_published);
    } else {
      reset({ title: '', description: '', is_published: false });
    }
  }, [module, isOpen, setValue, reset]);

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1E293B] border-slate-700 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{module ? 'Edit Module' : 'Create New Module'}</DialogTitle>
          <DialogDescription className="text-slate-400">
            Group related lessons together. Published modules are visible to students.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-200">Module Title</Label>
            <Input
              id="title"
              {...register('title', { required: true })}
              className="bg-[#0F172A] border-slate-600 text-white focus:border-[#BFFF00]"
              placeholder="e.g., Introduction to Reservoir Engineering"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-200">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              className="bg-[#0F172A] border-slate-600 text-white min-h-[100px] focus:border-[#BFFF00]"
              placeholder="Briefly describe what students will learn in this module."
            />
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-700 bg-[#0F172A]">
              <div className="space-y-0.5">
                  <Label className="text-base text-slate-200">Publish Module</Label>
                  <p className="text-xs text-slate-400">Make this module and its published lessons visible.</p>
              </div>
              <Switch 
                 checked={isPublished}
                 onCheckedChange={(val) => setValue('is_published', val)}
              />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose} className="text-slate-300 hover:text-white">
              Cancel
            </Button>
            <Button type="submit" className="bg-[#BFFF00] text-black hover:bg-[#a3d900]">
              {module ? 'Save Changes' : 'Create Module'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModuleEditor;