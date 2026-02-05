import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectSchema } from '@/services/torqueDrag/models/Project';
import { useTorqueDrag } from '@/contexts/TorqueDragContext';
import { DEMO_PROJECT } from '@/services/torqueDrag/data/demoData';
import { useToast } from '@/components/ui/use-toast';

const ProjectForm = ({ onSuccess }) => {
  const { current_project, addProject, updateProject, setCurrentProject } = useTorqueDrag();
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(ProjectSchema),
    defaultValues: current_project || {
      project_id: crypto.randomUUID(),
      name: '',
      description: '',
      location: '',
      unit_system: 'Imperial',
      owner: crypto.randomUUID(), // Mock owner
      created_date: new Date().toISOString(),
      status: 'Draft'
    }
  });

  const { register, handleSubmit, setValue, formState: { errors }, reset } = form;

  useEffect(() => {
    if (current_project) {
      reset(current_project);
    }
  }, [current_project, reset]);

  const onSubmit = (data) => {
    try {
      if (current_project) {
        updateProject(current_project.project_id, data);
        toast({ title: "Project updated", description: "Project details saved successfully." });
      } else {
        addProject(data);
        setCurrentProject(data);
        toast({ title: "Project created", description: "New project initialized." });
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  const loadDemoData = () => {
    const demo = { ...DEMO_PROJECT, project_id: crypto.randomUUID(), name: `${DEMO_PROJECT.name} (Copy)` };
    reset(demo);
    toast({ title: "Demo Data Loaded", description: "Form populated with sample data." });
  };

  return (
    <Card className="bg-slate-900 border-slate-700 text-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-slate-100">Project Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="name">Project Name <span className="text-red-500">*</span></Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger><Info className="h-4 w-4 text-slate-500" /></TooltipTrigger>
                  <TooltipContent>Enter a descriptive name for your project</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input id="name" {...register("name")} className={errors.name ? "border-red-500" : ""} />
            {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
          </div>

          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="description">Description</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger><Info className="h-4 w-4 text-slate-500" /></TooltipTrigger>
                  <TooltipContent>Provide additional context about the project</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Textarea id="description" {...register("description")} className="min-h-[100px]" />
            {errors.description && <span className="text-xs text-red-500">{errors.description.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger><Info className="h-4 w-4 text-slate-500" /></TooltipTrigger>
                    <TooltipContent>Geographic location of the project</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input id="location" {...register("location")} className={errors.location ? "border-red-500" : ""} />
              {errors.location && <span className="text-xs text-red-500">{errors.location.message}</span>}
            </div>

            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="unit_system">Unit System <span className="text-red-500">*</span></Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger><Info className="h-4 w-4 text-slate-500" /></TooltipTrigger>
                    <TooltipContent>Select measurement system (Metric or Imperial)</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select onValueChange={(val) => setValue("unit_system", val)} defaultValue={current_project?.unit_system || "Imperial"}>
                <SelectTrigger className={errors.unit_system ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select system" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Imperial">Imperial (ft, lbf, psi)</SelectItem>
                  <SelectItem value="Metric">Metric (m, kN, MPa)</SelectItem>
                </SelectContent>
              </Select>
              {errors.unit_system && <span className="text-xs text-red-500">{errors.unit_system.message}</span>}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={loadDemoData} className="border-slate-600 text-slate-300">
              Use Demo Data
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="mr-2 h-4 w-4" /> Save Project
            </Button>
          </div>

        </form>
      </CardContent>
    </Card>
  );
};

export default ProjectForm;