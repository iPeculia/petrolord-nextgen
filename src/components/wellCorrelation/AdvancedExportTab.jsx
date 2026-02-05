import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileCode, FileSpreadsheet, FileImage, Globe, ShieldCheck, Activity, Database, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AdvancedExporter } from '@/utils/wellCorrelation/AdvancedExporter';
import { ReportGenerator } from '@/services/wellCorrelation/ReportGenerator';
import { useWellCorrelation } from '@/contexts/WellCorrelationContext';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { validateWellData } from '@/utils/wellCorrelation/ValidationHelpers';

const AdvancedExportTab = () => {
    const { state } = useWellCorrelation();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Helper to show messages and auto-dismiss
    const notify = (type, message) => {
        if (type === 'error') {
            setError(message);
            setSuccess(null);
            toast({
                variant: "destructive",
                title: "Export Failed",
                description: message
            });
        } else {
            setSuccess(message);
            setError(null);
            toast({
                className: "bg-[#CCFF00] text-black border-none",
                title: "Success",
                description: message
            });
        }
        
        // Auto-dismiss local alerts after 5s
        setTimeout(() => {
            setError(null);
            setSuccess(null);
        }, 5000);
    };

    const validateExportReadiness = () => {
        if (!state.wells || !Array.isArray(state.wells) || state.wells.length === 0) {
            throw new Error("No wells available to export. Please import data first.");
        }
        return true;
    };

    const handleLasExport = () => {
        try {
            validateExportReadiness();

            // Strategy: Export Active Well if selected, otherwise first valid well found
            let targetWell = null;
            
            if (state.activeWellId) {
                targetWell = state.wells.find(w => w.id === state.activeWellId);
            }
            
            // Fallback to first valid well if no active well
            if (!targetWell) {
                 targetWell = state.wells.find(w => validateWellData(w).valid);
            }

            if (!targetWell) {
                throw new Error("No valid well data found. Ensure wells have name and depth range.");
            }

            AdvancedExporter.exportToLAS(targetWell);
            notify('success', `LAS 2.0 file generated for ${targetWell.name}`);

        } catch (err) {
            console.error(err);
            notify('error', err.message);
        }
    };

    const handleGeoJsonExport = () => {
        try {
            validateExportReadiness();
            AdvancedExporter.exportToGeoJSON(state.wells);
            notify('success', `GeoJSON export completed for ${state.wells.length} wells.`);
        } catch (err) {
            console.error(err);
            notify('error', err.message);
        }
    };

    const handleReportGen = () => {
        try {
            validateExportReadiness();
            
            ReportGenerator.generateCorrelationReport({
                name: state.project?.name || 'Well Correlation Project',
                wells: state.wells,
                markers: state.markers
            });
            
            notify('success', "PDF Report generated and downloading.");

        } catch (err) {
            console.error(err);
            notify('error', err.message);
        }
    };

    const handleImageExport = async () => {
        try {
             // We assume 'correlation-panel-scroll-area' is the ID we want to capture
             // Or prompt user to navigate to Correlation tab first if not visible
             notify('success', "Preparing image export... If panel is not visible, result may be empty.");
             await AdvancedExporter.exportPanelAsImage('root'); // Or specific ID if reachable
        } catch(err) {
             console.error(err);
             notify('error', "Failed to export image. Ensure you are viewing the correlation panel.");
        }
    };

    return (
        <div className="h-full p-6 bg-[#0F172A] overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Advanced Export & Integration</h2>
                    <p className="text-slate-400">Generate professional reports and export to industry standard formats.</p>
                </div>

                {/* Status Messages Area */}
                <div className="min-h-[4rem]">
                    {error && (
                        <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2 mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {success && (
                        <Alert className="bg-[#CCFF00]/10 border-[#CCFF00] text-[#CCFF00] animate-in fade-in slide-in-from-top-2 mb-4">
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Standard Formats */}
                    <Card className="bg-[#1E293B] border-slate-800 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2 text-lg">
                                <FileCode className="w-5 h-5 text-[#CCFF00]" /> Industry Formats
                            </CardTitle>
                            <CardDescription className="text-slate-400">LAS 2.0/3.0, DLIS, GeoJSON</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button 
                                onClick={handleLasExport} 
                                variant="outline" 
                                className="w-full justify-start h-12 border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800 hover:text-[#CCFF00] hover:border-slate-600 transition-all"
                            >
                                <FileCode className="w-5 h-5 mr-3" /> 
                                <div className="flex flex-col items-start text-xs">
                                    <span className="font-bold text-sm">Export to LAS 2.0</span>
                                    <span className="opacity-70">Single Well Export</span>
                                </div>
                            </Button>
                            <Button 
                                onClick={handleGeoJsonExport}
                                variant="outline" 
                                className="w-full justify-start h-12 border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800 hover:text-[#CCFF00] hover:border-slate-600 transition-all"
                            >
                                <Globe className="w-5 h-5 mr-3" /> 
                                <div className="flex flex-col items-start text-xs">
                                    <span className="font-bold text-sm">Export to GeoJSON</span>
                                    <span className="opacity-70">All Wells Locations</span>
                                </div>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Reporting */}
                    <Card className="bg-[#1E293B] border-slate-800 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2 text-lg">
                                <ShieldCheck className="w-5 h-5 text-emerald-400" /> Reporting
                            </CardTitle>
                            <CardDescription className="text-slate-400">PDF Generation & QC Certs</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button 
                                onClick={handleReportGen} 
                                className="w-full h-12 bg-[#CCFF00] hover:bg-[#B3E600] text-black font-bold shadow-[0_0_10px_rgba(204,255,0,0.2)] transition-all"
                            >
                                <div className="flex items-center gap-2">
                                    <FileSpreadsheet className="w-5 h-5" />
                                    Generate Correlation Report (PDF)
                                </div>
                            </Button>
                            <Button 
                                onClick={handleImageExport}
                                variant="outline" 
                                className="w-full justify-start h-12 border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800 hover:text-[#CCFF00] hover:border-slate-600 transition-all"
                            >
                                <FileImage className="w-5 h-5 mr-3" /> 
                                <div className="flex flex-col items-start text-xs">
                                    <span className="font-bold text-sm">Export Panel as Image</span>
                                    <span className="opacity-70">High-Res Snapshot</span>
                                </div>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Third Party Integration */}
                    <Card className="bg-[#1E293B] border-slate-800 md:col-span-2 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2 text-lg">
                                <Globe className="w-5 h-5 text-purple-400" /> External Integrations
                            </CardTitle>
                            <CardDescription className="text-slate-400">Direct connection to reservoir modeling suites</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {['EarthModel Pro', 'Petrel Connector', 'OpenWorks'].map((tool, i) => (
                                    <Button 
                                        key={tool}
                                        variant="outline" 
                                        className="h-24 flex flex-col gap-3 border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-900 hover:text-white hover:border-[#CCFF00]/30 transition-all group"
                                    >
                                        <div className="p-2 rounded-full bg-slate-900 group-hover:bg-[#CCFF00]/10 group-hover:text-[#CCFF00] transition-colors">
                                            {i === 0 ? <Globe className="w-6 h-6" /> : i === 1 ? <Activity className="w-6 h-6" /> : <Database className="w-6 h-6" />}
                                        </div>
                                        <span className="font-medium">{tool}</span>
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdvancedExportTab;