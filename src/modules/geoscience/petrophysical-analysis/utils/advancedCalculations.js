/**
 * Advanced Petrophysical Calculations for Phase 4
 */

// Basic Lithology Identification Rules
export const identifyLithology = (gr, rho, nphi, dt) => {
    if (gr == null) return null;

    // Simple Rule-Based Classifier
    if (gr > 75) return 'Shale';
    if (gr < 20 && rho > 2.8) return 'Anhydrite';
    if (gr < 20 && rho < 2.2 && rho > 2.0) return 'Salt';
    if (gr < 40 && rho > 2.6 && nphi < 0.05) return 'Limestone';
    if (gr < 40 && rho > 2.8 && nphi < 0.02) return 'Dolomite';
    if (rho < 1.5) return 'Coal'; // Very low density
    return 'Sandstone'; // Default clean formation
};

// Color mapping for lithology
export const lithologyColors = {
    'Shale': '#78716c',      // Stone-500
    'Sandstone': '#fcd34d',  // Amber-300
    'Limestone': '#60a5fa',  // Blue-400
    'Dolomite': '#c084fc',   // Purple-400
    'Anhydrite': '#f87171',  // Red-400
    'Salt': '#a78bfa',       // Violet-400
    'Coal': '#000000',       // Black
    'Unknown': '#cbd5e1'     // Slate-300
};

// Fluid Identification
export const identifyFluid = (sw, rho, nphi) => {
    if (sw == null) return null;
    if (sw > 0.7) return 'Water';
    if (sw < 0.5 && rho < 0.7) return 'Gas'; // Very low density + low Sw
    if (sw < 0.5) return 'Oil';
    return 'Mixed';
};

// Geomechanics: Estimate Vertical Stress (Overburden)
export const calculateOverburdenStress = (depth, rho_array) => {
    // Integrate density from surface to depth
    // Sigma_v = Integral(rho * g * dz)
    // Simplified: Cumulative sum of density * depth_step
    // We assume a constant surface density if depth starts deep
    // Returns array of pressure in psi
    
    if (!rho_array || rho_array.length === 0) return null;
    
    const g = 0.433; // psi/ft gradient approx for water, but here we integrate bulk density
    // Convert rho (g/cc) to psi/ft gradient: rho * 0.433
    
    let cumulativeStress = 0;
    const stressProfile = [];
    
    // Assume top of log is at some depth, add overburden for above log interval
    // Typical average overburden gradient is 1.0 psi/ft
    const startDepth = depth[0];
    cumulativeStress = startDepth * 1.0; 
    
    for (let i = 0; i < depth.length; i++) {
        const rho = rho_array[i] || 2.3; // Default if missing
        const dz = (i > 0) ? (depth[i] - depth[i-1]) : 0.5;
        
        // Stress increment = rho (g/cc) * 0.433 (psi/ft per g/cc) * dz (ft)
        const dStress = rho * 0.433 * dz;
        cumulativeStress += dStress;
        stressProfile.push(cumulativeStress);
    }
    
    return stressProfile;
};

// Pressure Prediction (Eaton's Method - Simplified)
export const calculatePorePressure = (depth, dt_array, normal_dt_trend) => {
    // Eaton: P_pore = S_v - (S_v - P_hydro) * (DT_norm / DT_obs)^3
    // Simplified for demo: just a gradient plus anomaly
    if (!depth) return null;
    
    const hydrostaticGradient = 0.433; // psi/ft
    const porePressure = depth.map(d => {
        // Fake overpressure zone for demo purposes between 2000-2500 if depth matches
        let multiplier = 1.0;
        if (d > 2000 && d < 2500) multiplier = 1.4;
        return d * hydrostaticGradient * multiplier;
    });
    return porePressure;
};

export const calculateReservoirQuality = (phi, vsh, sw) => {
    // Score 0-100
    if (phi == null || vsh == null) return 0;
    
    let score = 0;
    // Porosity contribution (0-40 pts)
    if (phi > 0.25) score += 40;
    else if (phi > 0.15) score += 30;
    else if (phi > 0.10) score += 15;
    else score += 5;
    
    // Shale contribution (0-30 pts) - Lower is better
    if (vsh < 0.1) score += 30;
    else if (vsh < 0.3) score += 20;
    else if (vsh < 0.5) score += 5;
    
    // Saturation contribution (0-30 pts) - Lower Sw is better (Hydrocarbon)
    if (sw < 0.3) score += 30;
    else if (sw < 0.5) score += 20;
    else if (sw < 0.7) score += 10;
    
    return Math.min(100, score);
};