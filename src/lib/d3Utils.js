// D3-like scaling functions for the correlation panel
// NOTE: These are simplified implementations and do not cover all D3 edge cases.

/**
 * Creates a linear scale function for depth.
 * @param {number} depthMin The minimum depth in the domain.
 * @param {number} depthMax The maximum depth in the domain.
 * @param {number} height The height of the output range.
 * @returns {(depth: number) => number} A function that converts depth to a pixel Y coordinate.
 */
export function createDepthScale(depthMin, depthMax, height) {
  const domain = [depthMin, depthMax];
  const range = [0, height];
  
  const scale = (depth) => {
    if (domain[1] === domain[0]) return range[0];
    const t = (depth - domain[0]) / (domain[1] - domain[0]);
    return range[0] + t * (range[1] - range[0]);
  };
  
  scale.invert = (y) => {
      if (range[1] === range[0]) return domain[0];
      const t = (y - range[0]) / (range[1] - range[0]);
      return domain[0] + t * (domain[1] - domain[0]);
  };

  scale.domain = () => domain;
  scale.range = () => range;

  return scale;
}

/**
 * Creates a value scale function for log curves.
 * @param {number} minValue The minimum value in the domain.
 * @param {number} maxValue The maximum value in the domain.
 * @param {number} width The width of the output range.
 * @param {'linear' | 'logarithmic'} scaleMode The type of scale.
 * @returns {(value: number) => number} A function that converts a curve value to a pixel X coordinate.
 */
export function createValueScale(minValue, maxValue, width, scaleMode = 'linear') {
  const domain = [minValue, maxValue];
  const range = [0, width];

  if (scaleMode === 'logarithmic') {
    // Handle log scale, ensuring domain values are positive
    const logMin = Math.log(Math.max(0.1, domain[0]));
    const logMax = Math.log(Math.max(0.1, domain[1]));
    
    const scale = (value) => {
      if (value <= 0) return range[0];
      const logValue = Math.log(value);
      if (logMax === logMin) return range[0];
      const t = (logValue - logMin) / (logMax - logMin);
      return range[0] + t * (range[1] - range[0]);
    };

    scale.invert = (x) => {
        if(range[1] === range[0]) return domain[0];
        const t = (x - range[0]) / (range[1] - range[0]);
        return Math.exp(logMin + t * (logMax - logMin));
    };
    scale.domain = () => domain;
    return scale;
  }

  // Linear scale
  const scale = (value) => {
    if (domain[1] === domain[0]) return range[0];
    const t = (value - domain[0]) / (domain[1] - domain[0]);
    return range[0] + t * (range[1] - range[0]);
  };
  
  scale.invert = (x) => {
    if (range[1] === range[0]) return domain[0];
    const t = (x - range[0]) / (range[1] - range[0]);
    return domain[0] + t * (domain[1] - domain[0]);
  };
  scale.domain = () => domain;
  return scale;
}

export const getDepthAtPixel = (pixelY, depthScale) => depthScale.invert(pixelY);
export const getPixelAtDepth = (depth, depthScale) => depthScale(depth);
export const getValueAtPixel = (pixelX, valueScale) => valueScale.invert(pixelX);
export const getPixelAtValue = (value, valueScale) => valueScale(value);

/**
 * Linear interpolation between two numbers.
 * @param {number} a The start value.
 * @param {number} b The end value.
 * @param {number} t The interpolation factor (0 to 1).
 * @returns {number} The interpolated value.
 */
export function interpolate(a, b, t) {
  return a + (b - a) * t;
}