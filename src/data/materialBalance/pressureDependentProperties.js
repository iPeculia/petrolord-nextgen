import { sampleReservoirs } from './reservoirs';

export const generatePressureProperties = (reservoir) => {
    const { initialPressure, bubblePointPressure } = reservoir.parameters;
    const { apiGravity, gasGravity } = reservoir.fluidProperties;
    
    const steps = 20;
    const maxP = Math.ceil(initialPressure * 1.1 / 100) * 100; // 10% above initial
    const minP = 500;
    const stepSize = (maxP - minP) / steps;
    
    const data = [];
    
    for(let i=0; i <= steps; i++) {
        const p = maxP - (i * stepSize);
        
        // Basic Correlations
        const isBelowPb = p < bubblePointPressure;
        
        // Bo (Oil FVF)
        let Bo;
        if (!isBelowPb) {
            // Undersaturated: slight linear decrease as P increases
             Bo = 1.3 - (0.000015 * (p - bubblePointPressure));
        } else {
             // Saturated: decreases as gas breaks out (P decreases)
             // Simplified correlation shape
             Bo = 1.05 + 0.25 * (p / bubblePointPressure);
        }

        // Rs (Solution Gas Ratio)
        let Rs;
        if (!isBelowPb) {
            Rs = reservoir.fluidProperties.initialGor;
        } else {
            Rs = reservoir.fluidProperties.initialGor * Math.pow((p / bubblePointPressure), 1.2);
        }

        // Viscosity (cp)
        let uo;
        const deadVisc = 1.0; // simplified
        if (!isBelowPb) {
            uo = deadVisc + 0.2; 
        } else {
            // Gas comes out, oil gets thicker
            uo = deadVisc + 1.5 * (1 - (p/bubblePointPressure));
        }

        // Gas FVF (Bg) - approx inverse to P
        const Bg = 0.028 * (1000 / p); // bbl/scf approx

        // Compressibilities (1/psi)
        const co = isBelowPb ? 1.5e-4 : 1.2e-5; // Higher below Pb due to free gas cap effect proxy
        const cw = 3e-6;
        const cf = 3e-6;

        data.push({
            pressure: Math.round(p),
            Bo: parseFloat(Bo.toFixed(4)),
            Rs: parseFloat(Rs.toFixed(1)),
            uo: parseFloat(uo.toFixed(3)),
            Bg: parseFloat(Bg.toFixed(6)),
            ug: 0.02, // simplified gas visc
            Bw: 1.02, 
            co: co,
            cw: cw,
            cf: cf,
            phase: isBelowPb ? 'Two-Phase' : 'Single-Phase'
        });
    }
    
    return data.sort((a,b) => b.pressure - a.pressure);
};

export const samplePressureDependentProperties = {};
sampleReservoirs.forEach(res => {
    samplePressureDependentProperties[res.id] = generatePressureProperties(res);
});