import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Brain, Play, Activity, BarChart2, Save, RefreshCw, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useToast } from '@/components/ui/use-toast';

const MachineLearningPage = () => {
  const { toast } = useToast();
  const [activeModel, setActiveModel] = useState('lithology-pred-v1');
  const [trainingStatus, setTrainingStatus] = useState('idle'); // idle, training, completed
  const [progress, setProgress] = useState(0);

  // Mock Data
  const performanceData = [
    { epoch: 1, accuracy: 0.65, loss: 0.8 },
    { epoch: 2, accuracy: 0.72, loss: 0.6 },
    { epoch: 3, accuracy: 0.78, loss: 0.45 },
    { epoch: 4, accuracy: 0.82, loss: 0.35 },
    { epoch: 5, accuracy: 0.85, loss: 0.28 },
  ];

  const featureImportance = [
    { feature: 'Gamma Ray', importance: 0.35 },
    { feature: 'Resistivity', importance: 0.25 },
    { feature: 'Neutron', importance: 0.20 },
    { feature: 'Density', importance: 0.15 },
    { feature: 'Sonic', importance: 0.05 },
  ];

  const handleTrain = () => {
    setTrainingStatus('training');
    setProgress(0);
    toast({ title: "Training Started", description: "Model training initiated on GPU cluster." });
    
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTrainingStatus('completed');
        toast({ title: "Training Completed", description: "Model reached 85% accuracy." });
      }
    }, 500);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Brain className="w-8 h-8 text-[#BFFF00]" />
            Machine Learning Center
          </h1>
          <p className="text-gray-400">Build, train, and deploy predictive models for subsurface analysis.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-600 text-slate-200">
            <Save className="w-4 h-4 mr-2" /> Save Model
          </Button>
          <Button className="bg-[#BFFF00] text-black hover:bg-[#a3d900]">
             New Project
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <Card className="col-span-12 md:col-span-3 bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">Models</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {['lithology-pred-v1', 'porosity-est-v2', 'perm-net-v3', 'fault-detect-cnn'].map((model) => (
              <div 
                key={model}
                className={`p-3 rounded-md cursor-pointer flex items-center justify-between ${activeModel === model ? 'bg-slate-800 border border-slate-700' : 'hover:bg-slate-800/50'}`}
                onClick={() => setActiveModel(model)}
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-slate-200">{model}</span>
                </div>
                {model === activeModel && <Badge variant="outline" className="text-[#BFFF00] border-[#BFFF00]">Active</Badge>}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="col-span-12 md:col-span-9 space-y-6">
           <Tabs defaultValue="train" className="w-full">
             <TabsList className="bg-slate-900 border-slate-800">
               <TabsTrigger value="train">Training</TabsTrigger>
               <TabsTrigger value="evaluate">Evaluation</TabsTrigger>
               <TabsTrigger value="predict">Prediction</TabsTrigger>
             </TabsList>

             <TabsContent value="train" className="space-y-4 mt-4">
               <Card className="bg-slate-900 border-slate-800">
                 <CardHeader>
                   <CardTitle className="text-white">Model Configuration</CardTitle>
                   <CardDescription>Configure hyperparameters and training data.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <label className="text-sm text-slate-400">Algorithm</label>
                       <Select defaultValue="xgboost">
                         <SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue /></SelectTrigger>
                         <SelectContent>
                           <SelectItem value="xgboost">XGBoost Classifier</SelectItem>
                           <SelectItem value="random_forest">Random Forest</SelectItem>
                           <SelectItem value="neural_net">Deep Neural Network</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                     <div className="space-y-2">
                       <label className="text-sm text-slate-400">Target Variable</label>
                       <Select defaultValue="lithology">
                         <SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue /></SelectTrigger>
                         <SelectContent>
                           <SelectItem value="lithology">Lithology</SelectItem>
                           <SelectItem value="porosity">Porosity</SelectItem>
                           <SelectItem value="permeability">Permeability</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                   </div>

                   {trainingStatus === 'training' && (
                     <div className="space-y-2 py-4">
                       <div className="flex justify-between text-sm text-slate-300">
                         <span>Training Progress</span>
                         <span>{progress}%</span>
                       </div>
                       <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-[#BFFF00] transition-all duration-300" style={{ width: `${progress}%` }} />
                       </div>
                     </div>
                   )}

                   <div className="pt-4">
                     <Button 
                        onClick={handleTrain} 
                        disabled={trainingStatus === 'training'}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                       {trainingStatus === 'training' ? <RefreshCw className="mr-2 w-4 h-4 animate-spin" /> : <Play className="mr-2 w-4 h-4" />}
                       {trainingStatus === 'training' ? 'Training in Progress...' : 'Start Training'}
                     </Button>
                   </div>
                 </CardContent>
               </Card>
             </TabsContent>

             <TabsContent value="evaluate" className="space-y-4 mt-4">
               <div className="grid grid-cols-2 gap-4">
                 <Card className="bg-slate-900 border-slate-800">
                   <CardHeader>
                     <CardTitle className="text-white text-sm">Training History</CardTitle>
                   </CardHeader>
                   <CardContent className="h-64">
                     <ResponsiveContainer width="100%" height="100%">
                       <LineChart data={performanceData}>
                         <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                         <XAxis dataKey="epoch" stroke="#94a3b8" />
                         <YAxis stroke="#94a3b8" />
                         <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                         <Line type="monotone" dataKey="accuracy" stroke="#BFFF00" strokeWidth={2} />
                         <Line type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={2} />
                       </LineChart>
                     </ResponsiveContainer>
                   </CardContent>
                 </Card>

                 <Card className="bg-slate-900 border-slate-800">
                   <CardHeader>
                     <CardTitle className="text-white text-sm">Feature Importance</CardTitle>
                   </CardHeader>
                   <CardContent className="h-64">
                     <ResponsiveContainer width="100%" height="100%">
                       <BarChart layout="vertical" data={featureImportance}>
                         <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                         <XAxis type="number" stroke="#94a3b8" />
                         <YAxis dataKey="feature" type="category" width={100} stroke="#94a3b8" />
                         <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                         <Bar dataKey="importance" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                       </BarChart>
                     </ResponsiveContainer>
                   </CardContent>
                 </Card>
               </div>
             </TabsContent>

             <TabsContent value="predict" className="mt-4">
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-12 text-center text-slate-400">
                    <Brain className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <h3 className="text-lg font-medium text-white">Prediction Engine Ready</h3>
                    <p className="mb-6">Select a well dataset to generate predictions using {activeModel}.</p>
                    <Button className="bg-[#BFFF00] text-black hover:bg-[#a3d900]">Select Dataset</Button>
                  </CardContent>
                </Card>
             </TabsContent>
           </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MachineLearningPage;