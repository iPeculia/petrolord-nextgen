export const checkDataQuality = (data, streamType = 'Oil') => {
    const issues = [];
    const rateKey = streamType === 'Oil' ? 'oilRate' : streamType === 'Gas' ? 'gasRate' : 'waterRate';
    
    if (!data || data.length === 0) {
        return { score: 0, issues: [{ type: 'critical', message: 'No data points found' }], summary: { count: 0 } };
    }

    let zeroRateCount = 0;
    let negativeRateCount = 0;
    let missingDatesCount = 0;
    let duplicateDatesCount = 0;

    const dateMap = new Set();
    let sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

    for (let i = 0; i < sortedData.length; i++) {
        const point = sortedData[i];
        
        // Check Zero Rates
        if (point[rateKey] === 0) zeroRateCount++;
        
        // Check Negative Rates
        if (point[rateKey] < 0) {
            negativeRateCount++;
            issues.push({ 
                type: 'error', 
                message: `Negative rate detected on ${point.date}`, 
                index: i 
            });
        }

        // Check Duplicates
        if (dateMap.has(point.date)) {
            duplicateDatesCount++;
        } else {
            dateMap.add(point.date);
        }

        // Check Gaps (simple check > 31 days)
        if (i > 0) {
            const diff = (new Date(point.date) - new Date(sortedData[i-1].date)) / (1000 * 60 * 60 * 24);
            if (diff > 35) {
                issues.push({
                    type: 'warning',
                    message: `Data gap of ${Math.round(diff)} days detected after ${sortedData[i-1].date}`,
                    index: i
                });
            }
        }
    }

    if (zeroRateCount > 0) {
        issues.push({ type: 'warning', message: `${zeroRateCount} zero-rate periods detected` });
    }
    if (duplicateDatesCount > 0) {
        issues.push({ type: 'error', message: `${duplicateDatesCount} duplicate dates found` });
    }

    // Calculate Score
    let score = 100;
    score -= (negativeRateCount * 5);
    score -= (duplicateDatesCount * 10);
    score -= (issues.filter(i => i.type === 'error').length * 5);
    score = Math.max(0, Math.min(100, score));

    return {
        score,
        issues,
        summary: {
            totalPoints: data.length,
            zeroRates: zeroRateCount,
            negatives: negativeRateCount,
            duplicates: duplicateDatesCount
        }
    };
};