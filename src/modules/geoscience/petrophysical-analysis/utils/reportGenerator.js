import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

export const generateReportData = (activeWell, wellLogs, templateType) => {
    if (!activeWell) return null;

    const reportDate = new Date();
    const logs = wellLogs[activeWell.id] || {};
    const logCount = Object.keys(logs).length;
    
    // Basic Metadata for all reports
    const baseData = {
        title: 'Petrophysical Analysis Report',
        generatedAt: format(reportDate, 'PPP p'),
        wellName: activeWell.name,
        operator: activeWell.metadata?.operator || 'N/A',
        field: activeWell.metadata?.field || 'N/A',
        location: activeWell.location || 'N/A',
        depthRange: `${activeWell.metadata?.depth_range?.top || 0} - ${activeWell.metadata?.depth_range?.bottom || 'TD'} ft`,
        template: templateType,
    };

    // Specific Logic based on template
    if (templateType === 'well_summary') {
        return {
            ...baseData,
            subtitle: 'Operational Summary & Data Inventory',
            sections: [
                {
                    title: 'Well Information',
                    type: 'key_value',
                    data: {
                        'Well Type': activeWell.metadata?.type || 'Unknown',
                        'Status': activeWell.metadata?.status || 'Active',
                        'Country': activeWell.metadata?.country || 'Unknown',
                        'Spud Date': activeWell.spud_date || 'N/A'
                    }
                },
                {
                    title: 'Log Data Inventory',
                    type: 'table',
                    headers: ['Log Name', 'Type', 'Unit', 'Samples', 'Range'],
                    rows: Object.values(logs).map(log => [
                        log.log_name,
                        log.log_type,
                        log.unit,
                        log.value_array?.length || 0,
                        log.depth_array?.length > 0 
                            ? `${Math.min(...log.depth_array).toFixed(0)} - ${Math.max(...log.depth_array).toFixed(0)}` 
                            : 'N/A'
                    ])
                }
            ]
        };
    } else if (templateType === 'curve_statistics') {
         const statsRows = Object.values(logs).map(log => {
            const values = log.value_array?.filter(v => v !== null && !isNaN(v)) || [];
            if (values.length === 0) return [log.log_name, 'No Data', '-', '-', '-'];
            
            const min = Math.min(...values);
            const max = Math.max(...values);
            const mean = values.reduce((a, b) => a + b, 0) / values.length;
            return [log.log_name, log.unit, min.toFixed(4), max.toFixed(4), mean.toFixed(4)];
        });

        return {
            ...baseData,
            subtitle: 'Statistical Analysis of Log Curves',
            sections: [
                {
                    title: 'Curve Statistics',
                    type: 'table',
                    headers: ['Curve', 'Unit', 'Min', 'Max', 'Mean'],
                    rows: statsRows
                }
            ]
        };
    }

    return baseData;
};

export const exportToPDF = (reportData) => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(15, 23, 42); // Slate-900
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("PETROLORD", 14, 20);
    doc.setFontSize(12);
    doc.setTextColor(191, 255, 0); // Neon green
    doc.text("Intelligent Energy Suite", 14, 28);

    doc.setTextColor(200, 200, 200);
    doc.setFontSize(10);
    doc.text(`Generated: ${reportData.generatedAt}`, 200, 20, { align: 'right' });
    doc.text(`Well: ${reportData.wellName}`, 200, 28, { align: 'right' });

    // Title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.text(reportData.title, 14, 55);
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(reportData.subtitle || '', 14, 62);

    let currentY = 75;

    // Sections
    reportData.sections?.forEach(section => {
        doc.setFontSize(14);
        doc.setTextColor(15, 23, 42);
        doc.text(section.title, 14, currentY);
        currentY += 10;

        if (section.type === 'key_value') {
            doc.setFontSize(10);
            Object.entries(section.data).forEach(([key, value]) => {
                doc.setFont('helvetica', 'bold');
                doc.text(`${key}:`, 14, currentY);
                doc.setFont('helvetica', 'normal');
                doc.text(`${value}`, 50, currentY);
                currentY += 6;
            });
            currentY += 10;
        } else if (section.type === 'table') {
            autoTable(doc, {
                startY: currentY,
                head: [section.headers],
                body: section.rows,
                headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
                alternateRowStyles: { fillColor: [241, 245, 249] }
            });
            currentY = doc.lastAutoTable.finalY + 20;
        }
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text('Confidential - Internal Use Only', 105, 290, { align: 'center' });
        doc.text(`Page ${i} of ${pageCount}`, 200, 290, { align: 'right' });
    }

    doc.save(`${reportData.wellName}_${reportData.template}_report.pdf`);
};