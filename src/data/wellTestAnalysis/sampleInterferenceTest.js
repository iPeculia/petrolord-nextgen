const generateInterferenceData = () => {
    const data = [];
    const Pi = 2600;
    
    // Active well starts producing at t=0
    // Observer is 500m away
    // Line Source Solution: P(r,t) = Pi + (70.6 q B u / kh) * Ei(-948 phi mu ct r^2 / kt)
    
    // Simplified Ei approximation for visual curve:
    // P_drop starts at 0, stays 0 for delay time, then increases exponentially then logarithmically
    
    const delayTime = 5.5; // hours until response felt
    
    for (let t = 0; t <= 96; t += 0.5) {
        let pressure = Pi;
        
        if (t > 0.1) {
            // Exponential Integral approximation term
            // X = r^2 / (4 t_D)
            // If X is large (early time), Ei is small. 
            
            // Visual fake using decay function
            const effectiveTime = Math.max(0, t - 2); // Lag
            const signalStrength = 15; // magnitude
            
            if (t > 2) {
                // The classic 'S' curve of interference response
                const response = signalStrength * Math.exp(-delayTime / t); 
                pressure -= response;
            }
        }
        
        // Add tidal effects (sine wave noise often seen in high precision gauges)
        pressure += 0.05 * Math.sin(t / 6); 

        data.push({
            time: Number(t.toFixed(2)),
            pressure: Number(pressure.toFixed(3)), // Higher precision for interference
            rate: 0 // Observer rate is 0
        });
    }

    return data;
};

export const sampleInterferenceTest = generateInterferenceData();