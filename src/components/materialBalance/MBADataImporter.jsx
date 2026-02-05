import React, { useState } from 'react';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { parseCSV, mapColumns } from '@/utils/materialBalance/CSVParser';
import { validateProductionData, validatePressureData, validatePVTData } from '@/utils/materialBalance/DataValidator';
import { Upload, CheckCircle2, AlertTriangle, FileSpreadsheet } from 'lucide-react';
import { cn } from '@/lib/utils';

const MBADataImporter = () => {
    const { loadProductionData, loadPressureData, loadPVTData } = useMaterialBalance();
    const { toast } = useToast();
    
    const [importType, setImportType] = useState('production'); // production, pressure, pvt
    const [pvtType, setPvtType] = useState('Bo'); // Bo, Bg, Rs, etc.
    const [csvData, setCsvData] = useState(null);
    const [headers, setHeaders] = useState([]);
    const [mapping, setMapping] = useState({});
    const [fileName, setFileName] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Schemas for mapping
    const schemas = {
        production: [
            { key: 'date', label: 'Date', required: true },
            { key: 'oilProd', label: 'Cumulative Oil (Np) / Rate', required: false },
            { key: 'gasProd', label: 'Cumulative Gas (Gp) / Rate', required: false },
            { key: 'waterProd', label: 'Cumulative Water (Wp) / Rate', required: false },
        ],
        pressure: [
            { key: 'date', label: 'Date', required: true },
            { key: 'pressure', label: 'Reservoir Pressure', required: true },
        ],
        pvt: [
            { key: 'pressure', label: 'Pressure', required: true },
            { key: 'value', label: 'Value', required: true },
        ]
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setFileName(file.name);
        setIsProcessing(true);
        try {
            const { headers, data } = await parseCSV(file);
            setHeaders(headers);
            setCsvData(data);
            
            // Auto-map logic (simple matching)
            const initialMapping = {};
            const activeSchema = schemas[importType === 'pvt' ? 'pvt' : importType];
            
            activeSchema.forEach(field => {
                const match = headers.find(h => h.toLowerCase().includes(field.label.toLowerCase()) || h.toLowerCase().includes(field.key.toLowerCase()));
                if (match) initialMapping[field.key] = match;
            });
            setMapping(initialMapping);
            
            toast({ title: "File Parsed", description: `Found ${data.length} rows and ${headers.length} columns.` });
        } catch (error) {
            toast({ title: "Import Failed", description: error.message, variant: "destructive" });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleMappingChange = (key, value) => {
        setMapping(prev => ({ ...prev, [key]: value }));
    };

    const handleImport = () => {
        if (!csvData) return;
        
        const mappedData = mapColumns(csvData, mapping);
        let validationResult;
        
        if (importType === 'production') {
            validationResult = validateProductionData(mappedData);
            if (validationResult.isValid) {
                loadProductionData(mappedData);
                toast({ title: "Success", description: "Production history loaded successfully.", variant: "success" });
            }
        } else if (importType === 'pressure') {
            validationResult = validatePressureData(mappedData);
            if (validationResult.isValid) {
                loadPressureData(mappedData);
                toast({ title: "Success", description: "Pressure data loaded successfully.", variant: "success" });
            }
        } else if (importType === 'pvt') {
            validationResult = validatePVTData(mappedData);
            if (validationResult.isValid) {
                loadPVTData(pvtType, mappedData);
                toast({ title: "Success", description: `${pvtType} table loaded successfully.`, variant: "success" });
            }
        }

        if (validationResult && !validationResult.isValid) {
            toast({ 
                title: "Validation Error", 
                description: validationResult.errors[0] || "Invalid data format.", 
                variant: "destructive" 
            });
        } else {
            // Reset after success
            setCsvData(null);
            setFileName('');
            setHeaders([]);
            setMapping({});
        }
    };

    const activeSchema = schemas[importType === 'pvt' ? 'pvt' : importType];

    return (
        <Card className="bg-slate-800 border-slate-700 h-full">
            <CardHeader>
                <CardTitle className="flex items-center text-white">
                    <Upload className="mr-2 h-5 w-5 text-[#BFFF00]" />
                    Data Importer
                </CardTitle>
                <CardDescription>Import CSV data for analysis.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Type Selection */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Data Type</Label>
                        <Select value={importType} onValueChange={setImportType}>
                            <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                <SelectItem value="production">Production History</SelectItem>
                                <SelectItem value="pressure">Pressure Data</SelectItem>
                                <SelectItem value="pvt">PVT Table</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {importType === 'pvt' && (
                        <div className="space-y-2">
                            <Label>Parameter</Label>
                            <Select value={pvtType} onValueChange={setPvtType}>
                                <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                    <SelectItem value="Bo">Bo (Oil FVF)</SelectItem>
                                    <SelectItem value="Bg">Bg (Gas FVF)</SelectItem>
                                    <SelectItem value="Rs">Rs (Solution GOR)</SelectItem>
                                    <SelectItem value="Rv">Rv (Vaporized OGR)</SelectItem>
                                    <SelectItem value="muO">Oil Viscosity</SelectItem>
                                    <SelectItem value="muG">Gas Viscosity</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                {/* File Upload */}
                <div className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer relative",
                    fileName ? "border-[#BFFF00] bg-[#BFFF00]/5" : "border-slate-600 hover:border-slate-500 hover:bg-slate-700/50"
                )}>
                    <input 
                        type="file" 
                        accept=".csv" 
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isProcessing}
                    />
                    <div className="flex flex-col items-center justify-center space-y-2">
                        {fileName ? (
                            <>
                                <FileSpreadsheet className="h-8 w-8 text-[#BFFF00]" />
                                <span className="text-sm font-medium text-[#BFFF00]">{fileName}</span>
                                <span className="text-xs text-slate-400">Click to change file</span>
                            </>
                        ) : (
                            <>
                                <Upload className="h-8 w-8 text-slate-400" />
                                <span className="text-sm font-medium text-slate-300">Drop CSV file or click to browse</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Mapping UI */}
                {headers.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-slate-700 animate-in fade-in slide-in-from-top-2">
                        <h4 className="text-sm font-medium text-slate-300">Map Columns</h4>
                        <div className="space-y-3">
                            {activeSchema.map((field) => (
                                <div key={field.key} className="grid grid-cols-3 items-center gap-2">
                                    <Label className={cn("text-xs", field.required ? "text-white" : "text-slate-400")}>
                                        {field.label} {field.required && "*"}
                                    </Label>
                                    <Select 
                                        value={mapping[field.key] || "ignore"} 
                                        onValueChange={(val) => handleMappingChange(field.key, val === "ignore" ? undefined : val)}
                                    >
                                        <SelectTrigger className="col-span-2 h-8 text-xs bg-slate-900 border-slate-700 text-white">
                                            <SelectValue placeholder="Select column..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                            <SelectItem value="ignore">-- Ignore --</SelectItem>
                                            {headers.map(h => (
                                                <SelectItem key={h} value={h}>{h}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ))}
                        </div>
                        <Button 
                            className="w-full mt-4 bg-[#BFFF00] text-slate-900 hover:bg-[#a3d900]"
                            onClick={handleImport}
                        >
                            Import Data
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default MBADataImporter;