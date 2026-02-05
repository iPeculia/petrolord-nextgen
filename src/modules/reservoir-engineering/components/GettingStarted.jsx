import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, UploadCloud, PlusCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useMaterialBalanceStore } from '@/modules/reservoir-engineering/store/materialBalanceStore';
import SampleDataLoader from './SampleDataLoader';
import { getSampleProductionData, getSamplePvtData } from '@/modules/reservoir-engineering/data/sampleData';

const GettingStarted = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setData, setLoading } = useMaterialBalanceStore.getState();

  const handleCreateNew = () => {
    toast({
      title: 'Feature In Progress',
      description: 'Creating new analyses will be available soon. For now, please use the "Load Sample Data" feature to explore.',
    });
    // In future: navigate('/modules/reservoir-engineering/material-balance-analysis/new');
  };
  
  const handleLoadSampleData = (scenario) => {
    setLoading(true);
    setTimeout(() => {
        const productionData = getSampleProductionData(scenario);
        const pvtData = getSamplePvtData(scenario);
        
        // This simulates loading data into a new, temporary analysis state
        // In a real app, this would create a new analysis record
        setData('productionData', productionData);
        setData('pvtData', pvtData);
        setData('pressureData', []); // Clear pressure if not part of sample
        
        // A hack to make the UI show the tabs
        useMaterialBalanceStore.setState({ analysis: { id: 'sample', name: 'Sample Analysis' }});

        setLoading(false);
        toast({
            title: 'Sample Data Loaded',
            description: `The "${scenario.replace(/_/g, ' ')}" scenario has been loaded.`,
        });
    }, 500);
  };


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Lightbulb className="mr-3 h-8 w-8 text-yellow-400" />
          Welcome to Material Balance Analysis
        </CardTitle>
        <CardDescription>
          Get started by creating a new analysis, or load sample data to explore the features.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PlusCircle className="mr-2" />
                Create New Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Start from scratch by creating a new analysis project and uploading your own data.
              </p>
              <button onClick={handleCreateNew} className="text-primary font-semibold">
                Start New Analysis &rarr;
              </button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UploadCloud className="mr-2" />
                Load Sample Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Don't have your own data? Load one of our pre-built sample scenarios to see how it works.
              </p>
              <SampleDataLoader onDataLoad={handleLoadSampleData} isLoading={useMaterialBalanceStore(s => s.loading)} />
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default GettingStarted;