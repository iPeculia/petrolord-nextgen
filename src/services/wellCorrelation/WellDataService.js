import { parseLasFile } from '@/utils/wellCorrelation/LasParser';
import { sampleWells } from '@/data/wellCorrelation/sampleWells';

// Service to handle well data operations
export const WellDataService = {
    importLasFile: async (file) => {
        try {
            const parsedData = await parseLasFile(file);
            
            if (!parsedData) throw new Error("Parsed data is null");

            // Transform into internal format
            const wellId = `well_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            const meta = parsedData.metadata || {};

            return {
                id: wellId,
                name: meta.name || "Unknown Well",
                uwi: meta.uwi,
                field: meta.field || "Unknown Field",
                company: meta.company,
                depthRange: {
                    start: typeof meta.startDepth === 'number' ? meta.startDepth : 0,
                    stop: typeof meta.stopDepth === 'number' ? meta.stopDepth : 1000,
                    step: meta.step || 1,
                    unit: meta.depthUnit || 'M'
                },
                curves: (parsedData.curves || []).map(c => ({
                    id: c.mnemonic,
                    name: c.mnemonic,
                    unit: c.unit,
                    description: c.description,
                    min: c.min,
                    max: c.max
                })),
                data: parsedData.data || [],
                markers: [] // Initialize with empty markers
            };
        } catch (error) {
            console.error("Service Import Error:", error);
            throw error;
        }
    },
    
    getSampleWells: () => {
        return sampleWells || [];
    }
};