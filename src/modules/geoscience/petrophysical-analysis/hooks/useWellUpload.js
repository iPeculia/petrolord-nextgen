import { useState, useCallback } from 'react';
import { useGlobalDataStore } from '@/store/globalDataStore.js';
import { parseWellData } from '../services/wellDataParser.js';
import { validateWellData } from '../services/wellDataValidator.js';
import { uploadWellData, saveWellLogs } from '@/api/globalDataApi.js';
import { useToast } from '@/components/ui/use-toast';

export const useWellUpload = () => {
    const { addWell, addLogsToWell, setActiveWell } = useGlobalDataStore();
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState(null);
    const [parsedData, setParsedData] = useState(null);
    const [validationResult, setValidationResult] = useState(null);
    const { toast } = useToast();

    const resetState = useCallback(() => {
        setProgress(0);
        setStatus('idle');
        setError(null);
        setParsedData(null);
        setValidationResult(null);
    }, []);

    const parseFile = useCallback(async (file, metadata = {}) => {
        setStatus('parsing');
        setProgress(10);
        setError(null);
        try {
            const data = await parseWellData(file);
            setProgress(50);
            const validation = validateWellData(data);
            setValidationResult(validation);
            if (metadata.name) data.name = metadata.name;
            setParsedData(data);
            setStatus('parsed');
            setProgress(100);
        } catch (err) {
            console.error("Parsing error:", err);
            setError(err.message || "Failed to parse file");
            setStatus('error');
            toast({ title: "Parsing Failed", description: err.message, variant: "destructive" });
        }
    }, [toast]);

    const confirmUpload = useCallback(async (metadata) => {
        if (!parsedData) return;
        setStatus('uploading');
        setProgress(0);
        try {
            const wellPayload = {
                name: metadata.name || parsedData.name,
                project_id: metadata.projectId || null,
                metadata: {
                    operator: metadata.operator || parsedData.metadata.operator,
                    field: metadata.field || parsedData.metadata.field,
                    type: metadata.type,
                    status: metadata.status
                }
            };
            setProgress(20);
            // 1. Save Well to DB
            const newWell = await uploadWellData(wellPayload);
            setProgress(40);

            // 2. Save Logs to DB
            if (parsedData.logs) {
                const logPayloads = Object.entries(parsedData.logs).map(([logName, logData]) => ({
                    log_type: logName,
                    log_name: logName,
                    unit: logData.unit || '',
                    depth_array: logData.depth || [],
                    value_array: logData.values || []
                }));
                
                // CRITICAL: Wait for DB insert before updating UI state
                // The saveWellLogs function now handles chunking internally to prevent network errors
                await saveWellLogs(newWell.id, logPayloads);
                
                // 3. Update Local State (Cache)
                addLogsToWell(newWell.id, logPayloads);
            }

            setProgress(100);
            setStatus('success');
            addWell(newWell);
            setActiveWell(newWell.id); 

            toast({ title: "Import Successful", description: `Well ${newWell.name} imported successfully.` });

        } catch (err) {
            console.error("Upload error:", err);
            setError(err.message);
            setStatus('error');
             toast({ title: "Upload Failed", description: err.message, variant: "destructive" });
        }
    }, [parsedData, addWell, addLogsToWell, setActiveWell, toast]);

    return {
        parseFile,
        confirmUpload,
        progress,
        status,
        error,
        parsedData,
        validationResult,
        resetState,
        isProcessing: status === 'parsing' || status === 'uploading'
    };
};