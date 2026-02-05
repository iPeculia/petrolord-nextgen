/**
 * Utilities for Petrophysical Porosity Calculations and Statistical Metrics
 */

// Calculate Density Porosity
// phi = (rho_matrix - rho_log) / (rho_matrix - rho_fluid)
export const calculateDensityPorosity = (rho, rhoMa, rhoFl) => {
    if (rho === null || rho === undefined || rhoMa === null || rhoFl === null) return null;
    
    // Avoid division by zero
    if (Math.abs(rhoMa - rhoFl) < 0.0001) return 0;

    const phi = (rhoMa - rho) / (rhoMa - rhoFl);
    // Clamp reasonable physical limits (0 to 100% porosity, though > 0.5 is rare)
    return Math.min(Math.max(phi, 0), 1); 
};

// Calculate Sonic Porosity (Wyllie Time Average)
// phi = (dt_log - dt_matrix) / (dt_fluid - dt_matrix)
export const calculateSonicPorosity = (dt, dtMa, dtFl) => {
    if (dt === null || dt === undefined || dtMa === null || dtFl === null) return null;

    // Avoid division by zero
    if (Math.abs(dtFl - dtMa) < 0.0001) return 0;

    const phi = (dt - dtMa) / (dtFl - dtMa);
    return Math.min(Math.max(phi, 0), 1);
};

// Calculate R-Squared (Coefficient of Determination)
export const calculateR2 = (predicted, actual) => {
    if (!predicted || !actual || !predicted.length || !actual.length || predicted.length !== actual.length) return 0;
    
    const n = predicted.length;
    const meanActual = actual.reduce((a, b) => a + b, 0) / n;
    
    const ssTot = actual.reduce((a, b) => a + Math.pow(b - meanActual, 2), 0);
    const ssRes = actual.reduce((a, b, i) => a + Math.pow(b - predicted[i], 2), 0);
    
    if (ssTot === 0) return 0; // Avoid division by zero if variance is 0
    
    return 1 - (ssRes / ssTot);
};

// Calculate RMSE (Root Mean Square Error)
export const calculateRMSE = (predicted, actual) => {
    if (!predicted || !actual || !predicted.length || predicted.length !== actual.length) return 0;
    
    const mse = predicted.reduce((a, b, i) => a + Math.pow(b - actual[i], 2), 0) / predicted.length;
    return Math.sqrt(mse);
};

// Calculate MAE (Mean Absolute Error)
export const calculateMAE = (predicted, actual) => {
     if (!predicted || !actual || !predicted.length || predicted.length !== actual.length) return 0;
     
     const sumAbsDiff = predicted.reduce((a, b, i) => a + Math.abs(b - actual[i]), 0);
     return sumAbsDiff / predicted.length;
};

// Calculate MAPE (Mean Absolute Percentage Error)
export const calculateMAPE = (predicted, actual) => {
     if (!predicted || !actual || !predicted.length || predicted.length !== actual.length) return 0;
     
     let sum = 0;
     let count = 0;
     
     for(let i = 0; i < actual.length; i++) {
         // Avoid division by zero for actual values of 0
         if (actual[i] !== 0 && Math.abs(actual[i]) > 0.00001) {
             sum += Math.abs((actual[i] - predicted[i]) / actual[i]);
             count++;
         }
     }
     
     if (count === 0) return 0;
     return (sum / count) * 100;
};