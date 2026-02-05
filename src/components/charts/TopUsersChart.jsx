import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

const TopUsersChart = ({ data, loading }) => {
    if (loading) {
        return <div className="h-80 flex justify-center items-center bg-[#1E293B] rounded-lg"><Loader2 className="w-8 h-8 animate-spin text-[#BFFF00]" /></div>;
    }
    if (!data || data.length === 0) {
        return <div className="h-80 flex justify-center items-center bg-[#1E293B] rounded-lg text-gray-400">No user activity found.</div>;
    }

    return (
        <div className="bg-[#1E293B] p-4 rounded-lg border border-gray-800 h-80">
            <h3 className="text-lg font-semibold text-white mb-4">Top 10 Active Users</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tick={{ angle: -20, textAnchor: 'end' }} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #374151' }} />
                    <Legend />
                    <Bar dataKey="value" name="Actions" fill="#A78BFA" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TopUsersChart;