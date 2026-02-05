import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReservoirSimulationProvider } from '@/context/ReservoirSimulationContext.jsx';
import ReservoirSimulationLab from '@/components/reservoirSimulation/ReservoirSimulationLab.jsx';
import RSLTabNavigation from '@/components/reservoirSimulation/RSLTabNavigation.jsx';
import OverviewTab from '@/components/reservoirSimulation/tabs/OverviewTab.jsx';
import ResultsExportsTab from '@/components/reservoirSimulation/tabs/ResultsExportsTab.jsx';
import { useReservoirSimulation } from '@/context/ReservoirSimulationContext.jsx';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet';

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
          <span className="text-xs font-semibold text-slate-200">Reservoir Simulation Lab</span>
      </div>
    );
};

const ReservoirSimulationContent = () => {
    const { state } = useReservoirSimulation();
    const { activeTab } = state;

    return (
        <div className="flex flex-col h-full w-full">
            <AppNavBar />
            
            {/* Top Navigation Bar */}
            <div className="shrink-0">
                <RSLTabNavigation />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden relative bg-slate-950">
                {activeTab === 'overview' && (
                    <OverviewTab />
                )}
                
                {activeTab === 'lab' && (
                     <ReservoirSimulationLab />
                )}

                {activeTab === 'results' && (
                    <ResultsExportsTab />
                )}
            </div>
        </div>
    );
};

const ReservoirSimulationPage = () => {
  return (
    <div className="h-screen w-full bg-slate-950 overflow-hidden flex flex-col">
        <Helmet>
          <title>Reservoir Simulation Lab | Petrolord</title>
          <meta name="description" content="Advanced reservoir simulation for comprehensive subsurface modeling." />
        </Helmet>
        <ReservoirSimulationProvider>
            <ReservoirSimulationContent />
        </ReservoirSimulationProvider>
    </div>
  );
};

export default ReservoirSimulationPage;