import React, { useMemo } from 'react';
import { useNetworkOptimization } from '@/context/NetworkOptimizationContext';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

const DataValidationSummary = () => {
  const { currentNetwork, nodes, pipelines, setCurrentTab, setSelectedNode, setSelectedPipeline } = useNetworkOptimization();

  const validationIssues = useMemo(() => {
    const issues = [];
    if (!currentNetwork) return [];

    // Check disconnected nodes
    const connectedNodeIds = new Set();
    pipelines.forEach(p => {
        connectedNodeIds.add(p.from_node_id);
        connectedNodeIds.add(p.to_node_id);
    });

    nodes.forEach(n => {
        if (!connectedNodeIds.has(n.node_id)) {
            issues.push({
                type: 'warning',
                message: `Node "${n.name}" is disconnected`,
                entity: n,
                entityType: 'node'
            });
        }
    });

    // Check invalid pipeline connections
    pipelines.forEach(p => {
        if (p.from_node_id === p.to_node_id) {
            issues.push({
                type: 'error',
                message: `Pipeline "${p.name}" connects to itself`,
                entity: p,
                entityType: 'pipeline'
            });
        }
    });
    
    // Check missing Wells (at least one source needed usually)
    const wells = nodes.filter(n => n.type === 'Well');
    if (wells.length === 0) {
        issues.push({ type: 'error', message: 'No Wells defined in network' });
    }

    // Check missing Sink (at least one export point)
    const sinks = nodes.filter(n => n.type === 'Sink');
    if (sinks.length === 0) {
        issues.push({ type: 'warning', message: 'No Sink/Export node defined' });
    }

    return issues;
  }, [nodes, pipelines, currentNetwork]);

  const handleFix = (issue) => {
      if (issue.entityType === 'node') {
          setCurrentTab('Nodes');
          setSelectedNode(issue.entity);
      } else if (issue.entityType === 'pipeline') {
          setCurrentTab('Pipelines');
          setSelectedPipeline(issue.entity);
      } else {
          // General navigation based on error type
          if (issue.message.includes('Wells')) setCurrentTab('Nodes');
      }
  };

  if (validationIssues.length === 0) {
      return (
        <div className="p-4 border-t border-slate-800 bg-[#0F172A]/50">
            <div className="flex items-center gap-2 text-emerald-500 text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>Network topology is valid</span>
            </div>
        </div>
      );
  }

  return (
    <div className="border-t border-slate-800 bg-[#0F172A] flex flex-col h-48">
        <div className="p-3 bg-slate-900/50 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider flex justify-between items-center">
            <span>Validation Issues ({validationIssues.length})</span>
        </div>
        <ScrollArea className="flex-1">
            <div className="divide-y divide-slate-800/50">
                {validationIssues.map((issue, idx) => (
                    <div key={idx} className="p-3 hover:bg-slate-800/30 flex justify-between items-start gap-3">
                        <div className="flex gap-2 items-start">
                             <AlertCircle className={`h-4 w-4 mt-0.5 ${issue.type === 'error' ? 'text-red-500' : 'text-amber-500'}`} />
                             <span className="text-sm text-slate-300">{issue.message}</span>
                        </div>
                        {issue.entity && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 text-xs text-blue-400 hover:text-blue-300"
                                onClick={() => handleFix(issue)}
                            >
                                Fix
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </ScrollArea>
    </div>
  );
};

export default DataValidationSummary;