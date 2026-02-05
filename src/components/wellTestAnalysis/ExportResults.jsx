import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, Printer, Share2 } from 'lucide-react';
import { useWellTestAnalysisContext } from '@/contexts/WellTestAnalysisContext';
import { generateResultSummary } from '@/utils/wellTestAnalysis/resultSummary';

const ExportResults = () => {
    const { state } = useWellTestAnalysisContext();

    const handleDownload = () => {
        const summary = generateResultSummary(state);
        const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `WTA_Report_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
    };

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-purple-400" />
                    Export & Integration
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-slate-400">Generate reports or export data for other Petrolord modules.</p>
                
                <div className="flex gap-4">
                    <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700">
                        <FileDown className="w-4 h-4 mr-2" />
                        Download JSON Report
                    </Button>
                    <Button variant="outline" className="border-slate-600 text-slate-300">
                        <Printer className="w-4 h-4 mr-2" />
                        Print Summary
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default ExportResults;