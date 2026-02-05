import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { calculateTotalDepth, calculateTotalWeight, calculateAverageGrade, formatNumber } from '../calculationUtils';
import { calculateHydrostaticPressure, calculateBurstLoad, calculateCollapseLoad, calculateAxialLoad, calculateBuoyancyFactor } from '@/utils/calculations/loadCaseCalculations';
import { verifyBurst, verifyCollapse, verifyTension } from '@/utils/calculations/designVerificationUtils';

export const generatePDFReport = (design, sections) => {
  if (!design || !sections) return;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // -- Header --
  doc.setFontSize(22);
  doc.setTextColor(40, 44, 52); // Dark slate
  doc.text("Casing Design Report", 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
  doc.line(14, 32, pageWidth - 14, 32);

  // -- Design Summary --
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text("Design Summary", 14, 42);

  const totalDepth = calculateTotalDepth(sections);
  const totalWeight = calculateTotalWeight(sections);
  const avgGrade = calculateAverageGrade(sections);

  doc.autoTable({
    startY: 46,
    head: [['Property', 'Value', 'Property', 'Value']],
    body: [
      ['Design Name', design.name, 'Total Measured Depth', `${formatNumber(totalDepth)} ft`],
      ['Well Name', design.wells?.name || "Unknown", 'Total String Weight', `${formatNumber(totalWeight / 1000)} klb`],
      ['String Type', design.type, 'Section Count', sections.length],
      ['Top OD', `${design.od} in`, 'Primary Grade', avgGrade]
    ],
    theme: 'grid',
    headStyles: { fillColor: [30, 41, 59] }, // Slate-800
    styles: { fontSize: 10 }
  });

  // -- Section Details --
  doc.setFontSize(14);
  doc.text("Section Details", 14, doc.lastAutoTable.finalY + 15);

  const sortedSections = [...sections].sort((a, b) => a.sequence_order - b.sequence_order);
  const sectionRows = sortedSections.map((s, i) => [
    i + 1,
    `${s.top_depth} - ${s.bottom_depth}`,
    (s.bottom_depth - s.top_depth).toFixed(1),
    s.weight,
    s.grade,
    s.connection_type,
    s.burst_rating,
    s.collapse_rating,
    (s.tensile_strength / 1000).toFixed(0) + ' k'
  ]);

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 20,
    head: [['Seq', 'Interval (ft)', 'Len (ft)', 'Wt (ppf)', 'Grade', 'Conn', 'Burst (psi)', 'Clps (psi)', 'Tens (lbs)']],
    body: sectionRows,
    theme: 'striped',
    headStyles: { fillColor: [15, 23, 42] }, // Slate-950
    styles: { fontSize: 9 }
  });

  // -- Load Analysis Verification --
  // We'll calculate simple verification based on defaults for the report
  const bf = calculateBuoyancyFactor(10.0);
  const sectionWeights = sortedSections.map(s => (s.bottom_depth - s.top_depth) * s.weight);

  const analysisRows = sortedSections.map((s, i) => {
     const depth = s.bottom_depth;
     const hydro = calculateHydrostaticPressure(depth, 10.0);
     const burstLoad = calculateBurstLoad(hydro, 0);
     const collapseLoad = calculateCollapseLoad(hydro);
     
     let weightBelow = 0;
     for(let j = i; j < sortedSections.length; j++) { weightBelow += sectionWeights[j]; }
     const axialLoad = calculateAxialLoad(weightBelow, bf, 0);

     const burstSF = calculateBurstLoad(hydro, 0) > 0 ? (s.burst_rating / burstLoad).toFixed(2) : "N/A";
     const collapseSF = (s.collapse_rating / collapseLoad).toFixed(2);
     const tensionSF = axialLoad > 0 ? (s.tensile_strength / axialLoad).toFixed(2) : "High";

     return [
        i + 1,
        burstSF,
        collapseSF,
        tensionSF
     ];
  });

  doc.setFontSize(14);
  doc.text("Safety Factor Analysis (10.0 ppg)", 14, doc.lastAutoTable.finalY + 15);
  
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 20,
    head: [['Seq', 'Burst SF', 'Collapse SF', 'Tension SF']],
    body: analysisRows,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] }, // Blue
    styles: { fontSize: 9, halign: 'center' }
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount} - Petrolord NextGen Suite`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
  }

  doc.save(`CasingDesign_${design.name}.pdf`);
};