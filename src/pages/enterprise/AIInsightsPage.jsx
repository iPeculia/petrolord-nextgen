import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, ArrowRight } from 'lucide-react';

const InsightCard = ({ type, title, description, impact, confidence }) => (
  <Card className="bg-slate-900 border-slate-800 hover:border-slate-600 transition-colors">
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${
          type === 'opportunity' ? 'bg-green-500/10 text-green-400' : 
          type === 'risk' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
        }`}>
          {type === 'opportunity' ? <TrendingUp className="w-5 h-5" /> :
           type === 'risk' ? <AlertTriangle className="w-5 h-5" /> : <Lightbulb className="w-5 h-5" />}
        </div>
        <Badge variant="outline" className="bg-slate-800 text-slate-400 border-slate-700">
          {confidence}% Confidence
        </Badge>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm mb-4">{description}</p>
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <span className="text-xs text-slate-500">Potential Impact: <span className="text-white font-medium">{impact}</span></span>
        <Button variant="ghost" size="sm" className="text-[#BFFF00] hover:text-white hover:bg-[#BFFF00]/20">
          View Details <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

const AIInsightsPage = () => {
  return (
    <div className="p-8 space-y-8 bg-[#0F172A] min-h-screen text-white animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="w-8 h-8 text-[#BFFF00]" />
            AI Insights Engine
          </h1>
          <p className="text-slate-400 mt-2">Automated intelligence surfacing key operational opportunities and risks.</p>
        </div>
        <Button className="bg-[#BFFF00] text-black hover:bg-[#a3d900]">Generate New Insights</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InsightCard 
          type="opportunity"
          title="Production Optimization: Well A-12"
          description="Choke optimization could increase daily production by 150 bbl/d based on historical flow correlations."
          impact="+$12k/day"
          confidence={94}
        />
        <InsightCard 
          type="risk"
          title="ESP Failure Prediction"
          description="Vibration anomalies detected in Pump B-04 suggest 85% probability of failure within 14 days."
          impact="Downtime Avoidance"
          confidence={88}
        />
        <InsightCard 
          type="insight"
          title="Reservoir Connectivity"
          description="Pressure transient analysis suggests unmapped fault transmissibility between Block A and Block B."
          impact="Reserve Revision"
          confidence={76}
        />
        <InsightCard 
          type="opportunity"
          title="Energy Efficiency"
          description="Adjusting gas lift injection timing could reduce compression energy costs by 12% across Field South."
          impact="-$45k/month"
          confidence={91}
        />
        <InsightCard 
          type="risk"
          title="Pipeline Corrosion"
          description="Chemical injection rates in Gathering Line 4 are below optimal levels for current water cut."
          impact="Asset Integrity"
          confidence={82}
        />
        <InsightCard 
          type="insight"
          title="Market Arbitrage"
          description="Predicted spot price variance suggests delaying crude lift by 48 hours."
          impact="Revenue Optimization"
          confidence={65}
        />
      </div>
    </div>
  );
};

export default AIInsightsPage;