import React, { useState } from 'react';
import { useTorqueDrag } from '@/contexts/TorqueDragContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const DrillStringForm = () => {
  const { current_well, tubular_components, addDrillString } = useTorqueDrag();
  const { toast } = useToast();
  
  const [components, setComponents] = useState([]);
  const [stringName, setStringName] = useState('BHA #1');

  const availableComponents = tubular_components.filter(c => c.well_id === current_well?.well_id);

  const addComponentRow = () => {
    if (availableComponents.length === 0) {
        toast({ variant: "destructive", title: "No Components", description: "Add tubular components first." });
        return;
    }
    setComponents([...components, {
        sequence: components.length + 1,
        component_id: availableComponents[0].component_id,
        length_ft: 30,
        quantity: 1
    }]);
  };

  const removeComponentRow = (index) => {
    setComponents(components.filter((_, i) => i !== index));
  };

  const updateRow = (index, field, value) => {
    const newComponents = [...components];
    newComponents[index] = { ...newComponents[index], [field]: value };
    setComponents(newComponents);
  };

  const calculateTotals = () => {
    let totalLen = 0;
    let totalWt = 0;
    components.forEach(comp => {
        const refComp = availableComponents.find(c => c.component_id === comp.component_id);
        if (refComp) {
            totalLen += comp.length_ft * comp.quantity;
            totalWt += refComp.weight_per_foot_lbm * comp.length_ft * comp.quantity;
        }
    });
    return { length: totalLen, weight: totalWt };
  };

  const { length: totalLength, weight: totalWeight } = calculateTotals();

  const handleSave = () => {
      if(components.length === 0) return;
      
      const drillString = {
          string_id: crypto.randomUUID(),
          well_id: current_well.well_id,
          name: stringName,
          components: components,
          total_length_ft: totalLength,
          total_weight_air_lbm: totalWeight,
          total_weight_buoyed_lbm: totalWeight * 0.85, // Simple approx
          status: 'Active',
          created_date: new Date().toISOString()
      };
      
      try {
        addDrillString(drillString);
        toast({ title: "Drill String Saved", description: "Configuration saved successfully." });
      } catch (e) {
        toast({ variant: "destructive", title: "Error", description: e.message });
      }
  };

  if (!current_well) return <div className="text-center text-slate-500 p-8">Select a well first.</div>;

  return (
    <Card className="bg-slate-900 border-slate-700 text-slate-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium text-slate-100">Drill String Assembly</CardTitle>
        <Input 
            value={stringName} 
            onChange={(e) => setStringName(e.target.value)} 
            className="w-48 h-8 bg-slate-800 border-slate-600"
            placeholder="String Name"
        />
      </CardHeader>
      <CardContent>
         <div className="rounded-md border border-slate-700 overflow-hidden mb-4">
            <Table>
                <TableHeader className="bg-slate-800">
                    <TableRow>
                        <TableHead>Seq</TableHead>
                        <TableHead>Component</TableHead>
                        <TableHead>Len/Joint (ft)</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {components.map((comp, index) => (
                        <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                                <Select 
                                    value={comp.component_id} 
                                    onValueChange={(val) => updateRow(index, 'component_id', val)}
                                >
                                    <SelectTrigger className="w-[200px] h-8">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableComponents.map(c => (
                                            <SelectItem key={c.component_id} value={c.component_id}>
                                                {c.type} - {c.od_inches}" ({c.weight_per_foot_lbm} lb/ft)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <Input 
                                    type="number" 
                                    className="h-8 w-24" 
                                    value={comp.length_ft}
                                    onChange={(e) => updateRow(index, 'length_ft', parseFloat(e.target.value))}
                                />
                            </TableCell>
                            <TableCell>
                                <Input 
                                    type="number" 
                                    className="h-8 w-20" 
                                    value={comp.quantity}
                                    onChange={(e) => updateRow(index, 'quantity', parseInt(e.target.value))}
                                />
                            </TableCell>
                            <TableCell>
                                <Button variant="ghost" size="icon" onClick={() => removeComponentRow(index)} className="h-8 w-8 hover:text-red-500">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {components.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-slate-500 py-4">
                                No components added. Add components to build string.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
         </div>

         <div className="flex items-center justify-between">
            <Button variant="outline" onClick={addComponentRow} className="border-dashed border-slate-600 text-slate-400">
                <Plus className="mr-2 h-4 w-4" /> Add Component
            </Button>
            
            <div className="flex items-center gap-4 text-sm">
                <div className="text-slate-400">Total Length: <span className="text-slate-200 font-bold">{totalLength.toFixed(1)} ft</span></div>
                <div className="text-slate-400">Total Wt (Air): <span className="text-slate-200 font-bold">{totalWeight.toFixed(0)} lbs</span></div>
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 ml-4">
                    <Save className="mr-2 h-4 w-4" /> Save String
                </Button>
            </div>
         </div>
      </CardContent>
    </Card>
  );
};

export default DrillStringForm;