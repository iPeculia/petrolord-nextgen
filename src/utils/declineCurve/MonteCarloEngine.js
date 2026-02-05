import { calculateCumulative } from './DeclineModels';

// Box-Muller transform for normal distribution
const randn_bm = () => {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); 
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
};

const sampleNormal = (mean, stdDev) => mean + (randn_bm() * stdDev);
const sampleUniform = (min, max) => min + Math.random() * (max - min);
const sampleLogNormal = (mean, stdDev) => {
    // Determine mu and sigma for underlying normal distribution
    const sigma2 = Math.log((stdDev*stdDev) / (mean*mean) + 1);
    const mu = Math.log(mean) - sigma2 / 2;
    return Math.exp(sampleNormal(mu, Math.sqrt(sigma2)));
};

export const runMonteCarloSimulation = (baseParams, uncertainties, iterations = 1000, durationYears = 30) => {
    const results = [];
    const { qi, Di, b } = baseParams;
    const durationDays = durationYears * 365;

    for (let i = 0; i < iterations; i++) {
        // Sample parameters
        // Uncertainty is typically % variation or absolute range
        // Here we assume uncertainties object has { type: 'normal'|'uniform', value: 0.1 } (10%)
        
        const qi_unc = uncertainties.qi || { type: 'normal', value: 0.1 };
        const Di_unc = uncertainties.Di || { type: 'normal', value: 0.1 };
        const b_unc  = uncertainties.b  || { type: 'uniform', value: 0.1 };

        let sim_qi, sim_Di, sim_b;

        // Sample Qi
        if (qi_unc.type === 'normal') {
            sim_qi = sampleNormal(qi, qi * qi_unc.value);
        } else {
            sim_qi = sampleUniform(qi * (1 - qi_unc.value), qi * (1 + qi_unc.value));
        }

        // Sample Di
        if (Di_unc.type === 'normal') {
            sim_Di = sampleNormal(Di, Di * Di_unc.value);
        } else {
            sim_Di = sampleUniform(Di * (1 - Di_unc.value), Di * (1 + Di_unc.value));
        }

        // Sample b (usually constrained 0-2)
        if (b_unc.type === 'normal') {
            sim_b = sampleNormal(b, b * b_unc.value);
        } else {
            sim_b = sampleUniform(Math.max(0, b - b_unc.value), Math.min(2, b + b_unc.value));
        }
        
        // Safety clamps
        sim_qi = Math.max(0, sim_qi);
        sim_Di = Math.max(0.001, sim_Di);
        sim_b = Math.max(0, sim_b);

        // Calculate EUR
        const eur = calculateCumulative(durationDays, sim_qi, sim_Di, sim_b);
        
        results.push({
            iteration: i,
            qi: sim_qi,
            Di: sim_Di,
            b: sim_b,
            eur
        });
    }

    // Sort by EUR for percentiles
    results.sort((a, b) => a.eur - b.eur);

    const p10Index = Math.floor(iterations * 0.1);
    const p50Index = Math.floor(iterations * 0.5);
    const p90Index = Math.floor(iterations * 0.9);

    return {
        iterations: results,
        stats: {
            p10: results[p10Index]?.eur || 0,
            p50: results[p50Index]?.eur || 0,
            p90: results[p90Index]?.eur || 0,
            mean: results.reduce((sum, r) => sum + r.eur, 0) / iterations,
            min: results[0].eur,
            max: results[results.length - 1].eur
        }
    };
};