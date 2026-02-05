import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { getModulesWithAppCount } from '@/lib/applicationModulesUtils';
import ModuleCard from '@/components/ModuleCard';
import { Grid, Layers, BarChart3, HardHat, Zap, DollarSign, Building2, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const iconMap = {
    Layers,
    BarChart3,
    HardHat,
    Zap,
    DollarSign,
    Building2,
    Grid,
};

const ApplicationModulesPage = () => {
    const { toast } = useToast();
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchModules = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getModulesWithAppCount();
            setModules(data);
        } catch (err) {
            setError('Failed to load application modules. Please try again later.');
            toast({
                variant: 'destructive',
                title: 'Error',
                description: err.message,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchModules();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const SkeletonCard = () => (
        <div className="bg-[#1E293B] rounded-lg p-6 border border-slate-700/80 animate-pulse">
            <div className="flex justify-between items-start mb-4">
                <div className="bg-slate-800 p-3 rounded-lg w-14 h-14"></div>
                <div className="bg-slate-700 h-6 w-16 rounded-full"></div>
            </div>
            <div className="h-6 w-3/4 bg-slate-700 rounded mb-3"></div>
            <div className="h-4 w-full bg-slate-700 rounded mb-2"></div>
            <div className="h-4 w-5/6 bg-slate-700 rounded"></div>
        </div>
    );

    return (
        <>
            <Helmet>
                <title>Application Modules - Petrolord NextGen Suite</title>
                <meta name="description" content="Explore the powerful application modules available in the Petrolord NextGen Suite." />
            </Helmet>
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full"
            >
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                        <Grid className="mr-3 h-10 w-10 text-[#BFFF00]" />
                        Application Modules
                    </h1>
                    <p className="text-xl text-gray-400">
                        Your gateway to specialized tools for the modern energy enterprise.
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : error ? (
                    <div className="bg-red-900/20 border border-red-500/50 text-red-400 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                        <AlertCircle className="h-10 w-10 mb-4" />
                        <h2 className="font-bold text-xl">An Error Occurred</h2>
                        <p className="mb-4">{error}</p>
                        <Button onClick={fetchModules} variant="secondary">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Try Again
                        </Button>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                    >
                        {modules.map(module => {
                            const IconComponent = iconMap[module.icon] || Grid;
                            return (
                                <ModuleCard
                                    key={module.id}
                                    id={module.id}
                                    icon={<IconComponent className="w-8 h-8 text-[#BFFF00]" />}
                                    name={module.name}
                                    description={module.description}
                                    appCount={module.app_count}
                                />
                            );
                        })}
                    </motion.div>
                )}
            </motion.div>
        </>
    );
};

export default ApplicationModulesPage;