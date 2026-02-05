import { useMemo } from 'react';

export const useChangeDetection = (initialData, currentData, sections, originalSections) => {
  const changes = useMemo(() => {
    const detectedChanges = [];

    // Check basic fields if editing
    if (initialData) {
      if (currentData.name !== initialData.name) detectedChanges.push({ field: 'Design Name', old: initialData.name, new: currentData.name });
      if (Number(currentData.od) !== Number(initialData.od)) detectedChanges.push({ field: 'Outer Diameter', old: initialData.od, new: currentData.od });
      if (currentData.type !== initialData.type) detectedChanges.push({ field: 'String Type', old: initialData.type, new: currentData.type });
      
      // Check section count
      if (sections.length !== originalSections.length) {
        detectedChanges.push({ 
          field: 'Section Count', 
          old: originalSections.length, 
          new: sections.length 
        });
      }
    }

    return detectedChanges;
  }, [initialData, currentData, sections, originalSections]);

  return changes;
};