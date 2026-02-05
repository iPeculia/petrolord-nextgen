export const reservoirModels = [
  { id: 'homogenous', name: 'Homogenous', description: 'Uniform properties throughout the reservoir.' },
  { id: 'dual_porosity', name: 'Dual Porosity', description: 'Matrix and fracture system.' },
  { id: 'radial_composite', name: 'Radial Composite', description: 'Two concentric regions with different properties.' }
];

export const boundaryModels = [
  { id: 'infinite', name: 'Infinite Acting', description: 'No boundaries detected during test duration.' },
  { id: 'single_fault', name: 'Single Fault', description: 'One sealing fault nearby.' },
  { id: 'channel', name: 'Parallel Faults (Channel)', description: 'Two parallel sealing faults.' },
  { id: 'closed_circle', name: 'Closed Circular', description: 'Fully bounded reservoir.' },
  { id: 'constant_pressure', name: 'Constant Pressure', description: 'Strong aquifer support or gas cap.' }
];

export const wellModels = [
  { id: 'vertical', name: 'Vertical Well', description: 'Standard vertical wellbore.' },
  { id: 'fractured', name: 'Hydraulically Fractured', description: 'Vertical well with hydraulic fracture.' },
  { id: 'horizontal', name: 'Horizontal Well', description: 'Horizontal wellbore section.' }
];

export const defaultParameters = {
  porosity: 0.15,
  permeability: 10,
  thickness: 50,
  viscosity: 1.0,
  compressibility: 1e-5,
  wellRadius: 0.3,
  skin: 0,
  wellboreStorage: 0.01
};