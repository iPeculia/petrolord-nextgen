import { calculateTotalDepth, calculateTotalWeight, calculateAverageGrade } from '@/components/casing-design/utils/calculationUtils';

export const compareDesigns = (designA, sectionsA, designB, sectionsB) => {
    // Basic Metrics
    const metricsA = {
        totalDepth: calculateTotalDepth(sectionsA),
        totalWeight: calculateTotalWeight(sectionsA),
        avgGrade: calculateAverageGrade(sectionsA),
        sectionCount: sectionsA.length
    };

    const metricsB = {
        totalDepth: calculateTotalDepth(sectionsB),
        totalWeight: calculateTotalWeight(sectionsB),
        avgGrade: calculateAverageGrade(sectionsB),
        sectionCount: sectionsB.length
    };

    const diffs = {
        totalDepth: metricsB.totalDepth - metricsA.totalDepth,
        totalWeight: metricsB.totalWeight - metricsA.totalWeight,
        sectionCount: metricsB.sectionCount - metricsA.sectionCount,
    };

    return {
        metricsA,
        metricsB,
        diffs
    };
};

export const getComparisonStatus = (valA, valB, lowerIsBetter = false) => {
    if (valA === valB) return 'neutral';
    if (lowerIsBetter) {
        return valB < valA ? 'better' : 'worse';
    }
    return valB > valA ? 'better' : 'worse';
};