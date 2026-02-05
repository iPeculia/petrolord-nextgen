import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import NetworkWorkspace from '../components/NetworkWorkspace';
import { useNetworkOptimization } from '@/context/NetworkOptimizationContext';
import TabPanel from '../components/TabPanel';

// We replaced MainContentArea with NetworkWorkspace as the primary view container
// but we still need to handle the specific tabs if they take over the full screen.
// For now, let's make NetworkWorkspace the main content area replacement.

const NetworkOptimizationStudio = () => {
  const { sidebarCollapsed, currentTab } = useNetworkOptimization();

  // Logic to switch main view based on tab could go here, 
  // but Workspace handles lists/viz/properties in one view.
  // Optimization tab might need a different full screen view later.
  
  return (
    <div className="flex h-screen w-screen flex-col bg-[#0F172A] text-slate-50 overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main 
          className={`flex-1 flex flex-col transition-all duration-300 ease-in-out bg-[#020617] relative`}
        >
            {/* If tab is 'Settings' or 'Results' we might show different components */}
            {currentTab === 'Settings' ? (
                <div className="flex-1 flex items-center justify-center text-slate-500">Settings Page Placeholder</div>
            ) : (
                <NetworkWorkspace />
            )}
        </main>
      </div>
    </div>
  );
};

export default NetworkOptimizationStudio;