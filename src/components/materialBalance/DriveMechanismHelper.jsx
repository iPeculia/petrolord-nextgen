import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, HelpCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const DriveMechanismHelper = ({ stats, reservoirType }) => {
    let primaryMechanism = "Undetermined";
    let confidence = "Low";
    let message = "Insufficient data to determine drive mechanism.";
    let bestPlot = null;
    let r2 = 0;
    let confidenceScore = 0; // 0-100

    if (reservoirType === 'gas') {
        if (stats['P_over_Z']) {
            r2 = stats['P_over_Z'].r2;
            if (r2 > 0.95) {
                primaryMechanism = "Volumetric Gas Expansion";
                confidence = "High";
                confidenceScore = 90;
                message = "Strong linearity on P/Z plot suggests a closed, volumetric reservoir.";
            } else if (r2 > 0.8) {
                primaryMechanism = "Gas Expansion (Possible Water Influx)";
                confidence = "Medium";
                confidenceScore = 60;
                message = "Moderate linearity. Curvature may indicate water drive or compressibility effects.";
            } else {
                primaryMechanism = "Complex / Strong Water Drive";
                confidence = "Low";
                confidenceScore = 30;
                message = "Non-linear P/Z plot suggests strong water drive or geomechanical effects.";
            }
            bestPlot = "P/Z vs Gp";
        }
    } else {
        // Oil Logic
        const r2_sg = stats['F_vs_Eo']?.r2 || 0;
        const r2_gc = stats['F_vs_Total_Expansion']?.r2 || 0;
        
        if (r2_sg > 0.96 && r2_sg >= r2_gc) {
            primaryMechanism = "Solution Gas Drive";
            confidence = "High";
            confidenceScore = 95;
            message = "F vs Eo is highly linear, indicating depletion drive is dominant.";
            bestPlot = "F vs Eo";
            r2 = r2_sg;
        } else if (r2_gc > 0.96) {
            primaryMechanism = "Gas Cap Drive";
            confidence = "High";
            confidenceScore = 90;
            message = "F vs Total Expansion is most linear, suggesting significant gas cap energy.";
            bestPlot = "F vs (Eo + Eg)";
            r2 = r2_gc;
        } else if (r2_sg > 0.8) {
            primaryMechanism = "Solution Gas Drive";
            confidence = "Medium";
            confidenceScore = 70;
            message = "F vs Eo is reasonably linear, but check for other drives.";
            bestPlot = "F vs Eo";
            r2 = r2_sg;
        } else {
            primaryMechanism = "Combination / Water Drive";
            confidence = "Low";
            confidenceScore = 40;
            message = "No single straight line plot fits perfectly. Likely combination drive or water influx.";
        }
    }

    const getConfidenceColor = (conf) => {
        if (conf === 'High') return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
        if (conf === 'Medium') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
        return 'bg-red-500/20 text-red-400 border-red-500/50';
    };

    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="pb-2 border-b border-slate-800">
                <CardTitle className="flex items-center gap-2 text-base">
                    <HelpCircle className="w-5 h-5 text-blue-400" />
                    Automated Analysis
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6 flex-1">
                {/* Result Box */}
                <div className="space-y-3">
                    <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Predicted Mechanism</label>
                    <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 space-y-3">
                        <div className="flex items-start justify-between">
                            <span className="font-semibold text-lg text-white">{primaryMechanism}</span>
                            <Badge variant="outline" className={getConfidenceColor(confidence)}>
                                {confidence}
                            </Badge>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">{message}</p>
                        
                        <div className="space-y-1 pt-2">
                             <div className="flex justify-between text-xs text-slate-400">
                                <span>Confidence Score</span>
                                <span>{confidenceScore}%</span>
                             </div>
                             <Progress value={confidenceScore} className="h-1.5 bg-slate-700" indicatorClassName="bg-blue-500" />
                        </div>
                    </div>
                </div>

                {/* Evidence Box */}
                {bestPlot && (
                    <div className="space-y-2">
                         <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Supporting Evidence</label>
                         <div className="flex items-center justify-between p-3 rounded bg-slate-800/30 border border-slate-800">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-slate-400" />
                                <span className="text-sm text-slate-300">Linear Fit ({bestPlot})</span>
                            </div>
                            <span className="text-sm font-mono text-lime-400">R² = {r2.toFixed(4)}</span>
                         </div>
                    </div>
                )}
                
                {/* Recommendations */}
                <div className="pt-4 border-t border-slate-800 mt-auto">
                    <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Recommendations
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li className="flex items-start gap-2">
                            <span className="text-slate-600 mt-1">•</span>
                            Verify PVT data quality for the analyzed pressure range.
                        </li>
                        {primaryMechanism.includes("Water") && (
                            <li className="flex items-start gap-2">
                                <span className="text-slate-600 mt-1">•</span>
                                Proceed to Aquifer Modeling tab to estimate water influx volume.
                            </li>
                        )}
                        {primaryMechanism.includes("Gas Cap") && (
                             <li className="flex items-start gap-2">
                                <span className="text-slate-600 mt-1">•</span>
                                Check 'm' parameter sensitivity in Model Fitting tab.
                            </li>
                        )}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
};

export default DriveMechanismHelper;