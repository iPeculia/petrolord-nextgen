import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useWellCorrelation } from '@/contexts/WellCorrelationContext';
import { Upload, FileText, CheckCircle, AlertTriangle, Loader2, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { parseLasFile } from '@/utils/wellCorrelation/LasParser';
import { useDropzone } from 'react-dropzone';

const WellImportDialog = ({ open, onOpenChange }) => {
    const { actions } = useWellCorrelation();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCurves, setSelectedCurves] = useState({});

    const onDrop = useCallback(async (acceptedFiles) => {
        const selectedFile = acceptedFiles[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setLoading(true);
        setError(null);

        try {
            const data = await parseLasFile(selectedFile);
            setPreview(data);
            const initialSelection = {};
            (data.curves || []).forEach(c => initialSelection[c.mnemonic] = true);
            setSelectedCurves(initialSelection);
        } catch (err) {
            setError("Failed to parse LAS file. " + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop, 
        accept: { 
            'text/plain': ['.las', '.txt'], 
            'application/octet-stream': ['.las'] 
        },
        multiple: false
    });

    const handleImport = async () => {
        if (!file || !preview) return;
        setLoading(true);
        try {
            const wellData = {
                ...preview,
                id: `well_${Date.now()}_${Math.random().toString(36).substr(2,5)}`
            };
            await actions.addWell(wellData);
            onOpenChange(false);
            setFile(null);
            setPreview(null);
        } catch (err) {
            setError("Import failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleCurve = (mnemonic) => {
        setSelectedCurves(prev => ({ ...prev, [mnemonic]: !prev[mnemonic] }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl bg-[#0F172A] border-slate-800 text-slate-100 p-0 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-800 bg-[#1E293B]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-white">Import Well Data</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Drag and drop LAS 2.0/3.0 files to parse and import well logs.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6 overflow-y-auto flex-1 bg-[#0F172A]">
                    {!preview ? (
                        <div 
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer h-64 flex flex-col items-center justify-center
                                ${isDragActive ? "border-[#CCFF00] bg-[#CCFF00]/5" : "border-slate-700 hover:border-slate-500 hover:bg-slate-900"}
                                ${error ? "border-red-500/50 bg-red-500/5" : ""}
                            `}
                        >
                            <input {...getInputProps()} />
                            {loading ? (
                                <div className="flex flex-col items-center">
                                    <Loader2 className="h-10 w-10 text-[#CCFF00] animate-spin mb-4" />
                                    <p className="text-slate-300">Parsing LAS structure...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-slate-800 p-4 rounded-full mb-4 border border-slate-700">
                                        <Upload className="h-8 w-8 text-slate-400" />
                                    </div>
                                    <p className="text-lg font-medium text-slate-200 mb-1">
                                        {isDragActive ? "Drop file now" : "Click or Drag File Here"}
                                    </p>
                                    <p className="text-sm text-slate-500">Supports .LAS format</p>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-[#1E293B] rounded-lg p-4 border border-slate-700 flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <FileText className="h-4 w-4 text-[#CCFF00]" />
                                        <h4 className="font-semibold text-white">{preview.metadata.name || file.name}</h4>
                                    </div>
                                    <div className="text-xs text-slate-400 grid grid-cols-2 gap-x-8 gap-y-1 font-mono mt-2">
                                        <span>Start: {preview.metadata.startDepth} {preview.metadata.depthUnit}</span>
                                        <span>Stop: {preview.metadata.stopDepth} {preview.metadata.depthUnit}</span>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => { setPreview(null); setFile(null); }} className="text-slate-400 hover:text-white hover:bg-slate-800">
                                    <X className="h-4 w-4 mr-1" /> Remove
                                </Button>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h5 className="text-sm font-semibold text-slate-300">Available Curves</h5>
                                    <span className="text-xs text-slate-500">{Object.values(selectedCurves).filter(Boolean).length} selected</span>
                                </div>
                                <ScrollArea className="h-48 rounded-lg border border-slate-700 bg-[#020617]">
                                    <div className="divide-y divide-slate-800">
                                        {(preview.curves || []).map((curve, idx) => (
                                            <div key={idx} className="flex items-center p-3 hover:bg-slate-800/30 transition-colors">
                                                <Checkbox 
                                                    id={`curve-${idx}`} 
                                                    checked={selectedCurves[curve.mnemonic]}
                                                    onCheckedChange={() => toggleCurve(curve.mnemonic)}
                                                    className="mr-3 border-slate-600 data-[state=checked]:bg-[#CCFF00] data-[state=checked]:border-[#CCFF00] data-[state=checked]:text-black"
                                                />
                                                <div className="flex-1 grid grid-cols-3 gap-4">
                                                    <label htmlFor={`curve-${idx}`} className="text-sm font-medium text-[#CCFF00] font-mono cursor-pointer">
                                                        {curve.mnemonic}
                                                    </label>
                                                    <span className="text-xs text-slate-500 font-mono">{curve.unit}</span>
                                                    <span className="text-xs text-slate-400 truncate" title={curve.description}>
                                                        {curve.description}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 bg-red-900/20 border border-red-900/50 p-3 rounded text-red-400 text-sm flex items-center">
                            <AlertTriangle className="mr-2 h-4 w-4 shrink-0" /> {error}
                        </div>
                    )}
                </div>

                <DialogFooter className="p-6 border-t border-slate-800 bg-[#1E293B]">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-white hover:bg-slate-800 mr-2">Cancel</Button>
                    <Button 
                        onClick={handleImport} 
                        disabled={!preview || loading} 
                        className="bg-[#CCFF00] hover:bg-[#B3E600] text-black font-bold min-w-[120px]"
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        {loading ? 'Importing...' : 'Import Well'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default WellImportDialog;