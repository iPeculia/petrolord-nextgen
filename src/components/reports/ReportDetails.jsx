import React from 'react';

const StatusBadge = ({ status }) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    if (status === 'success' || status === 'sent') {
        return <span className={`${baseClasses} bg-green-500/20 text-green-300`}>Success</span>;
    }
    if (status === 'failure' || status === 'failed') {
        return <span className={`${baseClasses} bg-red-500/20 text-red-300`}>Failure</span>;
    }
     if (status === 'completed') {
        return <span className={`${baseClasses} bg-blue-500/20 text-blue-300`}>Completed</span>;
    }
    return <span className={`${baseClasses} bg-gray-500/20 text-gray-300`}>{status}</span>;
};

const ReportDetails = ({ details }) => {
    if (!details || details.length === 0) {
        return <p className="text-gray-400 text-center py-8">No detailed data available for this report.</p>;
    }
    
    const headers = Object.keys(details[0]);

    const renderCellContent = (content) => {
        if (typeof content === 'string' && content.startsWith('{')) {
            return <pre className="whitespace-pre-wrap bg-gray-900 p-2 rounded text-xs max-w-md overflow-auto">{content}</pre>;
        }
        if (typeof content === 'boolean') {
            return content ? 'Yes' : 'No';
        }
        return content;
    };


    return (
        <div>
            <h3 className="text-xl font-semibold text-white mb-4">Detailed Logs</h3>
            <div className="bg-[#1E293B] rounded-lg border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#0F172A] text-gray-300">
                            <tr>
                                {headers.map(header => (
                                    <th key={header} className="px-6 py-3 font-semibold capitalize">{header.replace(/_/g, ' ')}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 text-gray-300">
                            {details.map((row, index) => (
                                <tr key={row.id || index} className="hover:bg-slate-800/50">
                                    {headers.map(header => (
                                        <td key={header} className="px-6 py-4 whitespace-nowrap">
                                            {header.toLowerCase().includes('status') ? <StatusBadge status={row[header]} /> : renderCellContent(row[header])}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReportDetails;