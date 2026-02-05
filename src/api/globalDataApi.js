import { supabase } from '@/lib/customSupabaseClient.js';

// Helper to clean payload
const cleanPayload = (payload) => {
    const cleaned = {};
    Object.keys(payload).forEach(key => {
        if (payload[key] !== undefined && payload[key] !== '' && payload[key] !== null) {
            cleaned[key] = payload[key];
        } else if (payload[key] === null) {
             cleaned[key] = null;
        }
    });
    return cleaned;
};

// Retry wrapper for network operations
const withRetry = async (operation, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await operation();
        } catch (error) {
            const isNetworkError = error.message && (
                error.message.includes('Failed to fetch') || 
                error.message.includes('Network request failed') ||
                error.message.includes('connection') ||
                error.message.includes('upstream')
            );

            if ((isNetworkError || i < retries - 1) && i < retries - 1) {
                console.warn(`Operation failed (attempt ${i + 1}/${retries}): ${error.message}. Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
                continue;
            }
            throw error;
        }
    }
};

export const getWellsByProject = async (projectId) => {
    return withRetry(async () => {
        try {
            if (!projectId) return [];
            const { data, error } = await supabase.from('wells').select('*').eq('project_id', projectId).order('name');
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching wells:', error.message);
            throw new Error(`Failed to fetch wells: ${error.message}`);
        }
    });
};

export const getAllWells = async () => {
    return withRetry(async () => {
        try {
            const { data, error } = await supabase.from('wells').select('*').order('name');
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Error in getAllWells:", error);
            return [];
        }
    });
};

export const createWell = async (wellData) => {
    return withRetry(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Authentication required.");
            const rawPayload = {
                ...wellData,
                created_by: user.id,
                user_id: user.id,
                project_id: wellData.project_id,
                well_type: wellData.type || wellData.well_type, 
            };
            const payload = cleanPayload(rawPayload);
            const { data, error } = await supabase.from('wells').insert(payload).select().single();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating well:', error.message);
            throw new Error(`Failed to create well: ${error.message}`);
        }
    });
};

export const updateWell = async (id, wellData) => {
    return withRetry(async () => {
        try {
            const rawPayload = { ...wellData, updated_at: new Date().toISOString() };
            const payload = cleanPayload(rawPayload);
            const { data, error } = await supabase.from('wells').update(payload).eq('id', id).select().single();
            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to update well: ${error.message}`);
        }
    });
};

export const deleteWell = async (id) => {
    return withRetry(async () => {
        try {
            const { error } = await supabase.from('wells').delete().eq('id', id);
            if (error) throw error;
            return true;
        } catch (error) {
            throw new Error(`Failed to delete well: ${error.message}`);
        }
    });
};

export const uploadFileRecord = async (fileData) => {
    return withRetry(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Authentication required.");
            const payload = {
                ...fileData,
                uploaded_by: user.id,
                upload_date: new Date().toISOString()
            };
            const { data, error } = await supabase.from('files').insert(payload).select().single();
            if (error) throw error;
            await logFileHistory(data.id, 'UPLOAD', user.id, { filename: data.filename });
            return data;
        } catch (error) {
            console.error('Error uploading file record:', error.message);
            throw error;
        }
    });
};

export const getFilesByWell = async (wellId) => {
    return withRetry(async () => {
        try {
            const { data, error } = await supabase.from('files').select('*').eq('well_id', wellId).order('upload_date', { ascending: false });
            if (error) throw error;
            return data || [];
        } catch (error) {
            return [];
        }
    });
};

export const deleteFileRecord = async (fileId) => {
    return withRetry(async () => {
        try {
            const { error } = await supabase.from('files').delete().eq('id', fileId);
            if (error) throw error;
            return true;
        } catch (error) { throw error; }
    });
};

export const logFileHistory = async (fileId, action, userId, details = {}) => {
    try {
        await supabase.from('file_history').insert({ file_id: fileId, action, user_id: userId, details, timestamp: new Date().toISOString() });
    } catch (e) { console.warn('Failed to log file history:', e); }
};

export const getWellDetails = async (wellId) => {
    return withRetry(async () => {
        try {
            const { data, error } = await supabase.from('well_details').select('*').eq('well_id', wellId);
            if (error) throw error;
            return data || [];
        } catch (error) { return []; }
    });
};

export const setWellDetail = async (wellId, key, value) => {
    return withRetry(async () => {
        try {
            const { data, error } = await supabase.from('well_details').upsert({ well_id: wellId, key, value, updated_at: new Date().toISOString() }, { onConflict: 'well_id, key' }).select().single();
            if (error) throw error;
            return data;
        } catch (error) { throw error; }
    });
};

export const createMarker = async (markerData) => {
    return withRetry(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Authentication required.");
            const payload = { ...markerData, created_by: user.id };
            const { data, error } = await supabase.from('markers').insert(payload).select().single();
            if (error) throw error;
            return data;
        } catch (error) { throw new Error(`Failed to create marker: ${error.message}`); }
    });
};

export const getMarkersByWell = async (wellId) => {
    return withRetry(async () => {
        try {
            const { data, error } = await supabase.from('markers').select('*').eq('well_id', wellId).order('depth', { ascending: true });
            if (error) throw error;
            return data || [];
        } catch (error) { throw new Error(`Failed to fetch markers: ${error.message}`); }
    });
};

export const updateMarker = async (markerId, updates) => {
    return withRetry(async () => {
        try {
            const { data, error } = await supabase.from('markers').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', markerId).select().single();
            if (error) throw error;
            return data;
        } catch (error) { throw new Error(`Failed to update marker: ${error.message}`); }
    });
};

export const deleteMarker = async (markerId) => {
    return withRetry(async () => {
        try {
            const { error } = await supabase.from('markers').delete().eq('id', markerId);
            if (error) throw error;
            return true;
        } catch (error) { throw new Error(`Failed to delete marker: ${error.message}`); }
    });
};

export const getWellLogs = async (wellId) => {
    return withRetry(async () => {
        try {
            const { data, error } = await supabase.from('well_logs').select('*').eq('well_id', wellId);
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error(`Error fetching well logs for well ID (${wellId}):`, error.message);
            throw new Error(`Failed to fetch logs: ${error.message}`);
        }
    });
};

export const getAnalysesByWell = async (wellId) => {
    return withRetry(async () => {
        try {
            const { data, error } = await supabase.from('analyses').select('*').eq('well_id', wellId);
            if (error) throw error;
            return data || [];
        } catch (error) { throw new Error(`Failed to fetch analyses: ${error.message}`); }
    });
};

export const saveAnalysis = async (analysisData) => {
    return withRetry(async () => {
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) throw new Error("Authentication required.");
            const payload = { ...analysisData, user_id: user.id };
            const validColumns = ['id', 'well_id', 'module_id', 'analysis_type', 'name', 'data', 'results', 'user_id', 'created_at', 'updated_at'];
            const filteredPayload = {};
            Object.keys(payload).forEach(key => {
                if (validColumns.includes(key)) filteredPayload[key] = payload[key];
            });
            const { data, error } = await supabase.from('analyses').upsert(filteredPayload, { onConflict: 'id' }).select().single();
            if (error) throw error;
            return data;
        } catch (error) { throw new Error(`Failed to save analysis: ${error.message}`); }
    });
};

export const uploadWellData = async (wellPayload) => {
    return createWell(wellPayload);
};

export const saveWellLogs = async (wellId, logs) => {
    // Do not use withRetry here directly if we want granular control over chunks.
    // We'll implement internal chunking and retry logic to avoid huge payloads.

    try {
        // Validate payload structure first
        const logEntries = logs.map(log => ({
            well_id: wellId,
            log_type: log.log_type || log.log_name.toUpperCase(),
            log_name: log.log_name,
            unit: log.unit || '',
            depth_array: log.depth_array,
            value_array: log.value_array,
        }));

        // CRITICAL FIX: Split data into smaller chunks to avoid "Failed to fetch" (Payload Too Large)
        const CHUNK_SIZE = 20; // Save 20 curves at a time
        const chunks = [];
        for (let i = 0; i < logEntries.length; i += CHUNK_SIZE) {
            chunks.push(logEntries.slice(i, i + CHUNK_SIZE));
        }

        let savedData = [];

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            console.log(`Saving log chunk ${i+1}/${chunks.length} for well ${wellId}...`);
            
            // Retry logic specifically for each chunk
            const chunkResult = await withRetry(async () => {
                const { data, error } = await supabase.from('well_logs').insert(chunk).select();
                if (error) throw error;
                return data;
            });
            
            savedData = [...savedData, ...chunkResult];
        }

        return savedData;
    } catch (error) {
        console.error('Error saving well logs:', error.message);
        throw new Error(`Saving well logs failed: ${error.message}`);
    }
};

export const deleteWellLog = async (wellId, logType) => {
    return withRetry(async () => {
        try {
            const { error } = await supabase.from('well_logs').delete().eq('well_id', wellId).eq('log_type', logType);
            if (error) throw error;
            return true;
        } catch (error) { throw new Error(`Failed to delete log: ${error.message}`); }
    });
};