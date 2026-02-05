/**
 * Enhanced LAS (Log ASCII Standard) Parser
 * Supports LAS 2.0 and partial 3.0
 */

export const validateLASFormat = (content) => {
    const lines = content.split('\n');
    const hasVersion = lines.some(line => line.trim().startsWith('~V') || line.trim().startsWith('~Version'));
    const hasWell = lines.some(line => line.trim().startsWith('~W') || line.trim().startsWith('~Well'));
    const hasCurves = lines.some(line => line.trim().startsWith('~C') || line.trim().startsWith('~Curve'));
    const hasData = lines.some(line => line.trim().startsWith('~A') || line.trim().startsWith('~Ascii'));

    const errors = [];
    if (!hasVersion) errors.push("Missing ~Version section");
    if (!hasWell) errors.push("Missing ~Well section");
    if (!hasCurves) errors.push("Missing ~Curve section");
    if (!hasData) errors.push("Missing ~Ascii data section");

    return {
        isValid: errors.length === 0,
        errors
    };
};

export const parseLASContent = (content, filename = 'Unknown') => {
    const lines = content.split('\n');
    let section = null;
    
    const curves = [];
    const data = [];
    const metadata = {
        well: {},
        params: {}
    };

    // Helper to clean LAS lines (remove comments)
    const cleanLine = (line) => {
        const commentIdx = line.indexOf('#');
        if (commentIdx !== -1) return line.substring(0, commentIdx).trim();
        return line.trim();
    };

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line || line.startsWith('#')) continue;

        // Detect Section Headers
        if (line.startsWith('~')) {
            const sectionChar = line.charAt(1).toUpperCase();
            if (sectionChar === 'V') section = 'VERSION';
            else if (sectionChar === 'W') section = 'WELL';
            else if (sectionChar === 'P') section = 'PARAMETER';
            else if (sectionChar === 'C') section = 'CURVE';
            else if (sectionChar === 'A') section = 'ASCII';
            else section = 'OTHER';
            continue;
        }

        if (section === 'ASCII') {
            // Data parsing - handle multiple delimiters (space, tab, comma)
            const values = line.split(/\s+/).map(v => parseFloat(v));
            // Filter out NaNs resulting from empty splits
            const cleanValues = values.filter(v => !isNaN(v));
            if (cleanValues.length > 0) {
                data.push(cleanValues);
            }
            continue;
        }

        // Parse Header Lines: MNEM .UNIT DATA : DESC
        // Regex matches: Mnemonic .Unit Value : Description
        const match = line.match(/^([^.]+)\s*\.([^\s]*)\s*(.*):(.*)$/);
        
        if (match) {
            const mnem = match[1].trim();
            const unit = match[2].trim();
            const value = match[3].trim();
            const desc = match[4].trim();

            if (section === 'WELL') {
                metadata.well[mnem] = value;
            } else if (section === 'PARAMETER') {
                metadata.params[mnem] = value;
            } else if (section === 'CURVE') {
                curves.push({ name: mnem, unit, desc });
            }
        } else {
            // Fallback for lines that don't match strict LAS format (rare but happens)
            if (section === 'CURVE') {
                const parts = line.split(':');
                if(parts.length > 0) {
                    const def = parts[0].trim().split(/\s+/);
                    if(def.length > 0) {
                         curves.push({ name: def[0], unit: '', desc: parts[1] || '' });
                    }
                }
            }
        }
    }

    // Validate data structure
    if (curves.length === 0) throw new Error("No curves found in LAS file");
    if (data.length === 0) throw new Error("No data points found in LAS file");

    // Transpose data: Row-based to Column-based (Log-based)
    const logs = {};
    const depthIndex = 0; // Assumption: First curve is depth (standard LAS)
    
    // Initialize logs
    curves.forEach(c => {
        logs[c.name] = {
            values: [],
            unit: c.unit,
            description: c.desc
        };
    });

    // Populate logs
    const depthValues = [];
    data.forEach(row => {
        if (row.length >= curves.length) {
            row.forEach((val, idx) => {
                // Handle null values (often -999.25 in LAS)
                const cleanVal = (val === -999.25) ? null : val;
                if (curves[idx]) {
                    logs[curves[idx].name].values.push(cleanVal);
                }
            });
            depthValues.push(row[depthIndex]);
        }
    });

    // Attach depth array to all logs for easier plotting later
    Object.keys(logs).forEach(key => {
        logs[key].depth = depthValues;
    });

    // Extract useful metadata for well creation
    const wellInfo = {
        name: metadata.well['WELL'] || filename.replace(/\.[^/.]+$/, ""),
        operator: metadata.well['COMP'] || '',
        field: metadata.well['FLD'] || '',
        location: metadata.well['LOC'] || '',
        country: metadata.well['CTRY'] || '',
        state: metadata.well['STAT'] || '',
        serviceCompany: metadata.well['SRVC'] || '',
        date: metadata.well['DATE'] || ''
    };

    return {
        wellInfo,
        curves,
        logs,
        metadata,
        stats: {
            curveCount: curves.length,
            dataPoints: data.length,
            depthMin: Math.min(...depthValues),
            depthMax: Math.max(...depthValues)
        }
    };
};