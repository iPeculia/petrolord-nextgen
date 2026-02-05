import React from 'react';

const TipsAndTricks = () => {
  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-white mb-4">Tips & Tricks</h2>
       <div className="grid gap-4">
         {[
           { title: "Quick Zoom", tip: "Hold Shift and drag on any chart to zoom in on a specific time period." },
           { title: "Export Shortcuts", tip: "You can download any chart as a PNG by right-clicking it." },
           { title: "Data Compare", tip: "Use the 'Group' feature to aggregate multiple reservoirs and see basin-wide performance." }
         ].map((item, i) => (
           <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
             <h4 className="text-[#BFFF00] font-semibold mb-1">{item.title}</h4>
             <p className="text-slate-300 text-sm">{item.tip}</p>
           </div>
         ))}
       </div>
    </div>
  );
};

export default TipsAndTricks;