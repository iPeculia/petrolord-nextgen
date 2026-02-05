/**
 * Calculates the superposition time function for a constant rate drawdown/buildup sequence.
 * 
 * @param {number} t - Current time since start of test (hours)
 * @param {number} tp - Production time before shut-in (hours)
 * @param {string} type - 'radial' or 'linear' flow regime
 * @returns {number} Superposition time function value
 */
export const calculateSuperpositionTime = (t, tp, type = 'radial') => {
  if (!t || t <= 0) return 0;
  
  // For simple buildup (Horner Time)
  // (tp + dt) / dt
  if (type === 'horner') {
    const dt = t; // Assuming t passed here is delta-t (shut-in time)
    return (tp + dt) / dt;
  }

  // Radial flow superposition: log((tp + dt)/dt)
  if (type === 'radial') {
    const dt = t;
    return Math.log10((tp + dt) / dt);
  }

  // Linear flow superposition (sqrt time)
  if (type === 'linear') {
    const dt = t;
    return Math.sqrt(tp + dt) - Math.sqrt(dt);
  }

  return t;
};

/**
 * Generates an array of superposition time values for a dataset
 */
export const generateSuperpositionData = (data, tp) => {
  if (!data || !tp) return [];
  
  return data.map(point => ({
    ...point,
    hornerTime: calculateSuperpositionTime(point.time, tp, 'horner'),
    radialSuperposition: calculateSuperpositionTime(point.time, tp, 'radial'),
    linearSuperposition: calculateSuperpositionTime(point.time, tp, 'linear')
  }));
};