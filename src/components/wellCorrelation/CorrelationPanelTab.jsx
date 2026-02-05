import React from 'react';
import CorrelationPanel from './CorrelationPanel';

const CorrelationPanelTab = () => {
    return (
        <div className="h-full w-full bg-[#0F172A] overflow-hidden flex flex-col">
            <div className="flex-1 relative border-t border-slate-800">
                 <CorrelationPanel />
            </div>
        </div>
    );
};

export default CorrelationPanelTab;