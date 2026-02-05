export const AutoSuggestionEngine = {
    analyzeCorrelations: (wells, markers) => {
        const suggestions = [];
        
        if (!wells || !Array.isArray(wells) || wells.length < 2) return suggestions;

        // 1. Marker Gaps Analysis
        try {
            const allMarkerNames = new Set((markers || []).map(m => m.name));
            
            wells.forEach(well => {
                if (!well) return;
                const wellMarkers = (markers || []).filter(m => m.wellId === well.id);
                const wellMarkerNames = new Set(wellMarkers.map(m => m.name));
                
                allMarkerNames.forEach(name => {
                    if (!wellMarkerNames.has(name)) {
                        // Find typical depth of this marker in nearby wells
                        const nearbyMarkers = (markers || []).filter(m => m.name === name && m.wellId !== well.id);
                        if (nearbyMarkers.length > 0) {
                            const avgDepth = nearbyMarkers.reduce((acc, m) => acc + m.depth, 0) / nearbyMarkers.length;
                            
                            suggestions.push({
                                id: `sugg-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,
                                type: 'Missing Marker',
                                targetWellId: well.id,
                                targetWellName: well.name,
                                description: `Potential '${name}' marker missing. Suggested depth: ${avgDepth.toFixed(1)}m`,
                                suggestedDepth: avgDepth,
                                confidence: 0.75,
                                action: 'add_marker',
                                payload: { name, depth: avgDepth }
                            });
                        }
                    }
                });
            });

            // 2. Pattern Recognition (Mock)
            if (wells.length >= 2) {
                suggestions.push({
                    id: `sugg-pattern-${Date.now()}`,
                    type: 'Pattern Match',
                    targetWellId: wells[1].id,
                    targetWellName: wells[1].name,
                    description: `Strong Gamma Ray correlation detected with ${wells[0].name}`,
                    confidence: 0.88,
                    action: 'highlight_interval',
                    payload: { start: 2440, end: 2460 }
                });
            }
        } catch (error) {
            console.error("AutoSuggestionEngine Error:", error);
        }

        return suggestions.sort((a, b) => b.confidence - a.confidence);
    }
};