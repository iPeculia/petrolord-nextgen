// Analytical generation for Drawdown Test
// Model: Homogeneous, Infinite Acting, Wellbore Storage + Skin

const generateDrawdownData = () => {
    const data = [];
    const Pi = 3625.9; // psia
    const q = 150; // STB/D
    const Bo = 1.25; // RB/STB
    const mu = 0.8; // cp
    const k = 15; // md
    const h = 45; // ft
    const phi = 0.18;
    const ct = 1.5e-5; // 1/psi
    const rw = 0.35; // ft
    const skin = 2.5; 
    const C = 0.01; // bbl/psi (Wellbore Storage)

    // Constant 141.2 factor for field units
    const m = (162.6 * q * Bo * mu) / (k * h);

    // Time steps (logarithmic distribution preferred for WTA)
    const times = [];
    for (let i = -3; i <= 2; i += 0.1) times.push(Math.pow(10, i)); // 0.001 to 100 hrs
    
    // Add linear late time points up to 72 hours
    for (let t = 100; t <= 72; t+=2) times.push(t);

    times.sort((a,b) => a-b).forEach(t => {
        if (t > 72) return;

        // Simple E1 approximation for radial flow
        // Pwf = Pi - m * (log10(t) + ... )
        // Adding WBS effect using approximation: P_wbs = Pi - (q*B*t)/(24*C) at very early time
        
        let pressure;
        
        // Very simplified physics model for sample data generation
        // Early time (WBS dominated): Unit slope on log-log
        // Middle time (Radial flow): dp ~ log(t)
        
        // Calculate dimensionless time tD
        const tD = (0.0002637 * k * t) / (phi * mu * ct * rw * rw);
        
        // Pressure drop (dp) calculation with simplified WBS convolution
        // Using a sigmoid transition from WBS to Radial flow for visual realism
        const dp_radial = m * (Math.log10(tD) + 0.3513 + 0.87 * skin);
        const dp_wbs = (q * Bo * t) / (24 * C); // Linear drawdown
        
        // Smooth transition factor alpha
        // Transition typically happens around tD_Cd ~ 50-100
        const alpha = Math.exp(-10 / (t * 20)); // Empirical smoothing for visual sample
        
        const dp = dp_wbs * (1 - alpha) + dp_radial * alpha;
        
        pressure = Pi - dp;

        // Late time boundary effect (simulate single fault at 48hrs+)
        if (t > 48) {
            pressure -= (t - 48) * 0.5; // Slight extra drop
        }

        // Add some random noise for realism
        const noise = (Math.random() - 0.5) * 0.5;

        data.push({
            time: Number(t.toFixed(4)),
            pressure: Number((pressure + noise).toFixed(2)),
            rate: q
        });
    });

    return data;
};

export const sampleDrawdownTest = generateDrawdownData();