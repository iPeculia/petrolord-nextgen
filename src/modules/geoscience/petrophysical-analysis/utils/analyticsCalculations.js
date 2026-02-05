import * as math from 'mathjs';

/**
 * Calculates basic statistics for a data array ignoring nulls/NaNs
 */
export const calculateStatistics = (data) => {
  if (!data || data.length === 0) return null;
  
  const validData = data.filter(v => v !== null && v !== undefined && !isNaN(v));
  if (validData.length === 0) return null;

  const sorted = [...validData].sort((a, b) => a - b);
  const mean = math.mean(validData);
  const stdDev = math.std(validData);
  
  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    mean: mean,
    median: math.median(validData),
    stdDev: stdDev,
    count: validData.length,
    p10: sorted[Math.floor(validData.length * 0.1)],
    p90: sorted[Math.floor(validData.length * 0.9)],
    variance: math.variance(validData)
  };
};

/**
 * Generates histogram buckets for data
 */
export const generateHistogramData = (data, buckets = 20) => {
  if (!data || data.length === 0) return [];
  
  const validData = data.filter(v => v !== null && !isNaN(v));
  if (validData.length === 0) return [];

  const min = Math.min(...validData);
  const max = Math.max(...validData);
  const range = max - min;
  const step = range / buckets;
  
  const histogram = Array(buckets).fill(0).map((_, i) => ({
    binStart: min + (i * step),
    binEnd: min + ((i + 1) * step),
    count: 0,
    label: `${(min + (i * step)).toFixed(2)} - ${(min + ((i + 1) * step)).toFixed(2)}`
  }));

  validData.forEach(val => {
    const binIndex = Math.min(Math.floor((val - min) / step), buckets - 1);
    if (binIndex >= 0) histogram[binIndex].count++;
  });

  return histogram;
};

/**
 * Calculates Pearson correlation coefficient between two arrays
 */
export const calculateCorrelation = (arr1, arr2) => {
  if (!arr1 || !arr2 || arr1.length !== arr2.length) return 0;
  
  const pairs = arr1.map((val, i) => [val, arr2[i]])
                    .filter(p => p[0] !== null && p[1] !== null && !isNaN(p[0]) && !isNaN(p[1]));
  
  if (pairs.length < 2) return 0;

  const x = pairs.map(p => p[0]);
  const y = pairs.map(p => p[1]);
  
  // Simple manual implementation to avoid heavy dependency overhead for one func if mathjs fails
  const n = pairs.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = pairs.reduce((a, b) => a + (b[0] * b[1]), 0);
  const sumX2 = x.reduce((a, b) => a + (b * b), 0);
  const sumY2 = y.reduce((a, b) => a + (b * b), 0);

  const numerator = (n * sumXY) - (sumX * sumY);
  const denominator = Math.sqrt(((n * sumX2) - (sumX * sumX)) * ((n * sumY2) - (sumY * sumY)));

  return denominator === 0 ? 0 : numerator / denominator;
};

/**
 * Detects anomalies using Z-Score method
 */
export const detectAnomalies = (data, depths, threshold = 2.5) => {
  const stats = calculateStatistics(data);
  if (!stats) return [];

  const anomalies = [];
  data.forEach((val, idx) => {
    if (val !== null && !isNaN(val)) {
      const zScore = Math.abs((val - stats.mean) / stats.stdDev);
      if (zScore > threshold) {
        anomalies.push({
          depth: depths[idx],
          value: val,
          zScore,
          type: val > stats.mean ? 'High' : 'Low'
        });
      }
    }
  });
  return anomalies;
};

/**
 * Petrophysical Calculations
 */
export const petrophysics = {
  // Density Porosity: phi = (rho_ma - rho_b) / (rho_ma - rho_fl)
  calculatePorosity: (rhoB, rhoMa = 2.65, rhoFl = 1.0) => {
    if (!rhoB) return null;
    return (rhoMa - rhoB) / (rhoMa - rhoFl);
  },

  // Archie's Saturation: Sw = ((a * Rw) / (phi^m * Rt)) ^ (1/n)
  calculateWaterSaturation: (phi, Rt, Rw = 0.1, a = 1, m = 2, n = 2) => {
    if (!phi || !Rt || phi <= 0 || Rt <= 0) return null;
    const term = (a * Rw) / (Math.pow(phi, m) * Rt);
    const Sw = Math.pow(term, 1/n);
    return Math.min(Math.max(Sw, 0), 1); // Clamp between 0 and 1
  },

  // Permeability (Timur-Coates estimate): k = (10000 * phi^4.4) / Sw_irr^2 
  // Simplified version often used: k = C * phi^e
  calculatePermeability: (phi, multiplier = 100000, exponent = 4.4) => {
    if (!phi || phi <= 0) return 0;
    return multiplier * Math.pow(phi, exponent);
  },
  
  // Shale Volume (Gamma Ray Index): Vsh = (GR - GRmin) / (GRmax - GRmin)
  calculateVsh: (gr, grMin = 10, grMax = 150) => {
    if (gr === null || gr === undefined) return null;
    const vsh = (gr - grMin) / (grMax - grMin);
    return Math.min(Math.max(vsh, 0), 1);
  }
};