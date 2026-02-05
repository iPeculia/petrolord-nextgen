import React from 'react';
import { Activity, RotateCcw, Calculator, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const StudyHeader = ({ fluidType, isCalculating, onCalculate, onReset }) => {
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-[#1e293b] border-b border-slate-700 flex items-center justify-between px-6 sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/modules/facilities')} className="text-slate-400 hover:text-white hover:bg-slate-800">
              <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-500" />
                  Pipeline Sizer Studio
              </h1>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span className="bg-slate-800 px-1.5 rounded text-amber-500 font-mono border border-slate-700">Project: DEFAULT</span>
                  <span>•</span>
                  <span>Fluid: <span className="text-slate-200 font-semibold">{fluidType.toUpperCase()}</span></span>
              </div>
          </div>
      </div>
      
      <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onReset} className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
              <RotateCcw className="w-4 h-4 mr-2" /> Reset
          </Button>
          <Button 
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold shadow-lg shadow-orange-900/20 transition-all hover:scale-105" 
            disabled={isCalculating} 
            onClick={onCalculate}
          >
              {isCalculating ? (
                  <>
                      <Activity className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                  </>
              ) : (
                  <>
                      <Calculator className="w-4 h-4 mr-2" />
                      Run Analysis
                  </>
              )}
          </Button>
      </div>
    </header>
  );
};

export default StudyHeader;