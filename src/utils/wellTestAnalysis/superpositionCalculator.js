/**
 * Calculates superposition time functions for variable rate tests.
 * 
 * @param {Array} rateSchedule - Array of { time, rate } objects defining the flow history.
 * @param {number} currentTime - Delta time since start of CURRENT flow period.
 * @param {number} tp - Production time (effective) prior to current period.
 * @returns {Object} { radial, linear } superposition time values.
 */
export const calculateSuperposition = (currentTime, tp, type = 'radial') => {
    // Basic Radial Superposition (Horner Approximation for simple buildup)
    // Horner Time = (tp + dt) / dt
    if (type === 'horner') {
        if (!currentTime || currentTime <= 0) return 1;
        return (tp + currentTime) / currentTime;
    }

    // Generalized Superposition would go here for multi-rate
    // Sum [ (qn - qn-1) * log(tn - t) ]
    
    return currentTime; 
};

/**
 * Enriches dataset with diagnostic time functions
 */
export const addDiagnosticTimes = (data, testConfig) => {
    // For a simple buildup, we assume t=0 in data is start of shut-in
    // We need 'tp' (producing time) from config
    const tp = testConfig.producingTime || 24; // Default to 24hr if missing

    return data.map(point => {
        // Avoid division by zero
        const dt = point.time > 0 ? point.time : 0.0001; 
        
        return {
            ...point,
            // Horner Time for Semilog plots
            hornerTime: (tp + dt) / dt,
            // Square Root Time for Linear Flow plots
            sqrtTime: Math.sqrt(dt),
            // Fourth Root Time for Bilinear Flow
            fourthRootTime: Math.pow(dt, 0.25)
        };
    });
};