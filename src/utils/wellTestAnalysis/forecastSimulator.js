export const runForecast = (modelParams, currentPressure, timeHorizonDays = 365, targetRate) => {
    const data = [];
    const steps = 50;
    const dt = timeHorizonDays / steps;

    // Simulate transient to boundary-dominated flow transition
    let p = currentPressure;
    let t = 0;

    // Simple drawdown simulation
    const k = modelParams.k || 10;
    const h = modelParams.h || 50;
    const phi = 0.2;
    const mu = 1;
    const ct = 1e-5;
    const rw = 0.25;

    for (let i = 0; i <= steps; i++) {
        const timeHours = Math.max(0.1, t * 24);
        
        // Pwf = Pi - 162.6 * q * B * mu / kh * (log(t) + ...)
        // Simplified Log approximation for forecast
        const slope = (162.6 * targetRate * 1.2 * mu) / (k * h);
        const skinDrop = 0.869 * slope * (modelParams.s || 0);
        
        // Infinite acting drawdown
        const dp = slope * (Math.log10(timeHours) + skinDrop + 0.351);
        
        // Add boundary effect (linear decline) if late time
        const boundaryDecline = t > 30 ? (t - 30) * 0.1 : 0; 

        data.push({
            time: t, // days
            pressure: Math.max(0, currentPressure - dp - boundaryDecline),
            rate: targetRate
        });

        t += dt;
    }
    
    return data;
};