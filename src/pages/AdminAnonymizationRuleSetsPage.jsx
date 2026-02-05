import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Layers, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminAnonymizationRuleSetsPage = () => {
    const { toast } = useToast();

    const handleNotImplemented = () => {
        toast({
            title: "🚧 Feature In Progress",
            description: "Managing Rule Sets is not yet implemented. You can request this feature!",
        });
    };

    return (
        <>
            <Helmet><title>Anonymization Rule Sets - Petrolord</title></Helmet>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center"><Layers className="mr-3" /> Anonymization Rule Sets</h1>
                    <Button onClick={handleNotImplemented} className="bg-[#BFFF00] text-black hover:bg-lime-400">
                        <Plus className="mr-2 h-4 w-4" /> Create New Rule Set
                    </Button>
                </div>
                <div className="bg-[#1E293B] rounded-lg border border-gray-800 p-8 text-center text-gray-400">
                    <p>Rule Set management is coming soon.</p>
                    <p className="text-sm">This page will allow you to group multiple anonymization rules together for easier application.</p>
                </div>
            </motion.div>
        </>
    );
};

export default AdminAnonymizationRuleSetsPage;