export const EXERCISES = [
  {
    id: 'ex_01_sweep',
    title: 'Sweep Efficiency Basics',
    description: 'Compare the sweep efficiency of a 5-spot pattern versus a direct line drive.',
    objectives: [
      'Visualize waterfront movement',
      'Calculate breakthrough time',
      'Compare recovery factors'
    ],
    baseModelId: 'model_01_waterflood',
    config: {
      adjustables: ['Injection Rate', 'Well Spacing'],
      targetMetric: 'Recovery Factor > 40%'
    },
    hints: [
      'Try increasing the injection rate to see if breakthrough happens sooner.',
      'Consider how the distance between injector and producer affects the sweep.'
    ],
    difficulty: 'Easy'
  },
  {
    id: 'ex_02_coning',
    title: 'Controlling Water Coning',
    description: 'Optimize production rate to delay water breakthrough in a bottom-water drive reservoir.',
    objectives: [
      'Identify critical oil production rate',
      'Maximize oil recovery before 50% water cut',
      'Observe coning shape in cross-section'
    ],
    baseModelId: 'model_04_bottom_water',
    config: {
      adjustables: ['Production Rate', 'Perforation Interval'],
      targetMetric: 'Water Cut < 50% at 1 year'
    },
    hints: [
      'High production rates draw the water table up locally (coning).',
      'Try reducing the rate or moving perforations higher up in the column.'
    ],
    difficulty: 'Intermediate'
  },
  {
    id: 'ex_03_gas_injection',
    title: 'Gas Injection Strategy',
    description: 'Determine the optimal timing for gas injection to maintain reservoir pressure.',
    objectives: [
      'Maintain pressure above bubble point',
      'Prevent gas channeling',
      'Optimize injection/production ratio'
    ],
    baseModelId: 'model_02_gas_cap',
    config: {
      adjustables: ['Gas Injection Rate', 'Injector Location'],
      targetMetric: 'Pressure > 3500 psi'
    },
    hints: [
      'Injecting gas into the gas cap helps maintain energy.',
      'Injecting too fast might push gas to the producer prematurely.'
    ],
    difficulty: 'Advanced'
  }
];