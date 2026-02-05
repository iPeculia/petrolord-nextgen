/**
 * DEPARTMENT MODULE MAPPING CONFIGURATION
 * ----------------------------------------
 * Source: Official Petrolord Module Alignment Matrix (2026-01-28)
 * 
 * Logic Principles:
 * 1. Departments are grouped by faculty/discipline.
 * 2. Each department is mapped to specific Petrolord modules.
 * 3. 'is_primary' denotes core curriculum relevance (Required).
 * 4. 'is_optional' denotes supplementary relevance (Elective).
 * 
 * Special Exceptions (as per directive):
 * - Mathematics/Statistics: 'Economics' is Primary, 'Reservoir' is Optional (not Primary).
 * - Computer Science/IT: 'Economics' and 'Production' are both Primary.
 * - Petroleum Engineering: All mapped modules are Primary due to broad relevance.
 */

export const MODULE_KEYS = {
  GEOSCIENCE: 'Geoscience',
  RESERVOIR: 'Reservoir',
  DRILLING: 'Drilling',
  PRODUCTION: 'Production',
  FACILITIES: 'Facilities',
  ECONOMICS: 'Economics'
};

export const DEPARTMENT_MAPPINGS = {
  // --- GEOSCIENCE & PHYSICS ---
  'Geology': {
    modules: [MODULE_KEYS.GEOSCIENCE, MODULE_KEYS.RESERVOIR],
    primary: [MODULE_KEYS.GEOSCIENCE, MODULE_KEYS.RESERVOIR]
  },
  'Applied Geology': {
    modules: [MODULE_KEYS.GEOSCIENCE, MODULE_KEYS.RESERVOIR],
    primary: [MODULE_KEYS.GEOSCIENCE, MODULE_KEYS.RESERVOIR]
  },
  'Geophysics': {
    modules: [MODULE_KEYS.GEOSCIENCE, MODULE_KEYS.RESERVOIR],
    primary: [MODULE_KEYS.GEOSCIENCE, MODULE_KEYS.RESERVOIR]
  },
  'Earth Science': {
    modules: [MODULE_KEYS.GEOSCIENCE, MODULE_KEYS.RESERVOIR],
    primary: [MODULE_KEYS.GEOSCIENCE, MODULE_KEYS.RESERVOIR]
  },
  'Physics': {
    modules: [MODULE_KEYS.GEOSCIENCE],
    primary: [MODULE_KEYS.GEOSCIENCE]
  },

  // --- MATHEMATICS & STATISTICS (Special Handling) ---
  'Mathematics': {
    modules: [MODULE_KEYS.RESERVOIR, MODULE_KEYS.ECONOMICS],
    primary: [MODULE_KEYS.ECONOMICS], 
    optional: [MODULE_KEYS.RESERVOIR]
  },
  'Statistics': {
    modules: [MODULE_KEYS.RESERVOIR, MODULE_KEYS.ECONOMICS],
    primary: [MODULE_KEYS.ECONOMICS],
    optional: [MODULE_KEYS.RESERVOIR]
  },
  'Geography': {
    modules: [MODULE_KEYS.GEOSCIENCE, MODULE_KEYS.ECONOMICS],
    primary: [MODULE_KEYS.GEOSCIENCE, MODULE_KEYS.ECONOMICS]
  },

  // --- ENGINEERING ---
  'Petroleum Engineering': {
    modules: [MODULE_KEYS.GEOSCIENCE, MODULE_KEYS.RESERVOIR, MODULE_KEYS.DRILLING, MODULE_KEYS.PRODUCTION, MODULE_KEYS.FACILITIES, MODULE_KEYS.ECONOMICS],
    primary: [MODULE_KEYS.GEOSCIENCE, MODULE_KEYS.RESERVOIR, MODULE_KEYS.DRILLING, MODULE_KEYS.PRODUCTION, MODULE_KEYS.FACILITIES, MODULE_KEYS.ECONOMICS]
  },
  'Chemical Engineering': {
    modules: [MODULE_KEYS.RESERVOIR, MODULE_KEYS.PRODUCTION, MODULE_KEYS.FACILITIES],
    primary: [MODULE_KEYS.RESERVOIR, MODULE_KEYS.PRODUCTION, MODULE_KEYS.FACILITIES]
  },
  'Mechanical Engineering': {
    modules: [MODULE_KEYS.DRILLING, MODULE_KEYS.PRODUCTION, MODULE_KEYS.FACILITIES],
    primary: [MODULE_KEYS.DRILLING, MODULE_KEYS.PRODUCTION, MODULE_KEYS.FACILITIES]
  },
  'Mining Engineering': {
    modules: [MODULE_KEYS.DRILLING],
    primary: [MODULE_KEYS.DRILLING]
  },
  'Industrial Engineering': {
    modules: [MODULE_KEYS.FACILITIES, MODULE_KEYS.ECONOMICS],
    primary: [MODULE_KEYS.FACILITIES, MODULE_KEYS.ECONOMICS]
  },
  'Electrical/Electronics Engineering': {
    modules: [MODULE_KEYS.PRODUCTION, MODULE_KEYS.FACILITIES],
    primary: [MODULE_KEYS.PRODUCTION, MODULE_KEYS.FACILITIES]
  },
  'Civil Engineering': {
    modules: [MODULE_KEYS.FACILITIES],
    primary: [MODULE_KEYS.FACILITIES]
  },
  'Production Engineering': {
    modules: [MODULE_KEYS.PRODUCTION, MODULE_KEYS.FACILITIES],
    primary: [MODULE_KEYS.PRODUCTION, MODULE_KEYS.FACILITIES]
  },
  'Process Engineering': {
    modules: [MODULE_KEYS.FACILITIES, MODULE_KEYS.PRODUCTION],
    primary: [MODULE_KEYS.FACILITIES, MODULE_KEYS.PRODUCTION]
  },
  'Industrial Technology': {
    modules: [MODULE_KEYS.FACILITIES],
    primary: [MODULE_KEYS.FACILITIES]
  },
  'Surveying & Geoinformatics': {
    modules: [MODULE_KEYS.GEOSCIENCE, MODULE_KEYS.FACILITIES],
    primary: [MODULE_KEYS.GEOSCIENCE, MODULE_KEYS.FACILITIES]
  },
  'Environmental Management': {
    modules: [MODULE_KEYS.FACILITIES, MODULE_KEYS.ECONOMICS],
    primary: [MODULE_KEYS.FACILITIES, MODULE_KEYS.ECONOMICS]
  },
  'Urban & Regional Planning': {
    modules: [MODULE_KEYS.FACILITIES, MODULE_KEYS.ECONOMICS],
    primary: [MODULE_KEYS.FACILITIES, MODULE_KEYS.ECONOMICS]
  },

  // --- BUSINESS & MANAGEMENT ---
  'Estate Management': {
    modules: [MODULE_KEYS.ECONOMICS],
    primary: [MODULE_KEYS.ECONOMICS]
  },
  'Economics': {
    modules: [MODULE_KEYS.ECONOMICS],
    primary: [MODULE_KEYS.ECONOMICS]
  },
  'Accounting': {
    modules: [MODULE_KEYS.ECONOMICS],
    primary: [MODULE_KEYS.ECONOMICS]
  },
  'Finance': {
    modules: [MODULE_KEYS.ECONOMICS],
    primary: [MODULE_KEYS.ECONOMICS]
  },
  'Business Administration': {
    modules: [MODULE_KEYS.ECONOMICS],
    primary: [MODULE_KEYS.ECONOMICS]
  },
  'Project Management': {
    modules: [MODULE_KEYS.ECONOMICS],
    primary: [MODULE_KEYS.ECONOMICS]
  },

  // --- TECHNOLOGY ---
  'Computer Science': {
    modules: [MODULE_KEYS.ECONOMICS, MODULE_KEYS.PRODUCTION],
    primary: [MODULE_KEYS.ECONOMICS, MODULE_KEYS.PRODUCTION]
  },
  'Information Technology': {
    modules: [MODULE_KEYS.ECONOMICS, MODULE_KEYS.PRODUCTION],
    primary: [MODULE_KEYS.ECONOMICS, MODULE_KEYS.PRODUCTION]
  },
  'Software Engineering': {
    modules: [MODULE_KEYS.ECONOMICS, MODULE_KEYS.PRODUCTION],
    primary: [MODULE_KEYS.ECONOMICS, MODULE_KEYS.PRODUCTION]
  }
};

/**
 * Helper to get mapping configuration for a department name
 * Supports fuzzy matching for common variations.
 */
export const getDepartmentMapping = (departmentName) => {
  if (!departmentName) return null;
  
  // Direct match
  if (DEPARTMENT_MAPPINGS[departmentName]) {
    return DEPARTMENT_MAPPINGS[departmentName];
  }

  // Case insensitive match
  const key = Object.keys(DEPARTMENT_MAPPINGS).find(k => k.toLowerCase() === departmentName.toLowerCase());
  if (key) return DEPARTMENT_MAPPINGS[key];

  // Fallback defaults for unknown departments
  return {
    modules: [],
    primary: [],
    optional: []
  };
};

/**
 * Returns default primary/optional boolean flags for a given department and module pair.
 */
export const getModuleStatusForDepartment = (departmentName, moduleName) => {
  const mapping = getDepartmentMapping(departmentName);
  if (!mapping) return { is_primary: false, is_optional: false };

  const isPrimary = mapping.primary && mapping.primary.includes(moduleName);
  const isOptional = mapping.optional && mapping.optional.includes(moduleName);
  // If listed in 'modules' but not explicitly in primary or optional lists, assume primary (default behavior)
  const isListed = mapping.modules && mapping.modules.includes(moduleName);
  
  if (isPrimary) return { is_primary: true, is_optional: false };
  if (isOptional) return { is_primary: false, is_optional: true };
  if (isListed) return { is_primary: true, is_optional: false }; // Default fallback

  return { is_primary: false, is_optional: false };
};