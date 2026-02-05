import * as math from 'mathjs';

export const AnalysisUtils = {
    // --- Statistical Calculations ---
    mean: (data) => math.mean(data),
    std: (data) => math.std(data),
    
    calculatePercentiles: (data) => {
        if (!data || data.length === 0) return { P90: 0, P50: 0, P10: 0 };
        const sorted = [...data].sort((a, b) => a - b);
        const p10Index = Math.floor(sorted.length * 0.9); // High case (P10 volume is small probability of EXCEEDING, wait. standard oilfield: P90 is conservative (small volume), P10 is optimistic (large volume).
        // Actually, typically:
        // P90: 90% probability of being met or exceeded (Conservative, Smaller Value)
        // P50: Median
        // P10: 10% probability of being met or exceeded (Optimistic, Larger Value)
        // Let's align with that standard.
        
        return {
            P90: sorted[Math.floor(sorted.length * 0.1)], 
            P50: sorted[Math.floor(sorted.length * 0.5)],
            P10: sorted[Math.floor(sorted.length * 0.9)],
            min: sorted[0],
            max: sorted[sorted.length - 1]
        };
    },

    calculateHistogram: (data, bins = 20) => {
        if (!data || data.length === 0) return [];
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min;
        const binSize = range / bins;
        
        const histogram = new Array(bins).fill(0).map((_, i) => ({
            binStart: min + i * binSize,
            binEnd: min + (i + 1) * binSize,
            mid: min + (i + 0.5) * binSize,
            frequency: 0
        }));

        data.forEach(val => {
            let binIndex = Math.floor((val - min) / binSize);
            if (binIndex >= bins) binIndex = bins - 1;
            histogram[binIndex].frequency++;
        });

        return histogram;
    },

    // --- Random Number Generation ---
    // Box-Muller transform for Normal distribution
    randomNormal: (mean = 0, stdDev = 1) => {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return mean + z * stdDev;
    },

    randomLognormal: (mean, stdDev) => {
        // Input mean/stdDev are for the underlying normal distribution usually, 
        // or the target lognormal. Assuming target parameters here for simplicity:
        // converting target mean/std to mu/sigma of underlying normal
        const sigma2 = Math.log((stdDev*stdDev)/(mean*mean) + 1);
        const mu = Math.log(mean) - 0.5 * sigma2;
        const sigma = Math.sqrt(sigma2);
        return Math.exp(AnalysisUtils.randomNormal(mu, sigma));
    },

    randomTriangular: (min, mode, max) => {
        const u = Math.random();
        const F = (mode - min) / (max - min);
        if (u <= F) {
            return min + Math.sqrt(u * (max - min) * (mode - min));
        } else {
            return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
        }
    },

    // --- Correlation Handling ---
    // Simple Cholesky decomposition for generating correlated normals
    // Uses mathjs for matrix operations
    generateCorrelatedSamples: (means, stdDevs, correlationMatrix, nSamples) => {
        const nVars = means.length;
        
        // 1. Create covariance matrix
        const covarianceMatrix = math.zeros(nVars, nVars).toArray();
        for (let i = 0; i < nVars; i++) {
            for (let j = 0; j < nVars; j++) {
                covarianceMatrix[i][j] = correlationMatrix[i][j] * stdDevs[i] * stdDevs[j];
            }
        }

        // 2. Cholesky Decomposition (L * L^T = Sigma)
        // MathJS doesn't have direct Cholesky for JS arrays easily accessible in all versions, manual implementation:
        const L = math.zeros(nVars, nVars).toArray();
        for (let i = 0; i < nVars; i++) {
            for (let j = 0; j <= i; j++) {
                let sum = 0;
                for (let k = 0; k < j; k++) {
                    sum += L[i][k] * L[j][k];
                }
                if (i === j) {
                    L[i][j] = Math.sqrt(Math.max(0, covarianceMatrix[i][i] - sum));
                } else {
                    L[i][j] = (1.0 / L[j][j] * (covarianceMatrix[i][j] - sum));
                }
            }
        }

        // 3. Generate uncorrelated standard normals
        const samples = [];
        for (let k = 0; k < nSamples; k++) {
            const z = Array(nVars).fill(0).map(() => AnalysisUtils.randomNormal(0, 1));
            // 4. Apply correlation: x = mu + L * z
            const x = means.map((mu, i) => {
                let dot = 0;
                for(let j=0; j<=i; j++) dot += L[i][j] * z[j];
                return mu + dot; // This is simplified; usually just correlated Z then transform to specific dist
            });
            samples.push(x);
        }
        return samples;
    }
};