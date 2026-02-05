import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Loader2, AlertTriangle, X, FileType, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWellUpload } from '../../hooks/useWellUpload';
import { useGlobalDataStore } from '@/store/globalDataStore';
import { saveWellLogs, uploadFileRecord } from '@/api/globalDataApi';
import { useToast } from '@/components/ui/use-toast';

const DragDropUpload = ({ wellId, projectId }) => {
    const {
        parseFile,
        confirmUpload,
        progress,
        status,
        error,
        parsedData,
        resetState
    } = useWellUpload();

    const { addLogsToWell } = useGlobalDataStore();
    const { toast } = useToast();

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            parseFile(acceptedFiles[0]);
        }
    }, [parseFile]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/octet-stream': ['.las'],
            'text/csv': ['.csv', '.txt'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/json': ['.json']
        },
        multiple: false
    });

    const handleImportToCurrentWell = async () => {
        if (!parsedData || !wellId) return;
        
        try {
            // Use confirmUpload logic but adapted for existing well
            // We need to show loading state here manually since we're bypassing the hook's confirmUpload partially
            
            // 1. Save File Record
            const fileRecord = {
                project_id: projectId,
                well_id: wellId,
                filename: parsedData.name,
                file_type: 'UPLOAD',
                file_size: 0, 
                status: 'processed',
                parsed_data: {
                    curves: parsedData.curves
                }
            };
            await uploadFileRecord(fileRecord);

             // 2. Save Logs
             const logPayloads = Object.entries(parsedData.logs).map(([logName, logData]) => ({
                log_type: logName,
                log_name: logName,
                unit: logData.unit || '',
                depth_array: logData.depth || [],
                value_array: logData.values || []
            }));
            
            // This might take a while due to chunking
            toast({ title: "Importing...", description: `Saving ${logPayloads.length} curves to database. This may take a moment.` });
            
            await saveWellLogs(wellId, logPayloads);
            
            // 3. Update Local Store
            addLogsToWell(wellId, logPayloads);
            
            toast({ title: "Import Successful", description: `${logPayloads.length} curves added to current well.` });
            resetState();
            
        } catch (e) {
            console.error(e);
            toast({ title: "Import Failed", description: e.message, variant: "destructive" });
        }
    };


    if (status === 'success') {
        return (
            <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-green-950/20 border-green-500/20">
                <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold text-green-400">Import Complete</h3>
                <p className="text-sm text-green-300 mb-4 text-center">Data has been successfully saved to the database.</p>
                <Button onClick={resetState} variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-500/20">
                    Import Another File
                </Button>
            </div>
        );
    }

    if (status === 'parsed' && parsedData) {
        return (
            <div className="border rounded-lg bg-slate-950 border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                    <div>
                        <h3 className="font-semibold text-white">Ready to Import</h3>
                        <p className="text-xs text-slate-400">{parsedData.curves.length} curves identified</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={resetState}><X className="w-4 h-4" /></Button>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                         <div className="bg-slate-900 p-2 rounded">
                            <div className="text-xs text-slate-500">Depth Min</div>
                            <div className="font-mono text-sm text-slate-200">{parsedData.depth.min.toFixed(2)}</div>
                         </div>
                         <div className="bg-slate-900 p-2 rounded">
                            <div className="text-xs text-slate-500">Depth Max</div>
                            <div className="font-mono text-sm text-slate-200">{parsedData.depth.max.toFixed(2)}</div>
                         </div>
                         <div className="bg-slate-900 p-2 rounded">
                            <div className="text-xs text-slate-500">Curves</div>
                            <div className="font-mono text-sm text-[#BFFF00]">{parsedData.curves.length}</div>
                         </div>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 mb-2">Detected Curves:</p>
                    <ScrollArea className="h-32 bg-slate-900/50 rounded border border-slate-800 p-2 mb-4">
                        <div className="grid grid-cols-2 gap-2">
                            {parsedData.curves.map(c => (
                                <div key={c} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950 p-1 rounded">
                                    <FileType className="w-3 h-3 text-slate-500" /> {c}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    
                    <Button onClick={handleImportToCurrentWell} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                        Confirm Import
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg cursor-pointer transition-all
                    ${isDragActive ? "border-[#BFFF00] bg-[#BFFF00]/5" : "border-slate-700 hover:border-slate-500 hover:bg-slate-800/50"}
                    ${error ? "border-red-500/50 bg-red-500/5" : ""}
                `}
            >
                <input {...getInputProps()} />
                {status === 'parsing' || status === 'uploading' ? (
                    <div className="flex flex-col items-center animate-pulse">
                        <Loader2 className="w-10 h-10 text-[#BFFF00] animate-spin mb-3" />
                        <p className="text-sm text-slate-300 font-medium">
                            {status === 'parsing' ? "Parsing File..." : "Uploading Data..."}
                        </p>
                        <Progress value={progress} className="w-48 h-1.5 mt-3" />
                        <p className="text-xs text-slate-500 mt-2">Please wait, large files may take a moment.</p>
                    </div>
                ) : (
                    <>
                        <div className="p-4 bg-slate-800 rounded-full mb-4">
                            <UploadCloud className="w-8 h-8 text-slate-400" />
                        </div>
                        <div className="text-center">
                             <p className="text-sm font-medium text-slate-200 mb-1">
                                {isDragActive ? "Drop file here" : "Click to upload log data"}
                            </p>
                            <p className="text-xs text-slate-500 mb-3">
                                Supports .LAS, .CSV, .XLSX, .JSON
                            </p>
                            <Button variant="outline" size="sm" className="text-xs h-7">Browse Files</Button>
                        </div>
                    </>
                )}
            </div>

            {error && (
                <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
};

export default DragDropUpload;