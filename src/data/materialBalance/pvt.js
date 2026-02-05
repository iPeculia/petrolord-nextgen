export const generatePVTData = (reservoir) => {
    const data = [];
    const { initialPressure, temperature } = reservoir.parameters;
    const { bubblePoint, initialGor, apiGravity, gasGravity } = reservoir.fluidProperties;

    const pressureSteps = 20;
    const minPressure = 500;
    const stepSize = (initialPressure - minPressure) / pressureSteps;

    for (let i = 0; i <= pressureSteps; i++) {
        const p = initialPressure - (i * stepSize);
        
        // Simplified PVT Correlations for synthetic data
        let Rs, Bo, Bg, uo, ug, Bw, uw;

        // Solution Gas Ratio (Rs)
        if (p >= bubblePoint) {
            Rs = initialGor;
        } else {
            Rs = initialGor * Math.pow(p / bubblePoint, 1.2);
        }

        // Oil FVF (Bo)
        if (p >= bubblePoint) {
            // Undersaturated: Bo decreases as pressure increases above Pb due to compression
            const bob = 1.0 + 0.0005 * Rs; // Bo at bubble point (simplified Standing)
            const co = 1.5e-5; // Oil compressibility
            Bo = bob * Math.exp(co * (bubblePoint - p)); 
        } else {
            // Saturated: Bo decreases as gas evolves
            Bo = 1.0 + 0.0005 * Rs;
        }

        // Gas FVF (Bg) - approx Bgi * (Pb/P)
        // Bg in res bbl / scf (very small number) or res ft3 / scf
        // Using res bbl/scf: ~ 0.005 @ 1000psi -> 0.0008 @ 5000psi
        const z = 0.9; // simplfied Z-factor constant
        const T_rankine = temperature + 460;
        Bg = 0.02827 * z * T_rankine / p / 5.615; // bbl/scf

        // Oil Viscosity (uo)
        const deadOilVisc = Math.pow(10, 3.0324 - 0.02023 * apiGravity) * Math.pow(temperature, -1.163);
        if (p >= bubblePoint) {
             uo = deadOilVisc + 0.2; // slightly higher
        } else {
             // gas comes out, viscosity increases
             uo = deadOilVisc * Math.pow(p/bubblePoint, -0.5);
        }
        if (uo < 0.2) uo = 0.2;
        if (uo > 5.0) uo = 5.0;

        // Gas Viscosity (ug) - typical range 0.015 - 0.03 cp
        ug = 0.015 + 2e-6 * p;

        data.push({
            pressure: Math.round(p),
            Rs: parseFloat(Rs.toFixed(2)),
            Bo: parseFloat(Bo.toFixed(4)),
            Bg: parseFloat(Bg.toFixed(6)),
            uo: parseFloat(uo.toFixed(3)),
            ug: parseFloat(ug.toFixed(4)),
            Bw: 1.02, // Simplified constant
            uw: 0.5   // Simplified constant
        });
    }

    // Sort ascending by pressure for plots
    return data.reverse();
};

export const samplePVTTables = {};