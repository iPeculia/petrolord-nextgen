import React, { memo } from 'react';
import MiniSimulator from '../MiniSimulator.jsx';

// Wrapper component for the MiniSimulator when used in Tabs
const MiniSimulatorTab = memo(() => {
    return (
        <div className="h-full w-full bg-slate-950 p-4">
            <div className="h-full border border-slate-800 rounded-lg overflow-hidden">
                <MiniSimulator />
            </div>
        </div>
    );
});

export default MiniSimulatorTab;