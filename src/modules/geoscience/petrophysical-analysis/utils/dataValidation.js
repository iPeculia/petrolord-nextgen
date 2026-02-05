/**
 * Utility functions for validating petrophysical data
 */

export const validateWellLogData = (data) => {
    if (!Array.isArray(data)) {
        return { isValid: false, message: "Data must be an array" };
    }
    
    if (data.length === 0) {
        return { isValid: true, message: "Empty data set" };
    }

    // Check basic structure of first item
    const firstItem = data[0];
    if (!firstItem.hasOwnProperty('log_type') || !firstItem.hasOwnProperty('value_array')) {
        return { isValid: false, message: "Data items missing required fields (log_type, value_array)" };
    }

    return { isValid: true, message: "Valid" };
};

export const validateParameters = (params) => {
    if (!params) return { isValid: false, message: "No parameters provided" };
    
    const required = ['matrixDensity', 'fluidDensity'];
    const missing = required.filter(r => params[r] === undefined || params[r] === null);
    
    if (missing.length > 0) {
        return { isValid: false, message: `Missing parameters: ${missing.join(', ')}` };
    }
    
    return { isValid: true };
};