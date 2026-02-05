import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generatePetrophysicalReport = (wellName, analysisData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // --- Header ---
    doc.setFillColor(15, 23, 42); // Slate-900
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("Petrophysical Analysis Report", 15, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(200, 200, 200);
    doc.text(`Well: ${wellName}`, 15, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 15, 30, { align: 'right' });

    let yPos = 50;

    // --- Executive Summary ---
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text("Executive Summary", 15, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.text("This report contains the results of the advanced petrophysical analysis, including lithology identification, reservoir quality assessment, and pore pressure prediction. The interpretation is based on available well logs and standard petrophysical models.", 15, yPos, { maxWidth: pageWidth - 30 });
    yPos += 20;

    // --- Parameters Used ---
    doc.setFontSize(14);
    doc.text("Analysis Parameters", 15, yPos);
    yPos += 8;

    const params = analysisData.parameters || {};
    const paramData = [
        ['Matrix Density', `${params.matrixDensity || '-'} g/cc`],
        ['Fluid Density', `${params.fluidDensity || '-'} g/cc`],
        ['Archie a', params.archieA || '-'],
        ['Archie m', params.archieM || '-'],
        ['Archie n', params.archieN || '-'],
        ['Water Resistivity (Rw)', `${params.rw || '-'} ohm.m`]
    ];

    doc.autoTable({
        startY: yPos,
        head: [['Parameter', 'Value']],
        body: paramData,
        theme: 'striped',
        headStyles: { fillColor: [51, 65, 85] },
        margin: { left: 15, right: 15 }
    });
    
    yPos = doc.lastAutoTable.finalY + 20;

    // --- Results Summary ---
    doc.setFontSize(14);
    doc.text("Reservoir Properties Summary", 15, yPos);
    yPos += 8;

    // Calculate averages
    const calcs = analysisData.calculations || {};
    const avg = (arr) => {
        if(!arr) return '-';
        const valid = arr.filter(v => v != null && !isNaN(v));
        if(valid.length === 0) return '-';
        return (valid.reduce((a,b) => a+b, 0) / valid.length).toFixed(3);
    };

    const resultsData = [
        ['Average Porosity', avg(calcs.PHI?.values) + ' v/v'],
        ['Average Water Saturation', avg(calcs.SW?.values) + ' v/v'],
        ['Average Shale Volume', avg(calcs.VSH?.values) + ' v/v'],
        ['Avg Reservoir Quality Score', avg(calcs.RES_QUALITY?.values) + ' / 100']
    ];

    doc.autoTable({
        startY: yPos,
        head: [['Property', 'Value']],
        body: resultsData,
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129] }, // Emerald
        margin: { left: 15, right: 15 }
    });

    yPos = doc.lastAutoTable.finalY + 20;

    // --- Lithology Interpretation ---
    doc.setFontSize(14);
    doc.text("Interpretation Findings", 15, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.text("• Lithology: Based on GR-Density-Neutron crossplot logic.", 15, yPos);
    yPos += 6;
    doc.text("• Fluid Type: Identified based on resistivity and saturation contrasts.", 15, yPos);
    yPos += 6;
    doc.text("• Geomechanics: Overburden stress calculated from integrated density.", 15, yPos);

    // Save
    doc.save(`Petrophysical_Report_${wellName.replace(/\s+/g, '_')}.pdf`);
};