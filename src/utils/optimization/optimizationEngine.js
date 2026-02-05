export const generateOptimizationSuggestions = (sections, calculations) => {
    const suggestions = [];

    // 1. Grade Optimization (Cost/Weight)
    // Rule: If high grade (P-110+) is used at shallow depths (top 30%), suggest lower grade
    const totalDepth = Math.max(...sections.map(s => s.bottom_depth));
    
    sections.forEach((section, idx) => {
        const isShallow = section.bottom_depth < (totalDepth * 0.3);
        const isHighGrade = ['P-110', 'Q-125'].includes(section.grade);
        
        if (isShallow && isHighGrade) {
            suggestions.push({
                type: 'cost',
                title: `Downgrade Top Section ${idx + 1}`,
                description: `Section ${idx + 1} uses high-grade ${section.grade} in shallow interval. Consider downgrading to L-80 or N-80 to reduce cost if burst loads permit.`,
                impact: 'High Cost Saving',
                sectionIndex: idx
            });
        }
    });

    // 2. Connection Optimization
    // Rule: If non-premium connection used in deep sections (>10000ft), suggest premium
    sections.forEach((section, idx) => {
        const isDeep = section.bottom_depth > 10000;
        const isStandardConn = ['API BTC', 'API LTC', 'API STC'].includes(section.connection_type);

        if (isDeep && isStandardConn) {
             suggestions.push({
                type: 'performance',
                title: `Upgrade Connection Section ${idx + 1}`,
                description: `Deep section ${idx + 1} uses standard ${section.connection_type}. Consider Premium connection for better gas seal and tensile capacity.`,
                impact: 'Safety Improvement',
                sectionIndex: idx
            });
        }
    });

    return suggestions;
};