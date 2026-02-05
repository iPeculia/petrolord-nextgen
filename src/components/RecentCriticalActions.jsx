import React from 'react';
import { Loader2 } from 'lucide-react';

const ActionBadge = ({ action }) => {
    const colors = {
        DELETE: 'bg-red-500/20 text-red-300',
        ROLE_CHANGE: 'bg-orange-500/20 text-orange-300',
        STATUS_CHANGE: 'bg-yellow-500/20 text-yellow-300',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[action]}`}>{action}</span>;
};

const RecentCriticalActions = ({ data, loading }) => {
    if (loading) {
        return <div className="h-80 flex justify-center items-center bg-[#1E293B] rounded-lg"><Loader2 className="w-8 h-8 animate-spin text-[#BFFF00]" /></div>;
    }
    if (!data || data.length === 0) {
        return <div className="h-80 flex justify-center items-center bg-[#1E293B] rounded-lg text-gray-400">No critical actions found.</div>;
    }

    return (
        <div className="bg-[#1E293B] rounded-lg border border-gray-800 overflow-hidden">
            <h3 className="text-lg font-semibold text-white p-4 border-b border-gray-800">Recent Critical Actions</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-[#0F172A]">
                        <tr>
                            <th className="px-6 py-3 text-left font-semibold text-gray-300">User</th>
                            <th className="px-6 py-3 text-left font-semibold text-gray-300">Action</th>
                            <th className="px-6 py-3 text-left font-semibold text-gray-300">Resource</th>
                            <th className="px-6 py-3 text-left font-semibold text-gray-300">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {data.map((log, index) => (
                            <tr key={index} className="hover:bg-slate-800/50">
                                <td className="px-6 py-4 text-white font-medium">{log.user_email}</td>
                                <td className="px-6 py-4"><ActionBadge action={log.action} /></td>
                                <td className="px-6 py-4 text-gray-300">{log.resource_type}: {log.resource_name}</td>
                                <td className="px-6 py-4 text-gray-300">{new Date(log.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentCriticalActions;