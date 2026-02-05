// Consolidated Sample Data Generator to ensure availability
// This file replaces individual files to prevent import errors if files are missing

export const generateDrawdownData = () => {
    const data = [];
    const Pi = 3625.9;
    for (let i = 0; i < 200; i++) {
        const t = i === 0 ? 0.001 : Math.pow(10, -3 + (i * 0.025)); 
        if (t > 72) break;
        const dp = 150 * (Math.log10(t) + 2); // Simple radial flow
        data.push({ time: Number(t.toFixed(4)), pressure: Number((Pi - dp).toFixed(2)), rate: 150 });
    }
    return data;
};

export const generateBuildupData = () => {
    const data = [];
    for (let i = 0; i < 200; i++) {
        const t = i === 0 ? 0.001 : Math.pow(10, -3 + (i * 0.025));
        if (t > 48) break;
        data.push({ time: Number((48 + t).toFixed(4)), pressure: Number((2500 + 50 * Math.log10(t)).toFixed(2)), rate: 0 });
    }
    return data;
};

export const sampleDrawdownTest = generateDrawdownData();
export const sampleBuildupTest = generateBuildupData();
export const sampleMultiRateTest = generateDrawdownData(); // Placeholder logic
export const sampleInjectionTest = generateDrawdownData(); // Placeholder logic
export const sampleInterferenceTest = generateDrawdownData(); // Placeholder logic
export const sampleFracturedReservoirTest = generateDrawdownData(); // Placeholder logic
export const sampleBoundedReservoirTest = generateDrawdownData(); // Placeholder logic
export const sampleDamagedWellTest = generateDrawdownData(); // Placeholder logic
export const sampleStimulatedWellTest = generateDrawdownData(); // Placeholder logic