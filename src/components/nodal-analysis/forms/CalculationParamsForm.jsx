import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

const CalculationParamsForm = () => {
  return (
    <Card className="bg-[#1E293B] border-slate-700">
        <CardHeader>
            <CardTitle className="text-lg text-white">Analysis Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="p-6 border border-dashed border-slate-700 rounded-lg bg-slate-900/30 text-center space-y-4">
                <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Play className="w-8 h-8 text-blue-400 ml-1" />
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-medium text-white">Ready to Simulate</h3>
                    <p className="text-slate-400 max-w-sm mx-auto mt-2">
                        Configure simulation constraints and step sizes here. Ensure all input data is valid before running.
                    </p>
                </div>
                <Button className="bg-green-500 hover:bg-green-600 text-black font-semibold px-8">
                    Run Analysis
                </Button>
            </div>
        </CardContent>
    </Card>
  );
};

export default CalculationParamsForm;