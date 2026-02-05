/**
 * Filters samples to only those within the visible depth range.
 * @param {number} depthMin The minimum visible depth.
 * @param {number} depthMax The maximum visible depth.
 * @param {Array<{depth_md: number}>} samples The full list of samples.
 * @returns {Array<{depth_md: number}>} The filtered list of samples.
 */
export function getVisibleSampleRange(depthMin, depthMax, samples) {
  if (!samples) return [];
  // Add a buffer to ensure curves connect smoothly off-screen
  const buffer = (depthMax - depthMin) * 0.1; 
  const min = depthMin - buffer;
  const max = depthMax + buffer;
  return samples.filter(s => s.depth_md >= min && s.depth_md <= max);
}

/**
 * Filters tops to only those within the visible depth range.
 * @param {number} depthMin The minimum visible depth.
 * @param {number} depthMax The maximum visible depth.
 * @param {Array<{depth_md: number}>} tops The full list of tops.
 * @returns {Array<{depth_md: number}>} The filtered list of tops.
 */
export function getVisibleTops(depthMin, depthMax, tops) {
  if (!tops) return [];
  return tops.filter(t => t.depth_md >= depthMin && t.depth_md <= depthMax);
}

/**
 * Filters correlation lines to only those within the visible depth range.
 * @param {number} depthMin The minimum visible depth.
 * @param {number} depthMax The maximum visible depth.
 * @param {Array} lines The full list of lines.
 * @param {Array} allTops The full list of all tops to find line depths.
 * @returns {Array} The filtered list of lines.
 */
export function getVisibleLines(depthMin, depthMax, lines, allTops) {
  if (!lines || !allTops) return [];
  
  const topMap = new Map(allTops.map(t => [t.id, t.depth_md]));

  return lines.filter(line => {
    const fromDepth = topMap.get(line.from_top_id);
    const toDepth = topMap.get(line.to_top_id);
    if (fromDepth === undefined || toDepth === undefined) return false;
    
    const lineMin = Math.min(fromDepth, toDepth);
    const lineMax = Math.max(fromDepth, toDepth);

    // Check if the line's vertical range overlaps with the visible depth range
    return lineMax >= depthMin && lineMin <= depthMax;
  });
}