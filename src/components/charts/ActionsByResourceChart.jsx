import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

const ActionsByResourceChart = ({ data, loading }) => {
    if (loading) {
        return <div className="h-80 flex justify-center items-center bg-[#1E293B] rounded-lg"><Loader2 className="w-8 h-8 animate-spin text-[#BFFF00]" /></div>;
    }
    if (!data || data.length === 0) {
        return <div className="h-80 flex justify-center items-center bg-[#1E293B] rounded-lg text-gray-400">No data available.</div>;
    }

    return (
        <div className="bg-[#1E293B] p-4 rounded-lg border border-gray-800 h-80">
            <h3 className="text-lg font-semibold text-white mb-4">Actions by Resource</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
                    <YAxis type="category" dataKey="name" stroke="#9CA3AF" fontSize={12} width={80} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #374151' }} />
                    <Bar dataKey="value" fill="#38BDF8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ActionsByResourceChart;