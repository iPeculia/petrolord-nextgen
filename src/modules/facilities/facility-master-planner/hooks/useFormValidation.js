import { useState, useCallback } from 'react';

const useFormValidation = (initialState, validationRules) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((field, value) => {
    setValues(prev => ({ ...prev, [field]: value }));
    // Clear error on change if it exists
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  const handleBlur = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    // Optional: Validate on blur
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const rules = validationRules[field];
      const value = values[field];

      if (rules.required && (value === undefined || value === null || value === '')) {
        newErrors[field] = 'This field is required';
        isValid = false;
      } else if (rules.min && typeof value === 'number' && value < rules.min) {
        newErrors[field] = `Must be at least ${rules.min}`;
        isValid = false;
      } else if (rules.max && typeof value === 'number' && value > rules.max) {
        newErrors[field] = `Must be at most ${rules.max}`;
        isValid = false;
      } else if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
        newErrors[field] = `Must be at least ${rules.minLength} characters`;
        isValid = false;
      } else if (rules.custom && !rules.custom(value, values)) {
        newErrors[field] = rules.message || 'Invalid value';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules]);

  const reset = useCallback(() => {
    setValues(initialState);
    setErrors({});
    setTouched({});
  }, [initialState]);

  return { values, errors, touched, handleChange, handleBlur, validate, setValues, reset };
};

export default useFormValidation;