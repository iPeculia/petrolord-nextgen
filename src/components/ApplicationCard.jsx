import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Lock, Zap, Calendar, AlertTriangle } from 'lucide-react';

const ApplicationCard = ({ name, description, phaseRequired, status, hasAccess, isLocked, expiryDate }) => {
    const { toast } = useToast();

    const handleComingSoon = () => {
        toast({
            title: "🚧 This feature isn't implemented yet!",
            description: "Don't worry, you can request it in your next prompt. 🚀",
        });
    };
    
    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
            },
        },
    };
    
    const isComingSoon = status === 'coming_soon';
    
    const cardBaseStyle = "bg-[#1E293B] rounded-lg p-6 border transition-all duration-300 flex flex-col h-full";
    const cardStateStyle = isLocked 
        ? "border-slate-700/60 opacity-60"
        : "border-slate-700/80 hover:border-[#BFFF00]";
    
    return (
        <motion.div
            variants={cardVariants}
            whileHover={!isLocked ? { y: -5, scale: 1.02, boxShadow: '0px 10px 30px rgba(191, 255, 0, 0.1)' } : {}}
            className={`group ${isLocked ? 'cursor-not-allowed' : ''}`}
            aria-label={`${name} application card. ${isLocked ? 'This application is currently locked.' : ''}`}
        >
            <div className={`${cardBaseStyle} ${cardStateStyle}`}>
                <div className="flex justify-between items-start mb-4">
                    <div className={`bg-slate-800 p-3 rounded-lg ${!isLocked ? 'group-hover:bg-[#BFFF00]/10' : ''} transition-colors duration-300`}>
                        <Zap className={`w-6 h-6 ${isLocked ? 'text-slate-500' : 'text-[#BFFF00]'}`} />
                    </div>
                    <div className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center ${isLocked ? 'bg-slate-700 text-gray-400' : 'bg-blue-500/20 text-blue-300'}`}>
                        Phase {phaseRequired}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 flex-grow">{name}</h3>
                <p className="text-gray-400 text-sm mb-4">{description}</p>
                
                <div className="mt-auto pt-4 border-t border-slate-700/50">
                    {isLocked ? (
                        <div className="flex items-center justify-center text-center text-yellow-400 bg-yellow-900/40 p-3 rounded-md">
                            <Lock className="w-5 h-5 mr-3" />
                            <span className="font-semibold">Locked</span>
                        </div>
                    ) : (
                        <Button 
                            onClick={handleComingSoon}
                            variant="outline"
                            className="w-full border-dashed border-gray-500 text-gray-400 hover:border-[#BFFF00] hover:text-white"
                            aria-label={`Access the ${name} application, which is coming soon.`}
                        >
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Coming Soon
                        </Button>
                    )}
                    
                    {expiryDate && !isLocked && hasAccess && (
                         <p className="text-xs text-gray-500 mt-3 text-center flex items-center justify-center">
                            <Calendar className="w-3 h-3 mr-1.5" />
                            Access expires: {new Date(expiryDate).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ApplicationCard;