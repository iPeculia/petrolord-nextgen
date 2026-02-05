// Core Material Balance Equation terms calculations
// Based on Dake (1978) and generalized MBE

// Interpolate PVT property at given pressure
const getPVTProperty = (pvtData, pressure, property) => {
  if (!pvtData || pvtData.length === 0) return null;
  
  // Sort by pressure
  const sorted = [...pvtData].sort((a, b) => a.pressure - b.pressure);
  
  for (let i = 0; i < sorted.length - 1; i++) {
    if (pressure >= sorted[i].pressure && pressure <= sorted[i+1].pressure) {
      const p1 = sorted[i].pressure;
      const p2 = sorted[i+1].pressure;
      const v1 = sorted[i][property];
      const v2 = sorted[i+1][property];
      
      if (v1 === undefined || v2 === undefined) return null;
      
      const fraction = (pressure - p1) / (p2 - p1);
      return v1 + fraction * (v2 - v1);
    }
  }
  
  // Extrapolation (clamped to boundaries)
  if (pressure < sorted[0].pressure) return sorted[0][property];
  if (pressure > sorted[sorted.length-1].pressure) return sorted[sorted.length-1][property];
  
  return null;
};

// Calculate Total Underground Withdrawal (F)
// F = Np(Bo + (Rp-Rs)Bg) + WpBw
export const calculateF = (production, pvtOil, pvtGas, pvtWater) => {
    const { Np, Gp, Wp, pressure } = production;
    
    const Bo = getPVTProperty(pvtOil, pressure, 'Bo');
    const Rs = getPVTProperty(pvtOil, pressure, 'Rs');
    const Bg = getPVTProperty(pvtGas, pressure, 'Bg');
    const Bw = getPVTProperty(pvtWater, pressure, 'Bw') || 1.0; 

    if (Bo == null || Rs == null || Bg == null) return null;

    // Rp = Gp / Np (cumulative GOR)
    const Rp = Np > 0 ? Gp / Np : 0;
    
    // Term 1: Oil expansion + dissolved gas
    const term1 = Np * (Bo + (Rp - Rs) * Bg);
    
    // Term 2: Water production
    const term2 = Wp * Bw;
    
    return term1 + term2;
};

// Calculate Oil Expansion Term (Eo)
// Eo = (Bo - Boi) + (Rsi - Rs)Bg
export const calculateEo = (pressure, initialPressure, pvtOil, pvtGas) => {
    const Bo = getPVTProperty(pvtOil, pressure, 'Bo');
    const Rs = getPVTProperty(pvtOil, pressure, 'Rs');
    const Bg = getPVTProperty(pvtGas, pressure, 'Bg');
    
    const Boi = getPVTProperty(pvtOil, initialPressure, 'Bo');
    const Rsi = getPVTProperty(pvtOil, initialPressure, 'Rs');

    if (Bo == null || Rs == null || Bg == null || Boi == null || Rsi == null) return null;

    return (Bo - Boi) + (Rsi - Rs) * Bg;
};

// Calculate Gas Expansion Term (Eg)
// Eg = Boi * (Bg/Bgi - 1) OR simply (Bg - Bgi) if dealing with gas cap directly normalized
// We use Eg = (Bg - Bgi) form here, which matches F vs (Eo + m*Boi/Bgi * Eg) convention 
// but often it's easier to compute expansion factor directly
export const calculateEg = (pressure, initialPressure, pvtGas) => {
    const Bg = getPVTProperty(pvtGas, pressure, 'Bg');
    const Bgi = getPVTProperty(pvtGas, initialPressure, 'Bg');
    
    if (Bg == null || Bgi == null) return null;
    
    return (Bg - Bgi);
};

// Calculate Formation Expansion (Efw)
// Efw = (1 + m) * Boi * [(Cw*Swi + Cf)/(1-Swi)] * deltaP
export const calculateEfw = (pressure, initialPressure, tankParams) => {
    const { cw, cf, swi, m, Boi } = tankParams;
    const deltaP = initialPressure - pressure;
    
    if (swi >= 1) return 0;
    
    const compressibilityTerm = (cw * swi + cf) / (1 - swi);
    // Use Boi if available, else 1.0
    const expansion = (1 + (m || 0)) * (Boi || 1.0) * compressibilityTerm * deltaP;
    
    return expansion;
};

// Calculate Formation Compressibility (Ef) - standalone if needed
export const calculateEf = (cf, swi, pressureChange) => {
    if (swi >= 1) return 0;
    return (cf / (1 - swi)) * pressureChange;
};

export const calculatePoverZ = (pressure, pvtGas) => {
    const z = getPVTProperty(pvtGas, pressure, 'z');
    if (z == null || z === 0) return null;
    return pressure / z;
};

export const calculateCumulativeTerms = (productionData, pvtData) => {
    // Helper to process a whole dataset
    // Not strictly needed if we iterate in DiagnosticDataGenerator, but good for testing
    return [];
};