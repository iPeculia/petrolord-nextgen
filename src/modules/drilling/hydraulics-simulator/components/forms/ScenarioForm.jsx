import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HydraulicsScenarioSchema } from '@/services/hydraulics/models/HydraulicsScenario';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useHydraulicsSimulator } from '@/contexts/HydraulicsSimulatorContext';
import { toast } from '@/components/ui/use-toast';
import { Save, PlayCircle } from 'lucide-react';
import { DEMO_SCENARIO } from '@/services/hydraulics/data/demoData';

const ScenarioForm = ({ onSuccess }) => {
  const { 
    current_well, 
    current_project,
    drilling_fluids, 
    pumps, 
    chokes, 
    addScenario,
    setCurrentScenario
  } = useHydraulicsSimulator();

  // Filter available resources for this project/well
  const availableFluids = drilling_fluids.filter(f => f.project_id === current_project?.project_id);
  const availablePumps = pumps.filter(p => p.project_id === current_project?.project_id);
  const availableChokes = chokes.filter(c => c.well_id === current_well?.well_id);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(HydraulicsScenarioSchema),
    defaultValues: {
        well_id: current_well?.well_id,
        name: 'Base Case',
        description: '',
        fluid_id: availableFluids[0]?.fluid_id || '',
        pump_id: availablePumps[0]?.pump_id || '',
        choke_id: availableChokes[0]?.choke_id || '',
        flow_rate_gpm: 500,
        pump_rpm: 80,
        rate_of_penetration_ft_per_hr: 50,
        surface_backpressure_psi: 0,
        status: 'Pending',
        created_date: new Date().toISOString()
    }
  });

  // Auto-select first available option if not set
  useEffect(() => {
    if (availableFluids.length > 0 && !watch('fluid_id')) setValue('fluid_id', availableFluids[0].fluid_id);
    if (availablePumps.length > 0 && !watch('pump_id')) setValue('pump_id', availablePumps[0].pump_id);
    if (availableChokes.length > 0 && !watch('choke_id')) setValue('choke_id', availableChokes[0].choke_id);
  }, [availableFluids, availablePumps, availableChokes, setValue, watch]);

  const onSubmit = (data) => {
    const newScenario = { ...data, scenario_id: crypto.randomUUID(), created_date: new Date().toISOString() };
    addScenario(newScenario);
    setCurrentScenario(newScenario);
    toast({ title: "Scenario Created", description: "Ready to simulate." });
    if (onSuccess) onSuccess();
  };
  
  const loadDemoData = () => {
    if(!current_well) return;
    const demo = { ...DEMO_SCENARIO, scenario_id: crypto.randomUUID(), well_id: current_well.well_id };
    // Try to match IDs if they exist in demo data, else keep current selection
    reset(demo);
    toast({ title: "Demo Scenario Loaded", description: "Values populated." });
  }

  if (!current_well) return <div className="text-center p-8 text-slate-500">Please select a well first.</div>;

  return (
    <div className="space-y-6 p-4 bg-slate-900 rounded-lg border border-slate-800">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
             <div>
                <h3 className="text-lg font-medium text-slate-200">Simulation Scenario</h3>
                <p className="text-sm text-slate-500">Define operational parameters for simulation.</p>
             </div>
             <Button variant="outline" size="sm" onClick={loadDemoData} className="border-slate-700 hover:bg-slate-800">
                <PlayCircle className="mr-2 h-4 w-4 text-blue-500" /> Use Demo Data
             </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Scenario Name</Label>
                    <Select onValueChange={v => setValue("name", v)} defaultValue={watch("name")}>
                        <SelectTrigger className="bg-slate-800"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Base Case">Base Case</SelectItem>
                            <SelectItem value="Optimized">Optimized</SelectItem>
                            <SelectItem value="High Flow">High Flow</SelectItem>
                            <SelectItem value="Low Flow">Low Flow</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Drilling Fluid</Label>
                    <Select onValueChange={v => setValue("fluid_id", v)} value={watch("fluid_id")}>
                        <SelectTrigger className="bg-slate-800"><SelectValue placeholder="Select Fluid" /></SelectTrigger>
                        <SelectContent>
                            {availableFluids.map(f => <SelectItem key={f.fluid_id} value={f.fluid_id}>{f.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    {errors.fluid_id && <span className="text-xs text-red-500">Required</span>}
                </div>

                <div className="space-y-2">
                    <Label>Pump</Label>
                    <Select onValueChange={v => setValue("pump_id", v)} value={watch("pump_id")}>
                        <SelectTrigger className="bg-slate-800"><SelectValue placeholder="Select Pump" /></SelectTrigger>
                        <SelectContent>
                            {availablePumps.map(p => <SelectItem key={p.pump_id} value={p.pump_id}>{p.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    {errors.pump_id && <span className="text-xs text-red-500">Required</span>}
                </div>

                <div className="space-y-2">
                    <Label>Choke</Label>
                    <Select onValueChange={v => setValue("choke_id", v)} value={watch("choke_id")}>
                        <SelectTrigger className="bg-slate-800"><SelectValue placeholder="Select Choke" /></SelectTrigger>
                        <SelectContent>
                            {availableChokes.map(c => <SelectItem key={c.choke_id} value={c.choke_id}>{c.choke_type} ({c.opening_percent}%)</SelectItem>)}
                        </SelectContent>
                    </Select>
                    {errors.choke_id && <span className="text-xs text-red-500">Required</span>}
                </div>

                <div className="space-y-2">
                    <Label>Flow Rate (gpm)</Label>
                    <Input type="number" step="10" {...register("flow_rate_gpm", { valueAsNumber: true })} className="bg-slate-800" />
                </div>
                 <div className="space-y-2">
                    <Label>Pump Speed (RPM)</Label>
                    <Input type="number" step="1" {...register("pump_rpm", { valueAsNumber: true })} className="bg-slate-800" />
                </div>
                 <div className="space-y-2">
                    <Label>ROP (ft/hr)</Label>
                    <Input type="number" step="1" {...register("rate_of_penetration_ft_per_hr", { valueAsNumber: true })} className="bg-slate-800" />
                </div>
                 <div className="space-y-2">
                    <Label>Surface Backpressure (psi)</Label>
                    <Input type="number" step="10" {...register("surface_backpressure_psi", { valueAsNumber: true })} className="bg-slate-800" />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea {...register("description")} className="bg-slate-800" placeholder="Optional notes..." />
            </div>

            <div className="pt-2 flex justify-end">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    <Save className="mr-2 h-4 w-4" /> Create Scenario
                </Button>
            </div>
        </form>
    </div>
  );
};

export default ScenarioForm;