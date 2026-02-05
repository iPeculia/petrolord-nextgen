import { calculateRate, calculateCumulative } from './DeclineModels';

/**
 * Generates forecast data points based on decline parameters.
 * Supports Economic Limit, Time Duration, and Tapering.
 */
export const generateForecast = (params, startCum, startT, lastDateTimestamp, config) => {
    const { qi, Di, b } = params;
    const { 
        economicLimit = 5, 
        maxDuration = 3650, 
        stopAtLimit = true,
        taperConfig 
    } = config;

    const data = [];
    const stepSize = 30; // Monthly steps for forecast visualization
    let currentT = startT; // This is relative time (days) since t=0 of the model
    
    // Tapering setup (Phase 3 addition)
    // Tapering usually means switching from Hyperbolic to Exponential at a certain decline rate (D_lim)
    // Or forcing b to 0 over a duration. Simplified here: Switch to Exp when Di_effective reaches limit.
    const D_limit = 0.06; // Example: Switch to exponential when decline < 6% / yr effective
    let isTapered = false;
    let paramsTaper = null;

    for (let i = 1; i <= maxDuration / stepSize; i++) {
        currentT += stepSize;
        
        // Calculate Rate
        let rate;
        let cum;
        
        if (!isTapered) {
             rate = calculateRate(currentT, qi, Di, b);
             cum = calculateCumulative(currentT, qi, Di, b); 
             
             // Check Taper Condition (Hyperbolic -> Exponential)
             // D(t) = Di / (1 + b*Di*t)
             const currentD = Di / (1 + b * Di * (currentT/365)); // Annualized instantaneous decline
             
             if (b > 0 && currentD <= D_limit && taperConfig?.enabled) {
                 isTapered = true;
                 // Start exponential leg from here
                 // qi_new = current rate
                 // Di_new = currentD (which is now constant D_limit)
                 // b_new = 0
                 paramsTaper = {
                     qi: rate,
                     Di: currentD,
                     b: 0,
                     startTime: currentT,
                     startCum: cum
                 };
             }
        } else {
             // Exponential leg
             const t_exp = (currentT - paramsTaper.startTime);
             rate = calculateRate(t_exp, paramsTaper.qi, paramsTaper.Di, 0); // b=0
             // Cumulative is delta + previous
             const deltaCum = calculateCumulative(t_exp, paramsTaper.qi, paramsTaper.Di, 0);
             cum = paramsTaper.startCum + deltaCum;
        }

        // Apply Economic Limit
        if (stopAtLimit && rate < economicLimit) break;

        // Construct Point
        // We add startCum from history to the model's cumulative (which assumes 0 at t=0 of fit)
        // Note: startCum passed in arg is the ACTUAL well cum at end of history.
        // The model 'cum' above calculates cum since t=0. 
        // We need to be careful: if the model was fit to history, model cum(lastHistoryT) ~= startCum.
        // So we just use model cum directly usually, OR we shift it if we want to match history perfectly.
        // For simplicity in this engine: We assume model continuity.
        
        const dateTick = lastDateTimestamp + ((currentT - startT) * 1000 * 60 * 60 * 24);
        
        data.push({
            dateTick,
            tDays: currentT,
            rate,
            cumulative: cum, 
            isForecast: true
        });
    }

    // Metrics Calculation
    const lastPoint = data[data.length - 1];
    const eur = lastPoint ? lastPoint.cumulative : 0;
    const reserves = eur - (data[0] ? calculateCumulative(startT, qi, Di, b) : 0); // Rough approximation of remaining

    return {
        data,
        metrics: {
            eur,
            reserves,
            finalRate: lastPoint ? lastPoint.rate : 0,
            durationYears: (currentT - startT) / 365
        }
    };
};

/**
 * Calculates a simple aggregate forecast for a group of wells
 * Sums up rates for overlapping timestamps.
 */
export const calculateGroupForecast = (wells, streamType) => {
    // This function aggregates HISTORY data for now.
    // Future: It should also aggregate the active FORECAST for each well if it exists.
    
    if (!wells || wells.length === 0) return [];

    const rateKey = streamType === 'Oil' ? 'oilRate' : streamType === 'Gas' ? 'gasRate' : 'waterRate';
    
    // 1. Collect all data points
    const allPoints = [];
    wells.forEach(w => {
        if(w.data) {
            w.data.forEach(d => {
                allPoints.push({
                    date: new Date(d.date).getTime(),
                    rate: d[rateKey] || 0
                });
            });
        }
    });

    if(allPoints.length === 0) return [];

    // 2. Sort by date
    allPoints.sort((a,b) => a.date - b.date);

    // 3. Bin by Day (or Month)
    // Simple daily binning
    const binned = new Map();
    allPoints.forEach(p => {
        // Round to nearest day to handle slight timestamp diffs
        const dayKey = Math.floor(p.date / (1000 * 60 * 60 * 24)) * (1000 * 60 * 60 * 24);
        binned.set(dayKey, (binned.get(dayKey) || 0) + p.rate);
    });

    // 4. Convert back to array
    const aggregated = Array.from(binned.entries())
        .map(([date, rate]) => ({
            date: new Date(date).toISOString(),
            dateTick: date,
            rate: rate
        }))
        .sort((a,b) => a.dateTick - b.dateTick);
        
    return aggregated;
};