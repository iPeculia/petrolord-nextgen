import { CONVERSION_FACTORS } from './UnitConverter';

/**
 * SurfaceParser - Handles parsing of various surface file formats
 * Supported formats: CSV, XYZ (text based)
 * Output: Standardized grid object { header: {}, data: [], stats: {} }
 */
export const SurfaceParser = {
    
    parse: async (file, options = {}) => {
        const fileName = file.name.toLowerCase();
        const text = await file.text();

        if (fileName.endsWith('.csv') || fileName.endsWith('.txt') || fileName.endsWith('.xyz') || fileName.endsWith('.dat')) {
            return SurfaceParser.parseDelimited(text, fileName, options);
        }
        
        throw new Error("Unsupported file format. Please use CSV, XYZ, or DAT files.");
    },

    parseDelimited: (text, fileName, options) => {
        const lines = text.trim().split(/\r?\n/);
        const points = [];
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        let minZ = Infinity, maxZ = -Infinity;

        // Detect delimiter (comma or whitespace)
        const firstLine = lines[0];
        const delimiter = firstLine.includes(',') ? ',' : /\s+/;

        // Skip header if requested or auto-detected (simple heuristic: first char is not number)
        let startIndex = 0;
        if (isNaN(parseFloat(firstLine.split(delimiter)[0]))) {
            startIndex = 1;
        }

        for (let i = startIndex; i < lines.length; i++) {
            const parts = lines[i].trim().split(delimiter).filter(val => val !== '');
            if (parts.length < 3) continue;

            const x = parseFloat(parts[0]);
            const y = parseFloat(parts[1]);
            const z = parseFloat(parts[2]);

            if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
                points.push({ x, y, z });
                
                minX = Math.min(minX, x); maxX = Math.max(maxX, x);
                minY = Math.min(minY, y); maxY = Math.max(maxY, y);
                minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z);
            }
        }

        if (points.length === 0) throw new Error("No valid 3D points found in file.");

        // Calculate simplified area (bounding box area)
        const area = (maxX - minX) * (maxY - minY);

        return {
            id: crypto.randomUUID(),
            name: fileName,
            type: 'point_cloud',
            points: points, // In a real app, this might be too heavy for state, consider simpler representation or typed arrays
            bounds: { minX, maxX, minY, maxY, minZ, maxZ },
            stats: {
                pointCount: points.length,
                area: area,
                avgZ: (minZ + maxZ) / 2
            },
            metadata: {
                originalName: fileName,
                importedAt: new Date().toISOString(),
                ...options
            }
        };
    }
};