export const ScenarioManager = {
    createScenario: (baseData, modifications, name) => {
        const newData = { ...baseData, ...modifications };
        return {
            id: crypto.randomUUID(),
            name: name || `Scenario ${new Date().toLocaleTimeString()}`,
            parameters: newData,
            created_at: new Date().toISOString()
        };
    },

    compareScenarios: (scenarios) => {
        // Logic to diff scenarios
        return scenarios.map(s => ({
            id: s.id,
            name: s.name,
            // ... calculated metrics
        }));
    }
};