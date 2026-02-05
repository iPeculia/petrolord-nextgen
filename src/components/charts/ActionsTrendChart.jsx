import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

const ActionsTrendChart = ({ data, loading }) => {
    if (loading) {
        return <div className="h-80 flex justify-center items-center bg-[#1E293B] rounded-lg"><Loader2 className="w-8 h-8 animate-spin text-[#BFFF00]" /></div>;
    }
    if (!data || data.length === 0) {
        return <div className="h-80 flex justify-center items-center bg-[#1E293B] rounded-lg text-gray-400">No data available for this period.</div>;
    }

    return (
        <div className="bg-[#1E293B] p-4 rounded-lg border border-gray-800 h-80">
            <h3 className="text-lg font-semibold text-white mb-4">Actions Over Time</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #374151', color: '#FFF' }} />
                    <Legend wrapperStyle={{ color: '#FFF' }} />
                    <Line type="monotone" dataKey="count" name="Actions" stroke="#BFFF00" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ActionsTrendChart;