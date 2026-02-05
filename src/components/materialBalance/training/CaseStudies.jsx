import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const CaseStudies = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Real-World Case Studies</h2>
      
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Case Study 1: Permian Basin Wolfcamp</CardTitle>
          <CardDescription>Analysis of a solution gas drive reservoir with rapid pressure depletion.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-slate-300 text-sm space-y-2">
            <p><strong>Scenario:</strong> Operator noted GOR increasing rapidly after 12 months.</p>
            <p><strong>Analysis:</strong> Material Balance indicated bubble point was reached earlier than predicted by static models. Volumetric OOIP was 15% higher than MB OOIP, suggesting compartment sealing.</p>
            <p><strong>Outcome:</strong> Drilling plan was adjusted to target un-drained compartments.</p>
          </div>
          <Button variant="outline" className="border-slate-700 hover:bg-slate-800 text-slate-300">
            <Download className="w-4 h-4 mr-2" /> Download Dataset
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CaseStudies;