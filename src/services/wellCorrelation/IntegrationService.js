export const IntegrationService = {
    exportToPetrophysics: async (wellId, data) => {
        console.log(`Exporting well ${wellId} to Petrophysics module...`, data);
        // Mock API call
        return new Promise(resolve => setTimeout(() => resolve({ success: true, jobId: 'job-123' }), 1000));
    },

    exportToReservoirModel: async (projectId, correlationData) => {
        console.log(`Exporting project ${projectId} correlations to EarthModel...`);
        return new Promise(resolve => setTimeout(() => resolve({ success: true, jobId: 'job-456' }), 1500));
    },

    fetchSeismicHorizons: async (projectId) => {
        // Mock fetching horizons from seismic module
        return [
            { id: 'sh-1', name: 'Top Reservoir', type: 'Seismic', color: '#FF0000' },
            { id: 'sh-2', name: 'Base Carbonate', type: 'Seismic', color: '#0000FF' }
        ];
    }
};