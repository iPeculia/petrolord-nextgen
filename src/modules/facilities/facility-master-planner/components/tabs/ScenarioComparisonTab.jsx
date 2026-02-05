import React, { useState } from 'react';
import { Plus, BarChart2, List, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import ScenarioCreationDialog from '../dialogs/ScenarioCreationDialog';
import ScenarioComparisonTable from '../visualization/ScenarioComparisonTable';
import ScenarioRankingChart from '../charts/ScenarioRankingChart';
import ScenarioDetailsPanel from '../panels/ScenarioDetailsPanel';
import useAdvancedPlanning from '../../hooks/useAdvancedPlanning';
import { cn } from '@/lib/utils';

const ScenarioComparisonTab = () => {
  const { 
    scenarios, 
    comparingScenarios, 
    isProcessing, 
    createNewScenario, 
    runScenarioAnalysis, 
    toggleComparison, 
    deleteScenario 
  } = useAdvancedPlanning();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedScenarioId, setSelectedScenarioId] = useState(null);

  const selectedScenario = scenarios.find(s => s.scenario_id === selectedScenarioId);
  const scenariosToCompare = scenarios.filter(s => comparingScenarios.includes(s.scenario_id));

  return (
    <div className="flex h-full bg-[#0f172a] text-white overflow-hidden">
      {/* Sidebar List */}
      <div className="w-[300px] border-r border-slate-800 bg-[#161e2e] flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800 bg-[#131b2b]">
            <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white" onClick={() => setIsCreateOpen(true)}>
                <Plus className="w-4 h-4 mr-2" /> New Scenario
            </Button>
        </div>
        <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
                {scenarios.map(scenario => (
                    <div 
                        key={scenario.scenario_id} 
                        className={cn(
                            "flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer border",
                            selectedScenarioId === scenario.scenario_id 
                                ? "bg-blue-900/20 border-blue-500/50" 
                                : "bg-transparent border-transparent hover:bg-slate-800/50"
                        )}
                        onClick={() => setSelectedScenarioId(scenario.scenario_id)}
                    >
                        <Checkbox 
                            checked={comparingScenarios.includes(scenario.scenario_id)}
                            onCheckedChange={() => toggleComparison(scenario.scenario_id)}
                            onClick={(e) => e.stopPropagation()}
                            className="border-slate-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                        />
                        <div className="flex-1 overflow-hidden">
                            <div className="font-medium text-sm truncate text-white">{scenario.name}</div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={cn(
                                    "w-2 h-2 rounded-full",
                                    scenario.status === 'Completed' ? "bg-emerald-500" : "bg-slate-600"
                                )} />
                                <span className="text-[10px] text-slate-400 uppercase">{scenario.status}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {scenarios.length === 0 && (
                    <div className="text-center p-8 text-slate-500 text-sm">
                        No scenarios created yet.
                    </div>
                )}
            </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header/Toolbar */}
        <div className="h-14 border-b border-slate-800 bg-[#131b2b] flex items-center px-6 justify-between shrink-0">
            <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-slate-400" />
                <h2 className="font-semibold text-lg">Comparison Workspace</h2>
                <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-400 ml-2">
                    {comparingScenarios.length} selected
                </span>
            </div>
            {isProcessing && (
                 <div className="flex items-center gap-2 text-blue-400 text-sm animate-pulse">
                     <PlayCircle className="w-4 h-4" /> Processing Analysis...
                 </div>
            )}
        </div>

        {/* Workspace Panels */}
        <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Side-by-Side Comparison</h3>
                        <ScenarioComparisonTable scenarios={scenariosToCompare} />
                    </div>
                    
                    <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Metric Ranking</h3>
                        <ScenarioRankingChart scenarios={scenariosToCompare} />
                    </div>
                </div>
            </div>

            {/* Right Details Panel */}
            {selectedScenarioId && (
                <div className="w-[320px] border-l border-slate-800 bg-[#161e2e] shrink-0 overflow-hidden animate-in slide-in-from-right-10 duration-300">
                    <ScenarioDetailsPanel 
                        scenario={selectedScenario} 
                        onRun={runScenarioAnalysis} 
                        onDelete={deleteScenario}
                    />
                </div>
            )}
        </div>
      </div>

      <ScenarioCreationDialog 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
        onCreate={createNewScenario} 
      />
    </div>
  );
};

export default ScenarioComparisonTab;