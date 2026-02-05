export const calculateHydrostaticPressure = (depth, fluidDensity) => {
  // P = 0.052 * rho * depth
  // depth in ft, density in ppg, result in psi
  if (!depth || !fluidDensity) return 0;
  return 0.052 * Number(fluidDensity) * Number(depth);
};

export const calculateBurstLoad = (hydrostaticPressure, surfacePressure = 0) => {
  // Internal Yield Pressure load case usually assumes full column of gas or fluid replacement
  // Simplified: Max expected internal pressure
  return Number(hydrostaticPressure) + Number(surfacePressure);
};

export const calculateCollapseLoad = (hydrostaticPressure, fluidLevelDrop = 0) => {
  // External pressure (formation/hydrostatic) vs Internal pressure (often 0 or reduced)
  // Simplified: External hydrostatic load assuming empty casing or significant fluid drop
  // Returns external pressure
  return Number(hydrostaticPressure); 
};

export const calculateAxialLoad = (sectionWeight, buoyancyFactor = 1, previousLoad = 0) => {
  // Axial load is cumulative weight hanging below + current section
  // Adjusted for buoyancy
  return Number(previousLoad) + (Number(sectionWeight) * Number(buoyancyFactor));
};

export const calculateBuoyancyFactor = (fluidDensity) => {
  // BF = 1 - (MW / 65.5)
  if (!fluidDensity) return 1;
  return 1 - (Number(fluidDensity) / 65.5);
};