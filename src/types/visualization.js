/**
 * @typedef {'linear' | 'logarithmic'} ScaleMode
 */

/**
 * @typedef {Object} DepthRange
 * @property {number} min
 * @property {number} max
 */

/**
 * @typedef {Object} CurveTrack
 * @property {string} curveId
 * @property {string} name
 * @property {string} unit
 * @property {number} minValue
 * @property {number} maxValue
 * @property {ScaleMode} scaleMode
 * @property {string} color
 * @property {boolean} visible
 */

/**
 * @typedef {Object} PanelState
 * @property {number} depthMin
 * @property {number} depthMax
 * @property {number} zoomLevel
 * @property {string | null} selectedWellId
 * @property {string | null} selectedTopId
 * @property {string[]} visibleCurves
 */

/**
 * @typedef {'MD' | 'TVD' | 'TVDSS'} DepthMode
 */

/**
 * @typedef {Object} VisualizationConfig
 * @property {number} width
 * @property {number} height
 * @property {DepthMode} depthMode
 * @property {number} referenceDepth
 */

export {};