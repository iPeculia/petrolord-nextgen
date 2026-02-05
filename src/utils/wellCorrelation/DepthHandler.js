export const convertDepth = (value, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return value;
  if (fromUnit === 'M' && toUnit === 'FT') return value * 3.28084;
  if (fromUnit === 'FT' && toUnit === 'M') return value / 3.28084;
  return value;
};

export const formatDepth = (value, unit = 'M') => {
  return `${value.toFixed(2)} ${unit}`;
};