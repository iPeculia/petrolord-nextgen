import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity, Database, BarChart3, Info } from 'lucide-react';

const DiagnosticSummary = ({ stats, params }) => {
    // Determine slope/intercept from best available plot
    let n_est = 0;
    let n_label = "N (stb)";
    
    if (params.reservoirType === 'gas') {
        if (stats['P_over_Z']) {
             // G = - intercept / slope
             const m = stats['P_over_Z'].slope;
             const c = stats['P_over_Z'].intercept;
             if (m < 0) {
                n_est = -c / m; 
                n_label = "G (scf)";
             }
        }
    } else {
        if (stats['F_vs_Eo']) {
            n_est = stats['F_vs_Eo'].slope; // Slope is N
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
             <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-4 flex items-center space-x-4">
                    <div className="p-2 bg-blue-500/10 rounded-full">
                        <Activity className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-400">Est. OOIP/OGIP</p>
                        <h3 className="text-xl font-bold text-white">
                            {n_est > 0 ? n_est.toExponential(3) : "—"}
                        </h3>
                        <p className="text-xs text-slate-500">{n_label}</p>
                    </div>
                </CardContent>
             </Card>

             <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-4 flex items-center space-x-4">
                    <div className="p-2 bg-purple-500/10 rounded-full">
                        <BarChart3 className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-400">Avg R²</p>
                        <h3 className="text-xl font-bold text-white">
                             {stats['F_vs_Eo']?.r2 ? stats['F_vs_Eo'].r2.toFixed(3) : "—"}
                        </h3>
                         <p className="text-xs text-slate-500">Model Fit Quality</p>
                    </div>
                </CardContent>
             </Card>

             <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-4 flex items-center space-x-4">
                    <div className="p-2 bg-emerald-500/10 rounded-full">
                        <Database className="h-6 w-6 text-emerald-500" />
                    </div>
                    <div>
                         <p className="text-sm font-medium text-slate-400">Data Points</p>
                         <h3 className="text-xl font-bold text-white">Active</h3>
                         <p className="text-xs text-slate-500">Diagnostic Set</p>
                    </div>
                </CardContent>
             </Card>

             <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-4 flex items-center space-x-4">
                    <div className="p-2 bg-orange-500/10 rounded-full">
                        <Info className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-400">Status</p>
                        <h3 className="text-xl font-bold text-white">Ready</h3>
                        <p className="text-xs text-slate-500">Awaiting Modeling</p>
                    </div>
                </CardContent>
             </Card>
        </div>
    );
};

export default DiagnosticSummary;