export const generateResultSummary = (state) => {
    const { testConfig, matchingResults } = state;
    
    const params = matchingResults?.parameters || {};
    const flowCap = matchingResults?.flowCapacity || {};

    return {
        header: {
            testType: testConfig.type,
            date: new Date().toLocaleDateString(),
            well: testConfig.wellName || 'Unknown Well'
        },
        parameters: [
            { name: 'Permeability (k)', value: params.k, unit: 'md' },
            { name: 'Skin Factor (s)', value: params.s, unit: 'dimensionless' },
            { name: 'Wellbore Storage (C)', value: params.C, unit: 'bbl/psi' },
            { name: 'Investigation Radius', value: params.ri, unit: 'ft' }
        ],
        capacity: [
            { name: 'Flow Capacity (kh)', value: flowCap.kh, unit: 'md-ft' },
            { name: 'Productivity Index', value: flowCap.pi, unit: 'STB/D/psi' },
            { name: 'Flow Efficiency', value: flowCap.flowEfficiency, unit: 'fraction' }
        ],
        recommendation: flowCap.flowEfficiency < 0.8 
            ? "Well is damaged. Consider stimulation (acid/frac) to remove positive skin."
            : "Well is performing efficiently. No immediate stimulation required."
    };
};