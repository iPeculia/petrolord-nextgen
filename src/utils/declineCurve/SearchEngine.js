export const searchWells = (wells, query) => {
    if (!query || !wells) return wells || [];
    const lowerQuery = query.toLowerCase();
    
    return wells.filter(w => 
        w.name.toLowerCase().includes(lowerQuery) ||
        (w.api && w.api.toLowerCase().includes(lowerQuery)) ||
        (w.metadata?.formation && w.metadata.formation.toLowerCase().includes(lowerQuery))
    );
};

export const searchScenarios = (scenarios, query) => {
    if (!query || !scenarios) return scenarios || [];
    const lowerQuery = query.toLowerCase();
    
    return scenarios.filter(s => 
        s.name.toLowerCase().includes(lowerQuery) ||
        (s.results?.modelType && s.results.modelType.toLowerCase().includes(lowerQuery))
    );
};