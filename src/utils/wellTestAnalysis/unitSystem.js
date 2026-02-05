export const UNIT_SYSTEMS = {
  FIELD: {
    pressure: 'psia',
    rate: 'STB/D',
    permeability: 'md',
    length: 'ft',
    temperature: '°F',
    viscosity: 'cp',
    compressibility: '1/psi'
  },
  SI: {
    pressure: 'kPa',
    rate: 'm³/d',
    permeability: 'm²',
    length: 'm',
    temperature: '°C',
    viscosity: 'Pa·s',
    compressibility: '1/Pa'
  }
};

const CONVERSION_FACTORS = {
  // From Field to SI
  pressure: 6.89476, // psi to kPa
  rate: 0.158987, // STB/D to m³/d
  length: 0.3048, // ft to m
  permeability: 9.869233e-16, // md to m²
  viscosity: 0.001, // cp to Pa·s
  compressibility: 0.000145038 // 1/psi to 1/Pa
};

export const convertValue = (value, type, toSystem) => {
  if (value === null || value === undefined) return 0;
  
  if (toSystem === 'si') {
    // Convert Field to SI
    if (type === 'temperature') return (value - 32) * 5/9;
    return value * (CONVERSION_FACTORS[type] || 1);
  } else {
    // Convert SI to Field (inverse)
    if (type === 'temperature') return (value * 9/5) + 32;
    return value / (CONVERSION_FACTORS[type] || 1);
  }
};

export const getUnitLabel = (type, system = 'field') => {
  const sysKey = system.toUpperCase();
  return UNIT_SYSTEMS[sysKey][type] || '';
};

export const convertUnits = (data, unitSystem) => {
    // Deep clone to avoid mutation
    // In a real app, this would iterate keys and convert based on schema
    return data;
};