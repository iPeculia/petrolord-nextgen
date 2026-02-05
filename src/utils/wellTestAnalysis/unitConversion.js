const factors = {
    pressure: { psi: 1, bar: 0.0689476, pa: 6894.76, kpa: 6.89476, atm: 0.068046 },
    rate: { stb_d: 1, m3_d: 0.158987, bbl_d: 1 },
    length: { ft: 1, m: 0.3048 },
    permeability: { md: 1, d: 0.001 },
    viscosity: { cp: 1, pas: 0.001 }
};

export const convert = (value, category, from, to) => {
    if (from === to) return value;
    if (!factors[category]) return value;
    
    // Convert to base unit then to target
    const baseVal = value / factors[category][from];
    return baseVal * factors[category][to];
};

export const formatNumber = (num, decimals = 2) => {
    if (num === null || num === undefined) return '-';
    return Number(num).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
};