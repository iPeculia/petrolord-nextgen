/**
 * IRR Analysis Data Validation Utilities
 */

export const validateProject = (data) => {
  const errors = {};
  
  if (!data.name || data.name.length < 3 || data.name.length > 100) {
    errors.name = "Name must be between 3 and 100 characters";
  }
  
  if (data.description && data.description.length > 500) {
    errors.description = "Description must be less than 500 characters";
  }
  
  if (!['Oil', 'Gas', 'Renewable', 'Infrastructure'].includes(data.type)) {
    errors.type = "Invalid project type selected";
  }
  
  if (!data.start_date || isNaN(new Date(data.start_date).getTime())) {
    errors.start_date = "Valid start date is required";
  }
  
  if (!data.project_duration_years || data.project_duration_years <= 0 || data.project_duration_years > 100) {
    errors.project_duration_years = "Duration must be between 1 and 100 years";
  }
  
  if (!['Draft', 'Active', 'Completed', 'Archived'].includes(data.status)) {
    errors.status = "Invalid status";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateFinancialParameters = (data) => {
  const errors = {};
  
  if (data.discount_rate_percent === undefined || data.discount_rate_percent < 0 || data.discount_rate_percent > 100) {
    errors.discount_rate_percent = "Discount rate must be between 0 and 100";
  }
  
  if (data.inflation_rate_percent === undefined || data.inflation_rate_percent < 0 || data.inflation_rate_percent > 100) {
    errors.inflation_rate_percent = "Inflation rate must be between 0 and 100";
  }
  
  if (data.tax_rate_percent === undefined || data.tax_rate_percent < 0 || data.tax_rate_percent > 100) {
    errors.tax_rate_percent = "Tax rate must be between 0 and 100";
  }
  
  if (!data.currency) {
    errors.currency = "Currency is required";
  }
  
  if (!data.analysis_date || isNaN(new Date(data.analysis_date).getTime())) {
    errors.analysis_date = "Valid analysis date is required";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateCostStructure = (data) => {
  const errors = {};
  
  if (data.capex_total === undefined || data.capex_total < 0) {
    errors.capex_total = "CAPEX total must be non-negative";
  }
  
  if (data.opex_annual === undefined || data.opex_annual < 0) {
    errors.opex_annual = "Annual OPEX must be non-negative";
  }
  
  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateRevenue = (data) => {
  const errors = {};
  
  if (!['Oil', 'Gas', 'Hybrid'].includes(data.revenue_type)) {
    errors.revenue_type = "Invalid revenue type";
  }
  
  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateScheduleItem = (item, type = 'generic') => {
  const errors = {};
  
  if (!item.year || item.year < 0) {
    errors.year = "Valid year is required";
  }
  
  if (type === 'production') {
    if (!item.volume || item.volume <= 0) errors.volume = "Volume must be positive";
    if (!['bbl', 'MMscf'].includes(item.unit)) errors.unit = "Invalid unit";
    if (!item.price || item.price <= 0) errors.price = "Price must be positive";
  } else {
    // Cost items
    if (item.amount === undefined || item.amount < 0) {
      errors.amount = "Amount must be non-negative";
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};