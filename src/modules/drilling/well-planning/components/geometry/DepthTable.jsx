import React from 'react';
import { useWellPlanningDesign } from '@/contexts/WellPlanningDesignContext';

const DepthTable = () => {
  const { geometryState } = useWellPlanningDesign();
  const { trajectory } = geometryState;

  return (
    <div className="w-full text-xs text-[#e0e0e0]">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#252541] sticky top-0">
          <tr>
            <th className="p-2 font-medium">Section</th>
            <th className="p-2 font-medium text-right">MD (ft)</th>
            <th className="p-2 font-medium text-right">TVD (ft)</th>
            <th className="p-2 font-medium text-right">Inc (°)</th>
            <th className="p-2 font-medium text-right">Azi (°)</th>
            <th className="p-2 font-medium text-right">Hole (in)</th>
          </tr>
        </thead>
        <tbody>
          {trajectory.map((point, i) => (
             i > 0 && ( // Skip initial 0,0 point for table cleanliness or keep it
              <tr key={i} className="border-b border-[#2f2f50] hover:bg-[#2f2f50/50]">
                <td className="p-2 truncate max-w-[100px] text-slate-300">
                  {point.name || point.sectionType}
                </td>
                <td className="p-2 text-right font-mono text-[#FFC107]">{point.md.toFixed(0)}</td>
                <td className="p-2 text-right font-mono">{point.tvd.toFixed(0)}</td>
                <td className="p-2 text-right font-mono">{point.inc.toFixed(1)}</td>
                <td className="p-2 text-right font-mono">{point.azi.toFixed(1)}</td>
                <td className="p-2 text-right font-mono text-slate-400">{point.holeSize}</td>
              </tr>
             )
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DepthTable;