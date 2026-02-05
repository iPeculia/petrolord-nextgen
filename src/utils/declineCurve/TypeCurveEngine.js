import { calculateRate } from './DeclineModels';

/**
 * Type Curve Engine - Phase 4 (Enhanced)
 * Generates and matches dimensionless type curves.
 */

// Fetkovich Type Curves Generation
export const generateFetkovichTypeCurves = () => {
    // Generate a family of curves for b values [0, 0.1, ... 1.0]
    // t_dd = dimensionless decline time
    // q_dd = dimensionless decline rate
    const curves = [];
    const bValues = [0, 0.2, 0.4, 0.5, 0.6, 0.8, 1.0];
    
    // Time range (log scale usually)
    const tPoints = [];
    for(let i=-2; i<=4; i+=0.1) tPoints.push(Math.pow(10, i));

    bValues.forEach(b => {
        const points = tPoints.map(tdd => {
            let qdd;
            if (b === 0) { // Exponential
                qdd = Math.exp(-tdd);
            } else if (b === 1) { // Harmonic
                qdd = 1 / (1 + tdd);
            } else { // Hyperbolic
                qdd = Math.pow(1 + b * tdd, -1/b);
            }
            return { x: tdd, y: qdd };
        });
        curves.push({ b, points, name: `b=${b}`, family: 'Fetkovich' });
    });

    return curves;
};

// Blasingame Type Curves (Placeholder for Phase 5+)
export const generateBlasingameTypeCurves = () => {
    // Similar structure but different equations involving material balance time
    return []; 
};

/**
 * Normalized well data for type curve matching
 * @param {Array} data - Production data array
 * @param {Number} qPeak - Peak rate for normalization
 * @returns {Array} Normalized data points
 */
export const normalizeWellData = (data, qPeak) => {
    if (!data || data.length === 0 || !qPeak) return [];

    // Filter out zero/negative rates and ensure sorted by time
    const validData = data
        .filter(d => d.q > 0)
        .sort((a,b) => a.t - b.t);

    if (validData.length === 0) return [];

    const tStart = validData[0].t;

    return validData.map(d => ({
        ...d,
        q_norm: d.q / qPeak,
        t_elapsed: d.t - tStart + 0.1, // Avoid t=0 issues in log plot
        // t_raw is kept for plotting against type curve t_dd via a shift factor (match point)
    }));
};

/**
 * Calculate match quality (R-squared) between well data and a specific type curve
 * given a specific match point (shift).
 */
export const calculateMatchQuality = (normalizedData, typeCurvePoints, timeShift, rateShift) => {
    // timeShift: t_dd = t_well / t_match
    // rateShift: q_dd = q_well / q_match
    
    // Simple interpolation matching
    let sse = 0;
    let sst = 0;
    let n = 0;
    let sumY = 0;

    normalizedData.forEach(pt => {
        // Transform well point to dimensionless space
        const t_dd_well = pt.t_elapsed * timeShift; 
        const q_dd_well = pt.q_norm * rateShift; 

        // Find corresponding point on type curve (interpolate)
        // Type curve points are sorted by x (t_dd)
        const typePt = interpolatePoint(typeCurvePoints, t_dd_well);
        
        if (typePt !== null) {
            const diff = Math.log10(q_dd_well) - Math.log10(typePt); // Log-space error
            sse += diff * diff;
            sumY += Math.log10(q_dd_well);
            n++;
        }
    });

    if (n < 5) return 0; // Insufficient overlap

    const meanY = sumY / n;
    normalizedData.forEach(pt => {
        const t_dd_well = pt.t_elapsed * timeShift; 
        const typePt = interpolatePoint(typeCurvePoints, t_dd_well);
        if (typePt !== null) {
             const q_dd_well = pt.q_norm * rateShift; 
             const diff = Math.log10(q_dd_well) - meanY;
             sst += diff * diff;
        }
    });

    if (sst === 0) return 0;
    return Math.max(0, 1 - (sse / sst));
};

// Helper for linear interpolation in log-log space
const interpolatePoint = (points, xTarget) => {
    // Points are {x, y}
    // Find neighbors
    if (xTarget < points[0].x || xTarget > points[points.length-1].x) return null;

    for (let i = 0; i < points.length - 1; i++) {
        if (xTarget >= points[i].x && xTarget <= points[i+1].x) {
            const p1 = points[i];
            const p2 = points[i+1];
            
            // Log-Log Interpolation
            const logX = Math.log10(xTarget);
            const logX1 = Math.log10(p1.x);
            const logX2 = Math.log10(p2.x);
            const logY1 = Math.log10(p1.y);
            const logY2 = Math.log10(p2.y);

            if (logX2 === logX1) return p1.y;

            const slope = (logY2 - logY1) / (logX2 - logX1);
            const logY = logY1 + slope * (logX - logX1);
            return Math.pow(10, logY);
        }
    }
    return null;
};