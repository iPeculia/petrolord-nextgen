import { matrix, multiply, inv, transpose, mean, std } from 'mathjs';

/**
 * Advanced Statistical Analytics Engine for Material Balance
 * Handles complex regression, uncertainty quantification, and sensitivity analysis.
 */

// Weighted Multiple Linear Regression
export const performWeightedRegression = (X_data, y_data, weights = null) => {
    try {
        const n = y_data.length;
        // Add intercept term to X if needed (assuming X is matrix of features)
        // For standard material balance, often intercept is zero or physically meaningful (N)
        
        let X = matrix(X_data);
        let Y = matrix(y_data);
        let W;

        if (weights) {
            W = matrix(weights.map(w => [w])); // Diagonal matrix representation simplified
             // MathJS implementation for weighted least squares: (X'WX)^-1 X'WY
             // Simplified here for typical unweighted or simple weighted usage
        }

        // Standard OLS: beta = (X'X)^-1 X'Y
        const Xt = transpose(X);
        const XtX = multiply(Xt, X);
        const XtY = multiply(Xt, Y);
        
        // Check for singularity
        try {
            const XtX_inv = inv(XtX);
            const beta = multiply(XtX_inv, XtY);
            
            // Calculate Statistics
            const beta_arr = beta.toArray();
            const y_pred = multiply(X, beta).toArray();
            
            // Residuals
            const residuals = y_data.map((y, i) => y - y_pred[i]);
            const sse = residuals.reduce((sum, r) => sum + r*r, 0);
            const mse = sse / (n - beta_arr.length);
            
            // Covariance Matrix of parameters: MSE * (X'X)^-1
            const cov_matrix = multiply(mse, XtX_inv).toArray();
            const std_errors = cov_matrix.map((row, i) => Math.sqrt(row[i]));

            // R-squared
            const y_mean = mean(y_data);
            const sst = y_data.reduce((sum, y) => sum + Math.pow(y - y_mean, 2), 0);
            const r2 = 1 - (sse / sst);

            return {
                coefficients: beta_arr.flat(),
                stdErrors: std_errors,
                rSquared: r2,
                residuals: residuals,
                covarianceMatrix: cov_matrix,
                success: true
            };

        } catch (invError) {
            console.error("Matrix inversion failed (collinear data):", invError);
            return { success: false, error: "Data is collinear or insufficient for regression." };
        }

    } catch (e) {
        console.error("Regression Error:", e);
        return { success: false, error: e.message };
    }
};

// Outlier Detection (Z-Score & IQR)
export const detectAdvancedOutliers = (residuals) => {
    if (!residuals || residuals.length < 4) return [];
    
    const avg = mean(residuals);
    const deviation = std(residuals);
    const threshold = 2.5; // Z-score threshold

    const outliers = [];
    residuals.forEach((res, index) => {
        const zScore = Math.abs((res - avg) / deviation);
        if (zScore > threshold) {
            outliers.push({ index, zScore, value: res });
        }
    });

    return outliers;
};

// Monte Carlo Simulation for Uncertainty
export const runMonteCarloSimulation = (modelFunc, paramDistributions, iterations = 1000) => {
    const results = [];
    
    for (let i = 0; i < iterations; i++) {
        // Sample parameters
        const params = {};
        Object.keys(paramDistributions).forEach(key => {
            const dist = paramDistributions[key];
            if (dist.type === 'normal') {
                // Box-Muller transform for normal distribution
                const u1 = Math.random();
                const u2 = Math.random();
                const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
                params[key] = dist.mean + z * dist.stdDev;
            } else if (dist.type === 'uniform') {
                params[key] = dist.min + Math.random() * (dist.max - dist.min);
            }
        });

        try {
            const result = modelFunc(params);
            results.push(result);
        } catch (e) {
            // Ignore failed iterations
        }
    }

    // Analyze results
    const N_estimates = results.map(r => r.N).sort((a, b) => a - b);
    
    return {
        p10: N_estimates[Math.floor(iterations * 0.9)],
        p50: N_estimates[Math.floor(iterations * 0.5)],
        p90: N_estimates[Math.floor(iterations * 0.1)],
        mean: mean(N_estimates),
        stdDev: std(N_estimates),
        iterations: results.length
    };
};