// Main Calculation Engine for Well Geometry - Audited & Robust

// 1. Core Trajectory Calculation (Tangential Method)
// Added robust parsing to prevent NaN propagation
export const calculateTrajectory = (sections) => {
  if (!Array.isArray(sections)) return [];

  let points = [];
  let currentMD = 0;
  let currentTVD = 0;
  let currentNorth = 0;
  let currentEast = 0;
  let currentInc = 0; // degrees
  let currentAzi = 0; // degrees

  // Initial surface point
  points.push({
    md: 0,
    tvd: 0,
    north: 0,
    east: 0,
    inc: 0,
    azi: 0,
    sectionType: 'Surface',
    holeSize: parseFloat(sections[0]?.holeSize) || 30
  });

  sections.forEach(section => {
    // Robust parsing with fallbacks
    const length = Math.max(0, parseFloat(section.length) || 0);
    const endInc = parseFloat(section.inclination) || 0;
    const endAzi = parseFloat(section.azimuth) || 0;
    const holeSize = parseFloat(section.holeSize) || 0;
    
    // Simple Tangential Method (Phase 2 Standard)
    // Convert to radians
    const i1 = (currentInc * Math.PI) / 180;
    const i2 = (endInc * Math.PI) / 180;
    const a1 = (currentAzi * Math.PI) / 180;
    const a2 = (endAzi * Math.PI) / 180;
    
    // Average angles (Tangential approximation)
    const avgInc = (i1 + i2) / 2;
    const avgAzi = (a1 + a2) / 2;

    const deltaTVD = length * Math.cos(avgInc);
    const deltaH = length * Math.sin(avgInc);
    
    const deltaNorth = deltaH * Math.cos(avgAzi);
    const deltaEast = deltaH * Math.sin(avgAzi);

    currentMD += length;
    currentTVD += deltaTVD;
    currentNorth += deltaNorth;
    currentEast += deltaEast;
    currentInc = endInc;
    currentAzi = endAzi;

    points.push({
      md: currentMD,
      tvd: currentTVD,
      north: currentNorth,
      east: currentEast,
      inc: currentInc,
      azi: currentAzi,
      sectionType: section.type || 'Unknown',
      holeSize: holeSize,
      id: section.id,
      name: section.name
    });
  });

  return points;
};

// 2. Statistics Aggregation - Audited for empty states
export const calculateStats = (trajectory) => {
  if (!trajectory || !Array.isArray(trajectory) || trajectory.length === 0) {
    return { totalMD: 0, totalTVD: 0, maxInc: 0, displacement: 0 };
  }
  
  const lastPoint = trajectory[trajectory.length - 1];
  
  // Safe max calculation
  const maxInc = trajectory.reduce((max, p) => Math.max(max, p.inc || 0), 0);
  
  // Displacement from surface (0,0)
  const displacement = Math.sqrt(Math.pow(lastPoint.north || 0, 2) + Math.pow(lastPoint.east || 0, 2));

  return {
    totalMD: lastPoint.md || 0,
    totalTVD: lastPoint.tvd || 0,
    maxInc,
    displacement
  };
};

// 3. Validation
export const validateGeometry = (sections) => {
  const errors = [];
  if (!Array.isArray(sections)) return ["Invalid sections data"];

  sections.forEach((section, index) => {
    if (!section.name) errors.push(`Section ${index + 1}: Name is required`);
    if ((parseFloat(section.length) || 0) <= 0) errors.push(`Section ${index + 1}: Length must be greater than 0`);
    if ((parseFloat(section.holeSize) || 0) <= 0) errors.push(`Section ${index + 1}: Hole size must be greater than 0`);
  });
  return errors;
};