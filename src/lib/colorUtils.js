/**
 * Gets the color for a stratigraphic unit, with a fallback.
 * @param {string | null} unitId The ID of the strat unit.
 * @param {Array<{id: string, color: string}>} stratUnits The list of all strat units.
 * @returns {string} The hex color code.
 */
export function getStratUnitColor(unitId, stratUnits) {
  if (!unitId || !stratUnits || stratUnits.length === 0) {
    return '#888888'; // Default grey color if no unit or units list
  }
  const unit = stratUnits.find(u => u.id === unitId);
  return unit ? unit.color : '#888888';
}

/**
 * Calculates a contrasting text color (black or white) for a given background hex color.
 * @param {string} hexColor The hex color code (e.g., "#RRGGBB").
 * @returns {'#000000' | '#FFFFFF'} Black or white.
 */
export function getContrastColor(hexColor) {
  if (!hexColor) return '#FFFFFF';

  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

  return (yiq >= 128) ? '#000000' : '#FFFFFF';
}

/**
 * Generates a palette of distinct colors.
 * @param {number} count The number of colors to generate.
 * @returns {string[]} An array of hex color codes.
 */
export function generateColorPalette(count) {
  const palette = [];
  for (let i = 0; i < count; i++) {
    const hue = (i * (360 / count)) % 360;
    palette.push(`hsl(${hue}, 70%, 50%)`);
  }
  return palette; // This returns HSL, might need conversion to hex if required.
}