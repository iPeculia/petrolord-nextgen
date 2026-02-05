import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WellTestAnalysisProvider } from '@/contexts/WellTestAnalysisContext';
import WellTestAnalysis from '@/components/wellTestAnalysis/WellTestAnalysis';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const AppNavBar = () => {
    const navigate = useNavigate();
    return (
      <div className="h-10 bg-slate-950 border-b border-slate-800 flex items-center px-4 shrink-0">
          <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard/modules/reservoir')} 
              className="text-slate-400 hover:text-white flex items-center gap-2 h-8 px-2"
          >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-medium">Back to Module</span>
          </Button>
          <div className="h-4 w-px bg-slate-800 mx-3" />
          <span className="text-xs font-semibold text-slate-200">Well Test Analysis</span>
      </div>
    );
};

const WellTestAnalysisPage = () => {
  return (
    <WellTestAnalysisProvider>
      <Helmet>
        <title>Well Test Analysis | Petrolord</title>
        <meta name="description" content="Advanced pressure transient analysis and interpretation software." />
      </Helmet>
      <div className="h-screen w-full bg-[#0F172A] overflow-hidden flex flex-col">
        <AppNavBar />
        <div className="flex-1 overflow-hidden">
            <WellTestAnalysis />
        </div>
      </div>
    </WellTestAnalysisProvider>
  );
};

export default WellTestAnalysisPage;