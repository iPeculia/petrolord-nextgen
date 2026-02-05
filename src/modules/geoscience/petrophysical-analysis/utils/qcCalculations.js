import { mean, std, median, min, max } from 'mathjs';

/**
 * Calculates basic quality metrics for a dataset
 */
export const calculateDataQualityMetrics = (data, depthArray) => {
  if (!data || data.length === 0) return null;

  const validData = data.filter(d => d !== null && d !== undefined && !isNaN(d));
  const validCount = validData.length;
  const totalCount = data.length;
  
  // 1. Completeness
  const completeness = (validCount / totalCount) * 100;

  // 2. Range Checks
  const negativeValues = validData.filter(d => d < 0).length;
  const negativePercentage = (negativeValues / validCount) * 100;

  // 3. Noise / Spike detection
  let spikes = 0;
  const threshold = std(validData) * 3; 
  for(let i = 1; i < validData.length - 1; i++) {
      const prev = validData[i-1];
      const curr = validData[i];
      const next = validData[i+1];
      if (Math.abs(curr - prev) > threshold && Math.abs(curr - next) > threshold) {
          spikes++;
      }
  }
  
  return {
    validCount,
    totalCount,
    completeness,
    negativeCount: negativeValues,
    negativePercentage,
    spikeCount: spikes,
    min: min(validData),
    max: max(validData),
    mean: mean(validData),
    std: std(validData)
  };
};

/**
 * Detects depth gaps greater than expected step
 */
export const detectDepthGaps = (depthArray) => {
    if (!depthArray || depthArray.length < 2) return { gaps: [], typicalStep: 0 };

    const steps = [];
    for(let i=0; i < Math.min(depthArray.length - 1, 1000); i++) {
        steps.push(Math.abs(depthArray[i+1] - depthArray[i]));
    }
    steps.sort((a,b) => a-b);
    const typicalStep = steps[Math.floor(steps.length / 2)];
    
    const gaps = [];
    const tolerance = typicalStep * 2.1; 

    for (let i = 0; i < depthArray.length - 1; i++) {
        const diff = Math.abs(depthArray[i+1] - depthArray[i]);
        if (diff > tolerance) {
            gaps.push({
                startDepth: depthArray[i],
                endDepth: depthArray[i+1],
                gapSize: diff,
                index: i
            });
        }
    }
    return { gaps, typicalStep };
};

/**
 * Detects statistical outliers using Z-Score or IQR
 */
export const detectOutliers = (data, depthArray, method = 'zscore', threshold = 3) => {
    if (!data || data.length === 0) return [];
    
    const outliers = [];
    const validData = data.filter(v => v !== null && !isNaN(v));
    
    if (method === 'zscore') {
        const avg = mean(validData);
        const deviation = std(validData);
        
        data.forEach((val, idx) => {
            if (val === null || isNaN(val)) return;
            const z = Math.abs((val - avg) / deviation);
            if (z > threshold) {
                outliers.push({
                    depth: depthArray[idx],
                    value: val,
                    score: z,
                    type: 'Statistical Outlier (Z-Score)'
                });
            }
        });
    } else if (method === 'iqr') {
        const sorted = [...validData].sort((a,b) => a - b);
        const q1 = sorted[Math.floor(sorted.length * 0.25)];
        const q3 = sorted[Math.floor(sorted.length * 0.75)];
        const iqr = q3 - q1;
        const lower = q1 - (1.5 * iqr);
        const upper = q3 + (1.5 * iqr);

        data.forEach((val, idx) => {
            if (val === null || isNaN(val)) return;
            if (val < lower || val > upper) {
                 outliers.push({
                    depth: depthArray[idx],
                    value: val,
                    score: Math.abs(val - median(validData)), 
                    type: 'Statistical Outlier (IQR)'
                });
            }
        });
    }

    return outliers;
};

/**
 * Calculates Z-Score Series for plotting
 */
export const calculateZScoreSeries = (data, depthArray) => {
    if (!data || data.length === 0) return [];
    
    const validData = data.filter(v => v !== null && !isNaN(v));
    if (validData.length === 0) return [];

    const avg = mean(validData);
    const deviation = std(validData);
    
    // Downsample for performance if too large
    const step = data.length > 5000 ? Math.floor(data.length / 2000) : 1;

    const series = [];
    for(let i=0; i<data.length; i+=step) {
        const val = data[i];
        if (val !== null && !isNaN(val)) {
            const z = (val - avg) / deviation;
            series.push({
                depth: depthArray[i],
                zScore: z,
                value: val,
                isOutlier: Math.abs(z) > 3 // Default marker, dynamic in UI
            });
        }
    }
    return series;
};

/**
 * Calculates Histogram Data
 */
export const calculateHistogram = (data, bins = 20) => {
    const validData = data.filter(v => v !== null && !isNaN(v));
    if (validData.length === 0) return [];

    const minVal = min(validData);
    const maxVal = max(validData);
    const range = maxVal - minVal;
    const binSize = range / bins;

    const histogram = Array(bins).fill(0).map((_, i) => ({
        binStart: minVal + (i * binSize),
        binEnd: minVal + ((i + 1) * binSize),
        count: 0,
        name: `${(minVal + (i * binSize)).toFixed(1)} - ${(minVal + ((i + 1) * binSize)).toFixed(1)}`
    }));

    validData.forEach(val => {
        const binIndex = Math.min(
            Math.floor((val - minVal) / binSize),
            bins - 1
        );
        if (binIndex >= 0) histogram[binIndex].count++;
    });

    return histogram;
};

export const classifyCurve = (name, unit) => {
    const n = name.toUpperCase();
    
    if (n.includes('GR') || n.includes('GAMMA')) return { type: 'Gamma Ray', expectedMin: 0, expectedMax: 200, unit: 'API' };
    if (n.includes('RHOB') || n.includes('DENS')) return { type: 'Density', expectedMin: 1.5, expectedMax: 3.0, unit: 'g/cc' };
    if (n.includes('NPHI') || n.includes('NEUT')) return { type: 'Neutron', expectedMin: -0.05, expectedMax: 0.6, unit: 'v/v' };
    if (n.includes('DT') || n.includes('SONIC') || n.includes('AC')) return { type: 'Sonic', expectedMin: 40, expectedMax: 140, unit: 'us/ft' };
    if (n.includes('RT') || n.includes('RES') || n.includes('ILD')) return { type: 'Resistivity', expectedMin: 0.1, expectedMax: 2000, unit: 'ohm.m' };
    
    return { type: 'Unknown', expectedMin: -9999, expectedMax: 9999, unit: 'unknown' };
};