import React, { useState } from 'react';
import ArtificialLiftLayout from './ArtificialLiftLayout';
import { useArtificialLift } from '../context/ArtificialLiftContext';

// Import Tabs
import WellsTab from '../components/tabs/WellsTab';
import ReservoirDataTab from '../components/tabs/ReservoirDataTab';
import LiftSystemsTab from '../components/tabs/LiftSystemsTab';
import EquipmentCatalogTab from '../components/tabs/EquipmentCatalogTab';
import DesignTab from '../components/tabs/DesignTab';
import ResultsTab from '../components/tabs/ResultsTab';
import SettingsTab from '../components/tabs/SettingsTab';
import { Loader2 } from 'lucide-react';

const ArtificialLiftApp = () => {
  const [activeTab, setActiveTab] = useState('wells');
  const { loading } = useArtificialLift();

  if (loading) {
      return (
        <div className="h-screen w-screen bg-[#0F172A] flex flex-col items-center justify-center text-white space-y-4">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-slate-400 font-medium tracking-wide animate-pulse">Initializing ALD Studio...</p>
        </div>
      );
  }
  
  // Render active component based on tab state
  const renderContent = () => {
    switch(activeTab) {
        case 'wells': return <WellsTab onDesign={() => setActiveTab('design')} />;
        case 'reservoir': return <ReservoirDataTab />;
        case 'lift-systems': return <LiftSystemsTab />;
        case 'equipment': return <EquipmentCatalogTab />;
        case 'design': return <DesignTab />;
        case 'results': return <ResultsTab />;
        case 'settings': return <SettingsTab />;
        default: return <WellsTab onDesign={() => setActiveTab('design')} />;
    }
  };

  return (
    <ArtificialLiftLayout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderContent()}
    </ArtificialLiftLayout>
  );
};

export default ArtificialLiftApp;