import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileJson, FileSpreadsheet, Image, Link as LinkIcon } from 'lucide-react';
import { useWellCorrelation } from '@/contexts/WellCorrelationContext';
import { WellExporter } from '@/utils/wellCorrelation/WellExporter';

const ExportLinksTab = () => {
    const { state } = useWellCorrelation();

    const handleBulkExport = (format) => {
        // Export logic for all selected wells
        state.selectedWellIds.forEach(id => {
            const well = state.wells.find(w => w.id === id);
            if (well) {
                if (format === 'json') WellExporter.exportToJSON(well);
                if (format === 'csv') WellExporter.exportToCSV(well);
            }
        });
    };

    return (
        <div className="p-8 h-full bg-slate-900/20 overflow-auto">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Export & Integration</h2>
                    <p className="text-slate-400">Export your correlation data or generate links for other modules.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="bg-slate-950 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <FileSpreadsheet className="w-5 h-5 text-emerald-500" /> Data Export
                            </CardTitle>
                            <CardDescription>Download well logs and marker data.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-slate-900 rounded border border-slate-800 text-sm text-slate-300">
                                {state.selectedWellIds.length > 0 
                                    ? `${state.selectedWellIds.length} wells currently selected for export.`
                                    : "Select wells in the list to enable bulk export."
                                }
                            </div>
                            <div className="flex gap-3">
                                <Button 
                                    className="flex-1 bg-slate-800 hover:bg-slate-700"
                                    disabled={state.selectedWellIds.length === 0}
                                    onClick={() => handleBulkExport('csv')}
                                >
                                    <FileSpreadsheet className="w-4 h-4 mr-2" /> CSV
                                </Button>
                                <Button 
                                    className="flex-1 bg-slate-800 hover:bg-slate-700"
                                    disabled={state.selectedWellIds.length === 0}
                                    onClick={() => handleBulkExport('json')}
                                >
                                    <FileJson className="w-4 h-4 mr-2" /> JSON
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-950 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Image className="w-5 h-5 text-blue-500" /> Visualization
                            </CardTitle>
                            <CardDescription>Export current correlation view as image.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-sm text-slate-400">
                                Generate a high-resolution PNG of the current Correlation Panel arrangement.
                            </p>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                <Image className="w-4 h-4 mr-2" /> Export Canvas Image
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="pt-8 border-t border-slate-800">
                    <h3 className="text-lg font-semibold text-white mb-4">Module Integrations</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 border-slate-700 bg-slate-900/50 hover:bg-slate-800 hover:text-white">
                            <LinkIcon className="w-5 h-5" />
                            Petrophysics
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 border-slate-700 bg-slate-900/50 hover:bg-slate-800 hover:text-white">
                            <LinkIcon className="w-5 h-5" />
                            Reservoir Model
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 border-slate-700 bg-slate-900/50 hover:bg-slate-800 hover:text-white">
                            <LinkIcon className="w-5 h-5" />
                            Seismic Tie
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExportLinksTab;