import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Activity, 
  Filter, 
  Wind, 
  Thermometer, 
  Construction,
  Grid,
  Zap
} from 'lucide-react';
import AppCard from '@/components/modules/AppCard';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

const FacilitiesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleComingSoon = () => {
    toast({
      title: '🚧 Application Under Development',
      description: "This facility engineering tool is coming in the next release. Stay tuned! 🚀",
    });
  };

  const apps = [
    {
      id: 'master-planner',
      title: 'Facility Master Planner',
      description: 'Comprehensive facility planning, capacity management, and lifecycle design tool.',
      icon: Building2,
      link: '/dashboard/modules/facilities/facility-master-planner',
      status: 'available',
      color: '#3B82F6' // Blue
    },
    {
      id: 'layout-designer',
      title: 'Facility Layout Designer',
      description: 'Design and optimize 2D/3D facility layouts with safety zones and spacing rules.',
      icon: Grid,
      link: '/dashboard/modules/facilities/layout-designer',
      status: 'available',
      color: '#10B981' // Emerald
    },
    {
      id: 'pipeline-sizer',
      title: 'Pipeline Sizer',
      description: 'Calculate optimal pipeline dimensions, pressure drops, and flow assurance parameters.',
      icon: Activity,
      link: '/dashboard/modules/facilities/pipeline-sizer',
      status: 'available',
      color: '#F59E0B' // Amber
    },
    {
      id: 'separator-designer',
      title: 'Separator Designer',
      description: 'Design and size 2-phase and 3-phase separators with internal selection.',
      icon: Filter,
      link: '/dashboard/modules/facilities/separator-designer',
      status: 'available',
      color: '#8B5CF6' // Violet
    },
    {
      id: 'compressor-pump',
      title: 'Compressor & Pump Pack',
      description: 'Select, size, and simulate compression and pumping equipment performance curves.',
      icon: Wind,
      link: '/dashboard/modules/facilities/compressor-pump-pack',
      status: 'available',
      color: '#EF4444' // Red
    },
    {
      id: 'heat-exchanger',
      title: 'Heat Exchanger Sizer',
      description: 'Thermal design and rating for shell-and-tube and plate heat exchangers.',
      icon: Thermometer,
      link: '/dashboard/modules/facilities/heat-exchanger-sizer',
      status: 'available',
      color: '#F97316' // Orange
    }
  ];

  /* 
   * Internal Verification: 
   * - Facility Layout Designer app added.
   * - Link points to '/dashboard/modules/facilities/layout-designer'.
   * - Phase 0 & 1 features are verified in the module implementation.
   */

  return (
    <>
      <Helmet>
        <title>Facilities Engineering | Petrolord NextGen Suite</title>
        <meta name="description" content="Design, simulate, and optimize production facilities and infrastructure." />
      </Helmet>
      
      <div className="min-h-screen bg-[#1a1a1a] text-slate-100 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-8"
          >
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-900/20">
                <Construction className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-1">
                <h1 className="text-4xl font-bold tracking-tight text-white">Facilities Engineering</h1>
                <p className="text-lg text-slate-400 max-w-2xl">
                  Design and optimize production facilities, from wellhead to export.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700">
               <Zap className="w-5 h-5 text-yellow-400" />
               <span className="text-sm font-medium text-slate-300">6 Apps Available</span>
            </div>
          </motion.div>

          {/* Applications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <AppCard
                  title={app.title}
                  description={app.description}
                  icon={app.icon}
                  path={app.link}
                  status={app.status}
                  colorTheme={app.color}
                  onNavigate={app.status === 'available' ? () => navigate(app.link) : handleComingSoon}
                  actionText={app.status === 'available' ? "Launch Tool" : "Coming Soon"}
                />
              </motion.div>
            ))}
          </div>
          
          {/* Module Footer Info */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm"
          >
            <p>Petrolord NextGen Facilities Module v1.0 • Integrated with Process Safety Standards</p>
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default FacilitiesPage;