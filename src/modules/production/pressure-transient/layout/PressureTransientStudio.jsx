import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import WellsTab from '../tabs/WellsTab';
import TestDataTab from '../tabs/TestDataTab';
import AnalysisTab from '../tabs/AnalysisTab';
import ResultsTab from '../tabs/ResultsTab';
import SettingsTab from '../tabs/SettingsTab';
import CreateWellModal from '../components/CreateWellModal';

const PressureTransientStudio = () => {
  const [activeTab, setActiveTab] = useState('wells');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNewWellModalOpen, setIsNewWellModalOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'wells': return <WellsTab onNewWell={() => setIsNewWellModalOpen(true)} />;
      case 'test-data': return <TestDataTab />;
      case 'analysis': return <AnalysisTab />;
      case 'results': return <ResultsTab />;
      case 'settings': return <SettingsTab />;
      default: return <WellsTab onNewWell={() => setIsNewWellModalOpen(true)} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0F172A] overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onNewWell={() => setIsNewWellModalOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 scroll-smooth">
          <div className="max-w-[1600px] mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Modals */}
      <CreateWellModal 
        isOpen={isNewWellModalOpen} 
        onClose={() => setIsNewWellModalOpen(false)} 
      />
    </div>
  );
};

export default PressureTransientStudio;