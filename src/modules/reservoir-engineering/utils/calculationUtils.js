/**
 * Performs linear least squares regression.
 * @param {number[]} xData - The independent variable data.
 * @param {number[]} yData - The dependent variable data.
 * @returns {{slope: number, intercept: number, rSquared: number}}
 */
export function solveLeastSquares(xData, yData) {
    if (xData.length !== yData.length || xData.length === 0) {
        throw new Error("Input data arrays must be non-empty and of equal length.");
    }

    const n = xData.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (let i = 0; i < n; i++) {
        sumX += xData[i];
        sumY += yData[i];
        sumXY += xData[i] * yData[i];
        sumX2 += xData[i] * xData[i];
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calculate R-squared for goodness of fit
    let ssTotal = 0;
    let ssResidual = 0;
    const meanY = sumY / n;
    for (let i = 0; i < n; i++) {
        ssTotal += (yData[i] - meanY) ** 2;
        ssResidual += (yData[i] - (slope * xData[i] + intercept)) ** 2;
    }
    const rSquared = 1 - (ssResidual / ssTotal);

    return { slope, intercept, rSquared };
}


/**
 * Interpolates PVT properties for a given set of pressures.
 * @param {object[]} pvtData - The PVT table data, sorted by pressure.
 * @param {number[]} targetPressures - The pressures to interpolate properties for.
 * @returns {object[]} An array of interpolated PVT properties.
 */
export function interpolatePvtData(pvtData, targetPressures) {
    if (!pvtData || pvtData.length < 2) {
        throw new Error("PVT data must have at least two points for interpolation.");
    }

    const pvtProperties = Object.keys(pvtData[0]).filter(k => k !== 'pressure');

    return targetPressures.map(p => {
        if (p === null || p === undefined) return null;

        // Find the two points to interpolate between
        let i = pvtData.findIndex(row => row.pressure >= p);

        if (i === -1) { // Pressure is higher than max in table, extrapolate
            i = pvtData.length - 1;
        }
        if (i === 0) { // Pressure is lower than min in table, extrapolate
             i = 1;
        }

        const p1 = pvtData[i - 1];
        const p2 = pvtData[i];

        const interpolated = { pressure: p };
        pvtProperties.forEach(prop => {
            const y1 = p1[prop];
            const y2 = p2[prop];
            const x1 = p1.pressure;
            const x2 = p2.pressure;
            
            if(x2 - x1 === 0) {
                 interpolated[prop] = y1;
                 return;
            }

            // Linear interpolation: y = y1 + (x - x1) * (y2 - y1) / (x2 - x1)
            interpolated[prop] = y1 + (p - x1) * (y2 - y1) / (x2 - x1);
        });

        return interpolated;
    });
}