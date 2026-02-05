import { calculateRate } from './DeclineModels';

/**
 * Calculates R-squared
 */
export const calculateR2 = (actual, predicted) => {
    if (!actual || !predicted || actual.length !== predicted.length || actual.length === 0) return 0;

    const mean = actual.reduce((a, b) => a + b, 0) / actual.length;
    const ssTot = actual.reduce((a, b) => a + Math.pow(b - mean, 2), 0);
    const ssRes = actual.reduce((a, b, i) => a + Math.pow(b - predicted[i], 2), 0);

    // If ssTot is 0 (all values same), R2 is undefined/0
    return ssTot === 0 ? 0 : 1 - (ssRes / ssTot);
};

/**
 * Root Mean Square Error
 */
export const calculateRMSE = (actual, predicted) => {
    if (!actual || !predicted || actual.length === 0) return 0;
    const mse = actual.reduce((a, b, i) => a + Math.pow(b - predicted[i], 2), 0) / actual.length;
    return Math.sqrt(mse);
};

/**
 * Main fitting function using a hybrid Grid Search + Hill Climbing approach.
 * This is robust for the small number of parameters (3) in DCA without needing heavy external deps.
 * 
 * data: Array of { t (days), q (rate) }
 * modelType: 'exponential', 'hyperbolic', 'harmonic'
 * constraints: { minB, maxB, minDi, maxDi }
 */
export const fitDecline = (data, modelType, constraints = {}) => {
    // 1. Data Prep
    const tValues = data.map(d => d.t);
    const qValues = data.map(d => d.q);
    const n = data.length;

    if (n < 3) throw new Error("Not enough data points to fit model.");

    // Initial Estimates
    const maxRate = Math.max(...qValues);
    const firstRate = qValues[0];
    const lastRate = qValues[n - 1];
    const duration = tValues[n - 1] - tValues[0];
    
    // Rough Di estimate: ln(qi/qf) / t
    // Rough Di is Annualized for the params
    const roughDiDaily = duration > 0 ? Math.log(Math.max(firstRate, 1) / Math.max(lastRate, 1)) / duration : 0.001;
    let roughDiAnnual = roughDiDaily * 365.0;
    // Clamp initial guess
    roughDiAnnual = Math.max(0.01, Math.min(2.0, roughDiAnnual));

    // Constraints Defaults
    const minB = constraints.minB !== undefined ? constraints.minB : 0;
    const maxB = constraints.maxB !== undefined ? constraints.maxB : 1.5;
    const minDi = constraints.minDi !== undefined ? constraints.minDi : 0.01;
    const maxDi = constraints.maxDi !== undefined ? constraints.maxDi : 5.0;

    // Helper to clamp
    const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

    // 2. Define Search Grid
    let bSteps = [];
    if (modelType === 'exponential') bSteps = [0];
    else if (modelType === 'harmonic') bSteps = [1];
    else {
        // Hyperbolic grid
        bSteps = [0, 0.2, 0.4, 0.5, 0.6, 0.8, 1.0, 1.2, 1.5].filter(v => v >= minB && v <= maxB);
        if (bSteps.length === 0) bSteps = [(minB + maxB)/2];
    }

    const DiSteps = [0.05, 0.1, 0.2, 0.4, 0.6, 0.9, 1.5, 2.5].filter(v => v >= minDi && v <= maxDi);
    // Add current rough estimate to steps
    DiSteps.push(clamp(roughDiAnnual, minDi, maxDi));

    const qiSteps = [maxRate * 0.8, maxRate * 0.9, maxRate, maxRate * 1.1, maxRate * 1.2];

    let bestFit = { 
        params: { qi: maxRate, Di: roughDiAnnual, b: bSteps[0] }, 
        error: Infinity,
        r2: -Infinity
    };

    // Optimization Objective Function
    const evaluate = (qi, Di, b) => {
        const predicted = tValues.map(t => calculateRate(t, qi, Di, b));
        const error = calculateRMSE(qValues, predicted);
        if (error < bestFit.error) {
            bestFit = {
                params: { qi, Di, b },
                error,
                r2: calculateR2(qValues, predicted),
                predicted
            };
        }
    };

    // Pass 1: Coarse Grid Search
    for (let b of bSteps) {
        for (let Di of DiSteps) {
            for (let qi of qiSteps) {
                evaluate(qi, Di, b);
            }
        }
    }

    // Pass 2: Local Refinement (Hill Climbing)
    // We will refine the best parameters found in Pass 1
    let currentParams = { ...bestFit.params };
    const learningRates = { qi: maxRate * 0.05, Di: 0.05, b: 0.1 };
    const iterations = 100;

    for (let i = 0; i < iterations; i++) {
        // Decay learning rate
        const factor = Math.exp(-i / 30);
        
        ['qi', 'Di', 'b'].forEach(param => {
            // Skip fixed b for expo/harmonic
            if (param === 'b' && (modelType === 'exponential' || modelType === 'harmonic')) return;

            const currentVal = currentParams[param];
            const step = learningRates[param] * factor;

            // Try increasing
            let nextValUp = currentVal + step;
            if (param === 'b') nextValUp = clamp(nextValUp, minB, maxB);
            if (param === 'Di') nextValUp = clamp(nextValUp, minDi, maxDi);
            if (param === 'qi') nextValUp = Math.max(0, nextValUp);

            evaluate(nextValUp, currentParams.Di, currentParams.b);
            if (bestFit.error < currentParams.error) currentParams = { ...bestFit.params };

            // Try decreasing
            let nextValDown = currentVal - step;
            if (param === 'b') nextValDown = clamp(nextValDown, minB, maxB);
            if (param === 'Di') nextValDown = clamp(nextValDown, minDi, maxDi);
            if (param === 'qi') nextValDown = Math.max(0, nextValDown);

            evaluate(nextValDown, currentParams.Di, currentParams.b);
            if (bestFit.error < currentParams.error) currentParams = { ...bestFit.params };
        });
        
        // Update current reference to best found so far
        currentParams = { ...bestFit.params, error: bestFit.error };
    }

    return { ...bestFit, modelType };
};

/**
 * Auto-select best model
 */
export const autoFit = (data, constraints) => {
    const models = ['exponential', 'hyperbolic', 'harmonic'];
    let bestResult = null;

    models.forEach(m => {
        const result = fitDecline(data, m, constraints);
        // Prefer simpler models if R2 is very close (Occam's razor logic could be added here)
        // For now, strict best R2
        if (!bestResult || result.r2 > bestResult.r2) {
            bestResult = { ...result, modelType: m };
        }
    });

    return bestResult;
};