import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { parseCSV, normalizeData } from '@/utils/declineCurve/DataParser';
import { useDeclineCurve } from '@/context/DeclineCurveContext';
import { useToast } from '@/components/ui/use-toast';
import { Upload, CheckCircle, AlertTriangle } from 'lucide-react';
import { checkDataQuality } from '@/utils/declineCurve/DataQualityChecker';

const DataImporter = ({ isOpen, onClose }) => {
    const { currentProjectId, currentWellId, updateWellData } = useDeclineCurve();
    const { toast } = useToast();
    
    const [step, setStep] = useState(1); // 1: Upload, 2: Map, 3: QC
    const [fullData, setFullData] = useState([]); // Store full parsed results
    const [headers, setHeaders] = useState([]);
    const [mapping, setMapping] = useState({
        date: '',
        oilRate: '',
        gasRate: '',
        waterRate: '',
        cumulativeOil: '',
        cumulativeGas: ''
    });
    const [processedData, setProcessedData] = useState(null);
    const [qcResult, setQcResult] = useState(null);

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            parseCSV(file, (result) => {
                if (result.error) {
                    toast({ title: "Error parsing CSV", description: result.error.message, variant: "destructive" });
                    return;
                }
                if (result.data && result.data.length > 0) {
                    setFullData(result.data); // Store FULL data
                    setHeaders(Object.keys(result.data[0]));
                    
                    // Auto-guess mapping logic
                    const keys = Object.keys(result.data[0]);
                    const guess = { ...mapping };
                    keys.forEach(k => {
                        const low = k.toLowerCase();
                        if (low.includes('date') || low.includes('time')) guess.date = k;
                        else if (low.includes('oil') && (low.includes('rate') || low.includes('prod'))) guess.oilRate = k;
                        else if (low.includes('gas') && (low.includes('rate') || low.includes('prod'))) guess.gasRate = k;
                        else if (low.includes('water') && (low.includes('rate') || low.includes('prod'))) guess.waterRate = k;
                        else if ((low.includes('cum') || low.includes('total')) && low.includes('oil')) guess.cumulativeOil = k;
                    });
                    setMapping(guess);
                    setStep(2);
                }
            });
        }
    }, [toast, mapping]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'text/csv': ['.csv']} });

    const runQC = () => {
        if (!mapping.date || !mapping.oilRate) {
            toast({ title: "Mapping Error", description: "Please map at least Date and Oil Rate columns.", variant: "destructive" });
            return;
        }

        const normalized = normalizeData(fullData, mapping);
        if (normalized.length === 0) {
             toast({ title: "Data Error", description: "No valid data rows found after normalization.", variant: "destructive" });
             return;
        }
        
        const qc = checkDataQuality(normalized, 'Oil');
        setProcessedData(normalized);
        setQcResult(qc);
        setStep(3);
    };

    const handleFinalize = () => {
        if (currentProjectId && currentWellId && processedData) {
            // Recalculate cumulatives if they are missing or mostly 0
            let finalData = [...processedData];
            
            // Basic cum calculation if missing
            const lastCum = finalData[finalData.length-1].cumulativeOil;
            if (!lastCum || lastCum === 0) {
                let cum = 0;
                finalData = finalData.map(d => {
                    cum += (d.oilRate || 0); // approx assuming daily
                    return { ...d, cumulativeOil: cum };
                });
            }

            updateWellData(currentProjectId, currentWellId, finalData);
            toast({ title: "Data Imported Successfully", description: `${finalData.length} records added to well.` });
            onClose();
            setStep(1);
            setFullData([]);
        } else {
             toast({ title: "Error", description: "No active well selected to import data into.", variant: "destructive" });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-slate-950 border-slate-800 text-white max-w-3xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Import Production Data</DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto py-2">
                    {step === 1 && (
                        <div 
                            {...getRootProps()} 
                            className={`border-2 border-dashed rounded-lg h-64 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:bg-slate-900'}`}
                        >
                            <input {...getInputProps()} />
                            <Upload className="h-12 w-12 text-slate-500 mb-4" />
                            <p className="text-slate-300 font-medium">Drag & drop CSV file here</p>
                            <p className="text-slate-500 text-sm mt-2">or click to browse</p>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Date Column *</Label>
                                    <Select value={mapping.date} onValueChange={(v) => setMapping({...mapping, date: v})}>
                                        <SelectTrigger className="bg-slate-900 border-slate-700"><SelectValue /></SelectTrigger>
                                        <SelectContent>{headers.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Oil Rate Column *</Label>
                                    <Select value={mapping.oilRate} onValueChange={(v) => setMapping({...mapping, oilRate: v})}>
                                        <SelectTrigger className="bg-slate-900 border-slate-700"><SelectValue /></SelectTrigger>
                                        <SelectContent>{headers.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Gas Rate Column</Label>
                                    <Select value={mapping.gasRate} onValueChange={(v) => setMapping({...mapping, gasRate: v})}>
                                        <SelectTrigger className="bg-slate-900 border-slate-700"><SelectValue /></SelectTrigger>
                                        <SelectContent>{headers.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Cumulative Oil (Optional)</Label>
                                    <Select value={mapping.cumulativeOil} onValueChange={(v) => setMapping({...mapping, cumulativeOil: v})}>
                                        <SelectTrigger className="bg-slate-900 border-slate-700"><SelectValue /></SelectTrigger>
                                        <SelectContent>{headers.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="border border-slate-800 rounded-md overflow-hidden">
                                <div className="bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-400 border-b border-slate-800">Preview (First 5 Rows)</div>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-slate-800 hover:bg-slate-900/50">
                                            {headers.slice(0, 5).map(h => <TableHead key={h} className="text-slate-400 h-8">{h}</TableHead>)}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {fullData.slice(0, 5).map((row, i) => (
                                            <TableRow key={i} className="border-slate-800 hover:bg-slate-900/50">
                                                {headers.slice(0, 5).map(h => <TableCell key={`${i}-${h}`} className="text-slate-300 py-2">{row[h]}</TableCell>)}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}

                    {step === 3 && qcResult && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 bg-slate-900 p-4 rounded-lg border border-slate-800">
                                <div className={`p-3 rounded-full ${qcResult.score > 80 ? 'bg-green-500/20 text-green-500' : 'bg-amber-500/20 text-amber-500'}`}>
                                    {qcResult.score > 80 ? <CheckCircle className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Data Quality Score: {qcResult.score}/100</h3>
                                    <p className="text-slate-400 text-sm">
                                        Found {qcResult.summary.zeroRates} zero rates, {qcResult.summary.negatives} negative values from {qcResult.summary.totalPoints} points.
                                    </p>
                                </div>
                            </div>
                            
                            <ScrollArea className="h-48 rounded-md border border-slate-800 bg-slate-900/50 p-4">
                                <div className="space-y-2">
                                    {qcResult.issues.map((issue, idx) => (
                                        <div key={idx} className={`text-sm flex items-center gap-2 ${issue.type === 'error' ? 'text-red-400' : 'text-amber-400'}`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                            {issue.message}
                                        </div>
                                    ))}
                                    {qcResult.issues.length === 0 && <div className="text-green-500 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> No issues found.</div>}
                                </div>
                            </ScrollArea>
                        </div>
                    )}
                </div>

                <DialogFooter className="mt-4">
                    {step > 1 && <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>}
                    {step === 2 && <Button onClick={runQC}>Analyze Quality</Button>}
                    {step === 3 && <Button onClick={handleFinalize} className="bg-green-600 hover:bg-green-700">Import Data</Button>}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DataImporter;