import { 
    sampleDrawdownTest, sampleBuildupTest, sampleMultiRateTest, 
    sampleInjectionTest, sampleInterferenceTest, sampleFracturedReservoirTest,
    sampleBoundedReservoirTest, sampleDamagedWellTest, sampleStimulatedWellTest
} from './sampleData';

export const SAMPLE_DATASETS = [
    { id: 'drawdown_basic', title: 'Drawdown Test (Standard)', type: 'drawdown', description: 'Constant rate drawdown.', data: sampleDrawdownTest, meta: { well: 'Well A-1', fluid: 'Oil', k_expected: '15 md' } },
    { id: 'buildup_standard', title: 'Buildup Test (PBU)', type: 'buildup', description: 'Pressure buildup after flow.', data: sampleBuildupTest, meta: { well: 'Well B-2', fluid: 'Oil', k_expected: '35 md' } },
    { id: 'multi_rate', title: 'Multi-Rate Test', type: 'drawdown', description: 'Variable rate test.', data: sampleMultiRateTest, meta: { well: 'Well C-3', fluid: 'Oil' } },
    { id: 'injection', title: 'Injection Falloff', type: 'injection', description: 'Water injection test.', data: sampleInjectionTest, meta: { well: 'Well D-4', fluid: 'Water' } },
    { id: 'interference', title: 'Interference Test', type: 'interference', description: 'Observation well data.', data: sampleInterferenceTest, meta: { well: 'Well E-5', fluid: 'Oil' } },
    { id: 'fractured', title: 'Fractured Reservoir', type: 'drawdown', description: 'Dual Porosity behavior.', data: sampleFracturedReservoirTest, meta: { well: 'Well F-6', fluid: 'Oil' } },
    { id: 'bounded', title: 'Bounded Reservoir', type: 'drawdown', description: 'Boundary effects.', data: sampleBoundedReservoirTest, meta: { well: 'Well G-7', fluid: 'Oil' } },
    { id: 'damaged', title: 'Damaged Well', type: 'drawdown', description: 'High positive skin.', data: sampleDamagedWellTest, meta: { well: 'Well H-8', fluid: 'Oil' } },
    { id: 'stimulated', title: 'Stimulated Well', type: 'drawdown', description: 'Negative skin.', data: sampleStimulatedWellTest, meta: { well: 'Well I-9', fluid: 'Oil' } }
];