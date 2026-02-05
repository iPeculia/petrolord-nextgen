import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Droplets, 
  LineChart, 
  Factory,
  ArrowLeft,
  Database,
  FileText,
  Beaker,
  Wrench
} from 'lucide-react';
import AppCard from '@/components/modules/AppCard';
import NetworkOptimizationCard from '@/modules/production/network-optimization/components/NetworkOptimizationCard';

const ResourceCard = ({ title, description, icon: Icon, onClick }) => (
  <div 
    onClick={onClick}
    className="group flex items-start gap-4 p-6 rounded-xl border border-slate-800 bg-[#1E293B] hover:border-slate-700 hover:bg-[#1E293B]/80 transition-all cursor-pointer"
  >
    <div className="p-3 rounded-lg bg-slate-900/50 text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h3 className="text-base font-semibold text-slate-200 group-hover:text-white transition-colors">
        {title}
      </h3>
      <p className="text-sm text-slate-400 mt-1">
        {description}
      </p>
    </div>
  </div>
);

const ProductionPage = () => {
  const navigate = useNavigate();

  // Defined applications that use the generic AppCard
  const applications = [
    {
      title: "Nodal Analysis",
      description: "Analyze inflow and outflow performance to optimize well production rates and identify restrictions.",
      icon: Activity,
      path: "/dashboard/production/nodal-analysis",
      status: "active",
      badge: "Core",
      colorTheme: "#3B82F6" // Blue
    },
    {
      title: "Well Test Analysis",
      description: "Comprehensive well testing analysis tool for pressure transient analysis, buildup tests, and well performance evaluation.",
      icon: Beaker,
      path: "/dashboard/modules/production/pressure-transient-analysis", 
      status: "active",
      badge: "Core",
      colorTheme: "#FFD700" // Gold
    },
    {
      title: "Artificial Lift Design",
      description: "Comprehensive artificial lift design tool for ESP, gas lift, and rod pump systems with equipment selection and economic analysis.",
      icon: Wrench,
      path: "/dashboard/modules/production/ald",
      status: "active",
      badge: "Core",
      colorTheme: "#F59E0B" // Amber
    },
    {
      title: "Decline Curve Analysis",
      description: "Forecast future production using Arps, Duong, and modern decline models with automated fitting.",
      icon: LineChart,
      path: "/dashboard/modules/reservoir/dca", 
      status: "active",
      badge: "Advanced",
      colorTheme: "#10B981" // Emerald
    },
    {
      title: "Material Balance",
      description: "Evaluate reservoir performance and estimate hydrocarbons in place using production history.",
      icon: Droplets,
      path: "/dashboard/modules/reservoir/material-balance", 
      status: "active",
      colorTheme: "#8B5CF6" // Violet
    },
    {
      title: "Production Reporting",
      description: "Daily production allocation, downtime tracking, and regulatory reporting generation.",
      icon: Factory,
      path: "/dashboard/modules/production/reporting",
      status: "coming_soon",
      colorTheme: "#64748B" // Slate
    }
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto space-y-12">
        {/* Header Section */}
        <div className="space-y-6">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Production Engineering
            </h1>
            <p className="text-lg text-slate-400 max-w-3xl">
              Comprehensive suite of tools for well performance analysis, artificial lift design, and field-wide production optimization.
            </p>
          </div>
        </div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Render the specialized Network Optimization Card */}
          <NetworkOptimizationCard />

          {/* Render other applications */}
          {applications.map((app, index) => (
            <AppCard
              key={index}
              {...app}
            />
          ))}
        </div>

        {/* Quick Resources Section */}
        <div className="space-y-6 pt-8 border-t border-slate-800">
          <h2 className="text-xl font-semibold text-white">Quick Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ResourceCard 
              title="Sample Data Sets"
              description="Access pre-loaded field data for training and validation."
              icon={Database}
              onClick={() => {}} 
            />
            <ResourceCard 
              title="Saved Reports"
              description="View and manage your generated engineering reports."
              icon={FileText}
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionPage;