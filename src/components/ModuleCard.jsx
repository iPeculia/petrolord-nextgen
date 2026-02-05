import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';

const ModuleCard = ({ id, icon, name, description, appCount }) => {
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

    return (
        <motion.div
            variants={cardVariants}
            whileHover={{ y: -5, scale: 1.02, boxShadow: '0px 10px 30px rgba(191, 255, 0, 0.1)' }}
            className="group"
            role="group"
            aria-label={`Navigate to ${name} module`}
        >
            <Link to={`/application-modules/${id}`} className="block h-full">
                <div className="bg-[#1E293B] rounded-lg p-6 border border-slate-700/80 hover:border-[#BFFF00] transition-all duration-300 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-slate-800 p-3 rounded-lg group-hover:bg-[#BFFF00]/10 transition-colors duration-300">
                            {icon}
                        </div>
                        <div className="flex items-center bg-slate-700 text-xs font-bold text-gray-300 px-2 py-1 rounded-full">
                            <Layers className="w-3 h-3 mr-1.5" />
                            {appCount} Apps
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
                    <p className="text-gray-400 text-sm flex-grow">{description}</p>
                </div>
            </Link>
        </motion.div>
    );
};

export default ModuleCard;