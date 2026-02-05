import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pipelineSchema, createPipeline } from '@/services/networkOptimization/models/Pipeline';
import { useNetworkOptimization } from '@/context/NetworkOptimizationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Calculator, Database } from 'lucide-react';

const PipelineForm = ({ onSuccess, onCancel, initialData }) => {
  const { currentNetwork, nodes, addPipeline, updatePipeline } = useNetworkOptimization();

  const form = useForm({
    resolver: zodResolver(pipelineSchema),
    defaultValues: initialData || {
      network_id: currentNetwork?.network_id,
      name: '',
      from_node_id: '',
      to_node_id: '',
      length_miles: 1,
      diameter_inches: 6,
      material: 'Carbon Steel',
      roughness_microns: 45,
      pressure_rating_psi: 3000,
      installation_cost: 0,
      operating_cost_per_year: 0,
      status: 'Active',
      created_date: new Date().toISOString()
    }
  });

  const loadDemoData = () => {
    // Basic demo values
    form.setValue('length_miles', 5.5);
    form.setValue('diameter_inches', 12);
    form.setValue('material', 'Carbon Steel');
    form.setValue('roughness_microns', 60);
    form.setValue('pressure_rating_psi', 5000);
    form.setValue('installation_cost', 2500000);
    form.setValue('operating_cost_per_year', 50000);
    if (!form.getValues('name')) form.setValue('name', 'Demo Pipeline');
  };

  const onSubmit = (data) => {
    try {
      if (initialData) {
        updatePipeline(initialData.pipeline_id, data);
      } else {
        const newPipe = createPipeline({ ...data, network_id: currentNetwork.network_id });
        addPipeline(newPipe);
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Pipeline Form submission error", error);
    }
  };

  const calculatePressureDrop = () => {
      // Mock calculation for UI purposes - real calc would be in service
      const length = form.getValues('length_miles');
      const diameter = form.getValues('diameter_inches');
      if (length && diameter) {
          const estimatedDrop = (length * 100) / diameter; // Fake formula
          alert(`Estimated Pressure Drop: ~${estimatedDrop.toFixed(2)} psi (Simplified)`);
      }
  };

  return (
    <Card className="w-full bg-[#0F172A] border-slate-800 text-slate-50">
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>{initialData ? 'Edit Pipeline' : 'Create New Pipeline'}</CardTitle>
                <CardDescription>Connect network nodes with a flowline.</CardDescription>
            </div>
            {!initialData && (
                 <Button variant="outline" size="sm" onClick={loadDemoData} className="border-slate-700 hover:bg-slate-800">
                    <Database className="w-4 h-4 mr-2 text-emerald-500" />
                    Demo Data
                 </Button>
            )}
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Pipeline Name</FormLabel>
                    <FormControl>
                    <Input placeholder="e.g. Flowline A-1" {...field} className="bg-slate-900 border-slate-700" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="from_node_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Node</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-900 border-slate-700">
                            <SelectValue placeholder="Select Source" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                            {nodes.map(n => (
                                <SelectItem key={n.node_id} value={n.node_id}>{n.name} ({n.type})</SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="to_node_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To Node</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-900 border-slate-700">
                            <SelectValue placeholder="Select Destination" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                             {nodes.map(n => (
                                <SelectItem key={n.node_id} value={n.node_id}>{n.name} ({n.type})</SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <div className="grid grid-cols-2 gap-4 border p-3 rounded-md border-slate-800">
                <h4 className="col-span-2 text-xs font-semibold text-slate-500 uppercase">Specifications</h4>
                <FormField
                    control={form.control}
                    name="length_miles"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-xs">Length (miles)</FormLabel>
                        <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="bg-slate-900 border-slate-700" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="diameter_inches"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-xs">Diameter (inches)</FormLabel>
                        <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="bg-slate-900 border-slate-700" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                  control={form.control}
                  name="material"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Material</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-900 border-slate-700 h-10">
                            <SelectValue placeholder="Select material" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                          <SelectItem value="Carbon Steel">Carbon Steel</SelectItem>
                          <SelectItem value="Stainless Steel">Stainless Steel</SelectItem>
                          <SelectItem value="Composite">Composite</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                    control={form.control}
                    name="pressure_rating_psi"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-xs">Rating (psi)</FormLabel>
                        <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="bg-slate-900 border-slate-700" />
                        </FormControl>
                    </FormItem>
                    )}
                />
            </div>

             <div className="flex justify-between items-center">
                 <div className="text-xs text-slate-500">
                     Check hydraulics before saving
                 </div>
                 <Button type="button" variant="secondary" size="sm" onClick={calculatePressureDrop}>
                     <Calculator className="w-3 h-3 mr-2" />
                     Est. Pressure Drop
                 </Button>
             </div>

            <CardFooter className="px-0 pt-4 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    {initialData ? 'Update Pipeline' : 'Create Pipeline'}
                </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PipelineForm;