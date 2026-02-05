import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, X, CheckCircle, AlertTriangle, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress'; // Updated import to be safe
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWellUpload } from '@/modules/geoscience/petrophysical-analysis/hooks/useWellUpload.js';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import FilePreview from './FilePreview';

const WellUploadPanel = () => {
  const [file, setFile] = useState(null);
  const [manualDialogOpen, setManualDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [metadata, setMetadata] = useState({
      name: '',
      operator: '',
      field: '',
      type: 'vertical',
      status: 'active'
  });
  
  const { 
      parseFile, 
      confirmUpload, 
      createManualWell, 
      progress, 
      error, 
      status, 
      isProcessing, 
      resetState,
      parsedData,
      validationResult 
  } = useWellUpload();

  useEffect(() => {
      if(!manualDialogOpen && status === 'success') {
          resetState();
          setFile(null);
      }
  }, [manualDialogOpen, status, resetState]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      resetState();
      
      // Pre-fill name from filename if empty
      let initialName = metadata.name;
      if (!initialName) {
          initialName = selectedFile.name.replace(/\.[^/.]+$/, "");
          setMetadata(prev => ({...prev, name: initialName}));
      }
      
      // Auto-parse on drop
      parseFile(selectedFile, { ...metadata, name: initialName });
    }
  }, [metadata, resetState, parseFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
        'text/csv': ['.csv'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        'application/json': ['.json'],
        'application/octet-stream': ['.las'] 
    }
  });

  const handleManualWellCreate = async (manualData) => {
     const success = await createManualWell(manualData);
     if (success) {
         setTimeout(() => {
             setManualDialogOpen(false);
             resetState();
         }, 1000);
     }
  };

  const removeFile = () => {
    setFile(null);
    setMetadata(prev => ({...prev, name: ''}));
    resetState();
  };
  
  const handleChange = (field, value) => {
      setMetadata(prev => ({...prev, [field]: value}));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4 border-b border-border pb-2">
         <Button 
            variant={activeTab === 'upload' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => setActiveTab('upload')}
            className="text-xs"
         >
            File Import
         </Button>
         <ManualWellCreationDialog 
            onSave={handleManualWellCreate} 
            open={manualDialogOpen} 
            onOpenChange={setManualDialogOpen}
            isProcessing={isProcessing}
            status={status}
            error={error}
         >
             <Button 
                variant={activeTab === 'manual' ? 'secondary' : 'ghost'} 
                size="sm"
                className="text-xs"
             >
                <Plus className="w-3 h-3 mr-1"/> Manual Creation
             </Button>
         </ManualWellCreationDialog>
      </div>

      {activeTab === 'upload' && (
          <>
            {!file && (
                <div
                {...getRootProps()}
                className={cn(
                    "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ease-in-out",
                    isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                )}
                >
                <input {...getInputProps()} />
                <div className="p-3 rounded-full bg-muted mb-3">
                    <UploadCloud className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground text-center">
                    {isDragActive ? 'Drop file here' : 'Click to upload or drag & drop'}
                </p>
                <p className="text-xs text-muted-foreground mt-1 text-center">
                    CSV, LAS, XLSX (Max 50MB)
                </p>
                </div>
            )}

            {file && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* File Header */}
                    <div className="p-3 border rounded-lg bg-card shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3 overflow-hidden">
                                <div className="p-2 bg-primary/10 rounded shrink-0">
                                    {status === 'success' ? <CheckCircle className="w-5 h-5 text-green-500" /> : <FileText className="w-5 h-5 text-primary" />}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                            </div>
                            {status !== 'success' && !isProcessing && (
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={removeFile}>
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>

                        {/* Metadata Inputs */}
                        {status !== 'success' && (
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="col-span-2 space-y-1.5">
                                    <Label htmlFor="well-name" className="text-xs">Well Name <span className="text-destructive">*</span></Label>
                                    <Input 
                                        id="well-name" 
                                        value={metadata.name} 
                                        onChange={(e) => handleChange('name', e.target.value)} 
                                        placeholder="e.g. OMEGA-001"
                                        className="h-8 text-sm"
                                        disabled={isProcessing || status === 'parsed'}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="operator" className="text-xs">Operator</Label>
                                    <Input 
                                        id="operator" 
                                        value={metadata.operator} 
                                        onChange={(e) => handleChange('operator', e.target.value)} 
                                        className="h-8 text-sm"
                                        disabled={isProcessing || status === 'parsed'}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="field" className="text-xs">Field</Label>
                                    <Input 
                                        id="field" 
                                        value={metadata.field} 
                                        onChange={(e) => handleChange('field', e.target.value)} 
                                        className="h-8 text-sm"
                                        disabled={isProcessing || status === 'parsed'}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Processing State */}
                        {isProcessing && (
                            <div className="space-y-2 pt-2 border-t border-border/50">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        {status === 'parsing' ? 'Parsing data...' : 'Uploading to database...'}
                                    </span>
                                    <span>{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-1.5" />
                            </div>
                        )}

                        {/* Error Display */}
                        {error && (
                            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-md flex items-start gap-2 mt-2">
                                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                                <span className="font-medium">{error}</span>
                            </div>
                        )}
                    </div>

                    {/* Preview Section */}
                    {status === 'parsed' && parsedData && (
                         <div className="bg-card rounded-lg border shadow-sm p-4">
                             <FilePreview data={parsedData} validationResult={validationResult} />
                             
                             <Button 
                                onClick={() => confirmUpload(metadata)} 
                                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Confirm & Import Well
                            </Button>
                         </div>
                    )}

                    {status === 'success' && (
                        <div className="space-y-4">
                            <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg flex flex-col items-center justify-center gap-2 text-center">
                                <CheckCircle className="w-8 h-8" />
                                <h4 className="font-semibold">Import Complete!</h4>
                                <p className="text-xs text-green-400/80">Well data has been successfully saved.</p>
                            </div>
                            <Button onClick={removeFile} variant="outline" className="w-full">
                                Import Another File
                            </Button>
                        </div>
                    )}
                </div>
            )}
          </>
      )}
    </div>
  );
};

const ManualWellCreationDialog = ({ children, onSave, open, onOpenChange, isProcessing, status, error }) => {
    const [manualData, setManualData] = useState({
        name: '', operator: '', field: '', topDepth: 0, bottomDepth: 1000, type: 'vertical', status: 'active'
    });
    const handleChange = (field, value) => setManualData(prev => ({...prev, [field]: value}));
    
    return (
        <Dialog open={open} onOpenChange={(val) => { if(!isProcessing) onOpenChange(val); }}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-card border-border">
                <DialogHeader>
                    <DialogTitle>Create Well Manually</DialogTitle>
                    <DialogDescription>Enter basic well information to create a new record.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="m-name" className="text-xs">Well Name *</Label>
                            <Input id="m-name" value={manualData.name} onChange={(e) => handleChange('name', e.target.value)} className="h-8 text-sm" disabled={isProcessing}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="m-op" className="text-xs">Operator</Label>
                            <Input id="m-op" value={manualData.operator} onChange={(e) => handleChange('operator', e.target.value)} className="h-8 text-sm" disabled={isProcessing}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="m-field" className="text-xs">Field</Label>
                            <Input id="m-field" value={manualData.field} onChange={(e) => handleChange('field', e.target.value)} className="h-8 text-sm" disabled={isProcessing}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="m-top" className="text-xs">Top Depth</Label>
                            <Input id="m-top" type="number" value={manualData.topDepth} onChange={(e) => handleChange('topDepth', parseFloat(e.target.value))} className="h-8 text-sm" disabled={isProcessing}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="m-btm" className="text-xs">Bottom Depth</Label>
                            <Input id="m-btm" type="number" value={manualData.bottomDepth} onChange={(e) => handleChange('bottomDepth', parseFloat(e.target.value))} className="h-8 text-sm" disabled={isProcessing}/>
                        </div>
                         <div className="space-y-2">
                            <Label className="text-xs">Status</Label>
                            <Select value={manualData.status} onValueChange={(val) => handleChange('status', val)} disabled={isProcessing}>
                                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="planned">Planned</SelectItem>
                                    <SelectItem value="abandoned">Abandoned</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {isProcessing && <div className="flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="w-3 h-3 animate-spin" /> Creating well...</div>}
                    {error && <div className="text-xs text-destructive">{error}</div>}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>Cancel</Button>
                    <Button onClick={() => onSave(manualData)} disabled={!manualData.name || isProcessing}>
                        {isProcessing ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : 'Create Well'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default WellUploadPanel;