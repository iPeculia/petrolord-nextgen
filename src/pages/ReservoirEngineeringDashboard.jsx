import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, Filter, BookOpen, GraduationCap, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Components
import ConceptCard from '@/components/dashboard/ConceptCard';
import QuickStats from '@/components/dashboard/QuickStats';
import LearningPath from '@/components/dashboard/LearningPath';
import ResourceLibrary from '@/components/dashboard/ResourceLibrary';
import InteractiveFormula from '@/components/dashboard/InteractiveFormula';
import ConceptVisualizer from '@/components/dashboard/ConceptVisualizer';

// Data
import { RESERVOIR_CONCEPTS } from '@/data/reservoirConcepts';

const ReservoirEngineeringDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('concepts');

  const filteredConcepts = RESERVOIR_CONCEPTS.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200">
      <Helmet>
        <title>Reservoir Engineering Dashboard | Petrolord</title>
        <meta name="description" content="Master reservoir engineering fundamentals with interactive tools." />
      </Helmet>

      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-emerald-500" />
            <span className="font-bold text-lg tracking-tight">Reservoir Engineering <span className="text-slate-500 font-normal">Academy</span></span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative w-64 hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input 
                placeholder="Search concepts..." 
                className="pl-9 h-9 bg-slate-900 border-slate-800 text-xs focus:ring-emerald-500/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button size="sm" variant="outline" className="border-slate-700 text-slate-300 hover:text-white" onClick={() => navigate('/modules/reservoir-engineering')}>
              Back to Module
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Welcome back, Engineer</h1>
          <p className="text-slate-400 max-w-2xl">
            Track your progress, explore core concepts, and visualize reservoir dynamics.
            Your gateway to mastering subsurface engineering.
          </p>
        </div>

        {/* Quick Stats Row */}
        <QuickStats />

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Tabs for Views */}
            <Tabs defaultValue="concepts" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList className="bg-slate-900 border border-slate-800">
                  <TabsTrigger value="concepts" className="text-xs"><BookOpen className="w-3 h-3 mr-2" /> Concepts</TabsTrigger>
                  <TabsTrigger value="tools" className="text-xs"><Calculator className="w-3 h-3 mr-2" /> Interactive Tools</TabsTrigger>
                </TabsList>
                <div className="text-xs text-slate-500 hidden md:block">
                  Showing {filteredConcepts.length} topics
                </div>
              </div>

              <TabsContent value="concepts" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredConcepts.map(concept => (
                    <div key={concept.id} className="h-64">
                      <ConceptCard concept={concept} />
                    </div>
                  ))}
                  {filteredConcepts.length === 0 && (
                     <div className="col-span-2 p-12 text-center text-slate-500 bg-slate-900/30 rounded-lg border border-slate-800 border-dashed">
                        No concepts found matching "{searchTerm}"
                     </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="tools" className="mt-0">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-96">
                    <InteractiveFormula />
                    <ConceptVisualizer />
                 </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar Column (1/3) */}
          <div className="space-y-6">
            <LearningPath />
            <ResourceLibrary />
            
            <div className="bg-gradient-to-br from-emerald-900/20 to-slate-900 border border-emerald-500/20 rounded-lg p-6 text-center space-y-4">
               <h3 className="font-bold text-emerald-400">Ready for Simulation?</h3>
               <p className="text-sm text-slate-400">Apply these concepts in our 3D Reservoir Simulation Lab.</p>
               <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => navigate('/modules/reservoir-engineering/simulation')}>
                 Launch Simulator
               </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReservoirEngineeringDashboard;