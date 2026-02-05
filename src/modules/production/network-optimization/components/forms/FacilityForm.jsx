import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { facilitySchema, createFacility } from '@/services/networkOptimization/models/Facility';
import { useNetworkOptimization } from '@/context/NetworkOptimizationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Database } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const FacilityForm = ({ onSuccess, onCancel, initialData }) => {
  const { currentNetwork, nodes, addFacility, updateFacility } = useNetworkOptimization();

  const form = useForm({
    resolver: zodResolver(facilitySchema),
    defaultValues: initialData || {
      network_id: currentNetwork?.network_id,
      name: '',
      type: 'Separator',
      node_id: '',
      capacity: 10000,
      capacity_unit: 'bpd',
      efficiency_percent: 90,
      inlet_pressure_psi: 500,
      outlet_pressure_psi: 100,
      installation_cost: 0,
      operating_cost_per_year: 0,
      specifications: {
          vessel_diameter_inches: 48,
          vessel_length_inches: 120,
          design_pressure_psi: 1440
      },
      status: 'Active',
      created_date: new Date().toISOString()
    }
  });

  const loadDemoData = () => {
    form.setValue('name', 'Demo Central Facility');
    form.setValue('type', 'Separator');
    form.setValue('capacity', 25000);
    form.setValue('capacity_unit', 'bpd');
    form.setValue('efficiency_percent', 98);
    form.setValue('inlet_pressure_psi', 250);
    form.setValue('outlet_pressure_psi', 50);
    form.setValue('installation_cost', 5000000);
    form.setValue('operating_cost_per_year', 250000);
  };

  const onSubmit = (data) => {
    try {
      if (initialData) {
        updateFacility(initialData.facility_id, data);
      } else {
        const newFacility = createFacility({ ...data, network_id: currentNetwork.network_id });
        addFacility(newFacility);
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Facility Form submission error", error);
    }
  };

  return (
    <Card className="w-full bg-[#0F172A] border-slate-800 text-slate-50">
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>{initialData ? 'Edit Facility' : 'Add Facility'}</CardTitle>
                <CardDescription>Configure processing equipment and facilities.</CardDescription>
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
                    <FormLabel>Facility Name</FormLabel>
                    <FormControl>
                    <Input placeholder="e.g. Central Processing Plant" {...field} className="bg-slate-900 border-slate-700" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <div className="grid grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-900 border-slate-700">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                          <SelectItem value="Separator">Separator</SelectItem>
                          <SelectItem value="Compressor">Compressor</SelectItem>
                          <SelectItem value="Pump">Pump</SelectItem>
                          <SelectItem value="Heater">Heater</SelectItem>
                          <SelectItem value="Cooler">Cooler</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="node_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location (Node)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-900 border-slate-700">
                            <SelectValue placeholder="Select node" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                             {nodes.map(n => (
                                <SelectItem key={n.node_id} value={n.node_id}>{n.name}</SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <div className="grid grid-cols-2 gap-4 border p-3 rounded-md border-slate-800">
                <h4 className="col-span-2 text-xs font-semibold text-slate-500 uppercase">Parameters</h4>
                <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-xs">Capacity</FormLabel>
                        <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="bg-slate-900 border-slate-700" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                  control={form.control}
                  name="capacity_unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Unit</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-900 border-slate-700 h-10">
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                          <SelectItem value="bpd">bpd</SelectItem>
                          <SelectItem value="MMscfd">MMscfd</SelectItem>
                          <SelectItem value="hp">hp</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                 <FormField
                    control={form.control}
                    name="inlet_pressure_psi"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-xs">Inlet P (psi)</FormLabel>
                        <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="bg-slate-900 border-slate-700" />
                        </FormControl>
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="outlet_pressure_psi"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-xs">Outlet P (psi)</FormLabel>
                        <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="bg-slate-900 border-slate-700" />
                        </FormControl>
                    </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="efficiency_percent"
                    render={({ field }) => (
                        <FormItem className="col-span-2">
                        <FormLabel className="text-xs flex justify-between">
                            <span>Efficiency (%)</span>
                            <span>{field.value}%</span>
                        </FormLabel>
                        <FormControl>
                            <Slider 
                                min={0} max={100} step={1} 
                                value={[field.value]} 
                                onValueChange={(vals) => field.onChange(vals[0])} 
                            />
                        </FormControl>
                        </FormItem>
                    )}
                />
            </div>
            
             <div className="grid grid-cols-2 gap-4 border p-3 rounded-md border-slate-800">
                <h4 className="col-span-2 text-xs font-semibold text-slate-500 uppercase">Specs (Optional)</h4>
                 <FormField
                    control={form.control}
                    name="specifications.vessel_diameter_inches"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-xs">Diameter (in)</FormLabel>
                        <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="bg-slate-900 border-slate-700" />
                        </FormControl>
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="specifications.vessel_length_inches"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-xs">Length (in)</FormLabel>
                        <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="bg-slate-900 border-slate-700" />
                        </FormControl>
                    </FormItem>
                    )}
                />
            </div>

            <CardFooter className="px-0 pt-4 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    {initialData ? 'Update Facility' : 'Add Facility'}
                </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FacilityForm;