import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
import { usePressureTransient } from '@/context/PressureTransientContext';
import { useToast } from '@/components/ui/use-toast';

// Components
import TestDataList from '../components/TestDataList';
import PressureTestForm from '../components/PressureTestForm';
import SmartGuidance from '../components/SmartGuidance';

const TestDataTab = () => {
  const { currentWell, addTest, setCurrentTest } = usePressureTransient();
  const { toast } = useToast();
  const [view, setView] = useState('list'); // 'list', 'create'

  const handleSaveTest = async (data) => {
    try {
      await addTest(data);
      setView('list');
      toast({ title: "Success", description: "Pressure test data saved." });
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "Failed to save test data", variant: "destructive" });
    }
  };

  const startNewTest = () => {
    if (!currentWell) {
        toast({ title: "Action Required", description: "Please select a well first in the Wells tab.", variant: "warning" });
        return;
    }
    setView('create');
  };

  if (view === 'list') {
      return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Test Data</h2>
                    <p className="text-slate-400">
                        {currentWell ? `Managing tests for: ${currentWell.name}` : "Select a well to view tests"}
                    </p>
                </div>
                <Button onClick={startNewTest} className="bg-blue-600 hover:bg-blue-700 text-white" disabled={!currentWell}>
                    <Plus className="w-4 h-4 mr-2" />
                    Upload New Test
                </Button>
            </div>
            
            {!currentWell && (
                 <SmartGuidance 
                    currentStep={0} 
                    onAction={() => {}} 
                 />
            )}

            <TestDataList 
                onAnalyze={(test) => { setCurrentTest(test); toast({title: "Test Selected", description: "Ready for analysis."}); }}
                onUpload={startNewTest}
            />
        </div>
      );
  }

  // Create View
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
         <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={() => setView('list')} className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
            <h2 className="text-2xl font-bold text-white">Upload Pressure Data</h2>
            <p className="text-slate-400">Target Well: {currentWell?.name}</p>
            </div>
        </div>

        <SmartGuidance currentStep={3} />

        <PressureTestForm 
            wellId={currentWell?.well_id}
            onSave={handleSaveTest}
            onCancel={() => setView('list')}
        />
    </div>
  );
};

export default TestDataTab;