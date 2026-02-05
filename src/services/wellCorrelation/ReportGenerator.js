import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { validateWellCollection } from '@/utils/wellCorrelation/ValidationHelpers';

export const ReportGenerator = {
    /**
     * Generates a PDF correlation report for the project.
     * Includes input validation to prevent crashes.
     */
    generateCorrelationReport: (projectData) => {
        try {
            // 1. Critical Input Validation
            if (!projectData) throw new Error("Project data is missing.");
            
            const wells = Array.isArray(projectData.wells) ? projectData.wells : [];
            const markers = Array.isArray(projectData.markers) ? projectData.markers : [];

            // Use the helper to filter only valid wells. 
            // This prevents the "reading 'stop' of undefined" error downstream.
            const validation = validateWellCollection(wells);
            
            if (!validation.valid) {
                const errorMsg = validation.errors.length > 0 
                    ? `Cannot generate report: ${validation.errors[0]}` 
                    : 'No valid wells found with complete depth data.';
                throw new Error(errorMsg);
            }

            const validWells = validation.validWells;

            // 2. PDF Generation Logic
            const doc = new jsPDF();
            
            // -- Header --
            doc.setFontSize(22);
            doc.setTextColor(15, 23, 42); // Slate 900
            doc.text('Well Correlation Report', 14, 22);
            
            doc.setFontSize(10);
            doc.setTextColor(100, 116, 139); // Slate 500
            doc.text(`Project: ${projectData.name || 'Untitled Project'}`, 14, 30);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 35);
            
            doc.line(14, 40, 196, 40); // Horizontal divider

            // -- Wells Summary Table --
            doc.setFontSize(14);
            doc.setTextColor(15, 23, 42);
            doc.text('Wells Summary', 14, 50);

            const wellRows = validWells.map(w => [
                w.name, 
                w.uwi || 'N/A', 
                // Safe access guaranteed by validation
                `${w.depthRange.start.toFixed(2)} - ${w.depthRange.stop.toFixed(2)}`, 
                w.depthRange.unit || 'M'
            ]);

            doc.autoTable({
                head: [['Well Name', 'UWI', 'Depth Range', 'Unit']],
                body: wellRows,
                startY: 55,
                headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
                styles: { fontSize: 9 },
                alternateRowStyles: { fillColor: [241, 245, 249] }
            });

            // -- Markers Table --
            const markersY = doc.lastAutoTable.finalY + 15;
            doc.text('Correlation Markers', 14, markersY);

            // Filter markers to only include those belonging to our VALID wells
            const validMarkers = markers.filter(m => {
                return m && 
                       m.wellId && 
                       validWells.find(w => w.id === m.wellId) && 
                       typeof m.depth === 'number';
            });

            if (validMarkers.length > 0) {
                const markerRows = validMarkers.map(m => {
                    const well = validWells.find(w => w.id === m.wellId);
                    return [
                        m.name || 'Unnamed', 
                        well ? well.name : 'Unknown', 
                        m.depth.toFixed(2),
                        m.type || 'Generic'
                    ];
                });

                doc.autoTable({
                    head: [['Marker', 'Well', 'Depth (MD)', 'Type']],
                    body: markerRows,
                    startY: markersY + 5,
                    headStyles: { fillColor: [204, 255, 0], textColor: [0, 0, 0] }, // PetroLord Lime brand color
                    styles: { fontSize: 9 }
                });
            } else {
                doc.setFontSize(10);
                doc.setTextColor(100, 100, 100);
                doc.text('No valid markers found for the selected wells.', 14, markersY + 10);
            }

            // -- Footer --
            const pageCount = doc.internal.getNumberOfPages();
            for(let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(150);
                doc.text(`Page ${i} of ${pageCount} - PetroLord NextGen Suite`, 196, 285, { align: 'right' });
            }

            doc.save(`Correlation_Report_${new Date().toISOString().slice(0,10)}.pdf`);
            return { success: true };

        } catch (error) {
            console.error("Report Generation Error:", error);
            // Re-throw so the UI can catch and display the toast
            throw error; 
        }
    }
};