import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SmartGuidance = ({ currentStep, onAction }) => {
  const getGuidance = () => {
    switch(currentStep) {
      case 0:
        return {
          title: "Setup Well Configuration",
          message: "Start by defining your well geometry and type. This establishes the base model for analysis.",
          action: "Configure Well"
        };
      case 1:
        return {
          title: "Define Reservoir Properties",
          message: "Input rock properties like porosity and permeability. These are critical for estimating reserves.",
          action: "Add Reservoir Data"
        };
      case 2:
        return {
          title: "Set Fluid Properties",
          message: "Characterize the fluid (Oil, Gas, or Water). PVT properties significantly impact pressure behavior.",
          action: "Add Fluid Data"
        };
      case 3:
        return {
          title: "Import Test Data",
          message: "Upload or manually enter pressure vs. time data to begin the diagnostic analysis.",
          action: "Upload Data"
        };
      default:
        return {
          title: "Analysis Ready",
          message: "All required data is present. You can now proceed to the Analysis tab to interpret the results.",
          action: "Go to Analysis"
        };
    }
  };

  const guidance = getGuidance();

  return (
    <Card className="bg-blue-950/20 border-blue-900/50">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="p-2 bg-blue-900/30 rounded-full">
          <Lightbulb className="w-5 h-5 text-blue-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-blue-200">{guidance.title}</h4>
          <p className="text-sm text-blue-300/80">{guidance.message}</p>
        </div>
        {onAction && (
           <Button 
            variant="ghost" 
            size="sm" 
            onClick={onAction}
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/50"
          >
            {guidance.action} <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartGuidance;