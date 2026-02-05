import React from 'react';
import ReportHeader from './ReportHeader';
import ReportSummary from './ReportSummary';
import ReportDetails from './ReportDetails';

const SystemActivityReport = ({ reportData, dateRange, generatedBy }) => {
    if (!reportData) return null;

    return (
        <div className="space-y-6">
            <ReportHeader title="System Activity Report" dateRange={dateRange} generatedBy={generatedBy} />
            <ReportSummary summary={reportData.summary} />
            <ReportDetails details={reportData.details} />
        </div>
    );
};

export default SystemActivityReport;