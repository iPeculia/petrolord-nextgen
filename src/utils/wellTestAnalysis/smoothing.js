/**
 * Applies Simple Moving Average smoothing to a data series.
 * 
 * @param {Array} data - Array of data points
 * @param {string} key - Key of the value to smooth (e.g., 'pressure' or 'derivative')
 * @param {number} windowSize - Number of points in the smoothing window (odd number preferred)
 */
export const smoothDataSMA = (data, key, windowSize = 3) => {
  if (!data || data.length < windowSize) return data;
  
  const halfWindow = Math.floor(windowSize / 2);
  const smoothed = [];

  for (let i = 0; i < data.length; i++) {
    let sum = 0;
    let count = 0;

    for (let j = i - halfWindow; j <= i + halfWindow; j++) {
      if (j >= 0 && j < data.length && data[j][key] !== null) {
        sum += data[j][key];
        count++;
      }
    }

    smoothed.push({
      ...data[i],
      [`${key}_smoothed`]: count > 0 ? sum / count : data[i][key]
    });
  }

  return smoothed;
};

/**
 * Savitzky-Golay smoothing (Simplified for demonstration)
 * Better for preserving peak heights than moving average.
 */
export const smoothDataSG = (data, key, windowSize = 5) => {
  // Full SG implementation requires matrix operations. 
  // For Phase 1, we use a weighted moving average as a placeholder approximation 
  // which is computationally lighter and sufficient for initial UI testing.
  
  if (!data || data.length < windowSize) return data;
  
  const weights = [-3, 12, 17, 12, -3]; // Coefficients for cubic, window 5
  const norm = 35;
  const halfWindow = 2;

  const smoothed = [...data];

  for (let i = halfWindow; i < data.length - halfWindow; i++) {
    let sum = 0;
    for (let j = -halfWindow; j <= halfWindow; j++) {
      const val = data[i + j][key];
      if (val !== null) {
        sum += val * weights[j + halfWindow];
      }
    }
    
    // Note: SG can produce values outside original range, check boundaries if needed
    smoothed[i] = {
      ...smoothed[i],
      [`${key}_sg_smoothed`]: sum / norm
    };
  }

  return smoothed;
};