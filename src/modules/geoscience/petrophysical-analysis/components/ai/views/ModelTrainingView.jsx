import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Play, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ModelTrainingView = () => {
    const [training, setTraining] = useState(false);
    const [progress, setProgress] = useState(0);
    const [epoch, setEpoch] = useState(0);
    const { toast } = useToast();

    const handleStartTraining = () => {
        setTraining(true);
        setProgress(0);
        setEpoch(0);
        
        const interval = setInterval(() => {
            setEpoch(prev => prev + 1);
            setProgress(prev => {
                const next = prev + 2;
                if (next >= 100) {
                    clearInterval(interval);
                    setTraining(false);
                    toast({ title: "Training Complete", description: "Model has been trained successfully." });
                    return 100;
                }
                return next;
            });
        }, 100);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <Card className="bg-slate-900 border-slate-800 lg:col-span-1">
                <CardHeader>
                    <CardTitle className="text-white">Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Model Name</Label>
                        <Input placeholder="New Model Name" className="bg-slate-950 border-slate-700" />
                    </div>
                    <div className="space-y-2">
                        <Label>Algorithm</Label>
                        <Select defaultValue="rf">
                            <SelectTrigger className="bg-slate-950 border-slate-700">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="rf">Random Forest</SelectItem>
                                <SelectItem value="gbm">Gradient Boosting</SelectItem>
                                <SelectItem value="nn">Neural Network (MLP)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Target Variable</Label>
                        <Select defaultValue="facies">
                            <SelectTrigger className="bg-slate-950 border-slate-700">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="facies">Lithofacies</SelectItem>
                                <SelectItem value="porosity">Porosity (PHI)</SelectItem>
                                <SelectItem value="perm">Permeability (K)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="pt-4">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white" onClick={handleStartTraining} disabled={training}>
                            {training ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                            {training ? 'Training...' : 'Start Training'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 lg:col-span-2 flex flex-col">
                <CardHeader>
                    <CardTitle className="text-white">Training Monitor</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-center">
                    {training || progress === 100 ? (
                        <div className="w-full max-w-md space-y-6 text-center">
                             <div className="flex justify-between text-sm text-slate-400 mb-2">
                                 <span>Epoch: {epoch}/50</span>
                                 <span>Loss: {(1 - (progress/100)).toFixed(4)}</span>
                             </div>
                             <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                                 <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                             </div>
                             <div className="grid grid-cols-3 gap-4 mt-8">
                                 <div className="p-4 bg-slate-950 rounded border border-slate-800">
                                     <p className="text-xs text-slate-500">Accuracy</p>
                                     <p className="text-xl font-bold text-white">{(0.5 + (progress/200)).toFixed(2)}</p>
                                 </div>
                                 <div className="p-4 bg-slate-950 rounded border border-slate-800">
                                     <p className="text-xs text-slate-500">Validation Loss</p>
                                     <p className="text-xl font-bold text-white">{(0.8 - (progress/200)).toFixed(2)}</p>
                                 </div>
                                 <div className="p-4 bg-slate-950 rounded border border-slate-800">
                                     <p className="text-xs text-slate-500">Time Elapsed</p>
                                     <p className="text-xl font-bold text-white">{Math.floor(epoch * 0.2)}s</p>
                                 </div>
                             </div>
                             {progress === 100 && (
                                 <Button className="mt-8" variant="outline"><Save className="w-4 h-4 mr-2" /> Save Model</Button>
                             )}
                        </div>
                    ) : (
                        <div className="text-slate-500">Ready to start training session.</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ModelTrainingView;