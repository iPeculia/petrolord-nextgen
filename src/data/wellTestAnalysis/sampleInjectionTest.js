const generateInjectionData = () => {
    const data = [];
    const Pi = 2400; // psia
    const q_inj = -180; // STB/D (negative for injection convention, though pressure rises)
    const m = 40; // slope
    
    // Injection increases pressure
    // P = Pi + m * (log(t) + s)
    
    const times = [];
    for (let i = -3; i <= 2; i += 0.05) times.push(Math.pow(10, i));
    
    times.forEach(t => {
        if (t > 60) return;
        
        // WBS logic: P rises linearly first
        const dp_wbs = 50 * t; // linear rise
        const dp_radial = m * (Math.log10(t) + 4);
        
        // Smooth min function to transition
        const smoothing = Math.exp(-t/0.05);
        const dp = dp_wbs * smoothing + dp_radial * (1 - smoothing);
        
        let pressure = Pi + dp;
        
        // Add "humph" effect common in injection (thermal fracturing or changing mobility)
        if (t > 10) {
            pressure -= 5 * Math.log10(t/10); // Mobility ratio improvement
        }

        data.push({
            time: Number(t.toFixed(4)),
            pressure: Number(pressure.toFixed(2)),
            rate: 180 // Reported as positive rate usually
        });
    });

    return data;
};

export const sampleInjectionTest = generateInjectionData();