export const validateProductionData = (data) => {
    const errors = [];
    if (!Array.isArray(data) || data.length === 0) {
        return { isValid: false, errors: ["Data is empty or invalid format"] };
    }
    
    // Check first row for basic structure
    const sample = data[0];
    if (!sample.hasOwnProperty('date')) {
        errors.push("Missing 'date' column");
    }
    
    // Warn if no production columns are found, but don't fail strictly as it might be rate data
    const hasProduction = ['Np', 'Gp', 'Wp', 'oilProd', 'gasProd', 'waterProd'].some(key => sample.hasOwnProperty(key));
    if (!hasProduction) {
        errors.push("No recognizable production columns found (Np, Gp, Wp)");
    }

    return { isValid: errors.length === 0, errors };
};

export const validatePressureData = (data) => {
    const errors = [];
    if (!Array.isArray(data) || data.length === 0) {
        return { isValid: false, errors: ["No pressure data provided"] };
    }
    
    if (!data[0].hasOwnProperty('pressure')) {
        errors.push("Missing 'pressure' column");
    }
    
    return { isValid: errors.length === 0, errors };
};

export const validatePVTData = (data) => {
    const errors = [];
    if (!Array.isArray(data) || data.length === 0) {
        return { isValid: false, errors: ["No PVT data provided"] };
    }
    
    if (!data[0].hasOwnProperty('pressure')) {
        errors.push("Missing 'pressure' column");
    }
    
    return { isValid: errors.length === 0, errors };
};

export const validateDiagnosticData = (data) => {
    if (!Array.isArray(data)) return { isValid: false, message: "Data is not an array" };
    if (data.length < 3) return { isValid: false, message: "Insufficient data points (minimum 3 required)" };
    return { isValid: true };
};

export const validateRegressionResults = (results) => {
    if (!results) return { isValid: false, message: "No results provided" };
    const required = ['slope', 'intercept', 'r2'];
    const missing = required.filter(k => !results.hasOwnProperty(k));
    return { 
        isValid: missing.length === 0, 
        message: missing.length > 0 ? `Missing keys: ${missing.join(', ')}` : "Valid" 
    };
};

export const checkDataSufficiency = (data) => {
    return data && Array.isArray(data) && data.length >= 3;
};