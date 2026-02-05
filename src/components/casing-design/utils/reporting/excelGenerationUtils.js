import * as XLSX from 'xlsx';
import { calculateTotalDepth, calculateTotalWeight, calculateAverageGrade, formatNumber } from '../calculationUtils';
import { calculateHydrostaticPressure, calculateBurstLoad, calculateCollapseLoad, calculateAxialLoad, calculateBuoyancyFactor } from '@/utils/calculations/loadCaseCalculations';
import { verifyBurst, verifyCollapse, verifyTension } from '@/utils/calculations/designVerificationUtils';

export const generateExcelReport = (design, sections) => {
  if (!design || !sections) return;

  const workbook = XLSX.utils.book_new();

  // --- Sheet 1: Design Summary ---
  const calculations = {
    totalDepth: calculateTotalDepth(sections),
    totalWeight: calculateTotalWeight(sections),
    avgGrade: calculateAverageGrade(sections),
    sectionCount: sections.length
  };

  const summaryData = [
    ["Design Name", design.name],
    ["Type", design.type],
    ["Well Name", design.wells?.name || "Unknown"],
    ["Top OD (in)", design.od],
    ["Description", design.description || ""],
    ["Created By", "User"], // In real app, fetch user name
    ["Created At", new Date(design.created_at).toLocaleDateString()],
    [""],
    ["Total Measured Depth (ft)", calculations.totalDepth],
    ["Total String Weight (lbs)", calculations.totalWeight],
    ["Number of Sections", calculations.sectionCount],
    ["Primary Grade", calculations.avgGrade]
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Design Summary");

  // --- Sheet 2: Section Details ---
  const sortedSections = [...sections].sort((a, b) => a.sequence_order - b.sequence_order);
  const sectionsHeader = [
    "Seq", "Top Depth (ft)", "Bottom Depth (ft)", "Length (ft)", "OD (in)", 
    "Weight (ppf)", "Grade", "Connection", 
    "Burst Rating (psi)", "Collapse Rating (psi)", "Tensile Strength (lbs)"
  ];

  const sectionsData = sortedSections.map((s, i) => [
    i + 1,
    s.top_depth,
    s.bottom_depth,
    s.bottom_depth - s.top_depth,
    design.od, // Assuming flush OD for now, in reality could vary by section for tapered strings
    s.weight,
    s.grade,
    s.connection_type,
    s.burst_rating,
    s.collapse_rating,
    s.tensile_strength
  ]);

  const sectionsSheet = XLSX.utils.aoa_to_sheet([sectionsHeader, ...sectionsData]);
  XLSX.utils.book_append_sheet(workbook, sectionsSheet, "Section Details");

  // --- Sheet 3: Load Analysis ---
  // Re-run calculations for export
  const bf = calculateBuoyancyFactor(10.0); // Default 10.0 ppg if not dynamic
  const loadAnalysisHeader = [
    "Seq", "Interval", "Burst Load (psi)", "Burst SF", "Burst Status",
    "Collapse Load (psi)", "Collapse SF", "Collapse Status",
    "Axial Load (lbs)", "Tension SF", "Tension Status"
  ];

  // Helper to get total weight below
  const sectionWeights = sortedSections.map(s => (s.bottom_depth - s.top_depth) * s.weight);
  
  const loadData = sortedSections.map((s, i) => {
    const depth = s.bottom_depth;
    const hydro = calculateHydrostaticPressure(depth, 10.0);
    
    const burstLoad = calculateBurstLoad(hydro, 0);
    const collapseLoad = calculateCollapseLoad(hydro);
    
    let weightBelow = 0;
    for(let j = i; j < sortedSections.length; j++) {
        weightBelow += sectionWeights[j];
    }
    const axialLoad = calculateAxialLoad(weightBelow, bf, 0);

    const burstRes = verifyBurst(s.burst_rating, burstLoad, 1.1);
    const collapseRes = verifyCollapse(s.collapse_rating, collapseLoad, 1.125);
    const tensionRes = verifyTension(s.tensile_strength, axialLoad, 1.6);

    return [
        i + 1,
        `${s.top_depth}-${s.bottom_depth}`,
        Math.round(burstLoad),
        burstRes.sf.toFixed(2),
        burstRes.pass ? "PASS" : "FAIL",
        Math.round(collapseLoad),
        collapseRes.sf.toFixed(2),
        collapseRes.pass ? "PASS" : "FAIL",
        Math.round(axialLoad),
        tensionRes.sf.toFixed(2),
        tensionRes.pass ? "PASS" : "FAIL"
    ];
  });

  const loadSheet = XLSX.utils.aoa_to_sheet([loadAnalysisHeader, ...loadData]);
  XLSX.utils.book_append_sheet(workbook, loadSheet, "Load Analysis");

  // Generate File
  XLSX.writeFile(workbook, `CasingDesign_${design.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
};