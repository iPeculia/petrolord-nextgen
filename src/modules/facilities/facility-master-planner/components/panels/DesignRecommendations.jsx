import React from 'react';
import { Lightbulb, AlertTriangle, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const RecommendationCard = ({ recommendation }) => {
  const priorityColor = recommendation.priority === 'High' ? 'border-red-500 bg-red-950/10' : 
                        recommendation.priority === 'Medium' ? 'border-amber-500 bg-amber-950/10' : 'border-blue-500 bg-blue-950/10';
  
  const iconColor = recommendation.priority === 'High' ? 'text-red-500' : 
                    recommendation.priority === 'Medium' ? 'text-amber-500' : 'text-blue-500';

  return (
    <div className={cn("p-4 rounded-lg border-l-4 mb-3 transition-all hover:bg-slate-800/50 group", priorityColor)}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-white flex items-center gap-2">
          <Lightbulb className={cn("w-4 h-4", iconColor)} />
          {recommendation.title}
        </h4>
        <span className={cn("text-[10px] px-2 py-0.5 rounded-full bg-slate-900 uppercase font-bold border border-slate-700", iconColor)}>
          {recommendation.priority}
        </span>
      </div>
      <p className="text-sm text-slate-400 mb-3 leading-relaxed">{recommendation.description}</p>
      
      <div className="grid grid-cols-2 gap-4 text-xs mb-3">
         <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
            <div className="text-slate-500 mb-1 font-medium uppercase text-[10px]">Impact</div>
            <div className="text-emerald-400 font-bold">{recommendation.impact}</div>
         </div>
         <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
            <div className="text-slate-500 mb-1 font-medium uppercase text-[10px]">Est. CAPEX</div>
            <div className="text-slate-200 font-bold">{recommendation.cost}</div>
         </div>
      </div>

      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="link" size="sm" className="h-6 text-xs text-blue-400 hover:text-blue-300 p-0">
              View Strategy <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
      </div>
    </div>
  );
};

const DesignRecommendations = ({ recommendations = [] }) => {
  // Dummy data if none provided (for display purposes)
  const displayRecs = recommendations.length > 0 ? recommendations : [
      {
          id: 1,
          title: "Debottleneck HP Separator",
          priority: "High",
          description: "Current analysis shows HP Separation train reaching 98% utilization by Q3 2025. Propose internal retrofit to increase residence time.",
          impact: "+5,000 bpd throughput",
          cost: "$2.5M USD"
      },
      {
          id: 2,
          title: "Upgrade Water Injection Pumps",
          priority: "Medium",
          description: "Reservoir pressure support required to maintain plateau. Add 2x Booster Pumps to meet 150k bpd injection target.",
          impact: "Sustain production curve",
          cost: "$4.2M USD"
      },
      {
          id: 3,
          title: "Optimize Gas Lift Network",
          priority: "Low",
          description: "Gas lift distribution efficiency is low. Implement smart choke automation to reduce gas cycling.",
          impact: "-15% OpEx reduction",
          cost: "$1.8M USD"
      }
  ];

  return (
    <Card className="h-full bg-[#1a1a1a] border-slate-800 text-slate-200 shadow-xl flex flex-col">
      <CardHeader className="pb-2 border-b border-slate-800">
        <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Strategic Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-4 overflow-hidden">
        <ScrollArea className="h-full pr-4">
            {displayRecs.map(rec => (
                <RecommendationCard key={rec.id} recommendation={rec} />
            ))}
            {displayRecs.length === 0 && (
                <div className="text-center text-slate-500 py-10 flex flex-col items-center">
                    <Lightbulb className="w-8 h-8 mb-2 opacity-20" />
                    <p>No recommendations generated yet. Run analysis first.</p>
                </div>
            )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DesignRecommendations;