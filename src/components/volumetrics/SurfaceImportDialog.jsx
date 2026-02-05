import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { SurfaceParser } from '@/services/volumetrics/SurfaceParser';
import { useToast } from '@/components/ui/use-toast';

const SurfaceImportDialog = ({ open, onOpenChange, onImport }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [preview, setPreview] = useState(null);
    const [options, setOptions] = useState({
        unitSystem: 'Imperial', // or Metric
        zType: 'Depth', // or Elevation
        name: ''
    });
    const fileInputRef = useRef(null);
    const { toast } = useToast();

    const handleFileSelect = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setOptions(prev => ({ ...prev, name: selected.name.split('.')[0] }));
            setError(null);
            setPreview(null);
            
            // Quick validate
            if (selected.size > 50 * 1024 * 1024) {
                setError("File too large. Max 50MB.");
            }
        }
    };

    const handlePreview = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const result = await SurfaceParser.parse(file, options);
            setPreview(result);
            setError(null);
        } catch (err) {
            setError(err.message);
            setPreview(null);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = () => {
        if (preview) {
            onImport(preview);
            onOpenChange(false);
            toast({ title: "Surface Imported", description: `${preview.name} imported successfully.` });
            // Reset
            setFile(null);
            setPreview(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-slate-950 border-slate-800 text-slate-100">
                <DialogHeader>
                    <DialogTitle>Import Surface Data</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Upload surface files (CSV, XYZ, DAT) containing X, Y, Z coordinates.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div 
                        className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center transition-colors ${file ? 'border-[#BFFF00]/50 bg-[#BFFF00]/5' : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900'}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input type="file" ref={fileInputRef} className="hidden" accept=".csv,.txt,.xyz,.dat" onChange={handleFileSelect} />
                        {file ? (
                            <>
                                <FileText className="w-10 h-10 text-[#BFFF00] mb-2" />
                                <p className="font-medium text-slate-200">{file.name}</p>
                                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                            </>
                        ) : (
                            <>
                                <Upload className="w-10 h-10 text-slate-500 mb-2" />
                                <p className="font-medium text-slate-300">Click to upload or drag and drop</p>
                                <p className="text-xs text-slate-500">Supported: CSV, XYZ, DAT (Max 50MB)</p>
                            </>
                        )}
                    </div>

                    {file && !preview && (
                        <div className="flex justify-center">
                            <Button variant="secondary" onClick={handlePreview} disabled={loading}>
                                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                {loading ? 'Parsing...' : 'Preview & Validate'}
                            </Button>
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-red-900/20 border border-red-900/50 rounded text-red-400 text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" /> {error}
                        </div>
                    )}

                    {preview && (
                        <div className="bg-slate-900 rounded p-4 border border-slate-800 space-y-3 text-sm">
                             <div className="flex items-center gap-2 text-green-400 mb-2">
                                <CheckCircle2 className="w-4 h-4" /> Valid Point Cloud Data
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-slate-500 text-xs">Surface Name</Label>
                                    <Input 
                                        value={options.name} 
                                        onChange={e => {
                                            setOptions({...options, name: e.target.value});
                                            setPreview({...preview, name: e.target.value});
                                        }}
                                        className="h-8 bg-slate-950 border-slate-700 mt-1"
                                    />
                                </div>
                                <div>
                                    <Label className="text-slate-500 text-xs">Points Detected</Label>
                                    <div className="font-mono text-slate-200 mt-2">{preview.stats.pointCount.toLocaleString()}</div>
                                </div>
                                <div>
                                    <Label className="text-slate-500 text-xs">Depth Range</Label>
                                    <div className="font-mono text-slate-200 mt-2">{preview.bounds.minZ.toFixed(1)} - {preview.bounds.maxZ.toFixed(1)}</div>
                                </div>
                                <div>
                                    <Label className="text-slate-500 text-xs">Approx. Area</Label>
                                    <div className="font-mono text-slate-200 mt-2">{preview.stats.area.toFixed(0)} sq units</div>
                                </div>
                             </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button 
                        onClick={handleConfirm} 
                        disabled={!preview || loading}
                        className="bg-[#BFFF00] text-slate-900 hover:bg-[#a3d900]"
                    >
                        Import Surface
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SurfaceImportDialog;