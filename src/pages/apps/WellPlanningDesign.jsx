import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { WellPlanningDesignProvider } from '@/contexts/WellPlanningDesignContext';
import TopBanner from '@/modules/drilling/well-planning/components/layout/TopBanner';
import LeftPanel from '@/modules/drilling/well-planning/components/layout/LeftPanel';
import CenterPanel from '@/modules/drilling/well-planning/components/layout/CenterPanel';
import RightPanel from '@/modules/drilling/well-planning/components/layout/RightPanel';
import WellPlanningErrorBoundary from '@/modules/drilling/well-planning/components/WellPlanningErrorBoundary';
import { Loader2 } from 'lucide-react';

// Import CSS directly to ensure it loads
import '@/styles/wellPlanning.css';
import '@/styles/wellGeometry.css';

const WellPlanningDesignContent = () => {
  return (
    <div className="flex flex-col h-screen w-full bg-[#0F172A] text-white overflow-hidden font-sans">
      <TopBanner />
      <div className="flex-1 flex overflow-hidden relative">
        <LeftPanel />
        <CenterPanel />
        <RightPanel />
      </div>
    </div>
  );
};

const WellPlanningDesignPage = () => {
  return (
    <WellPlanningErrorBoundary>
      <WellPlanningDesignProvider>
        <Helmet>
          <title>Well Planning & Design | Petrolord</title>
          <meta name="description" content="Advanced Well Planning and Directional Drilling Design Module" />
        </Helmet>
        <Suspense fallback={
          <div className="flex items-center justify-center h-screen bg-[#0F172A] text-white">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            <span className="ml-3 text-sm text-slate-400">Initializing Core Module...</span>
          </div>
        }>
          <WellPlanningDesignContent />
        </Suspense>
      </WellPlanningDesignProvider>
    </WellPlanningErrorBoundary>
  );
};

export default WellPlanningDesignPage;