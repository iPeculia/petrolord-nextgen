import React from 'react';
import { useRiskAnalysis } from '@/context/RiskAnalysisContext';
import { ChevronRight, ChevronLeft, Activity, Info, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import QuickStatsPanel from './QuickStatsPanel';

const PropertyRow = ({ label, value }) => (
  <div className="mb-3">
    <span className="block text-xs text-slate-500 mb-1">{label}</span>
    <span className="block text-sm text-slate-200 font-medium break-words">{value || '-'}</span>
  </div>
);

const RightPanel = () => {
  const { 
    currentRisk, 
    rightPanelCollapsed, 
    toggleRightPanel,
    analysisResults,
    currentProject
  } = useRiskAnalysis();

  const results = currentProject ? analysisResults[Object.keys(analysisResults).find(k => k.includes(currentProject.project_id))] : null;

  if (rightPanelCollapsed) {
    return (
      <div className="w-0 bg-[#1a1a1a] border-l border-[#333] relative transition-all duration-300">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute -left-8 top-1/2 bg-[#1a1a1a] border border-[#333] border-r-0 rounded-l-md w-8 h-12 text-slate-400 hover:text-white"
          onClick={toggleRightPanel}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-[300px] bg-[#1a1a1a] border-l border-[#333] flex flex-col shrink-0 transition-all duration-300">
      <div className="h-[50px] flex items-center px-4 border-b border-[#333] justify-between shrink-0">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Properties
        </span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-8 h-8 text-slate-400 hover:text-white"
          onClick={toggleRightPanel}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        {currentRisk ? (
          <div className="space-y-6">
            <div className="bg-[#262626] rounded-lg p-4 border border-[#333]">
              <div className="flex items-center gap-2 mb-4 text-blue-400">
                <Info className="w-4 h-4" />
                <h3 className="font-semibold text-sm">Risk Details</h3>
              </div>
              <PropertyRow label="Title" value={currentRisk.title} />
              <PropertyRow label="Category" value={currentRisk.category} />
              <PropertyRow label="Status" value={currentRisk.status} />
              <PropertyRow label="Owner" value="Assigned User" /> {/* Placeholder for user lookup */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                 <PropertyRow label="Probability" value={`${currentRisk.probability_percent}%`} />
                 <PropertyRow label="Impact" value={`$${currentRisk.impact_value.toLocaleString()}`} />
              </div>
              <PropertyRow label="Risk Score" value={currentRisk.risk_score.toFixed(2)} />
            </div>

            <div className="bg-[#262626] rounded-lg p-4 border border-[#333]">
               <div className="flex items-center gap-2 mb-2 text-slate-400">
                  <span className="text-xs font-semibold uppercase">Mitigation Strategy</span>
               </div>
               <p className="text-sm text-slate-300 leading-relaxed">
                  {currentRisk.mitigation_strategy || "No mitigation strategy defined."}
               </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
             <QuickStatsPanel />
             
             {results && (
               <div className="bg-[#262626] rounded-lg p-4 border border-[#333]">
                  <div className="flex items-center gap-2 mb-4 text-emerald-500">
                    <BarChart2 className="w-4 h-4" />
                    <h3 className="font-semibold text-sm">Latest Analysis</h3>
                  </div>
                  <PropertyRow label="Mean NPV" value={`$${results.mean_npv?.toLocaleString()}`} />
                  <PropertyRow label="P50 NPV" value={`$${results.p50_npv?.toLocaleString()}`} />
                  <PropertyRow label="Mean IRR" value={`${results.mean_irr?.toFixed(1)}%`} />
                  <PropertyRow label="Date" value={new Date(results.analysis_date).toLocaleDateString()} />
               </div>
             )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default RightPanel;