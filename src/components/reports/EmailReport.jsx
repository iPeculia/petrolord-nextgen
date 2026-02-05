import React from 'react';
import ReportHeader from './ReportHeader';
import ReportDetails from './ReportDetails';
import { motion } from 'framer-motion';

const SummaryCard = ({ label, value }) => (
    <motion.div
        className="bg-[#0F172A] p-4 rounded-lg border border-gray-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
    >
        <p className="text-sm text-gray-400 font-medium">{label}</p>
        <p className="text-xl font-bold text-white mt-1">{value}</p>
    </motion.div>
);

const EmailReport = ({ reportData, dateRange, generatedBy }) => {
    if (!reportData) return null;

    return (
        <div className="space-y-6">
            <ReportHeader title="Email Report" dateRange={dateRange} generatedBy={generatedBy} />
            
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(reportData.summary).map(([key, value]) => (
                        <SummaryCard key={key} label={key} value={value} />
                    ))}
                </div>
            </div>

            <ReportDetails details={reportData.details} />
        </div>
    );
};

export default EmailReport;