import { saveAs } from 'file-saver';
import { validateWellData, validateWellCollection } from './ValidationHelpers';
import html2canvas from 'html2canvas';

export const AdvancedExporter = {
    exportToLAS: (well) => {
        // 1. Strict Validation for LAS
        const validation = validateWellData(well);
        if (!validation.valid) {
            throw new Error(`LAS Export Failed: ${validation.error}`);
        }

        if (!Array.isArray(well.curves) || well.curves.length === 0) {
            throw new Error(`LAS Export Failed: Well '${well.name}' has no curves defined.`);
        }

        // Allow header-only export if data is missing, but warn? 
        // Requirements say "Validate data before processing", so we check for data array
        if (!Array.isArray(well.data) || well.data.length === 0) {
             // Strict check
             throw new Error(`LAS Export Failed: Well '${well.name}' contains no log data points.`);
        }

        try {
            // 2. Build LAS Content
            let content = `~VERSION INFORMATION\n VERS.  2.0 :   CWLS LOG ASCII STANDARD - VERSION 2.0\n WRAP.   NO :   ONE LINE PER DEPTH STEP\n`;
            
            content += `~WELL INFORMATION\n`;
            content += ` STRT.M        ${well.depthRange.start.toFixed(4)} : START DEPTH\n`;
            content += ` STOP.M        ${well.depthRange.stop.toFixed(4)} : STOP DEPTH\n`;
            
            const step = typeof well.depthRange.step === 'number' ? well.depthRange.step : 0.1524;
            content += ` STEP.M        ${step.toFixed(4)} : STEP\n`;
            content += ` NULL.         -999.2500 : NULL VALUE\n`;
            content += ` WELL.         ${well.name} : WELL NAME\n`;
            content += ` UWI.          ${well.uwi || 'UNKNOWN'} : UNIQUE WELL ID\n`;
            
            content += `~CURVE INFORMATION\n`;
            content += ` DEPT.M                        : 1  DEPTH\n`;
            
            well.curves.forEach((c, i) => {
                const mnemonic = c.mnemonic || c.name || `CURVE_${i}`;
                const unit = c.unit || 'UNITLESS';
                content += ` ${mnemonic}.${unit}                   : ${i+2}  ${c.description || c.name}\n`;
            });

            content += `~ASCII LOG DATA\n`;
            
            // 3. Data Writing with Safety
            well.data.forEach(row => {
                // Normalize depth key
                const depth = row.DEPT ?? row.depth ?? row.Depth ?? row[well.metadata?.depthColumn];
                
                if (depth !== undefined && depth !== null) {
                    let line = `${Number(depth).toFixed(4).padStart(10)} `;
                    
                    well.curves.forEach(c => {
                        const key = c.mnemonic || c.name;
                        let val = row[key];
                        // Handle nulls/undefined as LAS null value
                        if (val === undefined || val === null || isNaN(val)) {
                            val = -999.2500;
                        }
                        line += `${Number(val).toFixed(4).padStart(12)} `;
                    });
                    content += line + "\n";
                }
            });

            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            saveAs(blob, `${well.name.replace(/[^a-z0-9]/gi, '_')}.las`);
            return { success: true };

        } catch (error) {
            console.error("LAS Construction Error:", error);
            throw new Error(`Failed to construct LAS file: ${error.message}`);
        }
    },

    exportToGeoJSON: (wells) => {
        const validation = validateWellCollection(wells);
        if (!validation.valid) {
            // If no valid wells, we can't export location data
            throw new Error(`GeoJSON Export Failed: ${validation.errors[0]}`);
        }

        try {
            const validWells = validation.validWells;
            
            const features = validWells.map(w => {
                // Use lat/lng from location object or root properties, default to 0,0 if missing
                // Ensure numbers
                const lng = Number(w.location?.lng ?? w.longitude ?? 0);
                const lat = Number(w.location?.lat ?? w.latitude ?? 0);

                return {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [lng, lat]
                    },
                    properties: {
                        name: w.name,
                        uwi: w.uwi || 'N/A',
                        startDepth: w.depthRange.start,
                        stopDepth: w.depthRange.stop,
                        curveCount: w.curves ? w.curves.length : 0
                    }
                };
            });

            const geojson = {
                type: "FeatureCollection",
                metadata: {
                    generated: new Date().toISOString(),
                    count: features.length,
                    software: "PetroLord NextGen"
                },
                features: features
            };

            const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/geo+json' });
            saveAs(blob, "project_wells_location.geojson");
            return { success: true };

        } catch (error) {
             console.error("GeoJSON Export Error:", error);
             throw new Error(`Failed to generate GeoJSON: ${error.message}`);
        }
    },

    exportPanelAsImage: async (elementId = 'correlation-panel-root') => {
        const element = document.getElementById(elementId);
        if (!element) {
            throw new Error("Correlation panel element not found in DOM.");
        }

        try {
            const canvas = await html2canvas(element, {
                backgroundColor: '#0F172A', // Preserve dark theme bg
                scale: 2, // High resolution
                useCORS: true
            });

            canvas.toBlob((blob) => {
                if (blob) {
                    saveAs(blob, `correlation_snapshot_${new Date().getTime()}.png`);
                } else {
                    throw new Error("Failed to generate image blob.");
                }
            });
            return { success: true };
        } catch (error) {
            console.error("Image Export Error:", error);
            throw new Error(`Failed to capture image: ${error.message}`);
        }
    }
};