const factors = {
    pressure: {
        psi: 1,
        bar: 0.0689476,
        pa: 6894.76,
        atm: 0.068046,
        kpa: 6.89476,
    },
    volume: {
        bbl: 1,
        m3: 0.158987,
        ft3: 5.61458,
        liters: 158.987,
    },
    rate: {
        'bbl/day': 1,
        'm3/day': 0.158987,
        'ft3/day': 5.61458,
        'liters/day': 158.987,
    },
    viscosity: {
        cp: 1,
        'pa.s': 0.001,
        'mpa.s': 1,
    },
    temperature: {
        // Not factor based, requires functions
    },
    density: {
        'lb/ft3': 1,
        'kg/m3': 16.0185,
        'g/cm3': 0.0160185,
    }
};

function getConversionFactor(category, fromUnit, toUnit) {
    if (!factors[category]) throw new Error(`Invalid category: ${category}`);
    const fromFactor = factors[category][fromUnit];
    const toFactor = factors[category][toUnit];
    if (fromFactor === undefined || toFactor === undefined) {
        throw new Error(`Invalid units for ${category}: ${fromUnit} to ${toUnit}`);
    }
    return toFactor / fromFactor;
}

function convert(category, value, fromUnit, toUnit) {
    if (fromUnit === toUnit) return value;
    const factor = getConversionFactor(category, fromUnit, toUnit);
    return value * factor;
}

export const convertPressure = (value, from, to) => convert('pressure', value, from, to);
export const convertVolume = (value, from, to) => convert('volume', value, from, to);
export const convertRate = (value, from, to) => convert('rate', value, from, to);
export const convertViscosity = (value, from, to) => convert('viscosity', value, from, to);
export const convertDensity = (value, from, to) => convert('density', value, from, to);

export function convertTemperature(value, fromUnit, toUnit) {
    if (fromUnit === toUnit) return value;
    let tempK;
    // Convert to Kelvin first
    switch (fromUnit.toLowerCase()) {
        case 'c': tempK = value + 273.15; break;
        case 'f': tempK = (value - 32) * 5/9 + 273.15; break;
        case 'k': tempK = value; break;
        default: throw new Error(`Invalid from-unit for temperature: ${fromUnit}`);
    }
    // Convert from Kelvin to target unit
    switch (toUnit.toLowerCase()) {
        case 'c': return tempK - 273.15;
        case 'f': return (tempK - 273.15) * 9/5 + 32;
        case 'k': return tempK;
        default: throw new Error(`Invalid to-unit for temperature: ${toUnit}`);
    }
}

export function formatValue(value, unit, decimals = 2) {
    if (typeof value !== 'number' || isNaN(value)) return 'N/A';
    return `${value.toFixed(decimals)} ${unit}`;
}