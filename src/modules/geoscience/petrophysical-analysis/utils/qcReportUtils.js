import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

export const generateQCReportPDF = (wellName, qcResults, issues) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // --- Header ---
    doc.setFillColor(15, 23, 42); // Slate-900
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("Data Quality Control Report", 15, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(200, 200, 200);
    doc.text(`Well: ${wellName}`, 15, 30);
    doc.text(`Generated: ${format(new Date(), 'PPpp')}`, pageWidth - 15, 30, { align: 'right' });

    let yPos = 50;

    // --- Summary Statistics ---
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text("Quality Summary", 15, yPos);
    yPos += 10;

    const curveCount = Object.keys(qcResults).length;
    const criticalCount = issues.filter(i => i.severity === 'High').length;
    
    doc.setFontSize(11);
    doc.text(`Total Curves Analyzed: ${curveCount}`, 15, yPos);
    doc.text(`Total Issues Found: ${issues.length}`, 15, yPos + 6);
    doc.text(`Critical Issues: ${criticalCount}`, 15, yPos + 12);
    yPos += 20;

    // --- Detailed Curve Metrics Table ---
    doc.setFontSize(14);
    doc.text("Curve Validation Metrics", 15, yPos);
    yPos += 6;

    const metricsRows = Object.entries(qcResults).map(([id, res]) => [
        res.curveName || id,
        res.metrics.completeness.toFixed(1) + '%',
        res.metrics.min.toFixed(2),
        res.metrics.max.toFixed(2),
        res.gaps.gaps.length,
        res.outliers.length,
        res.metrics.negativePercentage > 0 ? 'FAIL' : 'PASS'
    ]);

    doc.autoTable({
        startY: yPos,
        head: [['Curve', 'Completeness', 'Min', 'Max', 'Gaps', 'Outliers', 'Phys. Check']],
        body: metricsRows,
        theme: 'striped',
        headStyles: { fillColor: [51, 65, 85] },
        styles: { fontSize: 9 }
    });

    yPos = doc.lastAutoTable.finalY + 15;

    // --- Issues List ---
    if (issues.length > 0) {
        doc.setFontSize(14);
        doc.text("Identified Issues & Anomalies", 15, yPos);
        yPos += 6;

        const issueRows = issues.map(i => [
            i.curveName,
            i.type,
            i.severity,
            i.description
        ]);

        doc.autoTable({
            startY: yPos,
            head: [['Curve', 'Issue Type', 'Severity', 'Description']],
            body: issueRows,
            theme: 'grid',
            headStyles: { fillColor: [185, 28, 28] }, // Red header
            styles: { fontSize: 9 }
        });
    } else {
        doc.setFontSize(12);
        doc.setTextColor(22, 163, 74); // Green
        doc.text("No significant data quality issues identified.", 15, yPos);
    }

    doc.save(`QC_Report_${wellName}_${Date.now()}.pdf`);
};

export const exportQCCSV = (wellName, qcResults, issues) => {
    // 1. Prepare Metrics Data
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "SECTION: CURVE METRICS\n";
    csvContent += "Curve Name,Completeness (%),Min,Max,Mean,StdDev,Negative Values (%),Gaps Count,Outliers Count\n";

    Object.values(qcResults).forEach(res => {
        const row = [
            res.curveName,
            res.metrics.completeness.toFixed(2),
            res.metrics.min.toFixed(4),
            res.metrics.max.toFixed(4),
            res.metrics.mean.toFixed(4),
            res.metrics.std.toFixed(4),
            res.metrics.negativePercentage.toFixed(2),
            res.gaps.gaps.length,
            res.outliers.length
        ].join(",");
        csvContent += row + "\n";
    });

    csvContent += "\nSECTION: ISSUES LIST\n";
    csvContent += "Curve Name,Issue Type,Severity,Description\n";
    
    issues.forEach(issue => {
        const row = [
            issue.curveName,
            issue.type,
            issue.severity,
            `"${issue.description.replace(/"/g, '""')}"` // Escape quotes
        ].join(",");
        csvContent += row + "\n";
    });

    // 2. Trigger Download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `QC_Export_${wellName}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};