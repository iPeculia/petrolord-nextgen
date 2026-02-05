/**
 * Calculates the Bourdet derivative for pressure transient analysis.
 * Uses the L-spline algorithm (weighted difference) on logarithmic time.
 * 
 * @param {Array} data - Array of {time, pressure} objects. Time must be delta-time.
 * @param {number} L - Smoothing parameter (distance on log cycle), typically 0.1 to 0.5.
 * @returns {Array} Array of objects with original data plus 'derivative'.
 */
export const calculateBourdetDerivative = (data, L = 0.2) => {
  if (!data || data.length < 3) return data;

  // 1. Ensure sorted positive time
  const cleanData = data
    .filter(d => d.time > 0)
    .sort((a, b) => a.time - b.time);

  const results = [];

  for (let i = 0; i < cleanData.length; i++) {
    const current = cleanData[i];
    const logTi = Math.log(current.time); // Natural log for calculation

    // 2. Find Left and Right neighbors based on L-spacing
    // We look for points where |ln(t) - ln(ti)| >= L
    
    let leftIdx = -1;
    let rightIdx = -1;

    // Search left
    for (let j = i - 1; j >= 0; j--) {
      if (logTi - Math.log(cleanData[j].time) >= L) {
        leftIdx = j;
        break;
      }
    }

    // Search right
    for (let k = i + 1; k < cleanData.length; k++) {
      if (Math.log(cleanData[k].time) - logTi >= L) {
        rightIdx = k;
        break;
      }
    }

    // 3. Calculate Derivative
    let derivative = null;

    if (leftIdx !== -1 && rightIdx !== -1) {
        // Central difference using weighted slopes
        const left = cleanData[leftIdx];
        const right = cleanData[rightIdx];

        // Slopes in semi-log coordinates: dp/dln(t)
        // m1 = (P_i - P_left) / (ln(t_i) - ln(t_left))
        const dLogT_left = Math.log(current.time / left.time);
        const m1 = (current.pressure - left.pressure) / dLogT_left;

        // m2 = (P_right - P_i) / (ln(t_right) - ln(t_i))
        const dLogT_right = Math.log(right.time / current.time);
        const m2 = (right.pressure - current.pressure) / dLogT_right;

        // Weighted average based on spacing
        // dP/dln(t) = (m1 * w1 + m2 * w2) / (w1 + w2)
        // where w1 = dLogT_right and w2 = dLogT_left
        derivative = (m1 * dLogT_right + m2 * dLogT_left) / (dLogT_right + dLogT_left);
    
    } else if (leftIdx !== -1) {
        // Backward difference
        const left = cleanData[leftIdx];
        derivative = (current.pressure - left.pressure) / Math.log(current.time / left.time);
    } else if (rightIdx !== -1) {
        // Forward difference
        const right = cleanData[rightIdx];
        derivative = (right.pressure - current.pressure) / Math.log(right.time / current.time);
    }

    // Store result (absolute value is standard convention for derivatives in log-log)
    results.push({
        ...current,
        derivative: derivative !== null ? Math.abs(derivative) : null
    });
  }

  // Map back to original structure if needed, filling nulls for skipped points
  return results;
};