import React from 'react';
import { Edit } from 'lucide-react';
import { useDesignCalculations } from '../hooks/useDesignCalculations';
import { useChangeDetection } from '../hooks/useChangeDetection';
import { formatNumber } from '../utils/calculationUtils';
import { cn } from '@/lib/utils';

const ReviewStep = ({ formData, sections, wells, initialData, originalSections }) => {
  const calculations = useDesignCalculations(sections);
  const changes = useChangeDetection(initialData?.design, formData, sections, originalSections);
  
  const wellName = wells.find(w => w.id === formData.well_id)?.name || "Unknown Well";

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4 animate-in fade-in slide-in-from-right-8 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Design Summary */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4 shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    Design Configuration
                </h3>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <span className="text-slate-500">Name</span>
                    <span className="text-slate-200 font-medium text-right">{formData.name}</span>
                    
                    <span className="text-slate-500">Type</span>
                    <span className="text-slate-200 font-medium text-right">{formData.type}</span>
                    
                    <span className="text-slate-500">Well</span>
                    <span className="text-slate-200 font-medium text-right">{wellName}</span>
                    
                    <span className="text-slate-500">Top OD</span>
                    <span className="text-slate-200 font-medium text-right">{formData.od} in</span>

                    <span className="text-slate-500">Description</span>
                    <span className="text-slate-300 text-right italic truncate pl-4">{formData.description || 'None'}</span>
                </div>
            </div>
            
            {/* Metrics */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4 shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Calculated Metrics</h3>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <span className="text-slate-500">Section Count</span>
                    <span className="text-slate-200 font-medium text-right">{calculations.sectionCount}</span>
                    
                    <span className="text-slate-500">Total Measured Depth</span>
                    <span className="text-slate-200 font-medium text-right">{formatNumber(calculations.totalDepth)} ft</span>
                    
                    <span className="text-slate-500">Total String Weight</span>
                    <span className="text-slate-200 font-medium text-right">{formatNumber(calculations.totalWeight / 1000, 1)} klb</span>
                    
                    <span className="text-slate-500">Primary Grade</span>
                    <span className="text-[#BFFF00] font-medium text-right">{calculations.averageGrade}</span>
                </div>
            </div>
        </div>

        {/* Change Detection (Edit Mode Only) */}
        {initialData && changes.length > 0 && (
            <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg animate-pulse">
                <h4 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
                    <Edit className="h-4 w-4" /> Unsaved Changes Detected
                </h4>
                <ul className="space-y-1">
                    {changes.map((c, i) => (
                        <li key={i} className="text-sm text-slate-300 flex justify-between">
                            <span>{c.field}</span>
                            <span className="text-slate-500 text-xs">
                                {String(c.old)} <span className="text-slate-600">→</span> {String(c.new)}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        )}

        <div className="text-center text-sm text-slate-500 mt-8">
            Please review all configuration details carefully. Saving will update the system of record and recalculate associated safety factors.
        </div>
    </div>
  );
};

export default ReviewStep;