/**
 * Service for validating volumetric inputs
 */

export const InputValidator = {
  validateSimpleInput: (data) => {
    const errors = {};
    const warnings = {};

    // Required Fields
    const requiredFields = ['area', 'thickness', 'porosity', 'water_saturation', 'formation_volume_factor'];
    requiredFields.forEach(field => {
      if (data[field] === undefined || data[field] === '' || data[field] === null) {
        errors[field] = 'This field is required';
      }
    });

    // Numeric Ranges
    if (data.porosity) {
      const phi = parseFloat(data.porosity);
      if (phi < 0 || phi > 1) errors.porosity = 'Porosity must be between 0 and 1';
      else if (phi > 0.4) warnings.porosity = 'High porosity value (> 40%)';
    }

    if (data.water_saturation) {
      const sw = parseFloat(data.water_saturation);
      if (sw < 0 || sw > 1) errors.water_saturation = 'Water saturation must be between 0 and 1';
    }

    if (data.recovery_factor) {
        const rf = parseFloat(data.recovery_factor);
        if (rf < 0 || rf > 1) errors.recovery_factor = 'Recovery Factor must be between 0 and 1';
    }

    if (data.formation_volume_factor) {
        const bo = parseFloat(data.formation_volume_factor);
        if (bo < 1) warnings.formation_volume_factor = 'Bo is typically >= 1.0';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      warnings
    };
  },

  validateHybridInput: (data) => {
      // Simplified validation for hybrid inputs
      const errors = {};
      if (!data.production_profile || data.production_profile.length === 0) {
          errors.production_profile = "Production profile is required";
      }
      return { isValid: Object.keys(errors).length === 0, errors, warnings: {} };
  },

  validateSurfacesInput: (data) => {
      // Simplified validation for surfaces
      const errors = {};
      if(!data.top_surface) errors.top_surface = "Top surface is missing";
      if(!data.base_surface) errors.base_surface = "Base surface is missing";
      return { isValid: Object.keys(errors).length === 0, errors, warnings: {} };
  }
};