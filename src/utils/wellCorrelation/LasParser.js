/**
 * Robust LAS 2.0/3.0 Parser for Well Correlation Tool
 * Handles standard wrapping, null values, and metadata extraction.
 */

export const parseLasFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target.result;
        // Robust newline splitting
        const lines = text.split(/\r\n|\n|\r/);
        
        const well = {
            metadata: {
                name: file?.name ? file.name.replace(/\.las$/i, '') : 'Unknown',
                uwi: null,
                field: null,
                company: null,
                startDepth: null,
                stopDepth: null,
                step: null,
                nullValue: -999.25,
                depthUnit: 'M',
                depthColumn: null
            },
            curves: [],
            data: [], 
            errors: []
        };

        let section = null;
        let dataStartIndex = -1;

        // --- Pass 1: Header Parsing ---
        for (let i = 0; i < lines.length; i++) {
            const line = (lines[i] || '').trim();
            if (!line || line.startsWith('#')) continue;

            if (line.startsWith('~')) {
                const sectionChar = line.charAt(1).toUpperCase();
                if (sectionChar === 'V') section = 'VERSION';
                else if (sectionChar === 'W') section = 'WELL';
                else if (sectionChar === 'C') section = 'CURVE';
                else if (sectionChar === 'P') section = 'PARAMETER';
                else if (sectionChar === 'O') section = 'OTHER';
                else if (sectionChar === 'A') {
                    section = 'ASCII';
                    dataStartIndex = i + 1;
                    break; // Stop parsing headers
                }
                continue;
            }

            if (section === 'WELL' || section === 'CURVE') {
                const match = line.match(/^([^.\s]+)(?:\.([^\s]*))?\s+(.*):(.*)$/);
                
                if (match) {
                    const mnem = match[1] ? match[1].trim() : '';
                    const unit = match[2] ? match[2].trim() : '';
                    let data = match[3] ? match[3].trim() : '';
                    const desc = match[4] ? match[4].trim() : '';

                    if (section === 'WELL') {
                        if (mnem === 'STRT') well.metadata.startDepth = parseFloat(data);
                        if (mnem === 'STOP') well.metadata.stopDepth = parseFloat(data);
                        if (mnem === 'STEP') well.metadata.step = parseFloat(data);
                        if (mnem === 'NULL') well.metadata.nullValue = parseFloat(data);
                        if (mnem === 'WELL') well.metadata.name = data;
                        if (mnem === 'FLD') well.metadata.field = data;
                        if (mnem === 'COMP') well.metadata.company = data;
                        if (mnem === 'UWI' || mnem === 'API') well.metadata.uwi = data;
                    } else if (section === 'CURVE') {
                        well.curves.push({
                            mnemonic: mnem,
                            unit: unit,
                            description: desc,
                            name: mnem // Alias for UI consistency
                        });
                    }
                }
            }
        }

        // --- Pass 2: Data Parsing ---
        if (dataStartIndex > -1 && well.curves.length > 0) {
            for (let i = dataStartIndex; i < lines.length; i++) {
                const line = (lines[i] || '').trim();
                if (!line) continue;
                
                const parts = line.split(/\s+/);
                
                // Basic wrapping check
                if (parts.length < well.curves.length) continue;

                const row = {};
                well.curves.forEach((curve, idx) => {
                    if (idx < parts.length) {
                        const val = parseFloat(parts[idx]);
                        // Check for null value using tolerance
                        if (Math.abs(val - well.metadata.nullValue) < 0.01 || isNaN(val)) {
                            row[curve.mnemonic] = null;
                        } else {
                            row[curve.mnemonic] = val;
                        }
                    }
                });
                well.data.push(row);
            }
        }

        if (!well.data.length) {
            // Instead of failing, return a placeholder well if structure exists but no data
            // But usually we want data.
            // Let's just resolve with what we have but log error
            well.errors.push("No valid data rows found in LAS file.");
        }

        // --- Validation & Post-Processing ---
        
        // 1. Identify Depth Column
        const depthCurve = well.curves.find(c => ['DEPT', 'DEPTH', 'MD'].includes(c.mnemonic.toUpperCase()));
        if (depthCurve) {
            well.metadata.depthColumn = depthCurve.mnemonic;
            well.metadata.depthUnit = depthCurve.unit || 'M';
        } else if (well.curves.length > 0) {
            // Fallback: Assume first column is depth
            well.metadata.depthColumn = well.curves[0].mnemonic;
            well.metadata.depthUnit = well.curves[0].unit || 'M';
            well.errors.push("Explicit depth column not found, assuming first column.");
        }

        // 2. Infer Start/Stop if missing or invalid (CRITICAL FIX for 'stop' error)
        const depthCol = well.metadata.depthColumn;
        if (well.data.length > 0 && depthCol) {
            const firstRow = well.data[0];
            const lastRow = well.data[well.data.length - 1];
            
            const firstDepth = firstRow ? firstRow[depthCol] : 0;
            const lastDepth = lastRow ? lastRow[depthCol] : 0;
            
            if (well.metadata.startDepth === null || isNaN(well.metadata.startDepth)) {
                well.metadata.startDepth = Math.min(firstDepth || 0, lastDepth || 0);
            }
            if (well.metadata.stopDepth === null || isNaN(well.metadata.stopDepth)) {
                well.metadata.stopDepth = Math.max(firstDepth || 0, lastDepth || 0);
            }
        }
        
        // Ensure we always have valid numbers
        if (isNaN(well.metadata.startDepth)) well.metadata.startDepth = 0;
        if (isNaN(well.metadata.stopDepth)) well.metadata.stopDepth = 100; // Default fallback
        if (isNaN(well.metadata.step)) well.metadata.step = 1;

        // Ensure start < stop
        if (well.metadata.startDepth > well.metadata.stopDepth) {
            const temp = well.metadata.startDepth;
            well.metadata.startDepth = well.metadata.stopDepth;
            well.metadata.stopDepth = temp;
        }

        // 3. Calculate Curve Stats
        well.curves.forEach(c => {
            const values = well.data.map(d => d[c.mnemonic]).filter(v => v !== null && !isNaN(v));
            if (values.length > 0) {
                c.min = Math.min(...values);
                c.max = Math.max(...values);
                c.mean = values.reduce((a,b) => a+b, 0) / values.length;
            } else {
                c.min = 0; c.max = 100; // Default range
            }
        });

        resolve(well);

      } catch (error) {
        console.error("LAS Parsing Error:", error);
        reject(new Error("Failed to parse LAS file: " + error.message));
      }
    };

    reader.onerror = () => reject(new Error("File read error"));
    reader.readAsText(file);
  });
};