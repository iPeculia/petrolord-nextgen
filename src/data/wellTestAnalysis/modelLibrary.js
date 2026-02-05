export const RESERVOIR_MODELS = [
    {
        id: 'infinite_radial',
        name: 'Infinite Acting Radial Flow',
        description: 'Homogeneous reservoir with no apparent boundaries during test duration.',
        regimes: ['Wellbore Storage', 'Radial Flow'],
        parameters: ['k', 's', 'C', 'p_initial'],
        signature: 'Horizontal derivative stabilization at late time.'
    },
    {
        id: 'bounded_closed',
        name: 'Bounded Reservoir (Closed)',
        description: 'Reservoir with sealing faults or limits on all sides.',
        regimes: ['Wellbore Storage', 'Radial Flow', 'Boundary Effect (Closed)'],
        parameters: ['k', 's', 'C', 're', 'shape_factor'],
        signature: 'Derivative curve increases to unit slope at late time.'
    },
    {
        id: 'constant_pressure',
        name: 'Constant Pressure Boundary',
        description: 'Reservoir with strong aquifer support or gas cap.',
        regimes: ['Wellbore Storage', 'Radial Flow', 'Boundary Effect (Const. P)'],
        parameters: ['k', 's', 'C', 're'],
        signature: 'Derivative plunges rapidly at late time.'
    },
    {
        id: 'dual_porosity',
        name: 'Dual Porosity (Fractured)',
        description: 'Naturally fractured reservoir with matrix and fracture porosity.',
        regimes: ['Wellbore Storage', 'Fracture Flow', 'Transition (Dip)', 'Total System Flow'],
        parameters: ['k_f', 's', 'omega', 'lambda'],
        signature: 'Characteristic "V" shape dip in derivative curve.'
    }
];

export const getModelById = (id) => RESERVOIR_MODELS.find(m => m.id === id);