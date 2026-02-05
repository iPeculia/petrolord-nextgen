import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

const COLORS = ['#BFFF00', '#38BDF8', '#A78BFA', '#F472B6', '#FB923C', '#FACC15'];

const ActionsByTypeChart = ({ data, loading }) => {
    if (loading) {
        return <div className="h-80 flex justify-center items-center bg-[#1E293B] rounded-lg"><Loader2 className="w-8 h-8 animate-spin text-[#BFFF00]" /></div>;
    }
    if (!data || data.length === 0) {
        return <div className="h-80 flex justify-center items-center bg-[#1E293B] rounded-lg text-gray-400">No data available.</div>;
    }

    return (
        <div className="bg-[#1E293B] p-4 rounded-lg border border-gray-800 h-80">
            <h3 className="text-lg font-semibold text-white mb-4">Actions by Type</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #374151' }} />
                    <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ActionsByTypeChart;