import React from 'react';
import { useNetworkOptimization } from '@/context/NetworkOptimizationContext';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = () => {
  const { currentNetwork, currentTab } = useNetworkOptimization();

  return (
    <nav className="hidden lg:flex items-center text-sm text-slate-400">
      <span className="hover:text-slate-200 cursor-pointer transition-colors">Production</span>
      <ChevronRight className="h-4 w-4 mx-2 text-slate-600" />
      <span className="hover:text-slate-200 cursor-pointer transition-colors">Network Opt</span>
      {currentNetwork && (
        <>
          <ChevronRight className="h-4 w-4 mx-2 text-slate-600" />
          <span className="font-medium text-slate-200">{currentNetwork.name}</span>
        </>
      )}
      <ChevronRight className="h-4 w-4 mx-2 text-slate-600" />
      <span className="text-emerald-400 font-medium">{currentTab}</span>
    </nav>
  );
};

export default Breadcrumb;