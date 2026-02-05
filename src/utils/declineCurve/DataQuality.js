export const checkQuality = (data, stream = 'oilRate') => {
    if (!data || data.length === 0) return { score: 0, issues: [] };

    const issues = [];
    let zeroCount = 0;
    let negativeCount = 0;
    let nullCount = 0;
    
    // Check points
    data.forEach((d, i) => {
        const val = d[stream];
        if (val === null || val === undefined) {
            nullCount++;
            issues.push({ index: i, date: d.date, type: 'missing', message: 'Missing value' });
        } else if (val < 0) {
            negativeCount++;
            issues.push({ index: i, date: d.date, type: 'negative', message: `Negative rate: ${val}` });
        } else if (val === 0) {
            zeroCount++;
        }
    });

    // Score Logic
    const total = data.length;
    const errorCount = nullCount + negativeCount;
    let score = 100 - (errorCount / total * 100) - (zeroCount / total * 20); // Zeros penalize less
    score = Math.max(0, Math.round(score));

    return {
        score,
        metrics: {
            totalPoints: total,
            zeroValues: zeroCount,
            negativeValues: negativeCount,
            missingValues: nullCount
        },
        issues: issues.slice(0, 50) // Cap returned issues for UI
    };
};

export const cleanData = (data, stream) => {
    // Basic cleaning: Filter out negatives/nulls, keep zeros if valid shut-in?
    // For DCA fitting, usually we want only positive rates.
    return data.filter(d => {
        const val = d[stream];
        return val !== null && val !== undefined && val >= 0;
    });
};