export const calculateTotalDepth = (sections) => {
  if (!sections || sections.length === 0) return 0;
  // Assumes sections might be out of order, finds the deepest point
  return Math.max(...sections.map(s => Number(s.bottom_depth) || 0));
};

export const calculateTotalWeight = (sections) => {
  if (!sections || sections.length === 0) return 0;
  return sections.reduce((sum, s) => {
    const top = Number(s.top_depth) || 0;
    const bottom = Number(s.bottom_depth) || 0;
    const weight = Number(s.weight) || 0;
    // Calculate length, ensuring non-negative
    const length = Math.max(0, bottom - top);
    return sum + (length * weight);
  }, 0);
};

export const calculateAverageGrade = (sections) => {
  if (!sections || sections.length === 0) return "N/A";
  
  // Find the most frequent grade (mode)
  const counts = {};
  let maxCount = 0;
  let mode = sections[0].grade;

  sections.forEach(s => {
    const g = s.grade || "Unknown";
    counts[g] = (counts[g] || 0) + 1;
    if (counts[g] > maxCount) {
      maxCount = counts[g];
      mode = g;
    }
  });

  return mode;
};

export const formatCurrency = (val) => {
   return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
};

export const formatNumber = (val, decimals = 2) => {
    const num = Number(val);
    return isNaN(num) ? '0' : num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
};