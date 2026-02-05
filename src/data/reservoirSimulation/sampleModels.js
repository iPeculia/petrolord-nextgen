export const SAMPLE_MODELS = [
  {
    id: 'model_01_waterflood',
    name: 'Quarter 5-Spot Waterflood',
    description: 'Classic waterflood pattern in a homogeneous reservoir. Ideal for understanding sweep efficiency.',
    gridSize: { nx: 20, ny: 20, nz: 5 },
    fluids: ['Oil', 'Water'],
    pattern: '5-Spot',
    initialConditions: {
      pressure: 3500, // psia
      sw: 0.2, // Initial Water Saturation
      porosity: 0.22,
      permeability: 150 // md
    },
    wells: [
      { id: 'I-1', type: 'Injector', location: { x: 1, y: 1 }, rate: 500 },
      { id: 'P-1', type: 'Producer', location: { x: 20, y: 20 }, bhp: 2000 }
    ],
    metadata: {
      difficulty: 'Beginner',
      avgRunTime: '15s'
    }
  },
  {
    id: 'model_02_gas_cap',
    name: 'Gas Cap Expansion',
    description: 'Reservoir with an initial gas cap. Observe pressure maintenance via gas cap expansion.',
    gridSize: { nx: 30, ny: 30, nz: 10 },
    fluids: ['Oil', 'Gas', 'Water'],
    pattern: 'Anticline',
    initialConditions: {
      pressure: 4200,
      sw: 0.15,
      gasCapRatio: 0.4,
      porosity: 0.18,
      permeability: 80
    },
    wells: [
      { id: 'P-1', type: 'Producer', location: { x: 15, y: 15 }, rate: 800 }
    ],
    metadata: {
      difficulty: 'Intermediate',
      avgRunTime: '25s'
    }
  },
  {
    id: 'model_03_channel_sand',
    name: 'Meandering Channel Sand',
    description: 'Heterogeneous permeability field representing a fluvial channel. Tests well placement strategy.',
    gridSize: { nx: 50, ny: 25, nz: 3 },
    fluids: ['Oil', 'Water'],
    pattern: 'Channel',
    initialConditions: {
      pressure: 2800,
      sw: 0.25,
      porosity: 0.25,
      permeability: 'Variable (50-2000 md)'
    },
    wells: [
      { id: 'P-1', type: 'Producer', location: { x: 10, y: 12 }, bhp: 1500 },
      { id: 'P-2', type: 'Producer', location: { x: 40, y: 15 }, bhp: 1500 }
    ],
    metadata: {
      difficulty: 'Advanced',
      avgRunTime: '40s'
    }
  },
  {
    id: 'model_04_bottom_water',
    name: 'Strong Bottom Water Drive',
    description: 'Oil zone underlain by a massive aquifer. Learn about water coning effects.',
    gridSize: { nx: 15, ny: 15, nz: 15 },
    fluids: ['Oil', 'Water'],
    pattern: 'Single Well',
    initialConditions: {
      pressure: 3100,
      sw: 1.0, // Aquifer at bottom
      porosity: 0.20,
      permeability: 300
    },
    wells: [
      { id: 'P-1', type: 'Producer', location: { x: 8, y: 8 }, rate: 1000 }
    ],
    metadata: {
      difficulty: 'Intermediate',
      avgRunTime: '20s'
    }
  },
  {
    id: 'model_05_faulted',
    name: 'Compartmentalized Fault Block',
    description: 'Reservoir separated by a sealing fault. Demonstrates pressure depletion in isolated compartments.',
    gridSize: { nx: 40, ny: 40, nz: 4 },
    fluids: ['Oil', 'Water'],
    pattern: 'Faulted Block',
    initialConditions: {
      pressure: 3800,
      sw: 0.2,
      porosity: 0.15,
      permeability: 50
    },
    wells: [
      { id: 'P-1', type: 'Producer', location: { x: 10, y: 10 }, rate: 400 },
      { id: 'P-2', type: 'Producer', location: { x: 30, y: 30 }, rate: 400 }
    ],
    metadata: {
      difficulty: 'Advanced',
      avgRunTime: '35s'
    }
  }
];