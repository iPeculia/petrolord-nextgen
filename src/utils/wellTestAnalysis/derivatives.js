/**
 * Calculates the Bourdet derivative for pressure transient analysis.
 * Uses the L-spline algorithm (weighted difference).
 * 
 * @param {Array} data - Array of {time, pressure} objects
 * @param {number} L - Smoothing parameter (distance on log cycle), typically 0.1 to 0.5
 */
export const calculateBourdetDerivative = (data, L = 0.2) => {
  if (!data || data.length < 3) return [];

  const results = [];

  // Sort data by time just in case
  const sortedData = [...data].sort((a, b) => a.time - b.time);

  for (let i = 0; i < sortedData.length; i++) {
    const current = sortedData[i];
    
    // Convert time to log space for spacing checks
    const logT = Math.log(current.time);
    
    // Find left and right neighbors that satisfy the L spacing
    // We look for points where |log(t) - log(ti)| >= L
    
    // Find left point (index j)
    let leftIdx = -1;
    for (let j = i - 1; j >= 0; j--) {
      if (logT - Math.log(sortedData[j].time) >= L) {
        leftIdx = j;
        break;
      }
    }

    // Find right point (index k)
    let rightIdx = -1;
    for (let k = i + 1; k < sortedData.length; k++) {
      if (Math.log(sortedData[k].time) - logT >= L) {
        rightIdx = k;
        break;
      }
    }

    // If we have both neighbors, calculate weighted derivative
    if (leftIdx !== -1 && rightIdx !== -1) {
      const left = sortedData[leftIdx];
      const right = sortedData[rightIdx];

      // Calculate slopes
      // m1 = (P_i - P_left) / (ln(t_i) - ln(t_left))
      const m1 = (current.pressure - left.pressure) / Math.log(current.time / left.time);
      
      // m2 = (P_right - P_i) / (ln(t_right) - ln(t_i))
      const m2 = (right.pressure - current.pressure) / Math.log(right.time / current.time);

      // Weighting factors
      const w1 = Math.log(right.time / current.time);
      const w2 = Math.log(current.time / left.time);
      const sumW = w1 + w2;

      // Derivative dP/dln(t) = t * dP/dt
      const derivative = (m1 * w1 + m2 * w2) / sumW;

      results.push({
        ...current,
        derivative: Math.abs(derivative) // Usually plotted as absolute value
      });
    } else {
      // Edge cases: use simple adjacent difference if possible or null
      results.push({
        ...current,
        derivative: null
      });
    }
  }

  return results;
};