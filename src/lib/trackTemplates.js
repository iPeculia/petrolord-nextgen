export const templates = {
  'GR_ONLY': {
    name: 'GR Only',
    description: 'A single Gamma Ray track.',
    curves: [
      { name: 'gr', unit: 'API', scale: 'linear', color: '#00FF00', min_value: 0, max_value: 150 },
    ],
  },
  'GR_RESISTIVITY': {
    name: 'GR + Resistivity',
    description: 'Gamma Ray and deep/shallow resistivity.',
    curves: [
      { name: 'gr', unit: 'API', scale: 'linear', color: '#00FF00', min_value: 0, max_value: 150 },
      { name: 'resd', unit: 'ohm.m', scale: 'logarithmic', color: '#FF0000', min_value: 0.2, max_value: 2000 },
      { name: 'ress', unit: 'ohm.m', scale: 'logarithmic', color: '#FFA500', min_value: 0.2, max_value: 2000 },
    ],
  },
  'TRIPLE_COMBO': {
    name: 'Triple Combo',
    description: 'GR, Density (RHOB), and Neutron (NPHI).',
    curves: [
      { name: 'gr', unit: 'API', scale: 'linear', color: '#00FF00', min_value: 0, max_value: 150 },
      { name: 'rhob', unit: 'g/cc', scale: 'linear', color: '#0000FF', min_value: 1.95, max_value: 2.95 },
      { name: 'nphi', unit: 'v/v', scale: 'linear', color: '#FF00FF', min_value: 0.45, max_value: -0.15 },
    ],
  },
  'PETROPHYSICS': {
    name: 'Full Petrophysics',
    description: 'A comprehensive set for petrophysical analysis.',
    curves: [
      { name: 'gr', unit: 'API', scale: 'linear', color: '#00FF00', min_value: 0, max_value: 150 },
      { name: 'resd', unit: 'ohm.m', scale: 'logarithmic', color: '#FF0000', min_value: 0.2, max_value: 2000 },
      { name: 'rhob', unit: 'g/cc', scale: 'linear', color: '#0000FF', min_value: 1.95, max_value: 2.95 },
      { name: 'nphi', unit: 'v/v', scale: 'linear', color: '#FF00FF', min_value: 0.45, max_value: -0.15 },
      { name: 'sw', unit: 'v/v', scale: 'linear', color: '#00BFFF', min_value: 0, max_value: 1 },
    ],
  },
};

/**
 * Applies a template to a specific well in the store.
 * @param {string} templateKey - The key of the template to apply.
 * @param {string} wellId - The ID of the well to apply the template to.
 * @param {Function} setWellCurves - The Zustand store action to set the curves for a well.
 */
export function applyTemplate(templateKey, wellId, setWellCurves) {
  const template = templates[templateKey];
  if (!template) {
    console.error(`Template with key "${templateKey}" not found.`);
    return;
  }
  
  const curvesForWell = template.curves.map(curveConfig => ({
    name: curveConfig.name,
    unit: curveConfig.unit,
    scale_mode: curveConfig.scale,
    color: curveConfig.color,
    min_value: curveConfig.min_value,
    max_value: curveConfig.max_value,
  }));

  setWellCurves(wellId, curvesForWell);
}