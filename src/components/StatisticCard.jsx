import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const StatisticCard = ({ title, value, icon, loading }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#1E293B] p-6 rounded-lg border border-gray-800 flex items-center space-x-4"
        >
            <div className="bg-[#BFFF00]/10 p-3 rounded-lg">
                {React.createElement(icon, { className: "w-6 h-6 text-[#BFFF00]" })}
            </div>
            <div>
                <p className="text-sm text-gray-400 font-medium">{title}</p>
                {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400 mt-1" />
                ) : (
                    <p className="text-2xl font-bold text-white">{value}</p>
                )}
            </div>
        </motion.div>
    );
};

export default StatisticCard;