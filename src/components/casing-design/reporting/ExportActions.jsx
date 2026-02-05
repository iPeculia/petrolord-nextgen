import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Download, FileText, Table as TableIcon, Loader2 } from 'lucide-react';
import { generatePDFReport } from '../utils/reporting/pdfGenerationUtils';
import { generateExcelReport } from '../utils/reporting/excelGenerationUtils';
import { useToast } from '@/components/ui/use-toast';

const ExportActions = ({ design, sections }) => {
    const { toast } = useToast();
    const [exporting, setExporting] = useState(false);

    const handlePDFExport = async () => {
        try {
            setExporting(true);
            await generatePDFReport(design, sections);
            toast({ title: "Export Complete", description: "PDF report downloaded successfully." });
        } catch (error) {
            console.error(error);
            toast({ title: "Export Failed", description: "Could not generate PDF.", variant: "destructive" });
        } finally {
            setExporting(false);
        }
    };

    const handleExcelExport = async () => {
        try {
            setExporting(true);
            await generateExcelReport(design, sections);
            toast({ title: "Export Complete", description: "Excel workbook downloaded successfully." });
        } catch (error) {
            console.error(error);
            toast({ title: "Export Failed", description: "Could not generate Excel file.", variant: "destructive" });
        } finally {
            setExporting(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-slate-700 hover:bg-slate-800 text-slate-300 min-w-[140px]">
                    {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                    Export Report
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700 text-slate-200">
                <DropdownMenuItem onClick={handlePDFExport} disabled={exporting}>
                    <FileText className="mr-2 h-4 w-4 text-red-400" /> Export PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExcelExport} disabled={exporting}>
                    <TableIcon className="mr-2 h-4 w-4 text-green-400" /> Export Excel
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ExportActions;