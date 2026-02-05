/**
 * Robust well data parser for CSV, Excel, JSON, and LAS files.
 * Ensures compatibility with Petrophysical Analysis module.
 */
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { parseLASContent, validateLASFormat } from './lasParser';

export const parseWellData = async (file) => {
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();

    if (fileExtension === 'las') {
        return await parseLAS(file);
    } else if (fileExtension === 'csv' || fileExtension === 'txt') {
        return await parseCSV(file);
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        return await parseXLSX(file);
    } else if (fileExtension === 'json') {
        return await parseJSON(file);
    } else {
        throw new Error(`Unsupported file format: .${fileExtension}`);
    }
};

const parseLAS = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                // Reuse existing LAS parser logic for consistency
                const validation = validateLASFormat(content);
                if (!validation.isValid) {
                     throw new Error("Invalid LAS format: " + validation.errors.join(', '));
                }
                const parsed = parseLASContent(content, file.name);
                
                // Adapt to unified structure
                resolve({
                    name: parsed.wellInfo.name,
                    metadata: {
                        operator: parsed.wellInfo.operator,
                        field: parsed.wellInfo.field,
                        location: parsed.wellInfo.location,
                        country: parsed.wellInfo.country,
                        state: parsed.wellInfo.state
                    },
                    logs: parsed.logs,
                    curves: parsed.curves.map(c => c.name),
                    depth: {
                        min: parsed.stats.depthMin,
                        max: parsed.stats.depthMax
                    }
                });
            } catch (err) {
                reject(new Error("Failed to parse LAS file: " + err.message));
            }
        };
        reader.onerror = () => reject(new Error("File reading failed"));
        reader.readAsText(file);
    });
};

const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.errors.length > 0) {
                    reject(new Error("CSV parsing error: " + results.errors[0].message));
                    return;
                }

                const data = results.data;
                const fields = results.meta.fields;
                
                if (!fields || fields.length < 2) {
                    reject(new Error("CSV must have at least 2 columns (Depth and one curve)."));
                    return;
                }

                // Identify depth column
                const depthCol = fields.find(f => 
                    ['depth', 'md', 'tvd', 'dept'].includes(f.toLowerCase())
                );
                
                if (!depthCol) {
                    reject(new Error("Could not identify a 'Depth' column (e.g., Depth, MD, TVD)."));
                    return;
                }

                const depthValues = data.map(row => row[depthCol]).filter(v => v !== null && v !== undefined && !isNaN(v));
                const logs = {};

                fields.forEach(field => {
                    if (field !== depthCol) {
                        const values = data.map(row => {
                            const v = row[field];
                            return (typeof v === 'number') ? v : null;
                        });
                        logs[field] = {
                            values: values,
                            depth: depthValues,
                            unit: '', 
                            description: 'Imported from CSV'
                        };
                    }
                });

                resolve({
                    name: file.name.replace(/\.[^/.]+$/, ""),
                    metadata: {},
                    logs: logs,
                    curves: Object.keys(logs),
                    depth: {
                        min: Math.min(...depthValues),
                        max: Math.max(...depthValues)
                    }
                });
            },
            error: (err) => reject(err)
        });
    });
};

const parseXLSX = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                
                // Assume first sheet
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                
                // Convert to JSON
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                
                if (jsonData.length === 0) throw new Error("Excel file appears empty.");
                
                const fields = Object.keys(jsonData[0]);
                 // Identify depth column
                const depthCol = fields.find(f => 
                    ['depth', 'md', 'tvd', 'dept'].includes(f.toLowerCase())
                );
                
                if (!depthCol) {
                    throw new Error("Could not identify a 'Depth' column in Excel sheet.");
                }

                const depthValues = jsonData.map(row => row[depthCol]).filter(v => typeof v === 'number');
                const logs = {};

                fields.forEach(field => {
                    if (field !== depthCol) {
                        const values = jsonData.map(row => {
                            const v = row[field];
                             return (typeof v === 'number') ? v : null;
                        });
                        logs[field] = {
                            values: values,
                            depth: depthValues,
                            unit: '',
                            description: 'Imported from Excel'
                        };
                    }
                });

                resolve({
                    name: file.name.replace(/\.[^/.]+$/, ""),
                    metadata: {},
                    logs: logs,
                    curves: Object.keys(logs),
                    depth: {
                         min: Math.min(...depthValues),
                         max: Math.max(...depthValues)
                    }
                });
            } catch (err) {
                reject(new Error("Excel parsing failed: " + err.message));
            }
        };
        reader.readAsArrayBuffer(file);
    });
};

const parseJSON = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target.result);
                // Expects specific structure or simple array of objects
                let processedData = null;
                
                if (Array.isArray(json)) {
                    // Array of row objects
                    const fields = Object.keys(json[0]);
                    const depthCol = fields.find(f => ['depth', 'md'].includes(f.toLowerCase()));
                    if(!depthCol) throw new Error("No depth column found in JSON array.");
                    
                    const depthValues = json.map(row => row[depthCol]);
                    const logs = {};
                    fields.forEach(field => {
                        if (field !== depthCol) {
                             logs[field] = {
                                 values: json.map(row => row[field]),
                                 depth: depthValues,
                                 unit: ''
                             };
                        }
                    });
                    processedData = { logs, depthValues };
                } else if (json.logs && json.depth) {
                    // Structured format
                    processedData = { logs: json.logs, depthValues: json.depth };
                } else {
                     throw new Error("Unrecognized JSON structure.");
                }

                if (!processedData) throw new Error("Failed to process JSON.");

                resolve({
                    name: file.name.replace(/\.[^/.]+$/, ""),
                    metadata: json.metadata || {},
                    logs: processedData.logs,
                    curves: Object.keys(processedData.logs),
                    depth: {
                         min: Math.min(...processedData.depthValues),
                         max: Math.max(...processedData.depthValues)
                    }
                });
            } catch (err) {
                reject(new Error("JSON parsing failed: " + err.message));
            }
        };
        reader.readAsText(file);
    });
};