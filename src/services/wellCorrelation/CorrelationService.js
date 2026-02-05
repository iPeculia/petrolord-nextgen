import { v4 as uuidv4 } from 'uuid';

export const CorrelationService = {
    // Panel Management
    createPanel: (name = "New Correlation") => ({
        id: uuidv4(),
        name,
        wellIds: [],
        datum: 'MSL', // or 'Flatten'
        flattenMarkerId: null
    }),

    addWellToPanel: (panel, wellId) => {
        if (panel.wellIds.includes(wellId)) return panel;
        return { ...panel, wellIds: [...panel.wellIds, wellId] };
    },

    removeWellFromPanel: (panel, wellId) => {
        return { ...panel, wellIds: panel.wellIds.filter(id => id !== wellId) };
    },

    reorderWells: (panel, newOrderIds) => {
        return { ...panel, wellIds: newOrderIds };
    },
    
    // Auto-Correlation (Placeholder for future algorithmic matching)
    correlateMarkers: (sourceWellId, targetWellId, markerId, windowSize = 5.0) => {
        // This would perform cross-correlation signal processing
        // For now, returning a mock result
        return {
            correlationCoefficient: 0.85,
            suggestedDepth: 0 // Offset
        };
    }
};