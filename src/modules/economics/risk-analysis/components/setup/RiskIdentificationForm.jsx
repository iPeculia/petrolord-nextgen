import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRiskAnalysis } from '@/context/RiskAnalysisContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, AlertTriangle, ArrowRight, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const riskSchema = z.object({
  title: z.string().min(3, "Title too short").max(200),
  description: z.string().max(1000).optional(),
  category: z.enum(['Market', 'Technical', 'Operational', 'Regulatory', 'Environmental']),
  impact_type: z.enum(['Financial', 'Schedule', 'Technical', 'Reputational']),
  probability_percent: z.number().min(0).max(100),
  impact_value: z.number().min(0),
  mitigation_strategy: z.string().optional(),
});

const RiskIdentificationForm = () => {
  const { currentProject, currentRisk, addRisk, updateRisk, setCurrentRisk, deleteRisk } = useRiskAnalysis();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(riskSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'Market',
      impact_type: 'Financial',
      probability_percent: 50,
      impact_value: 0,
      mitigation_strategy: ''
    }
  });

  const probability = watch('probability_percent');
  const impact = watch('impact_value');
  const riskScore = (probability * impact) / 100;

  useEffect(() => {
    if (currentRisk) {
      reset({
        title: currentRisk.title,
        description: currentRisk.description || '',
        category: currentRisk.category,
        impact_type: currentRisk.impact_type,
        probability_percent: currentRisk.probability_percent,
        impact_value: currentRisk.impact_value,
        mitigation_strategy: currentRisk.mitigation_strategy || ''
      });
    } else {
        reset({
            title: '',
            description: '',
            category: 'Market',
            impact_type: 'Financial',
            probability_percent: 50,
            impact_value: 0,
            mitigation_strategy: ''
        });
    }
  }, [currentRisk, reset]);

  const onSubmit = (data) => {
    if (!currentProject) {
        toast({ title: "Error", description: "No project selected.", variant: "destructive" });
        return;
    }

    const riskData = {
        ...data,
        project_id: currentProject.project_id,
        owner: user?.id,
        risk_score: (data.probability_percent * data.impact_value) / 100
    };

    if (currentRisk) {
        updateRisk(currentRisk.risk_id, riskData);
        toast({ title: "Updated", description: "Risk updated successfully." });
    } else {
        addRisk(riskData);
        reset(); // Clear form for new entry
    }
  };

  const handleCreateNew = () => {
      setCurrentRisk(null);
      reset();
  };
  
  const handleDelete = () => {
      if (currentRisk && window.confirm("Delete this risk?")) {
          deleteRisk(currentRisk.risk_id);
          setCurrentRisk(null);
      }
  };

  if (!currentProject) return (
      <Card className="bg-[#1a1a1a] border-[#333] h-full flex items-center justify-center">
          <p className="text-slate-500">Please create or select a project first.</p>
      </Card>
  );

  return (
    <Card className="bg-[#1a1a1a] border-[#333] text-slate-200 h-full flex flex-col">
      <CardHeader className="pb-4 border-b border-[#333] flex flex-row items-center justify-between shrink-0">
        <CardTitle className="text-lg font-medium text-slate-200">
            {currentRisk ? 'Edit Risk' : 'New Risk Entry'}
        </CardTitle>
        <div className="flex gap-2">
            {currentRisk && (
                <Button variant="ghost" size="icon" onClick={handleDelete} className="text-red-400 hover:text-red-300 hover:bg-[#333]">
                    <Trash2 className="w-4 h-4" />
                </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleCreateNew} className="border-slate-700 text-slate-400">
                New
            </Button>
        </div>
      </CardHeader>
      
      <div className="flex-1 overflow-y-auto">
        <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-[#262626] border-[#333] w-full grid grid-cols-2">
                    <TabsTrigger value="details">Identification</TabsTrigger>
                    <TabsTrigger value="assessment">Assessment</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label>Risk Title <span className="text-red-500">*</span></Label>
                        <Input {...register('title')} className="bg-[#262626] border-[#404040]" placeholder="e.g., Oil Price Fluctuation" />
                        {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select onValueChange={(val) => setValue('category', val)} defaultValue={currentRisk?.category || 'Market'}>
                                <SelectTrigger className="bg-[#262626] border-[#404040]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#262626] border-[#404040] text-slate-200">
                                    {['Market', 'Technical', 'Operational', 'Regulatory', 'Environmental'].map(c => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Impact Type</Label>
                            <Select onValueChange={(val) => setValue('impact_type', val)} defaultValue={currentRisk?.impact_type || 'Financial'}>
                                <SelectTrigger className="bg-[#262626] border-[#404040]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#262626] border-[#404040] text-slate-200">
                                    {['Financial', 'Schedule', 'Technical', 'Reputational'].map(t => (
                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea {...register('description')} className="bg-[#262626] border-[#404040] min-h-[100px]" placeholder="Detailed description..." />
                    </div>
                </TabsContent>

                <TabsContent value="assessment" className="space-y-6 mt-4">
                     {/* Assessment Fields */}
                     <div className="space-y-4 p-4 bg-[#262626] rounded-md border border-[#333]">
                        <div className="flex justify-between items-center">
                            <Label>Probability: {probability}%</Label>
                        </div>
                        <Slider 
                            value={[probability]} 
                            onValueChange={(vals) => setValue('probability_percent', vals[0])} 
                            max={100} 
                            step={1}
                            className="py-2"
                        />
                        
                        <div className="space-y-2">
                            <Label>Impact Value ($)</Label>
                            <Input 
                                type="number" 
                                {...register('impact_value', { valueAsNumber: true })} 
                                className="bg-[#1a1a1a] border-[#404040]" 
                            />
                        </div>

                        <div className="mt-4 pt-4 border-t border-[#333] flex justify-between items-center">
                            <span className="text-sm text-slate-400">Calculated Risk Score</span>
                            <span className={`text-lg font-bold ${riskScore > 15 ? 'text-red-500' : riskScore > 5 ? 'text-yellow-500' : 'text-green-500'}`}>
                                {riskScore.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Mitigation Strategy</Label>
                        <Textarea {...register('mitigation_strategy')} className="bg-[#262626] border-[#404040]" placeholder="How to mitigate this risk..." />
                    </div>
                </TabsContent>
            </Tabs>

            <div className="pt-2 flex justify-end gap-2">
                 {activeTab === 'details' ? (
                     <Button type="button" onClick={() => setActiveTab('assessment')} className="bg-[#333] hover:bg-[#444] text-white">
                         Next: Assessment <ArrowRight className="w-4 h-4 ml-2" />
                     </Button>
                 ) : (
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                        <Save className="w-4 h-4 mr-2" />
                        {currentRisk ? 'Update Risk' : 'Add to Register'}
                    </Button>
                 )}
            </div>

            </form>
        </CardContent>
      </div>
    </Card>
  );
};

export default RiskIdentificationForm;