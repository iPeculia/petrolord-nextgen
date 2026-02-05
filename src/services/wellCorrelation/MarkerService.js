import { v4 as uuidv4 } from 'uuid';

// In-memory storage simulation or Supabase connection
export const MarkerService = {
    createMarker: (projectId, wellId, depth, horizonId) => {
        return {
            id: uuidv4(),
            projectId,
            wellId,
            depth,
            horizonId,
            createdAt: new Date().toISOString()
        };
    },

    createHorizon: (projectId, name, color) => {
        return {
            id: uuidv4(),
            projectId,
            name,
            color: color || '#FF0000',
            type: 'chronostratigraphic'
        };
    },
    
    // Helper to guess marker position based on log signature (simple peak finding placeholder)
    suggestMarkerDepth: (logData, approxDepth, searchWindow = 20) => {
        // Placeholder for auto-pick algorithm
        return approxDepth; 
    }
};