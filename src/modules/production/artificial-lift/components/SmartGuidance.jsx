import React from 'react';
import { useArtificialLift } from '../context/ArtificialLiftContext';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SmartGuidance = ({ onAction }) => {
  const { currentWellId, getReservoirProperties, getProductionData } = useArtificialLift();

  const getGuidance = () => {
    if (!currentWellId) {
        return { message: "Start by creating or selecting a well.", action: "Create Well", target: "wells" };
    }
    if (!getReservoirProperties(currentWellId)) {
        return { message: "Configure reservoir fluid properties next.", action: "Go to Reservoir Data", target: "reservoir" };
    }
    if (!getProductionData(currentWellId)) {
        return { message: "Enter production targets and constraints.", action: "Go to Production Data", target: "wells" }; // Production data is often part of wells/data tab
    }
    return { message: "You are ready to select a lift system and begin design.", action: "Start Design", target: "lift-systems" };
  };

  const guidance = getGuidance();

  return (
    <div className="bg-blue-900/20 border border-blue-900/50 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-500/10 rounded-full mt-1 md:mt-0">
                <Lightbulb className="w-5 h-5 text-blue-400" />
            </div>
            <div>
                <h4 className="text-sm font-medium text-blue-300">Recommended Next Step</h4>
                <p className="text-sm text-slate-400">{guidance.message}</p>
            </div>
        </div>
        <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 whitespace-nowrap"
            onClick={() => onAction && onAction(guidance.target)}
        >
            {guidance.action} <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
    </div>
  );
};

export default SmartGuidance;