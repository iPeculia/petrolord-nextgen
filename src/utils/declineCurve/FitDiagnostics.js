import { calculateRate } from './DeclineModels';

/**
 * Calculate comprehensive diagnostics for a fit
 */
export const calculateDiagnostics = (data, params) => {
    // data: { t, q }
    const n = data.length;
    if (n < 3) return null;

    const { qi, Di, b } = params;
    
    // 1. Calculate fitted values and raw residuals
    const fitted = data.map(d => calculateRate(d.t, qi, Di, b));
    const residuals = data.map((d, i) => d.q - fitted[i]);
    
    // 2. Basic Stats (MSE, RMSE, MAE)
    const mse = residuals.reduce((sum, r) => sum + r*r, 0) / (n - 3); // DoF adjustment (3 params)
    const rmse = Math.sqrt(mse);
    const mae = residuals.reduce((sum, r) => sum + Math.abs(r), 0) / n;

    // 3. R-Squared
    const meanY = data.reduce((sum, d) => sum + d.q, 0) / n;
    const ssTot = data.reduce((sum, d) => sum + Math.pow(d.q - meanY, 2), 0);
    const ssRes = residuals.reduce((sum, r) => sum + r*r, 0);
    const r2 = ssTot === 0 ? 0 : 1 - (ssRes / ssTot);

    // 4. Standardized Residuals & Outliers
    // Estimate std dev of residuals
    const residualStdDev = Math.sqrt(ssRes / (n - 1));
    const stdResiduals = residuals.map(r => residualStdDev > 0 ? r / residualStdDev : 0);

    const outliers = [];
    stdResiduals.forEach((sr, i) => {
        if (Math.abs(sr) > 2.5) { // Threshold for outlier
            outliers.push({ 
                index: i, 
                t: data[i].t, 
                q: data[i].q, 
                fitted: fitted[i],
                residual: residuals[i], 
                stdResidual: sr 
            });
        }
    });

    // 5. Information Criteria (AIC/BIC)
    // Simplified formulae for least squares
    const k = 3; // number of parameters
    const aic = n * Math.log(ssRes / n) + 2 * k;
    const bic = n * Math.log(ssRes / n) + k * Math.log(n);

    return {
        fitted,
        residuals,
        stdResiduals,
        rmse,
        mae,
        r2,
        aic,
        bic,
        outliers,
        n
    };
};

export const getFitQualityLabel = (r2) => {
    if (r2 >= 0.90) return { label: 'Good', color: 'text-green-500', badge: 'bg-green-500/10 text-green-500 border-green-500/20' };
    if (r2 >= 0.70) return { label: 'Fair', color: 'text-amber-500', badge: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
    return { label: 'Poor', color: 'text-red-500', badge: 'bg-red-500/10 text-red-500 border-red-500/20' };
};