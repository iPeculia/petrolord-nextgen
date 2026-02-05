import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { LayoutDashboard, Database, Activity, Layers, TrendingUp, Gauge } from 'lucide-react';

const FeaturesGuide = () => {
  const features = [
    {
      id: 'dashboard',
      icon: LayoutDashboard,
      title: 'Dashboard & KPIs',
      description: 'Central hub for project overview.',
      content: 'The dashboard displays high-level metrics such as Total Reservoirs, Active Wells count, and aggregated production totals. It allows for quick health checks of your data quality.'
    },
    {
      id: 'prod-data',
      icon: Database,
      title: 'Production Data Management',
      description: 'Import and visualize historical data.',
      content: 'Supports monthly production data (Oil, Gas, Water) and reservoir pressure. You can import CSV files or manually edit data points. Includes interactive charts with zoom/pan capabilities.'
    },
    {
      id: 'pressure-analysis',
      icon: Gauge,
      title: 'Pressure Analysis',
      description: 'Comprehensive pressure data tracking.',
      content: 'Track reservoir pressure history, gradients, and saturation changes. Analyze pressure decline rates to identify drive mechanisms and estimate aquifer support. View pressure-dependent properties (Bo, Rs, Viscosity) across the full pressure range.'
    },
    {
      id: 'diagnostics',
      icon: Activity,
      title: 'Diagnostic Plots',
      description: 'Identify drive mechanisms visually.',
      content: 'Provides standard plots like F vs Eo, P/Z vs Gp, and Havlena-Odeh. These plots help distinguish between Solution Gas Drive, Gas Cap Expansion, and Water Drive mechanisms.'
    },
    {
      id: 'pvt',
      icon: Layers,
      title: 'PVT Modeling',
      description: 'Fluid property correlations.',
      content: 'Generates Black Oil properties (Bo, Rs, Bg, Viscosity) using correlations like Standing or Vasquez-Beggs. Allows for tuning against lab data if available.'
    },
    {
      id: 'forecast',
      icon: TrendingUp,
      title: 'Forecasting',
      description: 'Predict future performance.',
      content: 'Uses decline curve analysis (Arps) initialized with Material Balance constraints to forecast production profiles and estimate EUR.'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Feature Reference</h2>
        <p className="text-slate-400">Detailed guide to all application capabilities.</p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {features.map((feature) => (
          <AccordionItem key={feature.id} value={feature.id} className="border-slate-800">
            <AccordionTrigger className="hover:bg-slate-900/50 px-4 rounded-lg hover:no-underline">
              <div className="flex items-center gap-4 text-left">
                <div className="p-2 bg-slate-800 rounded-md text-[#BFFF00]">
                  <feature.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-white">{feature.title}</div>
                  <div className="text-sm text-slate-500 font-normal">{feature.description}</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-4 text-slate-300 bg-slate-950/30">
              <p className="mb-4">{feature.content}</p>
              <div className="flex gap-2">
                <Badge variant="outline" className="border-blue-500/30 text-blue-400">Available</Badge>
                <Badge variant="outline" className="border-slate-700 text-slate-500">v1.1.0</Badge>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FeaturesGuide;