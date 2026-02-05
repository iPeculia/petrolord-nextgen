import React from 'react';
import { AnalyticsProvider, useAnalytics } from '@/modules/geoscience/petrophysical-analysis/context/AnalyticsContext';
import AnalyticsToolbar from './AnalyticsToolbar';
import CurveStatsWidget from './widgets/CurveStatsWidget';
import CorrelationWidget from './widgets/CorrelationWidget';
import PetroEvalWidget from './widgets/PetroEvalWidget';
import AnomalyWidget from './widgets/AnomalyWidget';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';

const DashboardContent = () => {
  const { activeWidgets, activeLogs } = useAnalytics();
  
  const hasData = Object.keys(activeLogs).length > 0;

  if (!hasData) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500">
        <p className="text-lg font-medium mb-2">No Analytics Data Available</p>
        <p className="text-sm">Select a well with log data to begin analysis.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0B101B] text-slate-200">
      <AnalyticsToolbar />
      
      <ScrollArea className="flex-1 p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-[2400px] mx-auto pb-20">
          
          {/* Primary Stats Widget - Always useful */}
          {activeWidgets.stats && (
            <DashboardWidget title="Curve Statistics & Distribution" className="col-span-1 lg:col-span-2 xl:col-span-1">
              <CurveStatsWidget />
            </DashboardWidget>
          )}

          {/* Petrophysical Evaluation */}
          {activeWidgets.petrophysics && (
             <DashboardWidget title="Petrophysical Evaluation" className="col-span-1 lg:col-span-2 xl:col-span-1">
               <PetroEvalWidget />
             </DashboardWidget>
          )}

          {/* Correlation Matrix */}
          {activeWidgets.correlation && (
            <DashboardWidget title="Correlation Analysis" className="col-span-1">
              <CorrelationWidget mode="matrix" />
            </DashboardWidget>
          )}
          
          {/* Crossplot */}
          {activeWidgets.crossplot && (
            <DashboardWidget title="Cross-Plot Analysis" className="col-span-1">
              <CorrelationWidget mode="crossplot" />
            </DashboardWidget>
          )}

          {/* Anomaly Detection */}
          {activeWidgets.anomalies && (
            <DashboardWidget title="Anomaly Detection" className="col-span-1 lg:col-span-2">
              <AnomalyWidget />
            </DashboardWidget>
          )}
          
        </div>
      </ScrollArea>
    </div>
  );
};

const DashboardWidget = ({ title, children, className }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden flex flex-col ${className}`}
  >
    <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center">
      <h3 className="font-medium text-slate-200">{title}</h3>
    </div>
    <div className="p-4 flex-1 min-h-[300px]">
      {children}
    </div>
  </motion.div>
);

const AnalyticsDashboardPanel = () => {
  return (
    <AnalyticsProvider>
      <DashboardContent />
    </AnalyticsProvider>
  );
};

export default AnalyticsDashboardPanel;