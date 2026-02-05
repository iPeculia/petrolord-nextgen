/**
 * Calculates basic statistics for an array of numbers.
 * @param {number[]} data - Array of numerical values
 * @returns {Object} Statistics object { count, mean, std, min, max }
 */
export const calculateStatistics = (data) => {
    if (!data || data.length === 0) {
        return { count: 0, mean: 0, std: 0, min: 0, max: 0 };
    }

    const n = data.length;
    const sum = data.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    
    // Standard Deviation
    const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
    const std = Math.sqrt(variance);

    return {
        count: n,
        mean: parseFloat(mean.toFixed(2)),
        std: parseFloat(std.toFixed(2)),
        min: parseFloat(Math.min(...data).toFixed(2)),
        max: parseFloat(Math.max(...data).toFixed(2))
    };
};

/**
 * Generates histogram bins and counts.
 * @param {number[]} data - Array of numerical values
 * @param {number} binCount - Number of bins
 * @returns {Array} Array of bin objects { binStart, binEnd, binLabel, count }
 */
export const calculateHistogram = (data, binCount = 20) => {
    if (!data || data.length === 0) return [];

    const minVal = Math.min(...data);
    const maxVal = Math.max(...data);
    
    if (minVal === maxVal) return [{ binStart: minVal, binEnd: maxVal, binLabel: minVal.toString(), count: data.length }];

    const range = maxVal - minVal;
    const binWidth = range / binCount;
    
    const bins = Array(binCount).fill(0).map((_, i) => ({
        binStart: minVal + i * binWidth,
        binEnd: minVal + (i + 1) * binWidth,
        binLabel: (minVal + i * binWidth + binWidth / 2).toFixed(2), // Center of bin as label
        count: 0
    }));

    data.forEach(val => {
        let binIndex = Math.floor((val - minVal) / binWidth);
        if (binIndex >= binCount) binIndex = binCount - 1; // Handle max value case
        if (binIndex < 0) binIndex = 0;
        bins[binIndex].count++;
    });

    return bins;
};

/**
 * Calculates linear regression (least squares).
 * @param {number[]} x - Array of x values
 * @param {number[]} y - Array of y values
 * @returns {Object} Regression object { slope, intercept, r2 }
 */
export const calculateRegression = (x, y) => {
    if (!x || !y || x.length !== y.length || x.length === 0) {
        return { slope: 0, intercept: 0, r2: 0 };
    }

    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // R-squared calculation
    const meanY = sumY / n;
    const ssTot = y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0);
    const ssRes = y.reduce((sum, yi, i) => {
        const yPred = slope * x[i] + intercept;
        return sum + Math.pow(yi - yPred, 2);
    }, 0);
    
    const r2 = ssTot === 0 ? 0 : 1 - (ssRes / ssTot);

    return {
        slope,
        intercept,
        r2
    };
};