/**
 * Advanced Production Forecasting Engine
 */

export const runForecast = (config) => {
    const { mode, durationYears, declineRate, initialRate, abandonmentRate, startDate, startCumulative } = config;
    
    const data = [];
    const months = durationYears * 12;
    
    // Convert annual decline to monthly effective decline
    // di_eff = 1 - (1 - d_ann)^(1/12)
    const d_monthly = 1 - Math.pow(1 - (declineRate/100), 1/12);
    
    // Nominal decline rate for Harmonic (ai)
    // d_ann = 1 - exp(-ai) -> ai = -ln(1 - d_ann)
    // For harmonic: q = qi / (1 + ai*t)
    const ai_annual = -Math.log(1 - (declineRate/100));
    const ai_monthly = ai_annual / 12;

    let currentRate = initialRate;
    let currentCum = startCumulative;
    let currentDate = new Date(startDate);

    for (let m = 1; m <= months; m++) {
        // Increment date
        currentDate.setMonth(currentDate.getMonth() + 1);
        
        // Calculate Rate
        if (mode === 'exponential') {
            currentRate = currentRate * (1 - d_monthly);
        } else if (mode === 'harmonic') {
            // q(t) = qi / (1 + b * Di * t) where b=1 for harmonic
            // Using iterative step: q_new = q_old / (1 + ai_monthly * dt) approx or direct time
            // Direct: q = qi / (1 + ai * m)
            currentRate = initialRate / (1 + ai_monthly * m);
        } else if (mode === 'constant_rate') {
            currentRate = initialRate;
        }

        // Check Abandonment
        if (currentRate < abandonmentRate) {
            currentRate = 0;
        }

        // Calculate Volume (approx 30.4 days/month)
        const monthlyVol = currentRate * 30.4;
        currentCum += monthlyVol;

        if (currentRate > 0) {
            data.push({
                date: currentDate.toISOString(),
                rate: currentRate,
                cumulative: currentCum,
                month: m
            });
        } else {
            break; 
        }
    }

    return {
        data,
        eur: currentCum
    };
};