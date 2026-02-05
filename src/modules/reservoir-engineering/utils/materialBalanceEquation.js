import { solveLeastSquares, interpolatePvtData } from './calculationUtils';

// F = Np[Bo + (Rp - Rsi)Bg] + Wp*Bw
function calculateF(Np, Gp, Wp, Bo, Bg, Bw, Rsi) {
  if (Np === 0) return 0;
  const Rp = Gp / Np;
  return Np * (Bo + (Rp - Rsi) * Bg) + (Wp * (Bw || 1.0)); // Assume Bw=1 if not provided
}

// Eo = (Bo - Boi) + (Rsi - Rs)Bg
function calculateEo(Bo, Rs, Bg, Boi, Rsi) {
  return (Bo - Boi) + (Rsi - Rs) * Bg;
}

// Eg = Boi * ((Bg/Bgi) - 1)
function calculateEg(Boi, Bg, Bgi) {
    if (Bgi === 0) return 0;
    return Boi * (Bg / Bgi - 1);
}

// Efw = ( (Swi*Cw + Cf) / (1-Swi) ) * delta_P
function calculateEfw(deltaP, Cw, Cf, Swi) {
    if (Swi >= 1) return 0;
    const Cwi = Cw || 4e-6; // Assume water compressibility if not provided
    return ((Swi * Cwi + Cf) / (1 - Swi)) * deltaP;
}


export const runMaterialBalanceAnalysis = (productionData, pvtData, initialConditions) => {
    const {
        initialPressure,
        initialWaterSaturation: Swi,
        formationCompressibility: Cf,
        hasGasCap,
        gasCapRatio: m,
    } = initialConditions;

    if (!initialPressure || Swi === null || Cf === null) {
        throw new Error("Initial conditions (Pressure, Sw, Cf) must be set.");
    }

    const interpolatedPvt = interpolatePvtData(pvtData, productionData.map(d => d.pressure).filter(p => typeof p === 'number'));
    const pvtAtInitialPressure = interpolatePvtData(pvtData, [initialPressure])[0];

    if (!pvtAtInitialPressure) {
        throw new Error(`Could not interpolate PVT properties at initial pressure ${initialPressure}. Check PVT data range.`);
    }

    const { bo: Boi, rs: Rsi, bg: Bgi } = pvtAtInitialPressure;

    if (!Boi || !Rsi || !Bgi) {
        throw new Error("Could not determine initial PVT properties (Boi, Rsi, Bgi). Check initial pressure and PVT table.");
    }
    
    const plotData = productionData.map((prod, index) => {
        const pvt = interpolatedPvt[index];
        if (!pvt || typeof prod.pressure !== 'number' || typeof prod.cumulative_production !== 'number') return null;

        const deltaP = initialPressure - prod.pressure;
        
        const F = calculateF(prod.cumulative_production, prod.cumulative_gas || 0, prod.cumulative_water || 0, pvt.bo, pvt.bg, pvt.bw, Rsi);
        const Eo = calculateEo(pvt.bo, pvt.rs, pvt.bg, Boi, Rsi);
        
        let term_Eg = 0;
        if(hasGasCap && m) {
            term_Eg = calculateEg(Boi, pvt.bg, Bgi);
        }
        
        let term_Efw = calculateEfw(deltaP, pvt.cw, Cf, Swi);

        const x_axis = Eo + (m || 0) * term_Eg + term_Efw;
        
        return {
            f: F,
            eo_total: x_axis,
            pressure: prod.pressure,
            Np: prod.cumulative_production,
        };
    }).filter(Boolean);

    if (plotData.length < 2) {
        throw new Error("Insufficient data points for material balance plot. Need at least 2 valid points after processing.");
    }
    
    const xData = plotData.map(d => d.eo_total);
    const yData = plotData.map(d => d.f);

    const { slope: N, intercept, rSquared } = solveLeastSquares(xData, yData);

    const lastPvt = interpolatedPvt[interpolatedPvt.length - 1] || {};
    const waterInflux = intercept / (lastPvt.bw || 1.0); // We at last step

    return {
        plotData,
        ooip: N,
        gasCapRatio: m,
        estimatedWaterInflux: waterInflux,
        rSquared: rSquared,
        equation: `F = ${N.toExponential(3)} * E_total + ${intercept.toExponential(3)}`
    };
};