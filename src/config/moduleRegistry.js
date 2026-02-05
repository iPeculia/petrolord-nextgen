const moduleRegistry = {
  modules: {
    'well-log-correlation': {
      name: 'Well Log Correlation',
      path: '/modules/geoscience/well-log-correlation',
      dataTypes: ['wellData', 'correlationLines'],
      analysisTypes: ['stratigraphic', 'structural'],
      capabilities: ['canRead:wellData', 'canWrite:correlationLines'],
    },
    'petrophysical-analysis': {
      name: 'Petrophysical Analysis',
      path: '/modules/geoscience/petrophysical-analysis',
      dataTypes: ['wellData', 'petrophysicalResults'],
      analysisTypes: ['standard', 'multi-well'],
      capabilities: ['canRead:wellData', 'canWrite:petrophysicalResults'],
    },
    // Future modules can be registered here
  },
  dataTypes: {
    wellData: {
      description: 'Core well information, including location, depth, and logs.',
    },
    correlationLines: {
      description: 'Stratigraphic or structural correlation lines between wells.',
    },
    petrophysicalResults: {
      description: 'Calculated properties like porosity, permeability, and saturation.',
    },
  },
  capabilities: {
    canRead: 'Allows the module to read a specific data type.',
    canWrite: 'Allows the module to create or modify a specific data type.',
    canExport: 'Allows the module to export data.',
  },
};

export default moduleRegistry;