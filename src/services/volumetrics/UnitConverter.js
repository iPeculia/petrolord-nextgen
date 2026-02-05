/**
 * Service for handling unit conversions in Volumetrics Pro
 */

export const CONVERSION_FACTORS = {
  // Length
  FT_TO_M: 0.3048,
  M_TO_FT: 3.28084,
  
  // Area
  ACRES_TO_HECTARES: 0.404686,
  HECTARES_TO_ACRES: 2.47105,
  SQFT_TO_SQM: 0.092903,
  SQM_TO_SQFT: 10.7639,

  // Volume
  BBL_TO_M3: 0.158987,
  M3_TO_BBL: 6.28981,
  CF_TO_M3: 0.0283168,
  M3_TO_CF: 35.3147,

  // Pressure
  PSI_TO_BAR: 0.0689476,
  BAR_TO_PSI: 14.5038,
  KPA_TO_PSI: 0.145038,
  PSI_TO_KPA: 6.89476,
  
  // Density
  LB_CF_TO_KG_M3: 16.0185,
  KG_M3_TO_LB_CF: 0.062428,
};

export const UnitConverter = {
  convert: (value, fromUnit, toUnit) => {
    if (value === null || value === undefined || value === '') return value;
    
    const val = parseFloat(value);
    if (isNaN(val)) return value;

    // Same unit check
    if (fromUnit === toUnit) return val;

    // Metric <-> Imperial Logic
    // Length
    if (fromUnit === 'ft' && toUnit === 'm') return val * CONVERSION_FACTORS.FT_TO_M;
    if (fromUnit === 'm' && toUnit === 'ft') return val * CONVERSION_FACTORS.M_TO_FT;

    // Area
    if (fromUnit === 'acres' && toUnit === 'hectares') return val * CONVERSION_FACTORS.ACRES_TO_HECTARES;
    if (fromUnit === 'hectares' && toUnit === 'acres') return val * CONVERSION_FACTORS.HECTARES_TO_ACRES;
    
    // Volume
    if (fromUnit === 'bbl' && toUnit === 'm3') return val * CONVERSION_FACTORS.BBL_TO_M3;
    if (fromUnit === 'm3' && toUnit === 'bbl') return val * CONVERSION_FACTORS.M3_TO_BBL;

    // Pressure
    if (fromUnit === 'psi' && toUnit === 'bar') return val * CONVERSION_FACTORS.PSI_TO_BAR;
    if (fromUnit === 'bar' && toUnit === 'psi') return val * CONVERSION_FACTORS.BAR_TO_PSI;

    return val;
  },

  convertProjectData: (data, targetSystem) => {
    // Helper to recursively convert data object based on known keys
    // This is a simplified version; in production, mapping would be more explicit
    const newData = { ...data };
    
    // Example: Convert depth if system changes
    if (targetSystem === 'Metric' && data.thickness_unit === 'ft') {
        newData.thickness = UnitConverter.convert(data.thickness, 'ft', 'm');
        newData.thickness_unit = 'm';
        newData.area = UnitConverter.convert(data.area, 'acres', 'hectares');
        newData.area_unit = 'hectares';
    } else if (targetSystem === 'Imperial' && data.thickness_unit === 'm') {
        newData.thickness = UnitConverter.convert(data.thickness, 'm', 'ft');
        newData.thickness_unit = 'ft';
        newData.area = UnitConverter.convert(data.area, 'hectares', 'acres');
        newData.area_unit = 'acres';
    }

    return newData;
  }
};