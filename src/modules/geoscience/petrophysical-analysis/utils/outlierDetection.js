import { mean, std, min, max } from 'mathjs'; // Assuming mathjs might be available or we implement simple stats

// Simple stats implementation since mathjs might not be in package.json
const getMean = (data) => data.reduce((a, b) => a + b, 0) / data.length;

const getStd = (data, meanVal) => {
    const squareDiffs = data.map(value => Math.pow(value - meanVal, 2));
    const avgSquareDiff = getMean(squareDiffs);
    return Math.sqrt(avgSquareDiff);
};

export const detectOutliers = (data, thresholdSigma = 3) => {
    const cleanData = data.filter(d => d !== null && d !== undefined && !isNaN(d));
    if (cleanData.length === 0) return { hasOutliers: false, count: 0, indices: [], stats: {} };

    const meanVal = getMean(cleanData);
    const stdVal = getStd(cleanData, meanVal);
    
    const lowerBound = meanVal - (thresholdSigma * stdVal);
    const upperBound = meanVal + (thresholdSigma * stdVal);

    const outlierIndices = [];
    
    data.forEach((val, index) => {
        if (val !== null && !isNaN(val)) {
            if (val < lowerBound || val > upperBound) {
                outlierIndices.push(index);
            }
        }
    });

    return {
        hasOutliers: outlierIndices.length > 0,
        count: outlierIndices.length,
        indices: outlierIndices,
        stats: {
            mean: meanVal,
            std: stdVal,
            min: Math.min(...cleanData),
            max: Math.max(...cleanData),
            lowerBound,
            upperBound
        }
    };
};