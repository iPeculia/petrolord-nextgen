/**
 * Validates well data structure for export and processing operations.
 * Ensures all required properties exist to prevent "read properties of undefined" errors.
 * 
 * @param {Object} well - The well object to validate
 * @returns {Object} - { valid: boolean, error: string | null }
 */
export const validateWellData = (well) => {
    if (!well) {
        return { valid: false, error: 'Well data is missing or undefined.' };
    }

    if (!well.name || typeof well.name !== 'string') {
        return { valid: false, error: 'Well name is missing or invalid.' };
    }

    // Check depthRange object existence
    if (!well.depthRange) {
        return { valid: false, error: `Depth range object is missing for well: ${well.name}` };
    }

    // Check for start/stop existence (allowing 0 but not null/undefined)
    // Using strict undefined check to allow 0
    if (well.depthRange.start === undefined || well.depthRange.start === null) {
        return { valid: false, error: `Start depth is missing for well: ${well.name}` };
    }

    if (well.depthRange.stop === undefined || well.depthRange.stop === null) {
        return { valid: false, error: `Stop depth is missing for well: ${well.name}` };
    }

    // Type checks
    if (typeof well.depthRange.start !== 'number' || typeof well.depthRange.stop !== 'number') {
        return { valid: false, error: `Depth values must be numbers for well: ${well.name}` };
    }

    // Basic data integrity for export
    // Not strictly required for existence, but good for export validation
    if (well.curves && !Array.isArray(well.curves)) {
        return { valid: false, error: `Curves structure is invalid for well: ${well.name}` };
    }

    return { valid: true, error: null };
};

/**
 * Validates a collection of wells.
 * 
 * @param {Array} wells - Array of well objects
 * @returns {Object} - { valid: boolean, validWells: Array, errors: Array }
 */
export const validateWellCollection = (wells) => {
    if (!Array.isArray(wells) || wells.length === 0) {
        return { valid: false, validWells: [], errors: ['No wells provided for validation.'] };
    }

    const validWells = [];
    const errors = [];

    wells.forEach(well => {
        const result = validateWellData(well);
        if (result.valid) {
            validWells.push(well);
        } else {
            // Only collect errors for invalid items if needed, or just skip
            // console.warn(`Skipping invalid well: ${result.error}`);
            errors.push(result.error);
        }
    });

    return {
        valid: validWells.length > 0,
        validWells,
        errors
    };
};