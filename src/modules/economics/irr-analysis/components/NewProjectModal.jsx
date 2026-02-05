import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useIRRAnalysis } from '@/context/economics/IRRAnalysisContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
} from '@/components/ui/select';

const NewProjectModal = ({ isOpen, onClose }) => {
  const { addProject, loading } = useIRRAnalysis();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      type: 'Oil',
      status: 'Draft',
      start_date: new Date().toISOString().split('T')[0],
      project_duration_years: 20
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await addProject({
        ...data,
        project_duration_years: Number(data.project_duration_years)
      });
      if (result) {
        reset();
        onClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-[#1E293B] border-slate-800 text-slate-100">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Enter the basic details to initialize a new economic analysis project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input 
                id="name" 
                placeholder="e.g. Permian Basin A-1" 
                className="bg-slate-900 border-slate-700"
                {...register("name", { required: true, minLength: 3 })}
            />
            {errors.name && <span className="text-red-400 text-xs">Name is required (min 3 chars)</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input 
                id="description" 
                placeholder="Optional project description" 
                className="bg-slate-900 border-slate-700"
                {...register("description")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Project Type</Label>
                <Select onValueChange={(val) => setValue("type", val)} defaultValue="Oil">
                  <SelectTrigger className="bg-slate-900 border-slate-700">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1E293B] border-slate-700 text-slate-200">
                    <SelectItem value="Oil">Oil</SelectItem>
                    <SelectItem value="Gas">Gas</SelectItem>
                    <SelectItem value="Renewable">Renewable</SelectItem>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                  </SelectContent>
                </Select>
            </div>
            
            <div className="space-y-2">
                <Label>Status</Label>
                <Select onValueChange={(val) => setValue("status", val)} defaultValue="Draft">
                  <SelectTrigger className="bg-slate-900 border-slate-700">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1E293B] border-slate-700 text-slate-200">
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                  </SelectContent>
                </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input 
                    type="date"
                    id="start_date" 
                    className="bg-slate-900 border-slate-700"
                    {...register("start_date", { required: true })}
                />
             </div>
             <div className="space-y-2">
                <Label htmlFor="duration">Duration (Years)</Label>
                <Input 
                    type="number"
                    id="duration" 
                    min="1"
                    max="100"
                    className="bg-slate-900 border-slate-700"
                    {...register("project_duration_years", { required: true, min: 1 })}
                />
             </div>
          </div>

          <DialogFooter className="pt-4">
            <Button 
                type="button" 
                variant="ghost" 
                onClick={onClose}
                className="text-slate-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting || loading}
            >
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectModal;