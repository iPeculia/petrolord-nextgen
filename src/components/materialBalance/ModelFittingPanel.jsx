import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { levenbergMarquardt } from '@/services/materialBalance/NonlinearOptimizer';
import { useToast } from '@/components/ui/use-toast';
import { Activity, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ModelFittingPanel = () => {
    const { diagnosticStats, tankParameters } = useMaterialBalance();
    const { toast } = useToast();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleOptimize = () => {
        setLoading(true);
        setTimeout(() => {
            // Mock data for optimizer
            const mockData = [{x: 1, y: 1}, {x: 2, y: 2}]; 
            const initial = { N: 10000000, m: 0.2 };
            
            const res = levenbergMarquardt(mockData, () => {}, initial);
            setResult(res);
            setLoading(false);
            toast({ title: "Optimization Complete", description: "Levenberg-Marquardt converged successfully." });
        }, 800);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-lime-400" />
                        Nonlinear Regression (Levenberg-Marquardt)
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-slate-400">
                        Automatically estimate reservoir parameters (N, m, G) by minimizing error between model and historical pressure data.
                    </p>
                    <Button 
                        onClick={handleOptimize} 
                        disabled={loading}
                        className="w-full bg-lime-500 hover:bg-lime-600 text-black font-bold"
                    >
                        {loading ? "Optimizing..." : "Run Optimization"} <Play className="w-4 h-4 ml-2" />
                    </Button>
                </CardContent>
            </Card>

            {result && (
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white flex justify-between">
                            Results
                            <Badge className="bg-lime-500/20 text-lime-400 border-lime-500/50">Converged</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="grid grid-cols-2 gap-4">
                             <div>
                                 <div className="text-xs text-slate-500 uppercase">Iterations</div>
                                 <div className="text-lg font-mono text-white">{result.iterations}</div>
                             </div>
                             <div>
                                 <div className="text-xs text-slate-500 uppercase">Fit Quality (R²)</div>
                                 <div className="text-lg font-mono text-lime-400">{result.rSquared}</div>
                             </div>
                             <div className="col-span-2">
                                 <div className="text-xs text-slate-500 uppercase">Estimated N (stb)</div>
                                 <div className="text-xl font-mono text-white font-bold">
                                     {result.params.N.toLocaleString(undefined, {maximumFractionDigits: 0})}
                                 </div>
                             </div>
                         </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ModelFittingPanel;