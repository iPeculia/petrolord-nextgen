import React from 'react';
import { cn } from '@/lib/utils';
import { useFacilityMasterPlanner } from '../../context/FacilityMasterPlannerContext';

const TabNavigation = () => {
  const { currentTab, setCurrentTab } = useFacilityMasterPlanner();

  const tabs = [
    { id: 'Overview', label: 'Layout & Overview' },
    { id: 'Process Units', label: 'Process Units' },
    { id: 'Equipment', label: 'Equipment List' },
    { id: 'Production Schedule', label: 'Production Forecast' },
    { id: 'Analysis', label: 'Analysis & Results' },
    { id: 'Scenario Comparison', label: 'Scenario Comparison' },
    { id: 'Settings', label: 'Settings' }
  ];

  return (
    <div className="h-12 bg-[#1e293b] border-b border-[#333333] flex items-end px-4 gap-4 overflow-x-auto no-scrollbar shrink-0">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setCurrentTab(tab.id)}
          className={cn(
            "px-2 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap outline-none",
            currentTab === tab.id
              ? "border-[#0066cc] text-white"
              : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;