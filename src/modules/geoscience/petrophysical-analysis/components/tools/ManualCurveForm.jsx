import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGlobalDataStore } from '@/store/globalDataStore.js';
import { saveWellLogs } from '@/api/globalDataApi.js';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const ManualCurveForm = ({ onSuccess }) => {
    const { activeWell, addLogsToWell } = useGlobalDataStore();
    const { toast } = useToast();
    
    const [name, setName] = useState('');
    const [unit, setUnit] = useState('');
    const [type, setType] = useState('GR');
    const [rawData, setRawData] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSave = async () => {
        if (!activeWell) {
            toast({ title: "Error", description: "No active well selected.", variant: "destructive" });
            return;
        }
        if (!name || !rawData) {
             toast({ title: "Validation Error", description: "Name and Data are required.", variant: "destructive" });
             return;
        }

        setIsProcessing(true);
        try {
            // Parse Data
            const lines = rawData.trim().split('\n');
            const depthArray = [];
            const valueArray = [];
            
            lines.forEach((line, idx) => {
                // Split by comma, tab, or space
                const parts = line.trim().split(/[\s,\t]+/);
                if (parts.length >= 2) {
                    const d = parseFloat(parts[0]);
                    const v = parseFloat(parts[1]);
                    if (!isNaN(d) && !isNaN(v)) {
                        depthArray.push(d);
                        valueArray.push(v);
                    }
                }
            });

            if (depthArray.length === 0) {
                throw new Error("No valid depth-value pairs found in data.");
            }

            // Sort by depth
            const combined = depthArray.map((d, i) => ({ d, v: valueArray[i] }));
            combined.sort((a, b) => a.d - b.d);
            
            const sortedDepth = combined.map(x => x.d);
            const sortedValues = combined.map(x => x.v);

            const logPayload = [{
                log_type: name.toUpperCase(), // Using name as key for simplicity
                log_name: name,
                unit: unit,
                depth_array: sortedDepth,
                value_array: sortedValues
            }];

            const saved = await saveWellLogs(activeWell, logPayload);
            addLogsToWell(activeWell, saved);
            
            toast({ title: "Success", description: `Curve ${name} saved with ${sortedDepth.length} points.` });
            if (onSuccess) onSuccess();
            
            // Reset form
            setName('');
            setRawData('');
            
        } catch (error) {
            toast({ title: "Save Failed", description: error.message, variant: "destructive" });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-xs">Curve Name</Label>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. GR_Edit" className="h-8" />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs">Unit</Label>
                    <Input value={unit} onChange={e => setUnit(e.target.value)} placeholder="e.g. API" className="h-8" />
                </div>
                <div className="space-y-2 col-span-2">
                    <Label className="text-xs">Standard Type</Label>
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="GR">Gamma Ray (GR)</SelectItem>
                            <SelectItem value="RHOB">Density (RHOB)</SelectItem>
                            <SelectItem value="NPHI">Neutron (NPHI)</SelectItem>
                            <SelectItem value="RES">Resistivity (RES)</SelectItem>
                            <SelectItem value="DT">Sonic (DT)</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            <div className="space-y-2">
                <div className="flex justify-between">
                    <Label className="text-xs">Data (Depth Value)</Label>
                    <span className="text-[10px] text-muted-foreground">Paste from Excel/Notepad</span>
                </div>
                <Textarea 
                    value={rawData} 
                    onChange={e => setRawData(e.target.value)} 
                    placeholder={`1000 45.2\n1000.5 46.1\n1001 44.8`}
                    className="font-mono text-xs h-32"
                />
            </div>

            <Button onClick={handleSave} disabled={isProcessing} className="w-full text-xs h-8">
                {isProcessing ? <><Loader2 className="w-3 h-3 mr-2 animate-spin" /> Saving...</> : 'Save Curve'}
            </Button>
        </div>
    );
};

export default ManualCurveForm;