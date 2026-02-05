import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { networkSchema, createNetwork } from '@/services/networkOptimization/models/Network';
import { useNetworkOptimization } from '@/context/NetworkOptimizationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Database } from 'lucide-react';
import { generateDemoData } from '@/services/networkOptimization/data/demoData';

const NetworkForm = ({ onSuccess, onCancel, initialData }) => {
  const { addNetwork, updateNetwork } = useNetworkOptimization();

  const form = useForm({
    resolver: zodResolver(networkSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      location: '',
      type: 'Oil',
      fluid_model: 'Black Oil',
      status: 'Draft',
      created_date: new Date().toISOString()
    }
  });

  // Handle demo data loading
  const loadDemoData = () => {
    const demo = generateDemoData().networks[0];
    // We only want the fields, not ID if we are creating new
    if (!initialData) {
        form.setValue('name', `Demo: ${demo.name}`);
        form.setValue('description', demo.description);
        form.setValue('location', demo.location);
        form.setValue('type', demo.type);
        form.setValue('fluid_model', demo.fluid_model);
    }
  };

  const onSubmit = (data) => {
    try {
      if (initialData) {
        updateNetwork(initialData.network_id, data);
      } else {
        const newNetwork = createNetwork(data);
        addNetwork(newNetwork);
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Form submission error", error);
    }
  };

  return (
    <Card className="w-full bg-[#0F172A] border-slate-800 text-slate-50">
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>{initialData ? 'Edit Network' : 'Create New Network'}</CardTitle>
                <CardDescription>Configure the fundamental parameters for your production network.</CardDescription>
            </div>
            {!initialData && (
                <Button variant="outline" size="sm" onClick={loadDemoData} className="border-slate-700 hover:bg-slate-800">
                    <Database className="w-4 h-4 mr-2 text-emerald-500" />
                    Use Demo Data
                </Button>
            )}
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Network Name
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger><Info className="h-3 w-3 text-slate-500" /></TooltipTrigger>
                                <TooltipContent>Enter a descriptive name for your network (3-200 chars)</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Gulf Asset Network" {...field} className="bg-slate-900 border-slate-700" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Location
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger><Info className="h-3 w-3 text-slate-500" /></TooltipTrigger>
                                <TooltipContent>Geographic or facility location</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. North Sea Block 4" {...field} className="bg-slate-900 border-slate-700" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Description
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger><Info className="h-3 w-3 text-slate-500" /></TooltipTrigger>
                            <TooltipContent>Provide additional context about the network</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the network boundaries and scope..." {...field} className="bg-slate-900 border-slate-700 min-h-[80px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Network Type
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger><Info className="h-3 w-3 text-slate-500" /></TooltipTrigger>
                                <TooltipContent>Select the primary fluid type handled</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-900 border-slate-700">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                          <SelectItem value="Oil">Oil Production</SelectItem>
                          <SelectItem value="Gas">Gas Production</SelectItem>
                          <SelectItem value="Hybrid">Hybrid / Multiphase</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fluid_model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Fluid Model
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger><Info className="h-3 w-3 text-slate-500" /></TooltipTrigger>
                                <TooltipContent>Choose the thermodynamic model for calculations</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-900 border-slate-700">
                            <SelectValue placeholder="Select model" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                          <SelectItem value="Black Oil">Black Oil</SelectItem>
                          <SelectItem value="Compositional">Compositional</SelectItem>
                          <SelectItem value="Dry Gas">Dry Gas</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <CardFooter className="px-0 pt-4 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    {initialData ? 'Update Network' : 'Create Network'}
                </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NetworkForm;