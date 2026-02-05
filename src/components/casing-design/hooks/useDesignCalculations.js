import { useMemo } from 'react';
import { calculateTotalDepth, calculateTotalWeight, calculateAverageGrade } from '../utils/calculationUtils';

export const useDesignCalculations = (sections) => {
  const calculations = useMemo(() => {
    return {
      totalDepth: calculateTotalDepth(sections),
      totalWeight: calculateTotalWeight(sections),
      averageGrade: calculateAverageGrade(sections),
      sectionCount: sections.length
    };
  }, [sections]);

  return calculations;
};