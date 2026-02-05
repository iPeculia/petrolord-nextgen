import React from 'react';
import { Helmet } from 'react-helmet-async';
import ModuleIcons from '@/components/modules/ModuleIcons';
import TorqueDragCard from '@/components/modules/TorqueDragCard';
import AppCard from '@/components/modules/AppCard';
import HydraulicsSimulatorCard from '@/components/modules/HydraulicsSimulatorCard';
import { Separator } from '@/components/ui/separator';

const DrillingPage = () => {
  return (
    <>
      <Helmet>
        <title>Drilling Operations | Petrolord</title>
        <meta name="description" content="Drilling engineering and operations management modules" />
      </Helmet>

      <div className="container mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <ModuleIcons type="drilling" className="h-8 w-8 text-blue-500" />
            Drilling Operations
          </h1>
          <p className="text-slate-400 max-w-2xl">
            Comprehensive suite for well planning, engineering design, and real-time drilling optimization.
          </p>
        </div>

        <Separator className="bg-slate-800" />

        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* Well Planning & Design - Core Module */}
          <AppCard 
            title="Well Planning & Design"
            description="Trajectory design, anti-collision analysis, and wellbore geometry configuration."
            icon="target"
            route="/dashboard/modules/drilling/well-planning"
            tags={['Trajectory', 'Anti-Collision', 'Survey Management']}
            status="active"
          />

          {/* Casing Design - Core Module */}
          <AppCard 
            title="Casing Design"
            description="Stress analysis, load case generation, and casing grade selection."
            icon="layers"
            route="/dashboard/modules/drilling/casing-design"
            tags={['Stress Analysis', 'Load Cases', 'Safety Factors']}
            status="active"
          />

          {/* Torque & Drag - Advanced Module */}
          <TorqueDragCard />

          {/* Hydraulics Simulator - New Module */}
          <HydraulicsSimulatorCard />

          {/* BHA Analysis - Placeholder */}
          <AppCard 
            title="BHA Analysis"
            description="Bottom hole assembly design, vibration analysis, and stabilization."
            icon="drill"
            route="/dashboard/modules/drilling/bha-analysis"
            tags={['Vibration', 'Stabilization', 'Bit Selection']}
            status="development"
          />

           {/* Real-Time Monitoring - Placeholder */}
           <AppCard 
            title="Real-Time Operations"
            description="Live drilling data monitoring, KPI tracking, and alert management."
            icon="activity"
            route="/dashboard/modules/drilling/real-time"
            tags={['WITSML', 'KPIs', 'Alerts']}
            status="planned"
          />

        </div>
      </div>
    </>
  );
};

export default DrillingPage;