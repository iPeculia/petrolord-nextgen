import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useDeclineCurve } from '@/context/DeclineCurveContext';
import { useToast } from '@/components/ui/use-toast';
import { trainAndSelectModel } from '@/utils/declineCurve/MachineLearningEngine';
import { Brain, Play, CheckCircle, BarChart, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { calculateRate } from '@/utils/declineCurve/DeclineModels';

const MLModelTraining = () => {
    const { currentWell, activeStream, addScenario } = useDeclineCurve();
    const { toast } = useToast();
    
    const [isTraining, setIsTraining] = useState(false);
    const [progress, setProgress] = useState(0);
    const [trainingResult, setTrainingResult] = useState(null);
    const [selectedModels, setSelectedModels] = useState({
        exponential: true,
        hyperbolic: true,
        harmonic: true
    });

    const handleTrain = async () => {
        if (!currentWell || !currentWell.data || currentWell.data.length === 0) {
            toast({ title: "No Data", description: "Select a well with production data first.", variant: "destructive" });
            return;
        }

        setIsTraining(true);
        setProgress(10);
        setTrainingResult(null);

        // Simulate async work for UI feel
        setTimeout(() => {
            try {
                // Prepare Data
                const rateKey = activeStream === 'Oil' ? 'oilRate' : activeStream === 'Gas' ? 'gasRate' : 'waterRate';
                const sortedData = [...currentWell.data].sort((a,b) => new Date(a.date) - new Date(b.date));
                const startDate = new Date(sortedData[0].date);
                
                const fitData = sortedData.map(d => ({
                    t: (new Date(d.date) - startDate) / (1000 * 60 * 60 * 24),
                    q: d[rateKey] || 0,
                    originalDate: d.date
                })).filter(d => d.q > 0);

                setProgress(50);

                // Run AutoML Engine
                const result = trainAndSelectModel(fitData, {});
                
                setProgress(100);
                setTrainingResult(result);
                toast({ title: "Training Complete", description: `Best model: ${result.bestModel.modelType}` });

            } catch (err) {
                console.error(err);
                toast({ title: "Training Failed", description: err.message, variant: "destructive" });
            } finally {
                setIsTraining(false);
            }
        }, 800);
    };

    const handleSaveBest = () => {
        if (!trainingResult) return;
        
        addScenario(currentWell.project_id, {
            name: `AutoML Best Fit (${trainingResult.bestModel.modelType})`,
            results: { 
                ...trainingResult.bestModel, 
                stream: activeStream,
                timestamp: new Date().toISOString() 
            },
            config: { modelType: trainingResult.bestModel.modelType }
        });
        toast({ title: "Model Saved", description: "Added to project scenarios." });
    };

    return (
        <div className="space-y-4 h-full flex flex-col">
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="py-3 px-4 border-b border-slate-800 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <Brain className="w-4 h-4 text-purple-400" /> Automated Model Selection
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                        <span className="text-xs text-slate-500 uppercase tracking-wider">Candidate Models</span>
                        <div className="flex gap-4">
                            {Object.keys(selectedModels).map(model => (
                                <div key={model} className="flex items-center space-x-2">
                                    <Checkbox 
                                        id={model} 
                                        checked={selectedModels[model]}
                                        onCheckedChange={(c) => setSelectedModels(prev => ({...prev, [model]: c}))}
                                    />
                                    <label htmlFor={model} className="text-sm text-slate-300 capitalize cursor-pointer">
                                        {model}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-2">
                        {isTraining ? (
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Training...</span>
                                    <span>{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-2 bg-slate-800" indicatorClassName="bg-purple-500" />
                            </div>
                        ) : (
                            <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={handleTrain}>
                                <Play className="w-4 h-4 mr-2" /> Train & Evaluate
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {trainingResult && (
                <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Best Model Card */}
                    <Card className="bg-slate-900 border-slate-800 border-l-4 border-l-green-500">
                        <CardHeader className="py-3 px-4 border-b border-slate-800">
                            <CardTitle className="text-sm font-medium text-green-400 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" /> Recommended Model
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div className="flex justify-between items-center">
                                <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30 text-lg py-1 px-3">
                                    {trainingResult.bestModel.modelType}
                                </Badge>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-white">{trainingResult.bestModel.confidence.toFixed(1)}%</div>
                                    <div className="text-xs text-slate-500">Confidence</div>
                                </div>
                            </div>
                            
                            <div className="space-y-2 text-sm text-slate-300">
                                <div className="flex justify-between border-b border-slate-800 pb-1">
                                    <span className="text-slate-500">RMSE</span>
                                    <span className="font-mono">{trainingResult.bestModel.error.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-800 pb-1">
                                    <span className="text-slate-500">R²</span>
                                    <span className="font-mono">{trainingResult.bestModel.r2.toFixed(4)}</span>
                                </div>
                                <div className="flex justify-between pt-1">
                                    <span className="text-slate-500">b-Factor</span>
                                    <span className="font-mono font-bold text-amber-400">{trainingResult.bestModel.params.b.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <p className="text-xs text-slate-400 italic bg-slate-950 p-2 rounded border border-slate-800">
                                {trainingResult.explanation}
                            </p>

                            <Button onClick={handleSaveBest} className="w-full bg-green-600 hover:bg-green-700">
                                Apply This Model
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Comparison Table */}
                    <Card className="bg-slate-900 border-slate-800 flex flex-col">
                        <CardHeader className="py-3 px-4 border-b border-slate-800">
                            <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <BarChart className="w-4 h-4 text-blue-400" /> Evaluation Metrics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 flex-1">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-slate-400">
                                    <thead className="text-xs text-slate-500 uppercase bg-slate-950 border-b border-slate-800">
                                        <tr>
                                            <th className="px-4 py-3">Model</th>
                                            <th className="px-4 py-3 text-right">Error (RMSE)</th>
                                            <th className="px-4 py-3 text-right">R²</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {trainingResult.candidates.map((model, idx) => (
                                            <tr key={idx} className={idx === 0 ? "bg-green-900/10" : ""}>
                                                <td className="px-4 py-3 font-medium text-slate-300 capitalize flex items-center gap-2">
                                                    {model.modelType}
                                                    {idx === 0 && <CheckCircle className="w-3 h-3 text-green-500" />}
                                                </td>
                                                <td className="px-4 py-3 text-right font-mono">{model.error.toFixed(2)}</td>
                                                <td className="px-4 py-3 text-right font-mono">{model.r2.toFixed(3)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default MLModelTraining;