/**
 * @typedef {Object} Project
 * @property {string} id - UUID
 * @property {string} name
 * @property {string} [description]
 * @property {string} owner_id - UUID of the owner user
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Well
 * @property {string} id - UUID
 * @property {string} project_id - UUID of the parent project
 * @property {string} name
 * @property {string} [field]
 * @property {string} [operator]
 * @property {number} [surface_x]
 * @property {number} [surface_y]
 * @property {number} [kb] - Kelly Bushing elevation
 * @property {number} [gl] - Ground Level elevation
 * @property {string} [datum_type] - e.g., 'MSL'
 * @property {number} [td] - Total Depth
 * @property {string} [status] - e.g., 'Active'
 */

/**
 * @typedef {Object} Wellbore
 * @property {string} id - UUID
 * @property {string} well_id - UUID of the parent well
 * @property {string} name
 * @property {string} [type] - e.g., 'Vertical', 'Deviated'
 * @property {string} [status] - e.g., 'Active'
 */

/**
 * @typedef {Object} LogCurve
 * @property {string} id - UUID
 * @property {string} wellbore_id - UUID of the parent wellbore
 * @property {string} name - Mnemonic, e.g., 'GR'
 * @property {string} [curve_type] - e.g., 'Gamma Ray'
 * @property {string} [unit] - e.g., 'API'
 * @property {number} [sampling_step]
 * @property {string} [source] - e.g., 'Manual', 'LAS Import'
 */

/**
 * @typedef {Object} LogCurveSample
 * @property {string} id - UUID
 * @property {string} log_curve_id - UUID of the parent log curve
 * @property {number} depth_md - Measured Depth
 * @property {number} [depth_tvd] - True Vertical Depth
 * @property {number} [depth_tvdss] - True Vertical Depth Sub-Sea
 * @property {number} [value]
 */

/**
 * @typedef {Object} StratUnit
 * @property {string} id - UUID
 * @property {string} project_id - UUID of the parent project
 * @property {string} name
 * @property {string} [code]
 * @property {string} [color] - Hex color code
 * @property {string} [description]
 * @property {number} [order_index]
 */

/**
 * @typedef {Object} WellTop
 * @property {string} id - UUID
 * @property {string} wellbore_id - UUID of the parent wellbore
 * @property {string} top_name
 * @property {string} [strat_unit_id] - UUID of the associated strat unit
 * @property {number} depth_md - Measured Depth
 * @property {number} [depth_tvd] - True Vertical Depth
 * @property {string} [pick_quality] - e.g., 'Certain', 'Probable'
 * @property {string} [source] - e.g., 'Manual', 'Pick'
 */

/**
 * @typedef {Object} CorrelationPanel
 * @property {string} id - UUID
 * @property {string} project_id - UUID of the parent project
 * @property {string} name
 * @property {string} [description]
 * @property {string} [reference_datum] - e.g., 'MSL', 'KB'
 * @property {string} [flatten_on_top_id] - UUID of a well_top to flatten on
 * @property {string} [depth_mode] - e.g., 'TVD', 'MD'
 */

/**
 * @typedef {Object} CorrelationLine
 * @property {string} id - UUID
 * @property {string} panel_id - UUID of the parent panel
 * @property {string} from_top_id - UUID of the starting well_top
 * @property {string} to_top_id - UUID of the ending well_top
 * @property {string} [style] - e.g., 'solid', 'dashed'
 * @property {string} [color] - Hex color code
 * @property {number} [confidence_score]
 */

// This file is for type definitions only. No actual code is exported.
export {};