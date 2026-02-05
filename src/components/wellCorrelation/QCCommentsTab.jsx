import React from 'react';
import QCTool from './QCTool';
import CommentsPanel from './CommentsPanel';

const QCCommentsTab = () => {
    return (
        <div className="h-full p-6 bg-slate-900/20 overflow-hidden flex flex-col">
            <div className="mb-4 shrink-0">
                <h2 className="text-xl font-bold text-white">QC & Interpretation</h2>
                <p className="text-sm text-slate-400">Validate correlations and document findings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
                <div className="min-h-0">
                    <QCTool />
                </div>
                <div className="min-h-0">
                    <CommentsPanel />
                </div>
            </div>
        </div>
    );
};

export default QCCommentsTab;