import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { getModuleById, getApplicationsByModule, getStudentApplicationAccessMap } from '@/lib/applicationModulesUtils';
import ApplicationCard from '@/components/ApplicationCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, AlertCircle, Layers, BarChart3, HardHat, Zap, DollarSign, Building2, Grid, ServerCrash } from 'lucide-react';

const iconMap = {
    Layers,
    BarChart3,
    HardHat,
    Zap,
    DollarSign,
    Building2,
    Grid,
};

const ModuleDetailPage = () => {
    const { moduleId } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user, profile, isAdmin, isSuperAdmin } = useAuth();
    
    const [module, setModule] = useState(null);
    const [applications, setApplications] = useState([]);
    const [accessMap, setAccessMap] = useState(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const moduleData = await getModuleById(moduleId);

            if (!moduleData) {
                setError('Module not found. It might have been moved or deleted.');
                setLoading(false);
                return;
            }

            const [applicationsData] = await Promise.all([
                getApplicationsByModule(moduleId),
            ]);

            setModule(moduleData);
            setApplications(applicationsData);
            
            if (profile?.role === 'student') {
                const studentAccess = await getStudentApplicationAccessMap(user.id);
                setAccessMap(studentAccess);
            }

        } catch (err) {
            setError('Failed to load module details. Please try again.');
            toast({ variant: 'destructive', title: 'Error', description: err.message });
        } finally {
            setLoading(false);
        }
    }, [moduleId, user?.id, profile?.role, toast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
            },
        },
    };
    
    const ModuleIcon = module ? iconMap[module.icon] || Grid : Grid;

    const SkeletonCard = () => (
      <div className="bg-[#1E293B] rounded-lg p-6 border border-slate-700/60 animate-pulse">
          <div className="flex justify-between items-start mb-4">
              <div className="bg-slate-800 p-3 rounded-lg w-12 h-12"></div>
              <div className="bg-slate-700 h-7 w-20 rounded-full"></div>
          </div>
          <div className="h-6 w-3/4 bg-slate-700 rounded mb-3"></div>
          <div className="h-4 w-full bg-slate-700 rounded mb-2"></div>
          <div className="mt-auto pt-4 border-t border-slate-700/50">
              <div className="h-10 w-full bg-slate-700 rounded"></div>
          </div>
      </div>
    );

    if (error) {
        return (
             <div className="bg-red-900/20 border border-red-500/50 text-red-400 rounded-lg p-6 flex flex-col items-center text-center">
                <ServerCrash className="h-10 w-10 mb-4" />
                <h2 className="font-bold text-xl mb-2">An Error Occurred</h2>
                <p className="mb-4">{error}</p>
                <Button asChild variant="secondary">
                    <Link to="/application-modules">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Modules
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{`${module?.name || 'Loading Module...'} - Petrolord`}</title>
            </Helmet>
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full"
            >
                <div className="mb-8">
                    <Button asChild variant="ghost" className="mb-4 pl-0 text-gray-300 hover:text-[#BFFF00]">
                        <Link to="/application-modules">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to All Modules
                        </Link>
                    </Button>
                     {loading ? (
                        <div className="flex items-center space-x-4 animate-pulse">
                            <div className="bg-slate-800 p-4 rounded-lg w-[68px] h-[68px]"></div>
                            <div>
                                <div className="h-10 w-64 bg-slate-700 rounded"></div>
                                <div className="h-6 w-96 bg-slate-700 rounded mt-2"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <div className="bg-slate-800 p-4 rounded-lg">
                               <ModuleIcon className="w-10 h-10 text-[#BFFF00]" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-white">{module?.name}</h1>
                                <p className="text-lg text-gray-400">{module?.description}</p>
                            </div>
                        </div>
                    )}
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
                >
                    {loading ? (
                        [...Array(4)].map((_, i) => <SkeletonCard key={i}/>)
                    ) : (
                        applications.map(app => {
                            const isStudent = profile?.role === 'student';
                            const userPhase = profile?.phase || 0;
                            const hasAccess = isStudent ? accessMap.has(app.id) : (isAdmin || isSuperAdmin);
                            const isLocked = isStudent && app.phase_required > userPhase;
                            const expiry = isStudent && hasAccess ? accessMap.get(app.id).expires : null;

                            return (
                                <ApplicationCard
                                    key={app.id}
                                    name={app.name}
                                    description={app.description}
                                    phaseRequired={app.phase_required}
                                    status={app.status}
                                    hasAccess={hasAccess}
                                    isLocked={isLocked}
                                    expiryDate={expiry}
                                />
                            );
                        })
                    )}
                </motion.div>
            </motion.div>
        </>
    );
};

export default ModuleDetailPage;