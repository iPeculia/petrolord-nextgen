import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileDown, Loader2 } from 'lucide-react';
import { useLayoutPersistence } from '../utils/layoutPersistence';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const LayoutReport = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const persistence = useLayoutPersistence();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            let layoutId = searchParams.get('layout');
            
            if (!layoutId) {
                 layoutId = await persistence.getOrCreateDefaultLayout();
            }

            if (layoutId) {
                const loaded = await persistence.loadLayoutData(layoutId);
                setData(loaded);
            }
            setLoading(false);
        };
        loadData();
    }, [searchParams]);

    const generatePDF = () => {
        if (!data) return;
        const doc = new jsPDF();

        // Title
        doc.setFontSize(22);
        doc.text("Facility Layout Report", 14, 20);
        
        doc.setFontSize(12);
        doc.text(`Project: Golden Eagle CPF Phase 2`, 14, 30);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 36);

        // Equipment Table
        doc.setFontSize(16);
        doc.text("Equipment Summary", 14, 50);
        
        const eqData = data.equipment ? data.equipment.map(item => [
            item.tag, item.type, item.properties?.service || '', item.status || 'Active'
        ]) : [];

        doc.autoTable({
            startY: 55,
            head: [['Tag', 'Type', 'Service', 'Status']],
            body: eqData,
        });

        // Line Table
        const finalY = doc.lastAutoTable.finalY + 15;
        doc.text("Pipeline Schedule", 14, finalY);
        
        const lnData = data.lines ? data.lines.map(line => [
            line.line_id, line.properties?.size || '', line.from_tag, line.to_tag, line.status || 'Proposed'
        ]) : [];

        doc.autoTable({
            startY: finalY + 5,
            head: [['Line ID', 'Size', 'From', 'To', 'Status']],
            body: lnData,
        });

        doc.save("LayoutReport.pdf");
    };

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-[#0f172a] text-white">
            <Loader2 className="w-8 h-8 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 p-8 flex flex-col items-center justify-center">
            <div className="max-w-md w-full bg-[#1a1a1a] border border-[#333333] rounded-xl p-8 shadow-2xl text-center space-y-6">
                <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto">
                    <FileDown className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold mb-2">Report Ready</h1>
                    <p className="text-slate-400 text-sm">
                        Facility layout analysis complete. Contains summary of {data?.equipment?.length || 0} equipment items and {data?.lines?.length || 0} lines.
                    </p>
                </div>
                <div className="flex gap-4 justify-center">
                    <Button variant="outline" onClick={() => navigate(-1)}>
                        <ChevronLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <Button onClick={generatePDF} className="bg-blue-600 hover:bg-blue-700">
                        Download PDF
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LayoutReport;