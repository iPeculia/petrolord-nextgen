import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, AlertTriangle, CheckCircle2 } from 'lucide-react';

const BestPracticesGuide = () => {
    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-semibold text-white mb-4">Well Test Analysis Workflow</h3>
                <p className="text-slate-300 mb-6">
                    Follow this structured approach to ensure accurate interpretation of pressure transient data.
                </p>

                <div className="grid gap-6">
                    <section className="space-y-3">
                        <h4 className="flex items-center gap-2 text-blue-400 font-medium">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/10 text-xs border border-blue-500/20">1</span>
                            Data QC & Preparation
                        </h4>
                        <div className="pl-8 text-sm text-slate-400 space-y-2">
                            <p>• Remove outliers and synchronize pressure/rate time data.</p>
                            <p>• Extract the correct flow period (usually the main buildup or drawdown).</p>
                            <p>• Ensure PVT properties (viscosity, compressibility, FVF) are representative of reservoir conditions.</p>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h4 className="flex items-center gap-2 text-blue-400 font-medium">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/10 text-xs border border-blue-500/20">2</span>
                            Diagnostic Identification
                        </h4>
                        <div className="pl-8 text-sm text-slate-400 space-y-2">
                            <p>• Use the Log-Log plot (Pressure & Derivative) as your primary diagnostic tool.</p>
                            <p>• Identify the <strong>Unit Slope</strong> at early time (Wellbore Storage).</p>
                            <p>• Identify the <strong>Zero Slope</strong> (Horizontal line) at middle time (Radial Flow).</p>
                            <Alert className="bg-slate-900 border-yellow-500/20 mt-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                <AlertTitle className="text-yellow-500">Derivative Noise</AlertTitle>
                                <AlertDescription className="text-yellow-500/90 text-xs">
                                    Do not over-smooth the derivative. A value of L=0.1 to 0.3 is standard. Over-smoothing can mask reservoir features.
                                </AlertDescription>
                            </Alert>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h4 className="flex items-center gap-2 text-blue-400 font-medium">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/10 text-xs border border-blue-500/20">3</span>
                            Model Matching
                        </h4>
                        <div className="pl-8 text-sm text-slate-400 space-y-2">
                            <p>• Start with the simplest model (Homogeneous + Storage + Skin).</p>
                            <p>• Only add complexity (Boundaries, Dual Porosity) if the simple model cannot match the derivative shape.</p>
                            <p>• Prioritize matching the derivative curve over the pressure curve.</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default BestPracticesGuide;