import React, { useState } from 'react';
import { usePorosityStore } from '@/modules/geoscience/petrophysical-analysis/store/porosityStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Download, Code, FileJson, FileSpreadsheet, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useToast } from '@/components/ui/use-toast';

const ModelExport = () => {
    const { models } = usePorosityStore();
    const { toast } = useToast();
    const [selectedId, setSelectedId] = useState('');
    const [format, setFormat] = useState('json');

    const selectedModel = models.find(m => m.id === selectedId);

    const generatePythonCode = (model) => {
        if (model.type === 'density') {
            return `
def calculate_porosity(rho_log):
    rho_matrix = ${model.params.rhoMatrix}
    rho_fluid = ${model.params.rhoFluid}
    phi = (rho_matrix - rho_log) / (rho_matrix - rho_fluid)
    return max(0, min(phi, 1))
            `.trim();
        }
        return `
def calculate_porosity(dt_log):
    dt_matrix = ${model.params.dtMatrix}
    dt_fluid = ${model.params.dtFluid}
    phi = (dt_log - dt_matrix) / (dt_fluid - dt_matrix)
    return max(0, min(phi, 1))
        `.trim();
    };

    const generateMatlabCode = (model) => {
        if (model.type === 'density') {
            return `
function phi = calculate_porosity(rho_log)
    rho_matrix = ${model.params.rhoMatrix};
    rho_fluid = ${model.params.rhoFluid};
    phi = (rho_matrix - rho_log) / (rho_matrix - rho_fluid);
    phi = max(0, min(phi, 1));
end
            `.trim();
        }
        return `
function phi = calculate_porosity(dt_log)
    dt_matrix = ${model.params.dtMatrix};
    dt_fluid = ${model.params.dtFluid};
    phi = (dt_log - dt_matrix) / (dt_fluid - dt_matrix);
    phi = max(0, min(phi, 1));
end
        `.trim();
    };

    const handleExport = () => {
        if (!selectedModel) return;

        const filename = `${selectedModel.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;

        try {
            if (format === 'json') {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selectedModel, null, 2));
                downloadFile(dataStr, `${filename}.json`);
            } else if (format === 'csv' || format === 'xlsx') {
                const wb = XLSX.utils.book_new();
                const data = [
                    ["Model Name", selectedModel.name],
                    ["Type", selectedModel.type],
                    ["Well ID", selectedModel.wellId],
                    ["Curve", selectedModel.curve],
                    [],
                    ["Parameters"],
                    ...Object.entries(selectedModel.params),
                    [],
                    ["Metrics"],
                    ...Object.entries(selectedModel.metrics || {})
                ];
                const ws = XLSX.utils.aoa_to_sheet(data);
                XLSX.utils.book_append_sheet(wb, ws, "Model Info");
                
                if (format === 'csv') {
                    XLSX.writeFile(wb, `${filename}.csv`, { bookType: 'csv' });
                } else {
                    XLSX.writeFile(wb, `${filename}.xlsx`);
                }
            } else if (format === 'python') {
                const code = generatePythonCode(selectedModel);
                const blob = new Blob([code], { type: 'text/x-python' });
                downloadBlob(blob, `${filename}.py`);
            } else if (format === 'matlab') {
                const code = generateMatlabCode(selectedModel);
                const blob = new Blob([code], { type: 'text/plain' });
                downloadBlob(blob, `${filename}.m`);
            }
            
            toast({ title: "Export Successful", description: `Model exported as ${format.toUpperCase()}` });
        } catch (e) {
            console.error(e);
            toast({ variant: "destructive", title: "Export Failed", description: e.message });
        }
    };

    const downloadFile = (url, filename) => {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const downloadBlob = (blob, filename) => {
        const url = URL.createObjectURL(blob);
        downloadFile(url, filename);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex items-center justify-center h-full p-8">
            <Card className="bg-slate-900 border-slate-800 max-w-md w-full">
                <CardHeader>
                    <CardTitle className="text-white">Export Model</CardTitle>
                    <CardDescription>Download model parameters and code.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Select Model</Label>
                        <Select value={selectedId} onValueChange={setSelectedId}>
                            <SelectTrigger className="bg-slate-950 border-slate-700">
                                <SelectValue placeholder="Choose model..." />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800">
                                {models.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Format</Label>
                        <Select value={format} onValueChange={setFormat}>
                            <SelectTrigger className="bg-slate-950 border-slate-700">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800">
                                <SelectItem value="json"><div className="flex items-center"><FileJson className="w-4 h-4 mr-2 text-yellow-500"/> JSON</div></SelectItem>
                                <SelectItem value="csv"><div className="flex items-center"><FileText className="w-4 h-4 mr-2 text-blue-500"/> CSV</div></SelectItem>
                                <SelectItem value="xlsx"><div className="flex items-center"><FileSpreadsheet className="w-4 h-4 mr-2 text-green-500"/> Excel</div></SelectItem>
                                <SelectItem value="python"><div className="flex items-center"><Code className="w-4 h-4 mr-2 text-indigo-500"/> Python</div></SelectItem>
                                <SelectItem value="matlab"><div className="flex items-center"><Code className="w-4 h-4 mr-2 text-red-500"/> MATLAB</div></SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button 
                        onClick={handleExport} 
                        disabled={!selectedId} 
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
                    >
                        <Download className="w-4 h-4 mr-2" /> Export Package
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default ModelExport;