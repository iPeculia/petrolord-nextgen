const generateFracturedData = () => {
    const data = [];
    const Pi = 3200;
    
    // Dual Porosity Model signatures:
    // 1. Fracture flow (early)
    // 2. Transition (matrix feeding fractures - dip in derivative)
    // 3. Total system flow (late)
    
    const times = [];
    for (let i = -4; i <= 2; i += 0.05) times.push(Math.pow(10, i));
    
    times.forEach(t => {
        if (t > 84) return;
        
        // Derivative shape construction for V-shape
        // Early: Radial flow in fractures
        const dp_frac = 20 * (Math.log10(t) + 2);
        
        // Transition damping
        // Lambda factor effect
        const transition = 10 * Math.exp(-Math.pow(Math.log10(t) - (-0.5), 2)); 
        
        // Total system
        const dp_total = 10 * (Math.log10(t) + 3); // slope is half of frac slope typically in some models, or same slope but shifted
        
        // Combine for pressure
        // P ~ Integral of derivative
        // Visual approximation:
        
        let pressure = Pi;
        
        if (t < 0.1) {
            pressure -= 50 * t; // WBS
        } else if (t < 1) {
             pressure -= (50 + 20 * Math.log10(t)); // Fracture flow dominant
        } else if (t < 10) {
             pressure -= (70 + 5 * Math.log10(t)); // Transition (flat pressure, dip in deriv)
        } else {
             pressure -= (75 + 20 * Math.log10(t)); // Total system
        }

        // Smoothing needed?
        // Let's just output a clean curve that looks like dual porosity
        
        data.push({
            time: Number(t.toFixed(4)),
            pressure: Number(pressure.toFixed(2)),
            rate: 250
        });
    });

    return data;
};

export const sampleFracturedReservoirTest = generateFracturedData();