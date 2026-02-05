import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ChevronRight } from 'lucide-react';

const GettingStartedGuide = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="prose prose-invert max-w-none">
        <h1 className="text-3xl font-bold text-white mb-4">Getting Started with Material Balance</h1>
        <p className="text-lg text-slate-300">
          Welcome to the Material Balance Analysis module. This guide will help you set up your first project,
          load data, and perform your first reservoir analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">What is Material Balance?</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-400 space-y-2">
            <p>
              Material Balance is a reservoir engineering method used to determine the volume of hydrocarbons 
              in place (OOIP/OGIP) and the prevailing drive mechanisms by analyzing the relationship between 
              production cumulative volumes and reservoir pressure decline.
            </p>
            <p>
              It is based on the principle of mass conservation: <br />
              <code className="bg-slate-950 p-1 rounded text-[#BFFF00] text-sm">Withdrawal = Expansion + Influx + Injection</code>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Quick Start Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                "Create a Project or Load Sample Data",
                "Define Tank Parameters (Pressure, Temperature)",
                "Input or Import Production History",
                "Configure PVT Properties",
                "Identify Drive Mechanism via Diagnostic Plots",
                "Run Regression to Estimate OOIP/OGIP"
              ].map((item, i) => (
                <li key={i} className="flex items-center text-slate-300">
                  <CheckCircle2 className="w-5 h-5 mr-3 text-[#BFFF00]" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">First Steps</h3>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-none w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">1</div>
            <div>
              <h4 className="font-medium text-white">Load Data</h4>
              <p className="text-slate-400 text-sm mt-1">
                If you are new, click the <strong>"Load Sample Data"</strong> button on the main dashboard. 
                This will create a fully populated project with 5 reservoirs.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-none w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">2</div>
            <div>
              <h4 className="font-medium text-white">Navigate to Diagnostics</h4>
              <p className="text-slate-400 text-sm mt-1">
                Go to the <strong>Diagnostics</strong> tab. Look at the "F vs Eo" plot. 
                A straight line indicates a volumetric reservoir. An upward curve suggests water influx.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-none w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">3</div>
            <div>
              <h4 className="font-medium text-white">Analyze Results</h4>
              <p className="text-slate-400 text-sm mt-1">
                Check the calculated OOIP/OGIP and compare it with volumetric estimates if available.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GettingStartedGuide;