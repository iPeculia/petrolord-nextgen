import React from 'react';
import LogLogPlot from '../plots/LogLogPlot'; // Reusing diagnostic plot but now with Type Curve overlay capability
import ManualMatcher from '../ManualMatcher';
import DeliverabilityAnalysis from '../DeliverabilityAnalysis';
import PlotToolbar from '../PlotToolbar';

const ModelMatchTab = () => {
  return (
    <div className="flex flex-col h-full bg-slate-950">
        <div className="shrink-0">
           <PlotToolbar />
        </div>

        <div className="flex-1 flex overflow-hidden">
            {/* Main Plot Area (Model Matching) */}
            <div className="flex-1 p-2 min-w-0 relative">
                {/* We overlay the plot. The LogLogPlot needs to be aware of matchingResults to draw the line. 
                    Assuming LogLogPlot handles drawing 'typeCurve' if present in context. 
                    For now, we just show the component.
                */}
                <LogLogPlot isMatchingMode={true} />
            </div>

            {/* Right Control Panel */}
            <div className="w-80 p-2 border-l border-slate-800 shrink-0 overflow-y-auto bg-slate-950 flex flex-col gap-2">
                <ManualMatcher />
                <DeliverabilityAnalysis />
            </div>
        </div>
    </div>
  );
};

export default ModelMatchTab;