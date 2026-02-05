import { mean, std } from 'mathjs';

// Advanced Regression with confidence intervals
export const performAdvancedRegression = (xData, yData, confidenceLevel = 0.95) => {
    if (!xData || !yData || xData.length !== yData.length || xData.length < 3) {
        return null;
    }

    const n = xData.length;
    const xMean = mean(xData);
    const yMean = mean(yData);

    let s_xy = 0;
    let s_xx = 0;
    
    for (let i = 0; i < n; i++) {
        s_xy += (xData[i] - xMean) * (yData[i] - yMean);
        s_xx += (xData[i] - xMean) ** 2;
    }

    const slope = s_xx === 0 ? 0 : s_xy / s_xx;
    const intercept = yMean - slope * xMean;

    // Residuals and Error
    let sse = 0;
    let sst = 0;
    const residuals = [];

    for (let i = 0; i < n; i++) {
        const yPred = slope * xData[i] + intercept;
        const res = yData[i] - yPred;
        residuals.push(res);
        sse += res ** 2;
        sst += (yData[i] - yMean) ** 2;
    }

    const mse = sse / (n - 2);
    const stdError = Math.sqrt(mse);
    const r2 = sst === 0 ? 0 : 1 - (sse / sst);

    // Standard Error of Slope
    const seSlope = Math.sqrt(mse / s_xx);
    
    // T-Critical (approx for >30 samples or use lookup)
    const tCrit = 1.96; // 95% approx
    
    const slopeConfInterval = [
        slope - tCrit * seSlope,
        slope + tCrit * seSlope
    ];

    return {
        slope,
        intercept,
        r2,
        stdError,
        seSlope,
        slopeConfInterval,
        residuals,
        n
    };
};

// Z-Score Outlier Detection
export const detectOutliersZScore = (data, threshold = 2.0) => {
    if (data.length < 4) return [];
    
    const avg = mean(data);
    const dev = std(data);
    
    if (dev === 0) return [];

    const outliers = [];
    data.forEach((val, idx) => {
        const z = Math.abs((val - avg) / dev);
        if (z > threshold) {
            outliers.push({ index: idx, value: val, zScore: z });
        }
    });

    return outliers;
};