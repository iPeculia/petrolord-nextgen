import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight } from 'lucide-react';

const HydraulicsSimulatorCard = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-slate-900 border-slate-800 hover:border-blue-500/50 transition-all duration-300 group h-full flex flex-col">
      <CardHeader>
        <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-600 transition-colors">
            {/* Simple Pump Icon SVG */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400 group-hover:text-white">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
        </div>
        <CardTitle className="text-slate-100 group-hover:text-blue-400 transition-colors">Hydraulics Simulator</CardTitle>
        <CardDescription className="text-slate-400">
          Advanced drilling hydraulics simulation and ECD optimization studio.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-2 mb-4">
             <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">Steady-State</span>
             <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">ECD Management</span>
             <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">Hole Cleaning</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>System Status: Available</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
            className="w-full bg-slate-800 hover:bg-blue-600 text-white border border-slate-700 hover:border-blue-500" 
            onClick={() => navigate('/dashboard/modules/drilling/hydraulics-simulator')}
        >
          Launch Studio <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HydraulicsSimulatorCard;