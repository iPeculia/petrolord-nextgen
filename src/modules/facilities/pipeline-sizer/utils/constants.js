export const DEFAULT_FLUID_PROPS = {
  oil: { density: 53.0, viscosity: 2.5, heatCapacity: 0.5 },
  gas: { density: 0.8, viscosity: 0.015, heatCapacity: 0.6 },
  water: { density: 62.4, viscosity: 1.0, heatCapacity: 1.0 },
  multiphase: { density: 45.0, viscosity: 1.8, heatCapacity: 0.7 }
};

export const PIPE_SCHEDULES = {
  '40': { '2': 2.067, '3': 3.068, '4': 4.026, '6': 6.065, '8': 7.981, '10': 10.02, '12': 11.938 },
  '80': { '2': 1.939, '3': 2.900, '4': 3.826, '6': 5.761, '8': 7.625, '10': 9.562, '12': 11.374 },
  '160': { '2': 1.687, '3': 2.624, '4': 3.438, '6': 5.187, '8': 6.813, '10': 8.500, '12': 10.126 }
};

export const ROUGHNESS_VALUES = {
  'new_steel': 0.0018,
  'corroded_steel': 0.018,
  'plastic': 0.00006,
  'concrete': 0.012
};

export const FITTING_EQUIV_LENGTH = {
  'elbow90': 30, // L/D
  'elbow45': 16,
  'tee': 60,
  'valve': 45,
  'other': 10
};