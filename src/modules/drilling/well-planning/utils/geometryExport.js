import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportAsJSON = (data, filename = 'well-geometry.json') => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  saveAs(blob, filename);
};

export const exportAsCSV = (trajectory, filename = 'well-trajectory.csv') => {
  const headers = ['MD (ft)', 'TVD (ft)', 'North (ft)', 'East (ft)', 'Inclination (deg)', 'Azimuth (deg)', 'Hole Size (in)'];
  const rows = trajectory.map(p => [
    p.md.toFixed(2),
    p.tvd.toFixed(2),
    p.north.toFixed(2),
    p.east.toFixed(2),
    p.inc.toFixed(2),
    p.azi.toFixed(2),
    p.holeSize.toFixed(2)
  ]);
  
  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
};

export const exportAsPDF = (wellName, trajectory, stats) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(18);
  doc.text(`Well Geometry Report: ${wellName}`, 14, 22);
  
  doc.setFontSize(11);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Stats
  doc.text(`Total MD: ${stats.totalMD.toFixed(2)} ft`, 14, 40);
  doc.text(`Total TVD: ${stats.totalTVD.toFixed(2)} ft`, 70, 40);
  doc.text(`Max Inclination: ${stats.maxInc.toFixed(2)} deg`, 126, 40);
  
  // Table
  const tableColumn = ["MD", "TVD", "North", "East", "Inc", "Azi", "Hole Size"];
  const tableRows = trajectory.map(p => [
    p.md.toFixed(1),
    p.tvd.toFixed(1),
    p.north.toFixed(1),
    p.east.toFixed(1),
    p.inc.toFixed(1),
    p.azi.toFixed(1),
    p.holeSize
  ]);
  
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 50,
  });
  
  doc.save(`${wellName}_geometry_report.pdf`);
};