export const prepareIntegrationData = (matchResults, testConfig) => {
    if (!matchResults) return null;

    const { kh, pi, piIdeal, flowEfficiency } = matchResults.flowCapacity || {};
    const { k, s } = matchResults.parameters || {};

    return {
        // Data for Well Planning / Completion
        completion: {
            permeability: k,
            skin: s,
            flowEfficiency,
            damageRatio: 1 / (flowEfficiency || 1)
        },
        // Data for Material Balance
        reservoir: {
            kh: kh,
            initialPressure: testConfig.initialPressure,
            boundaryObserved: matchResults.parameters.re ? true : false
        },
        // Data for DCA / Economics
        production: {
            productivityIndex: pi,
            potentialRate: pi * (testConfig.initialPressure || 3000), // AOF approx
            recommendedRate: pi * (testConfig.initialPressure || 3000) * 0.5
        }
    };
};