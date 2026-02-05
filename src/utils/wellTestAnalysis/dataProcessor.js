import { smoothDataSMA } from './smoothing';

export const processImportedData = (rawData, mapping) => {
    // Map columns to standard format
    // Mapping: { time: 'CSV_Col_Time', pressure: 'CSV_Col_Pres', rate: 'CSV_Col_Rate' }
    
    const processed = rawData.map((row, idx) => ({
        id: idx,
        time: parseFloat(row[mapping.time]),
        pressure: parseFloat(row[mapping.pressure]),
        rate: mapping.rate ? parseFloat(row[mapping.rate]) : 0,
        // Keep original for reference if needed
        _original: row
    })).filter(item => 
        !isNaN(item.time) && !isNaN(item.pressure)
    ).sort((a, b) => a.time - b.time); // Ensure sorted by time

    return processed;
};

export const applyProcessing = (data, options = {}) => {
    let result = [...data];

    // 1. Exclusion (Bad Intervals)
    if (options.exclusions && options.exclusions.length > 0) {
        result = result.filter(point => {
            return !options.exclusions.some(range => point.time >= range.start && point.time <= range.end);
        });
    }

    // 2. Smoothing
    if (options.smoothing && options.smoothing.enabled) {
        result = smoothDataSMA(result, 'pressure', options.smoothing.windowSize || 5);
        // Rename smoothed key back to pressure for plotting simplicity, or keep distinct?
        // Usually we want to plot smoothed on top. Let's keep distinct 'pressure_smoothed' property from utility.
    }

    return result;
};