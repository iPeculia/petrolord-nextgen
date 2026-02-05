import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { nodeSchema, createNode } from '@/services/networkOptimization/models/Node';
import { useNetworkOptimization } from '@/context/NetworkOptimizationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Database } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { generateDemoData } from '@/services/networkOptimization/data/demoData';

const NodeForm = ({ onSuccess, onCancel, initialData }) => {
  const { currentNetwork, addNode, updateNode } = useNetworkOptimization();

  const form = useForm({
    resolver: zodResolver(nodeSchema),
    defaultValues: initialData || {
      network_id: currentNetwork?.network_id,
      name: '',
      type: 'Junction',
      location: { x: 0, y: 0, elevation: 0 },
      well_data: {
        production_rate_bpd: 0,
        static_pressure_psi: 0,
        temperature_f: 60,
        gor: 0,
        water_cut: 0,
        api_gravity: 30
      },
      constraints: {
        min_pressure_psi: 0,
        max_pressure_psi: 5000,
        max_flow_bpd: 10000
      },
      created_date: new Date().toISOString()
    }
  });

  const nodeType = form.watch('type');

  const loadDemoData = () => {
    // Generate a random-ish well for demo
    const randomWell = generateDemoData().nodes.find(n => n.type === 'Well');
    if (randomWell && !initialData) {
        form.setValue('name', `Demo Node ${Math.floor(Math.random() * 100)}`);
        form.setValue('type', 'Well');
        form.setValue('location', { ...randomWell.location, x: Math.random() * 1000, y: Math.random() * 1000 });
        form.setValue('well_data', randomWell.well_data);
        form.setValue('constraints', randomWell.constraints);
    }
  };

  const onSubmit = (data) => {
    try {
      // Clean up data based on type (e.g., junctions don't need well_data)
      if (data.type !== 'Well') {
        delete data.well_data;
      }
      
      if (initialData) {
        updateNode(initialData.node_id, data);
      } else {
        const newNode = createNode({ ...data, network_id: currentNetwork.network_id });
        addNode(newNode);
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Node Form submission error", error);
    }
  };

  return (
    <Card className="w-full bg-[#0F172A] border-slate-800 text-slate-50">
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>{initialData ? 'Edit Node' : 'Create New Node'}</CardTitle>
                <CardDescription>Define a point in the network topology.</CardDescription>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Node Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Well A-01" {...field} className="bg-slate-900 border-slate-700" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Node Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-900 border-slate-700">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                          <SelectItem value="Well">Well</SelectItem>
                          <SelectItem value="Junction">Junction</SelectItem>
                          <SelectItem value="Separator">Separator</SelectItem>
                          <SelectItem value="Compressor">Compressor</SelectItem>
                          <SelectItem value="Sink">Sink / Export</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <div className="grid grid-cols-3 gap-4 border p-3 rounded-md border-slate-800">
                <h4 className="col-span-3 text-xs font-semibold text-slate-500 uppercase">Location</h4>
                <FormField
                  control={form.control}
                  name="location.x"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">X Coord</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="bg-slate-900 border-slate-700" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location.y"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Y Coord</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="bg-slate-900 border-slate-700" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location.elevation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Elevation (ft)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="bg-slate-900 border-slate-700" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            {nodeType === 'Well' && (
                <div className="space-y-4 border p-3 rounded-md border-slate-800 bg-slate-900/50">
                    <h4 className="text-xs font-semibold text-blue-400 uppercase">Production Data</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="well_data.production_rate_bpd"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Rate (bpd)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="bg-slate-900 border-slate-700" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name="well_data.static_pressure_psi"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Static Press. (psi)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="bg-slate-900 border-slate-700" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name="well_data.temperature_f"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Temp (°F)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="bg-slate-900 border-slate-700" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name="well_data.gor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">GOR (scf/bbl)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="bg-slate-900 border-slate-700" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                            control={form.control}
                            name="well_data.water_cut"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                <FormLabel className="text-xs flex justify-between">
                                    <span>Water Cut (Fraction)</span>
                                    <span>{field.value}</span>
                                </FormLabel>
                                <FormControl>
                                    <Slider 
                                        min={0} max={1} step={0.01} 
                                        value={[field.value]} 
                                        onValueChange={(vals) => field.onChange(vals[0])} 
                                    />
                                </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            )}

            <CardFooter className="px-0 pt-4 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    {initialData ? 'Update Node' : 'Create Node'}
                </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NodeForm;