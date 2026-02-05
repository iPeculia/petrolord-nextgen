export const calculateRMSE = (observed, predicted) => {
    if (observed.length !== predicted.length || observed.length === 0) return 0;
    
    let sumSqDiff = 0;
    for (let i = 0; i < observed.length; i++) {
        const diff = observed[i] - predicted[i];
        sumSqDiff += diff * diff;
    }
    
    return Math.sqrt(sumSqDiff / observed.length);
};

export const calculateMatchQuality = (data, modelCurve) => {
    // Extract delta pressure arrays
    const observed = data.map(d => d.deltaP || 0);
    const predicted = modelCurve.map(d => d.pressure || 0);
    
    // Align lengths if necessary
    const len = Math.min(observed.length, predicted.length);
    const obsTrim = observed.slice(0, len);
    const predTrim = predicted.slice(0, len);

    const rmse = calculateRMSE(obsTrim, predTrim);
    
    // R-Squared
    const meanObs = obsTrim.reduce((a, b) => a + b, 0) / len;
    const ssTot = obsTrim.reduce((a, b) => a + Math.pow(b - meanObs, 2), 0);
    const ssRes = obsTrim.reduce((a, b, i) => a + Math.pow(b - predTrim[i], 2), 0);
    const rSquared = ssTot !== 0 ? 1 - (ssRes / ssTot) : 0;

    // Quality Rating
    let rating = 'Poor';
    let color = 'text-red-500';
    if (rSquared > 0.9) { rating = 'Excellent'; color = 'text-green-500'; }
    else if (rSquared > 0.8) { rating = 'Good'; color = 'text-blue-500'; }
    else if (rSquared > 0.6) { rating = 'Fair'; color = 'text-yellow-500'; }

    return {
        rmse,
        rSquared,
        rating,
        colorClass: color
    };
};