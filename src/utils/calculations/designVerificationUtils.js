import { calculateSafetyFactor } from './safetyMarginCalculations';

export const verifyBurst = (rating, load, requiredSF) => {
  const sf = calculateSafetyFactor(rating, load);
  return {
    pass: sf >= requiredSF,
    sf: sf,
    rating,
    load
  };
};

export const verifyCollapse = (rating, load, requiredSF) => {
  const sf = calculateSafetyFactor(rating, load);
  return {
    pass: sf >= requiredSF,
    sf: sf,
    rating,
    load
  };
};

export const verifyTension = (rating, load, requiredSF) => {
  const sf = calculateSafetyFactor(rating, load);
  return {
    pass: sf >= requiredSF,
    sf: sf,
    rating,
    load
  };
};