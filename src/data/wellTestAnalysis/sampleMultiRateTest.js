const generateMultiRateData = () => {
    const data = [];
    const Pi = 2800;
    
    // Flow periods
    const periods = [
        { q: 100, duration: 24 },
        { q: 150, duration: 24 },
        { q: 200, duration: 24 }
    ];

    let currentTime = 0;
    let currentPressure = Pi;

    periods.forEach((period, idx) => {
        // Generate points for this period
        // Use log spacing for transient resolution at start of each rate change
        const steps = [];
        for (let i = -3; i <= Math.log10(period.duration); i += 0.1) steps.push(Math.pow(10, i));
        
        steps.forEach(dt => {
            if (dt > period.duration) return;
            const t = currentTime + dt;
            
            // Simple pressure drop model: dp proportional to rate * log(time)
            // Cumulative drop from previous periods
            let totalDrop = 0;
            
            // Superposition of all previous rate changes
            // P = Pi - m * Sum [ (q_i - q_i-1) * log(t - t_i-1) ]
            
            let t_prev = 0;
            let q_prev = 0;
            
            for (let j = 0; j <= idx; j++) {
                const q_curr = periods[j].q;
                const dq = q_curr - q_prev;
                const elapsedSinceChange = t - t_prev;
                
                if (elapsedSinceChange > 0) {
                     // Add simple radial flow term + skin
                     // using 10 * dq as a scaling factor 'm'
                     totalDrop += 0.5 * dq * (Math.log10(elapsedSinceChange) + 2); 
                }
                
                t_prev += periods[j].duration;
                q_prev = q_curr;
            }

            // Apply specific transient for current step (WBS effect)
            // Smoothing the step change
            
            const pressure = Pi - totalDrop;
            
            data.push({
                time: Number(t.toFixed(4)),
                pressure: Number(pressure.toFixed(2)),
                rate: period.q
            });
        });
        
        currentTime += period.duration;
    });

    return data;
};

export const sampleMultiRateTest = generateMultiRateData();