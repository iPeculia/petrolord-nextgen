import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Droplets, 
  TrendingDown, 
  Layers, 
  Database,
  BarChart3
} from 'lucide-react';
import AppCard from '@/components/modules/AppCard';

const ReservoirPage = () => {
  const navigate = useNavigate();

  const apps = [
    {
      id: 'material-balance',
      title: 'Material Balance Pro',
      description: 'Advanced material balance analysis for estimating hydrocarbons in place and drive mechanisms.',
      icon: <Droplets className="w-8 h-8 text-blue-500" />,
      link: '/dashboard/modules/reservoir/material-balance',
      status: 'active',
      colorTheme: "#3B82F6"
    },
    {
      id: 'decline-curve',
      title: 'Decline Curve Analysis',
      description: 'Production forecasting and reserve estimation using Arps, SEPD, and Duong models.',
      icon: <TrendingDown className="w-8 h-8 text-emerald-500" />,
      link: '/dashboard/modules/reservoir/dca',
      status: 'active',
      colorTheme: "#10B981"
    },
    {
      id: 'simulation',
      title: 'Reservoir Simulation Lab',
      description: 'Full-field numerical simulation for complex reservoir management and recovery optimization.',
      icon: <Layers className="w-8 h-8 text-purple-500" />,
      link: '/dashboard/modules/reservoir/simulation-lab', 
      status: 'active',
      colorTheme: "#A855F7"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 p-8">
      <Helmet>
        <title>Reservoir Engineering | Petrolord</title>
      </Helmet>

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
        <Button 
          variant="ghost" 
          className="mb-4 text-slate-400 hover:text-white pl-0"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">Reservoir Engineering</h1>
            <p className="text-xl text-slate-400 max-w-3xl">
              Comprehensive suite of tools for reservoir characterization, performance analysis, and production optimization.
            </p>
          </div>
        </div>
      </div>

      {/* Applications Grid */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
        {apps.map((app) => (
          <AppCard 
            key={app.id}
            title={app.title}
            description={app.description}
            icon={app.icon}
            link={app.link}
            status={app.status}
            colorTheme={app.colorTheme}
            actionText="Launch Tool"
          />
        ))}
      </div>

      {/* Quick Resources */}
      <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Resources</h2>
        <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-[#1E293B] border-slate-800 hover:border-slate-600 transition-colors cursor-pointer group">
                <CardHeader>
                    <CardTitle className="text-base text-slate-200 group-hover:text-emerald-400 flex items-center transition-colors">
                        <Database className="w-4 h-4 mr-2" /> Sample Data Sets
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-500">Access pre-loaded field data for training and validation.</p>
                </CardContent>
            </Card>
            <Card className="bg-[#1E293B] border-slate-800 hover:border-slate-600 transition-colors cursor-pointer group">
                <CardHeader>
                    <CardTitle className="text-base text-slate-200 group-hover:text-emerald-400 flex items-center transition-colors">
                        <BarChart3 className="w-4 h-4 mr-2" /> Saved Reports
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-500">View and manage your generated engineering reports.</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default ReservoirPage;